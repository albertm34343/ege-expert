import Link from "next/link";

export const metadata = {
  title: "Политика конфиденциальности | ЕГЭ-Эксперт",
  description: "Политика обработки персональных данных",
};

export default function PrivacyPage() {
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
            Политика конфиденциальности
          </h1>
          <p className="text-slate-400 mb-8">Действует с 2026 года</p>

          <div className="text-slate-300 leading-relaxed space-y-6">
            <p>
              Настоящая Политика конфиденциальности определяет порядок обработки и
              защиты персональных данных пользователей сервиса{" "}
              <span className="text-purple-300">проверка-сочиненийегэ.рф</span>.
            </p>
            <p>
              Оператором персональных данных является самозанятый{" "}
              <strong className="text-white">Махмутов Альберт Маратович</strong>, ИНН{" "}
              <strong className="text-white">560911225995</strong>.
            </p>
            <p>
              Политика разработана в соответствии с Федеральным законом от 27.07.2006
              № 152-ФЗ «О персональных данных».
            </p>

            <h2 className="font-serif text-2xl font-bold text-white mt-8 mb-3">
              1. Общие положения
            </h2>
            <p>
              1.1. Используя Сервис, Пользователь даёт согласие на обработку своих
              персональных данных на условиях настоящей Политики.
            </p>
            <p>
              1.2. В случае несогласия с условиями Политики Пользователь должен
              прекратить использование Сервиса.
            </p>

            <h2 className="font-serif text-2xl font-bold text-white mt-8 mb-3">
              2. Какие данные мы собираем
            </h2>
            <p>2.1. Оператор обрабатывает следующие категории данных:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong className="text-white">Email пользователя</strong> — для
                отправки фискального чека, результата проверки и связи в случае
                спорных ситуаций;
              </li>
              <li>
                <strong className="text-white">Содержание загружаемых текстов</strong>{" "}
                (исходный текст, тема, сочинение) — для оказания услуги по проверке;
              </li>
              <li>
                <strong className="text-white">Технические данные</strong> — IP-адрес,
                тип браузера, операционная система (собираются автоматически);
              </li>
              <li>
                <strong className="text-white">Данные об оплате</strong> —
                обрабатываются непосредственно платёжным сервисом ЮKassa. Оператор
                не получает и не хранит реквизиты банковских карт.
              </li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-white mt-8 mb-3">
              3. Цели обработки данных
            </h2>
            <p>3.1. Персональные данные обрабатываются в следующих целях:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>оказание услуги по проверке сочинения;</li>
              <li>направление результата проверки на email Пользователя;</li>
              <li>выставление фискального чека согласно 54-ФЗ;</li>
              <li>выполнение обязанностей, предусмотренных законодательством РФ;</li>
              <li>рассмотрение обращений и претензий Пользователей.</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-white mt-8 mb-3">
              4. Правовые основания обработки
            </h2>
            <p>4.1. Обработка персональных данных осуществляется на основаниях:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>согласие Пользователя (ст. 6 152-ФЗ);</li>
              <li>исполнение договора, заключённого с Пользователем (Оферта);</li>
              <li>требования законодательства РФ (54-ФЗ, 422-ФЗ).</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-white mt-8 mb-3">
              5. Сроки хранения данных
            </h2>
            <p>
              5.1. Email и история заказов хранятся в течение 3 (трёх) лет с момента
              последнего обращения Пользователя.
            </p>
            <p>
              5.2. Тексты сочинений хранятся{" "}
              <strong className="text-white">не более 30 дней</strong> с момента
              проверки и затем автоматически удаляются.
            </p>
            <p>
              5.3. Данные об оплате хранятся в течение сроков, установленных
              налоговым законодательством РФ.
            </p>

            <h2 className="font-serif text-2xl font-bold text-white mt-8 mb-3">
              6. Передача данных третьим лицам
            </h2>
            <p>6.1. Оператор передаёт данные третьим лицам только в случаях:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong className="text-white">ЮKassa (ООО НКО «ЮMoney»)</strong> —
                для обработки платежа и выставления чека;
              </li>
              <li>
                <strong className="text-white">DeepSeek (поставщик AI-модели)</strong>{" "}
                — тексты сочинений передаются в обезличенном виде для проверки;
              </li>
              <li>
                <strong className="text-white">Государственные органы</strong> — по
                официальным запросам, в случаях, предусмотренных законом.
              </li>
            </ul>
            <p>
              6.2. Оператор{" "}
              <strong className="text-white">не передаёт данные в рекламных целях</strong>{" "}
              и не продаёт их третьим лицам.
            </p>

            <h2 className="font-serif text-2xl font-bold text-white mt-8 mb-3">
              7. Меры защиты данных
            </h2>
            <p>7.1. Оператор принимает следующие меры для защиты данных:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>шифрование передаваемых данных по протоколу HTTPS (TLS 1.3);</li>
              <li>хранение данных на защищённых серверах в РФ;</li>
              <li>ограничение доступа к данным;</li>
              <li>регулярное резервное копирование.</li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-white mt-8 mb-3">
              8. Права пользователя
            </h2>
            <p>8.1. Пользователь имеет право:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>получать информацию о своих обрабатываемых данных;</li>
              <li>требовать их уточнения, блокирования или удаления;</li>
              <li>отозвать согласие на обработку в любой момент;</li>
              <li>обжаловать действия Оператора в Роскомнадзоре.</li>
            </ul>
            <p>
              8.2. Для реализации этих прав Пользователь направляет запрос на email{" "}
              <a
                href="mailto:malbert333j@mail.ru"
                className="text-purple-300 hover:text-purple-200 underline"
              >
                malbert333j@mail.ru
              </a>
              . Срок ответа — до 30 дней.
            </p>

            <h2 className="font-serif text-2xl font-bold text-white mt-8 mb-3">
              9. Использование файлов cookie
            </h2>
            <p>
              9.1. Сервис использует технические cookie-файлы, необходимые для
              корректной работы сайта. Они не содержат персональных данных.
            </p>

            <h2 className="font-serif text-2xl font-bold text-white mt-8 mb-3">
              10. Изменения политики
            </h2>
            <p>
              10.1. Оператор имеет право вносить изменения в настоящую Политику.
              Актуальная редакция всегда доступна на этой странице.
            </p>

            <h2 className="font-serif text-2xl font-bold text-white mt-8 mb-3">
              11. Контактная информация
            </h2>
            <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700 mt-4">
              <p>
                <strong className="text-white">Оператор:</strong> Махмутов Альберт
                Маратович
              </p>
              <p>
                <strong className="text-white">ИНН:</strong> 560911225995
              </p>
              <p>
                <strong className="text-white">Email:</strong>{" "}
                <a
                  href="mailto:malbert333j@mail.ru"
                  className="text-purple-300 hover:text-purple-200 underline"
                >
                  malbert333j@mail.ru
                </a>
              </p>
              <p>
                <strong className="text-white">Сайт:</strong>{" "}
                проверка-сочиненийегэ.рф
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}