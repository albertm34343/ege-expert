import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { email, amount, essay, topic, sourceText } = await req.json();

    if (!email || !amount || !essay) {
      return NextResponse.json(
        { error: "Не хватает данных" },
        { status: 400 }
      );
    }

    const idempotenceKey = uuidv4();

    const credentials = Buffer.from(
      `${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`
    ).toString("base64");

    const paymentData = {
      amount: {
        value: amount.toFixed(2),
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      },
      capture: true,
      description: "Проверка сочинения ЕГЭ",
      receipt: {
        customer: {
          email: email,
        },
        items: [
          {
            description: "Проверка сочинения ЕГЭ (AI-анализ)",
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
        email,
        essay,
        topic: topic || "",
        sourceText: sourceText || "",
      },
    };

    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
        "Idempotence-Key": idempotenceKey,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("ЮКасса ошибка:", errorData);
      return NextResponse.json(
        { error: "Ошибка создания платежа: " + errorData.description },
        { status: 500 }
      );
    }

    const payment = await response.json();

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      confirmationUrl: payment.confirmation.confirmation_url,
    });

  } catch (error: any) {
    console.error("Ошибка создания платежа:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}