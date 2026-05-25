import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SESSIONS_DIR = path.join("/tmp", "ege-sessions");

function ensureDir() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, email, essay, topic, sourceText } = await req.json();

    if (!sessionId || !email || !essay) {
      return NextResponse.json(
        { success: false, error: "Недостаточно данных" },
        { status: 400 }
      );
    }

    ensureDir();

    const filePath = path.join(SESSIONS_DIR, `${sessionId}.json`);

    fs.writeFileSync(
      filePath,
      JSON.stringify({
        email,
        essay,
        topic,
        sourceText,
        createdAt: Date.now(),
      }),
      "utf-8"
    );

    console.log(`✅ Сессия сохранена: ${sessionId}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ Ошибка сохранения сессии:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Не указан sessionId" },
        { status: 400 }
      );
    }

    ensureDir();

    const filePath = path.join(SESSIONS_DIR, `${sessionId}.json`);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Файл сессии не найден: ${filePath}`);
      return NextResponse.json(
        { success: false, error: "Сессия не найдена или устарела" },
        { status: 404 }
      );
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    // Удаляем файл после чтения — одноразовый
    fs.unlinkSync(filePath);

    console.log(`✅ Сессия прочитана и удалена: ${sessionId}`);
    return NextResponse.json({ success: true, ...data });

  } catch (error: any) {
    console.error("❌ Ошибка чтения сессии:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}