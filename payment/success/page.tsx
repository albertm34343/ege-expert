export default function PaymentSuccessPage() {
  return (
    <main className="animated-gradient min-h-screen flex items-center justify-center text-slate-100">
      <div className="glass-card rounded-3xl p-12 max-w-lg w-full text-center shadow-2xl mx-4">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="font-serif text-3xl font-bold text-white mb-4">
          Оплата прошла успешно!
        </h1>
        <p className="text-slate-300 leading-relaxed mb-6">
          Мы получили оплату и уже проверяем ваше сочинение.
          <br />
          <strong className="text-white">
            Результат придёт на ваш email в течение 2–3 минут.
          </strong>
        </p>
        <p className="text-slate-400 text-sm mb-8">
          Также чек об оплате придёт отдельным письмом от ЮKassa.
        </p>
        <a
          href="/"
          className="inline-block py-3 px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition"
        >
          ← Вернуться на главную
        </a>
      </div>
    </main>
  );
}