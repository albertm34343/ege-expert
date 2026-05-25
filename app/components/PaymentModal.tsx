"use client";

import { useState } from "react";

interface PaymentModalProps {
  amount: number;
  essay: string;
  topic: string;
  sourceText: string;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function PaymentModal({
  amount,
  essay,
  topic,
  sourceText,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Пожалуйста, введите корректный email");
      return;
    }
    setError("");
    setProcessing(true);

    try {
      // Создаём платёж в ЮКасса
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount, essay, topic, sourceText }),
      });

      const data = await res.json();

      if (!data.success || !data.confirmationUrl) {
        setError(data.error || "Не удалось создать платёж");
        setProcessing(false);
        return;
      }

      // Редиректим на страницу оплаты ЮКасса
      window.location.href = data.confirmationUrl;

    } catch (e: any) {
      setError("Ошибка сети: " + e.message);
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="glass-card rounded-3xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💳</div>
          <h2 className="font-serif text-2xl font-bold text-white mb-2">
            Оплата проверки сочинения
          </h2>
          <p className="text-slate-400 text-sm">Безопасная оплата через ЮKassa</p>
        </div>

        <div className="bg-slate-900/60 rounded-2xl p-5 mb-6 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400">Услуга:</span>
            <span className="text-white text-sm">Проверка сочинения ЕГЭ</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-700">
            <span className="text-slate-300 font-medium">К оплате:</span>
            <span className="text-3xl font-bold text-white">{amount} ₽</span>
          </div>
        </div>

        <label className="block mb-2 text-sm font-medium text-slate-300">
          Email для отправки чека и результата
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.ru"
          disabled={processing}
          className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2 transition disabled:opacity-50"
        />
        <p className="text-xs text-slate-500 mb-4">
          На этот email мы пришлём чек и результат проверки
        </p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={processing}
            className="flex-1 py-3 rounded-xl font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            onClick={handlePay}
            disabled={processing}
            className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 disabled:opacity-50 transition"
          >
            {processing ? "⏳ Создаём платёж..." : `Оплатить ${amount} ₽`}
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          🔒 Платёж защищён. Сервис работает по 54-ФЗ.
        </p>
      </div>
    </div>
  );
}