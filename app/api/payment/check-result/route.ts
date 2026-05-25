import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Не указан session_id" },
        { status: 400 }
      );
    }

    console.log(`🔍 Запрос результата для сессии: ${sessionId}`);

    const sessionRes = await fetch(
      `${appUrl}/api/payment/save-session?sessionId=${sessionId}`
    );
    const sessionData = await sessionRes.json();

    if (!sessionData.success) {
      console.error("❌ Сессия не найдена:", sessionId);
      return NextResponse.json(
        { success: false, error: "Сессия не найдена или уже использована" },
        { status: 404 }
      );
    }

    const { essay, topic, sourceText, email } = sessionData;

    console.log(`✅ Сессия найдена, запускаем AI проверку для ${email}`);

    const checkRes = await fetch(`${appUrl}/api/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, essay, sourceText }),
    });

    const checkData = await checkRes.json();

    if (checkData.error) {
      console.error("❌ Ошибка AI проверки:", checkData.error);
      return NextResponse.json(
        { success: false, error: checkData.error },
        { status: 500 }
      );
    }

    console.log(`✅ AI проверка завершена, отправляем email на ${email}`);

    fetch(`${appUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        topic,
        essay,
        sourceText,
        result: checkData.result,
      }),
    }).catch((e) => console.warn("⚠️ Ошибка отправки email:", e));

    return NextResponse.json({
      success: true,
      result: checkData.result,
      topic,
      essay,
      sourceText,
    });

  } catch (error: any) {
    console.error("❌ Ошибка check-result:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}