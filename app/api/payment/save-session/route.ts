import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Папка для хранения сессий
const SESSIONS_DIR = path.join("/tmp", "ege-sessions");

// Создаём папку если её нет
function ensureDir() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  }
}

// ✅ СОХРАНИТЬ сессию
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
    
    const sessionData = {
      email,
      essay,
      topic,
      sourceText,
      createdAt: Date.now(),
    };

    fs.writeFileSync(filePath, JSON.stringify(sessionData), "utf-8");

    console.log(`✅ Сессия сохранена в файл: ${filePath}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ Ошибка сохранения сессии:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ ПОЛУЧИТЬ сессию
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

    // Проверяем существует ли файл
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Файл сессии не найден: ${filePath}`);
      return NextResponse.json(
        { success: false, error: "Сессия не найдена или устарела" },
        { status: 404 }
      );
    }

    // Читаем данные
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    // Удаляем файл — он одноразовый
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