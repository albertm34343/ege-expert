"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { generatePDF } from "@/lib/generatePDF";

type Status = "loading" | "checking" | "done" | "error";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<Status>("loading");
  const [result, setResult] = useState("");
  const [topic, setTopic] = useState("");
  const [essay, setEssay] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErrorMsg(
        "Не найден идентификатор сессии. Результат будет отправлен на ваш email."
      );
      return;
    }

    setStatus("checking");

    fetch(`/api/payment/check-result?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResult(data.result);
          setTopic(data.topic);
          setEssay(data.essay);
          setSourceText(data.sourceText);
          setStatus("done");
        } else {
          setErrorMsg(
            data.error || "Ошибка проверки. Результат придёт на email."
          );
          setStatus("error");
        }
      })
      .catch((e) => {
        setErrorMsg("Ошибка сети: " + e.message);
        setStatus("error");
      });
  }, [sessionId]);

  return (
    <main className="animated-gradient min-h-screen text-slate-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Шапка */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {status === "done"
              ? "✅"
              : status === "error"
              ? "⚠️"
              : "⏳"}
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-2">
            {status === "loading" && "Подготовка..."}
            {status === "checking" && "Проверяем ваше сочинение..."}
            {status === "done" && "Готово! Результат проверки"}
            {status === "error" && "Не удалось загрузить результат"}
          </h1>
          <p className="text-slate-400 text-sm">
            {status === "checking" &&
              "AI анализирует по 12 критериям ФИПИ. Это займёт около 60 секунд — не закрывайте страницу."}
            {status === "done" &&
              "Результат также отправлен на ваш email."}
            {status === "error" &&
              "Результат будет отправлен на ваш email в течение нескольких минут."}
          </p>
        </div>

        {/* Лоадер */}
        {(status === "loading" || status === "checking") && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="flex flex-col items-center gap-6">

              {/* Спиннер */}
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
              </div>

              <div className="space-y-1 text-center">
                <p className="text-white font-semibold text-lg">
                  🔍 AI проверяет сочинение...
                </p>
                <p className="text-slate-400 text-sm">
                  Двухпроходная проверка по критериям ФИПИ 2025
                </p>
              </div>

              {/* Шаги */}
              <div className="w-full max-w-sm space-y-3 mt-2">
                {[
                  { label: "✅ Платёж подтверждён", done: true },
                  {
                    label: "🔍 Первый проход — младший эксперт",
                    done: status === "checking",
                  },
                  { label: "🔍 Второй проход — старший эксперт", done: false },
                  { label: "📊 Формирование результата", done: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                        step.done
                          ? "bg-green-500 text-white"
                          : "bg-slate-700 text-slate-500"
                      }`}
                    >
                      {step.done ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-sm transition-all ${
                        step.done ? "text-slate-200" : "text-slate-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-slate-500 text-xs mt-2">
                ⏱ Пожалуйста, не закрывайте эту страницу
              </p>
            </div>
          </div>
        )}

        {/* Ошибка */}
        {status === "error" && (
          <div className="glass-card rounded-3xl p-8 text-center border border-yellow-500/20">
            <div className="text-4xl mb-4">📧</div>
            <p className="text-yellow-300 font-semibold mb-3">
              {errorMsg}
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Проверьте папку «Спам» — письмо с результатом могло попасть туда.
              <br />
              Если письмо не пришло в течение 10 минут — напишите нам на{" "}
              <a
                href="mailto:malbert333j@mail.ru"
                className="text-purple-400 underline"
              >
                malbert333j@mail.ru
              </a>
            </p>
            <a
              href="/"
              className="inline-block py-3 px-8 rounded-xl font-semibold text-white
              bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
              hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition"
            >
              ← На главную
            </a>
          </div>
        )}

        {/* Результат */}
        {status === "done" && result && (
          <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold mb-6 text-white flex items-center gap-3">
              📊 Результат проверки
            </h2>

            <div
              className="whitespace-pre-wrap text-slate-200 leading-relaxed
              font-mono text-sm bg-slate-950/40 p-6 rounded-2xl
              border border-slate-800 mb-6 overflow-auto max-h-[600px]"
            >
              {result}
            </div>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={async () =>
                  await generatePDF({
                    topic,
                    sourceText,
                    essay,
                    analysis: result,
                  })
                }
                className="flex-1 py-4 rounded-xl font-semibold text-white
                bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600
                hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500
                transition-all flex items-center justify-center gap-2"
              >
                📥 Скачать результат в PDF
              </button>

              <a
                href="/"
                className="flex-1 py-4 rounded-xl font-semibold text-white
                bg-slate-700 hover:bg-slate-600 transition-all
                flex items-center justify-center gap-2 text-center"
              >
                ← Проверить ещё одно сочинение
              </a>
            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
              📧 Результат также отправлен на ваш email
            </p>
          </div>
        )}

      </div>
    </main>
  );
}

// Suspense нужен для useSearchParams в Next.js 13+
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="animated-gradient min-h-screen flex items-center justify-center text-slate-100">
          <div className="text-center">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-white text-xl">Загрузка...</p>
          </div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}