import { NextRequest, NextResponse } from "next/server";

// Временное хранилище в памяти сервера
// Для продакшена лучше использовать Redis/Vercel KV
const sessions = new Map<string, {
  email: string;
  essay: string;
  topic: string;
  sourceText: string;
  createdAt: number;
}>();

// Очищаем старые сессии (старше 2 часов)
function cleanupSessions() {
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  for (const [key, value] of sessions.entries()) {
    if (value.createdAt < twoHoursAgo) {
      sessions.delete(key);
    }
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

    cleanupSessions();

    sessions.set(sessionId, {
      email,
      essay,
      topic,
      sourceText,
      createdAt: Date.now(),
    });

    console.log(`✅ Сессия сохранена: ${sessionId}`);

    return NextResponse.json({ success: true });

  } catch (error: any) {
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

    const session = sessions.get(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Сессия не найдена или устарела" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, ...session });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}