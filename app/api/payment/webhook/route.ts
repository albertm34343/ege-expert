import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📩 Webhook получен:", JSON.stringify(body, null, 2));

    if (body.event !== "payment.succeeded") {
      return NextResponse.json({ ok: true });
    }

    const payment = body.object;

    if (payment.status !== "succeeded") {
      return NextResponse.json({ ok: true });
    }

    const { email, session_id } = payment.metadata;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!email || !session_id) {
      console.error("❌ Нет email или session_id в метаданных");
      return NextResponse.json({ ok: true });
    }

    console.log(`✅ Платёж успешен для ${email}, сессия: ${session_id}`);

    // ✅ Получаем данные сочинения из сессии
    const sessionRes = await fetch(
      `${appUrl}/api/payment/save-session?sessionId=${session_id}`
    );
    const sessionData = await sessionRes.json();

    if (!sessionData.success) {
      console.error("❌ Сессия не найдена:", session_id);
      return NextResponse.json({ ok: true });
    }

    const { essay, topic, sourceText } = sessionData;

    // Запускаем AI-проверку
    const checkRes = await fetch(`${appUrl}/api/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, essay, sourceText }),
    });

    const checkData = await checkRes.json();

    if (checkData.error) {
      console.error("❌ Ошибка проверки:", checkData.error);
      return NextResponse.json({ ok: true });
    }

    // Отправляем результат на email
    const emailRes = await fetch(`${appUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        topic,
        essay,
        sourceText,
        result: checkData.result,
      }),
    });

    const emailData = await emailRes.json();

    if (emailData.success) {
      console.log(`📧 Результат отправлен на ${email}`);
    } else {
      console.warn("⚠️ Не удалось отправить email:", emailData.error);
    }

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error("❌ Ошибка webhook:", error);
    return NextResponse.json({ ok: true });
  }
}