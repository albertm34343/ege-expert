"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { generatePDF } from "@/lib/generatePDF";
import PaymentModal from "./components/PaymentModal";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Подсчёт слов в сочинении
  const wordCount = useMemo(() => {
    return essay.trim().split(/\s+/).filter(Boolean).length;
  }, [essay]);

  // Подсчёт слов в исходном тексте
  const sourceWordCount = useMemo(() => {
    return sourceText.trim().split(/\s+/).filter(Boolean).length;
  }, [sourceText]);

  // Цвет и статус счётчика слов
  const wordStatus = useMemo(() => {
    if (wordCount === 0) return { color: "text-slate-400", label: "Начните вводить сочинение" };
    if (wordCount < 70)
      return {
        color: "text-red-400",
        label: `❌ Слишком мало! Меньше 70 слов = 0 баллов`,
      };
    if (wordCount < 150)
      return {
        color: "text-yellow-400",
        label: `⚠️ Мало слов. От 70 до 149 — К7–К12 снижаются`,
      };
    return {
      color: "text-green-400",
      label: `✅ Объём в норме (150+ слов)`,
    };
  }, [wordCount]);

  // Шаг 1: Клик по кнопке «Проверить за 35 ₽» → проверка полей → открытие модалки оплаты
  const handlePayClick = () => {
    if (!topic.trim() || !essay.trim() || !sourceText.trim()) {
      alert("Пожалуйста, заполните все три поля: исходный текст, тему и сочинение");
      return;
    }
    if (wordCount < 70) {
      const confirm = window.confirm(
        "В сочинении меньше 70 слов. По критериям ФИПИ такая работа получит 0 баллов. Проверить всё равно?"
      );
      if (!confirm) return;
    }
    setShowPayment(true);
  };

  // Шаг 2: После «успешной оплаты» в модалке → запускаем реальную проверку
  // Шаг 2: После «успешной оплаты» → запускаем проверку + отправку email
  const handlePaymentSuccess = async (userEmail: string) => {
    setShowPayment(false);
    setLoading(true);
    setResult("");

    try {
      // 1) Запускаем проверку сочинения
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, essay, sourceText }),
      });
      const data = await res.json();

      if (data.error) {
        setResult("❌ Ошибка: " + data.error);
        return;
      }

      setResult(data.result);

      // 2) Отправляем результат на email пользователя
      try {
        const emailRes = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            topic,
            essay,
            sourceText,
            result: data.result,
          }),
        });
        const emailData = await emailRes.json();
        
        if (emailData.success) {
          console.log("✅ Письмо отправлено на", userEmail);
        } else {
          console.warn("⚠️ Не удалось отправить письмо:", emailData.error);
        }
      } catch (emailErr) {
        console.warn("⚠️ Ошибка отправки email:", emailErr);
        // Не прерываем работу — результат всё равно показан на сайте
      }
    } catch (e: any) {
      setResult("❌ Ошибка сети: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="animated-gradient min-h-screen text-slate-100">
      {/* ====== HERO SECTION ====== */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full glass-card text-sm text-purple-300 mb-6">
          ✨ Проверка на основе нейросети нового поколения
        </div>

        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent leading-tight">
          AI-проверка сочинений ЕГЭ
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-4 leading-relaxed">
          Получите <span className="text-purple-300 font-semibold">детальный разбор</span> своего сочинения
          по всем 12 критериям всего за <span className="text-purple-300 font-semibold">60 секунд</span>.
          Найдём ошибки, поставим баллы и подскажем, как улучшить работу.
        </p>

        {/* Преимущества */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">
          <div className="glass-card rounded-2xl p-6">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-white mb-1">Быстро</h3>
            <p className="text-sm text-slate-400">Результат за 1 минуту вместо часов ожидания</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-white mb-1">Точно</h3>
            <p className="text-sm text-slate-400">Двухпроходная проверка по критериям ФИПИ</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-semibold text-white mb-1">Полезно</h3>
            <p className="text-sm text-slate-400">Конкретные рекомендации, а не сухие баллы</p>
          </div>
        </div>
      </section>

      {/* ====== ФОРМА ПРОВЕРКИ ====== */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl">
          <h2 className="font-serif text-3xl font-bold mb-6 text-white">
            Проверить сочинение
          </h2>

          {/* Поле темы */}
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Тема или проблема исходного текста
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Например: проблема нравственного выбора человека на войне"
            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-8 transition"
          />

          {/* ====== ДВЕ ФОРМЫ РЯДОМ ====== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Левая колонка — Исходный текст */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                📖 Исходный текст из варианта ЕГЭ
              </label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Вставьте сюда текст, по которому написано сочинение..."
                rows={16}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
              <div className="flex justify-end mt-2">
                <span className="text-sm text-slate-400">
                  Слов: <span className="text-white font-semibold">{sourceWordCount}</span>
                </span>
              </div>
            </div>

            {/* Правая колонка — Сочинение */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                ✍️ Текст вашего сочинения
              </label>
              <textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="Вставьте сюда полный текст вашего сочинения..."
                rows={16}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm font-medium ${wordStatus.color}`}>
                  {wordStatus.label}
                </span>
                <span className="text-sm text-slate-400">
                  Слов: <span className="text-white font-semibold">{wordCount}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Прогресс-бар слов */}
          <div className="w-full bg-slate-800 rounded-full h-2 mb-8 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                wordCount < 70
                  ? "bg-red-500"
                  : wordCount < 150
                  ? "bg-yellow-500"
                  : "bg-gradient-to-r from-green-400 to-emerald-500"
              }`}
              style={{ width: `${Math.min((wordCount / 150) * 100, 100)}%` }}
            />
          </div>

          {/* Кнопка оплаты + проверки */}
          <button
            onClick={handlePayClick}
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed glow-button text-lg"
          >
            {loading
              ? "🔍 Проверяю... (это займёт ~60 сек)"
              : "🚀 Проверить сочинение (35 ₽)"}
          </button>

          {/* Подсказка под кнопкой */}
          <p className="text-center text-xs text-slate-500 mt-3">
            Нажимая кнопку, вы соглашаетесь с{" "}
            <Link href="/offer" className="text-purple-400 hover:text-purple-300 underline">
              договором-офертой
            </Link>{" "}
            и{" "}
            <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
              политикой конфиденциальности
            </Link>
          </p>
        </div>

        {/* ====== РЕЗУЛЬТАТ ====== */}
        {result && (
          <div className="glass-card rounded-3xl p-8 md:p-10 mt-8 shadow-2xl">
            <h2 className="font-serif text-3xl font-bold mb-6 text-white flex items-center gap-3">
              📊 Результат проверки
            </h2>
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-mono text-sm bg-slate-950/40 p-6 rounded-2xl border border-slate-800">
              {result}
            </div>

            {/* Кнопка скачивания PDF */}
            <button
              onClick={async () =>
                await generatePDF({
                  topic: topic,
                  sourceText: sourceText,
                  essay: essay,
                  analysis: result,
                })
              }
              className="w-full mt-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 transition-all glow-button flex items-center justify-center gap-2"
            >
              📥 Скачать результат в PDF
            </button>
          </div>
        )}
      </section>

      {/* ====== КАК ЭТО РАБОТАЕТ ====== */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-serif text-4xl font-bold text-center text-white mb-12">
          Как это работает
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: "1", title: "Вставьте материалы", desc: "Исходный текст из варианта, тему и ваше сочинение" },
            { num: "2", title: "AI анализирует", desc: "Две модели последовательно проверяют по критериям" },
            { num: "3", title: "Получите разбор", desc: "Баллы, ошибки и рекомендации по улучшению" },
          ].map((step) => (
            <div key={step.num} className="glass-card rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== ДИСКЛЕЙМЕР ====== */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="glass-card rounded-2xl p-6 border-yellow-500/20">
          <p className="text-sm text-slate-400 leading-relaxed">
            <span className="text-yellow-300 font-semibold">⚠️ Важное уведомление:</span>{" "}
            Данный сервис является независимым образовательным проектом и{" "}
            <span className="text-white font-medium">
              не связан с ФИПИ, Рособрнадзором, Министерством просвещения РФ
            </span>{" "}
            или иными официальными организациями, проводящими ЕГЭ. Все оценки носят{" "}
            <span className="text-white font-medium">рекомендательный характер</span> и не
            гарантируют идентичного результата на реальном экзамене. Используйте сервис как
            вспомогательный инструмент для подготовки.
          </p>
        </div>
      </section>

      {/* ====== ФУТЕР ====== */}
      <footer className="border-t border-slate-800 mt-12 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Колонка 1: О сервисе */}
            <div>
              <h3 className="font-serif text-lg font-bold text-white mb-3">ЕГЭ-Эксперт</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                AI-сервис для проверки сочинений ЕГЭ по русскому языку.
                Помогаем выпускникам готовиться к экзамену.
              </p>
            </div>

            {/* Колонка 2: Документы */}
            <div>
              <h3 className="font-semibold text-white mb-3">Документы</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/offer" className="text-slate-400 hover:text-purple-300 transition">
                    Договор-оферта
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-purple-300 transition">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link href="/contacts" className="text-slate-400 hover:text-purple-300 transition">
                    Контакты и реквизиты
                  </Link>
                </li>
              </ul>
            </div>

            {/* Колонка 3: Реквизиты */}
            <div>
              <h3 className="font-semibold text-white mb-3">Реквизиты</h3>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>Махмутов Альберт Маратович</li>
                <li>Самозанятый (плательщик НПД)</li>
                <li>ИНН: 560911225995</li>
                <li>
                  <a href="mailto:malbert333j@mail.ru" className="hover:text-purple-300 transition">
                    malbert333j@mail.ru
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
            <p>© 2026 ЕГЭ-Эксперт. Все права защищены.</p>
            <p className="mt-2">Сделано с ❤️ для будущих выпускников</p>
          </div>
        </div>
      </footer>

      {/* ====== МОДАЛКА ОПЛАТЫ ====== */}
      {showPayment && (
        <PaymentModal
          amount={35}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </main>
  );
}