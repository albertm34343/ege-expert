import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { email, amount, essay, topic, sourceText } = await req.json();

    if (!email || !amount) {
      return NextResponse.json(
        { success: false, error: "Не указан email или сумма" },
        { status: 400 }
      );
    }

    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!shopId || !secretKey) {
      console.error("❌ Не заданы YOOKASSA_SHOP_ID или YOOKASSA_SECRET_KEY");
      return NextResponse.json(
        { success: false, error: "Ошибка конфигурации платёжной системы" },
        { status: 500 }
      );
    }

    // ✅ Сохраняем данные сочинения во временное хранилище (KV или просто в БД)
    // Но так как у нас нет БД — сохраняем essay/topic/sourceText в Redis или
    // передаём только email, а данные берём из сессии/куки на клиенте.
    
    // Решение: сохраняем данные в отдельный API-эндпоинт с уникальным ID
    const sessionId = uuidv4();
    
    // Сохраняем сочинение во временное хранилище
    const saveRes = await fetch(`${appUrl}/api/payment/save-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, email, essay, topic, sourceText }),
    });

    if (!saveRes.ok) {
      return NextResponse.json(
        { success: false, error: "Ошибка сохранения сессии" },
        { status: 500 }
      );
    }

    const idempotenceKey = uuidv4();

    const paymentData = {
      amount: {
        value: amount.toFixed(2),
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: `${appUrl}/payment/success`,
      },
      capture: true,
      description: "Проверка сочинения ЕГЭ",
      receipt: {
        customer: {
          email: email,
        },
        items: [
          {
            description: "Проверка сочинения ЕГЭ по русскому языку",
            quantity: "1.00",
            amount: {
              value: amount.toFixed(2),
              currency: "RUB",
            },
            vat_code: 1,
            payment_mode: "full_payment",
            payment_subject: "service",
          },
        ],
      },
      metadata: {
        // ✅ Только короткие значения — максимум 256 символов каждое
        email: email.substring(0, 256),
        session_id: sessionId, // UUID = 36 символов, всё ок
      },
    };

    const credentials = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
        "Idempotence-Key": idempotenceKey,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Ошибка ЮКасса:", data);
      return NextResponse.json(
        { success: false, error: data.description || "Ошибка создания платежа" },
        { status: 500 }
      );
    }

    console.log("✅ Платёж создан:", data.id);

    return NextResponse.json({
      success: true,
      paymentId: data.id,
      confirmationUrl: data.confirmation.confirmation_url,
    });

  } catch (error: any) {
    console.error("❌ Ошибка создания платежа:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}