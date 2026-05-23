import Link from "next/link";

export const metadata = {
  title: "Контакты | ЕГЭ-Эксперт",
  description: "Контактная информация и реквизиты",
};

export default function ContactsPage() {
  return (
    <main className="animated-gradient min-h-screen text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-8 transition"
        >
          ← Вернуться на главную
        </Link>

        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">
            Контакты и реквизиты
          </h1>
          <p className="text-slate-400 mb-8">
            Свяжитесь с нами по любым вопросам
          </p>

          {/* ====== СВЯЗЬ ====== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="text-lg font-semibold text-white mb-2">Email для связи</h3>
              <a
                href="mailto:malbert333j@mail.ru"
                className="text-purple-300 hover:text-purple-200 underline break-all"
              >
                malbert333j@mail.ru
              </a>
              <p className="text-sm text-slate-400 mt-3">
                Ответим в течение 24 часов в рабочие дни
              </p>
            </div>

            <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="text-lg font-semibold text-white mb-2">Сайт</h3>
              <p className="text-purple-300 break-all">
                проверка-сочиненийегэ.рф
              </p>
              <p className="text-sm text-slate-400 mt-3">
                Сервис работает 24/7
              </p>
            </div>
          </div>

          {/* ====== ПО КАКИМ ВОПРОСАМ ====== */}
          <h2 className="font-serif text-2xl font-bold text-white mb-4">
            По каким вопросам можно обращаться
          </h2>
          <div className="space-y-3 mb-10">
            <div className="flex items-start gap-3 bg-slate-900/40 rounded-xl p-4">
              <span className="text-2xl">💳</span>
              <div>
                <h4 className="font-semibold text-white">Вопросы по оплате и возвратам</h4>
                <p className="text-sm text-slate-400">
                  Не пришёл чек, двойное списание, запрос возврата средств
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-900/40 rounded-xl p-4">
              <span className="text-2xl">🔧</span>
              <div>
                <h4 className="font-semibold text-white">Технические проблемы</h4>
                <p className="text-sm text-slate-400">
                  Не пришёл результат, ошибки при загрузке, проблемы с сайтом
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-900/40 rounded-xl p-4">
              <span className="text-2xl">📄</span>
              <div>
                <h4 className="font-semibold text-white">Вопросы по проверке</h4>
                <p className="text-sm text-slate-400">
                  Уточнение по баллам, разбору ошибок и критериям
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-900/40 rounded-xl p-4">
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="font-semibold text-white">Персональные данные</h4>
                <p className="text-sm text-slate-400">
                  Запрос на удаление данных, отзыв согласия на обработку
                </p>
              </div>
            </div>
          </div>

          {/* ====== РЕКВИЗИТЫ ====== */}
          <h2 className="font-serif text-2xl font-bold text-white mb-4">
            Реквизиты исполнителя
          </h2>
          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700 space-y-3">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">Полное наименование</span>
              <span className="text-white font-medium">Махмутов М.А.</span>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">Статус</span>
              <span className="text-white font-medium">Самозанятый (плательщик НПД)</span>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">ИНН</span>
              <span className="text-white font-medium font-mono">560911225995</span>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">Налоговый режим</span>
              <span className="text-white font-medium">
                НПД (Федеральный закон № 422-ФЗ)
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">Email</span>
              <a
                href="mailto:malbert333j@mail.ru"
                className="text-purple-300 hover:text-purple-200 underline font-medium"
              >
                malbert333j@mail.ru
              </a>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <span className="text-slate-400">Сайт</span>
              <span className="text-white font-medium">проверка-сочиненийегэ.рф</span>
            </div>
          </div>

          {/* ====== ДОКУМЕНТЫ ====== */}
          <h2 className="font-serif text-2xl font-bold text-white mt-10 mb-4">
            Документы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/offer"
              className="bg-slate-900/60 rounded-2xl p-5 border border-slate-700 hover:border-purple-500 transition group"
            >
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-semibold text-white mb-1 group-hover:text-purple-300 transition">
                Договор-оферта →
              </h4>
              <p className="text-sm text-slate-400">
                Условия предоставления услуг
              </p>
            </Link>
            <Link
              href="/privacy"
              className="bg-slate-900/60 rounded-2xl p-5 border border-slate-700 hover:border-purple-500 transition group"
            >
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-semibold text-white mb-1 group-hover:text-purple-300 transition">
                Политика конфиденциальности →
              </h4>
              <p className="text-sm text-slate-400">
                Обработка персональных данных
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}