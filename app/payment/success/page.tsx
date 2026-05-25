"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const savedTopic = localStorage.getItem("ege_topic") || "";
    const savedEssay = localStorage.getItem("ege_essay") || "";
    const savedSourceText = localStorage.getItem("ege_sourceText") || "";
    const savedEmail = localStorage.getItem("ege_email") || "";

    setTopic(savedTopic);
    setEssay(savedEssay);
    setSourceText(savedSourceText);
    setUserEmail(savedEmail);

    if (!savedEssay || !savedTopic || !savedSourceText) {
      setStatus("error");
      setErrorMsg(
        "Данные сочинения не найдены в браузере. Если оплата прошла — результат придёт на email."
      );
      return;
    }

    setStatus("checking");

    const runCheck = async () => {
      try {
        const res = await fetch("/api/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: savedTopic,
            essay: savedEssay,
            sourceText: savedSourceText,
          }),
        });
        const data = await res.json();

        if (data.error) {
          setErrorMsg("Ошибка проверки: " + data.error);
          setStatus("error");
          return;
        }

        setResult(data.result);
        setStatus("done");

        // Очищаем localStorage
        localStorage.removeItem("ege_topic");
        localStorage.removeItem("ege_essay");
        localStorage.removeItem("ege_sourceText");
        localStorage.removeItem("ege_email");

        // Отправляем email
        if (savedEmail) {
          try {
            await fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: savedEmail,
                topic: savedTopic,
                essay: savedEssay,
                sourceText: savedSourceText,
                result: data.result,
              }),
            });
          } catch (e) {
            console.warn("Не удалось отправить email:", e);
          }
        }
      } catch (e: any) {
        setErrorMsg("Ошибка сети: " + e.message);
        setStatus("error");
      }
    };

    runCheck();
  }, [sessionId]);

  if (status === "loading" || status === "checking") {
    return (
      <main className="animated-gradient min-h-screen flex items-center justify-center text-slate-100">
        <div className="text-center px-4">
          <div className="text-6xl mb-6">⚙️</div>
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            {status === "loading" ? "Загрузка..." : "🔍 Проверяю сочинение..."}
          </h2>
          {status === "checking" && (
            <p className="text-slate-300 text-lg mb-8">
              Это займёт около 60 секунд. Не закрывайте страницу!
            </p>
          )}
          <div className="w-64 mx-auto bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="animated-gradient min-h-screen flex items-center justify-center text-slate-100 px-4">
        <div className="glass-card rounded-3xl p-8 md:p-10 max-w-lg w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="font-serif text-2xl font-bold text-yellow-300 mb-4">
            Что-то пошло не так
          </h2>
          <p className="text-slate-300 mb-3">{errorMsg}</p>
          <p className="text-slate-400 text-sm mb-6">
            Проверьте папку «Спам». Если письмо не пришло в течение 10 минут — напишите нам:{" "}
            <a
              href="mailto:malbert333j@mail.ru"
              className="text-purple-400 underline hover:text-purple-300"
            >
              malbert333j@mail.ru
            </a>
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 transition"
          >
            ← На главную
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="animated-gradient min-h-screen text-slate-100">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
            Проверка завершена!
          </h1>
          {userEmail && (
            <p className="text-slate-300">
              Результат также отправлен на{" "}
              <span className="text-purple-300 font-semibold">{userEmail}</span>
            </p>
          )}
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl">
          <h2 className="font-serif text-3xl font-bold mb-6 text-white flex items-center gap-3">
            📊 Результат проверки
          </h2>
          <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-mono text-sm bg-slate-950/40 p-6 rounded-2xl border border-slate-800">
            {result}
          </div>
          <button
            onClick={async () =>
              await generatePDF({ topic, sourceText, essay, analysis: result })
            }
            className="w-full mt-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 transition-all glow-button flex items-center justify-center gap-2"
          >
            📥 Скачать результат в PDF
          </button>
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-purple-400 hover:text-purple-300 transition text-sm underline"
            >
              ← Проверить ещё одно сочинение
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

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