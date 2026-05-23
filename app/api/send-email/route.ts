import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, topic, essay, sourceText, result } = await req.json();

    if (!email || !result) {
      return NextResponse.json(
        { error: "Не указан email или результат проверки" },
        { status: 400 }
      );
    }

    // Создаём транспорт SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // 465 = SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // HTML-шаблон письма
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Результат проверки сочинения</title>
      </head>
      <body style="font-family: Arial, sans-serif; background: #f5f5f7; margin: 0; padding: 20px;">
        <div style="max-width: 700px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          
          <!-- Хедер -->
          <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📊 Результат проверки</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">ЕГЭ-Эксперт · AI-проверка сочинений</p>
          </div>

          <!-- Контент -->
          <div style="padding: 32px;">
            <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">Здравствуйте!</h2>
            <p style="color: #475569; line-height: 1.6;">
              Спасибо, что воспользовались нашим сервисом! Ниже — полный разбор вашего сочинения по критериям ФИПИ.
            </p>

            <!-- Тема -->
            <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Тема</p>
              <p style="margin: 6px 0 0 0; color: #1e293b; font-weight: 500;">${topic}</p>
            </div>

            <!-- Результат -->
            <h3 style="color: #1e293b; font-size: 16px; margin-top: 28px;">📋 Детальный разбор:</h3>
            <div style="background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.7; white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(result)}</div>

            <!-- Чек -->
            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; margin-top: 28px;">
              <p style="margin: 0; color: #065f46; font-size: 14px;">
                <strong>✅ Оплата получена.</strong> Чек об оплате (35 ₽) направлен отдельным письмом от ЮKassa.
              </p>
            </div>

            <p style="color: #64748b; font-size: 13px; margin-top: 24px; line-height: 1.6;">
              💡 <strong>Совет:</strong> сохраните результат — мы храним тексты сочинений не более 30 дней.
            </p>
          </div>

          <!-- Футер -->
          <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">
              © 2026 ЕГЭ-Эксперт · <a href="https://проверка-сочиненийегэ.рф" style="color: #6366f1; text-decoration: none;">проверка-сочиненийегэ.рф</a>
            </p>
            <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 11px;">
              Самозанятый Махмутов А.М. · ИНН 560911225995
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Отправка
    await transporter.sendMail({
      from: `"ЕГЭ-Эксперт" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: "📊 Результат проверки вашего сочинения",
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Ошибка отправки email:", error);
    return NextResponse.json(
      { error: "Не удалось отправить письмо: " + error.message },
      { status: 500 }
    );
  }
}

// Утилита: экранирование HTML, чтобы избежать XSS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}