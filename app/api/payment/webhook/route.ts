import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📩 Webhook получен:", JSON.stringify(body, null, 2));

    // Нас интересует только успешный платёж
    if (body.event !== "payment.succeeded") {
      return NextResponse.json({ ok: true });
    }

    const payment = body.object;

    if (payment.status !== "succeeded") {
      return NextResponse.json({ ok: true });
    }

    const { email, essay, topic, sourceText } = payment.metadata;

    if (!email || !essay) {
      console.error("❌ Нет email или essay в метаданных");
      return NextResponse.json({ ok: true });
    }

    console.log(`✅ Платёж успешен, запускаем проверку для ${email}`);

    // Запускаем AI-проверку
    const checkRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/check`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, essay, sourceText }),
      }
    );

    const checkData = await checkRes.json();

    if (checkData.error) {
      console.error("❌ Ошибка проверки:", checkData.error);
      return NextResponse.json({ ok: true });
    }

    const result = checkData.result;

    // Отправляем результат на email через твой существующий /api/send-email
    const emailRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, topic, essay, sourceText, result }),
      }
    );

    const emailData = await emailRes.json();

    if (emailData.success) {
      console.log(`📧 Результат отправлен на ${email}`);
    } else {
      console.warn("⚠️ Не удалось отправить email:", emailData.error);
    }

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error("❌ Ошибка webhook:", error);
    // Всегда 200 — иначе ЮКасса будет повторять запросы
    return NextResponse.json({ ok: true });
  }
}