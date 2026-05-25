"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        
        {/* Иконка успеха */}
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Оплата прошла успешно! 🎉
        </h1>

        {/* Описание */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 mb-6">
          <p className="text-slate-300 text-lg mb-3">
            Ваше сочинение отправлено на проверку
          </p>
          <p className="text-slate-400 text-sm">
            📧 Результат проверки придёт на вашу электронную почту в течение{" "}
            <span className="text-purple-400 font-semibold">нескольких минут</span>
          </p>
        </div>

        {/* Что дальше */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 mb-8 text-left">
          <p className="text-slate-400 text-sm font-medium mb-3">Что происходит сейчас:</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Платёж подтверждён
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">⏳</span> AI проверяет ваше сочинение
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-500">○</span> Результат отправляется на email
            </li>
          </ul>
        </div>

        {/* Кнопка и таймер */}
        <p className="text-slate-500 text-sm mb-4">
          Возврат на главную через{" "}
          <span className="text-purple-400 font-bold">{countdown}</span> сек
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white 
            font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          Вернуться на главную
        </button>

      </div>
    </main>
  );
}