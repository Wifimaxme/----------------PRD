import { Link } from "react-router";
import {
  Bot,
  Database,
  ExternalLink,
  FileText,
  Lock,
  Shield,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

type PolicyRow = {
  label: string;
  value: React.ReactNode;
};

const operatorRows: PolicyRow[] = [
  {
    label: "Оператор персональных данных",
    value: "Общество с ограниченной ответственностью «Чемпион и К»",
  },
  {
    label: "Сокращенное наименование",
    value: "ООО «Чемпион и К»",
  },
  {
    label: "ИНН / ОГРН",
    value: "5403027269 / 1175476013888",
  },
  {
    label: "Место нахождения",
    value: "Российская Федерация, г. Новосибирск",
  },
  {
    label: "Контактный email",
    value: (
      <a href="mailto:wifimaxme@gmail.com" className="text-purple-700 hover:underline">
        wifimaxme@gmail.com
      </a>
    ),
  },
  {
    label: "Контактный телефон",
    value: (
      <a href="tel:+79138927059" className="text-purple-700 hover:underline">
        8-913-892-70-59
      </a>
    ),
  },
  {
    label: "Дата редакции",
    value: "13 марта 2026 года",
  },
];

const dataCategories: PolicyRow[] = [
  {
    label: "Контактные данные",
    value:
      "Имя, номер телефона, адрес электронной почты и иные сведения, которые пользователь добровольно сообщает при обращении к оператору по телефону, email или через внешние каналы связи.",
  },
  {
    label: "Данные ребенка и семьи",
    value:
      "Сведения, которые пользователь добровольно вводит при оформлении услуги, взаимодействии с оператором, в квизе, в договорных документах и при использовании сервисов сайта.",
  },
  {
    label: "Данные для AI-нутрициолога",
    value:
      "Возраст, рост, вес, уровень активности ребенка, текст описания приемов пищи, предпочтения в питании, журнал питания и сформированные рекомендации.",
  },
  {
    label: "Технические данные",
    value:
      "IP-адрес, сведения о браузере и устройстве, данные журналов веб-сервера, технические события сайта, данные браузерного хранилища и иные сведения, автоматически передаваемые при использовании сайта.",
  },
  {
    label: "Данные сторонних сервисов",
    value:
      "При переходе в Telegram-бот, просмотре встроенного RuTube-видео и использовании AI-функций часть технических и пользовательских данных может обрабатываться соответствующими внешними сервисами по их собственным правилам.",
  },
];

const purposeRows: PolicyRow[] = [
  {
    label: "Оказание услуг и сопровождение договора",
    value:
      "Запись на занятия, сопровождение обучения, коммуникация с родителями, прием и подтверждение оплат, исполнение обязательств по договору.",
  },
  {
    label: "Обработка обращений",
    value:
      "Ответы на запросы пользователей, обработка входящих писем, сообщений и звонков, организация обратной связи.",
  },
  {
    label: "Работа цифровых сервисов сайта",
    value:
      "Формирование PDF-гайдов по квизу, работа AI-нутрициолога, хранение пользовательских настроек и журналов в браузере, обеспечение корректной работы интерфейсов.",
  },
  {
    label: "Безопасность и защита прав оператора",
    value:
      "Предотвращение злоупотреблений, защита законных интересов оператора, ведение внутреннего учета и исполнение требований законодательства РФ.",
  },
];

const legalBasis = [
  "Конституция Российской Федерации, Гражданский кодекс Российской Федерации и иные применимые нормы права.",
  "Федеральный закон от 27.07.2006 № 152-ФЗ «О персональных данных».",
  "Договоры, оферта и иные соглашения, заключаемые с пользователем.",
  "Согласие субъекта персональных данных либо его законного представителя на обработку персональных данных.",
  "Законный интерес оператора в случаях, допускаемых законодательством Российской Федерации.",
];

const processingActions = [
  "сбор, запись, систематизация, накопление, хранение",
  "уточнение (обновление, изменение), извлечение, использование",
  "передача (предоставление, доступ) в предусмотренных законом или договором случаях",
  "обезличивание, блокирование, удаление, уничтожение",
];

const securityMeasures = [
  "ограничение доступа к данным только уполномоченным лицам",
  "применение организационных и технических мер защиты информации",
  "контроль доступа к внутренним сервисам и документам оператора",
  "использование защищенных каналов связи и стандартных механизмов безопасности платформ",
];

const rights = [
  "получать сведения об обработке своих персональных данных",
  "требовать уточнения, блокирования или уничтожения персональных данных, если они неполные, устаревшие, неточные или обрабатываются незаконно",
  "отозвать согласие на обработку персональных данных",
  "обжаловать действия или бездействие оператора в уполномоченный орган или в судебном порядке",
];

function PolicyTable({ rows }: { rows: PolicyRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="w-full min-w-[720px] border-collapse bg-white">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-gray-200 last:border-b-0">
              <th className="w-[32%] bg-gray-50 px-5 py-4 text-left align-top text-sm font-semibold text-gray-900">
                {row.label}
              </th>
              <td className="px-5 py-4 text-sm leading-7 text-gray-700">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PolicySection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[2.5rem] bg-gradient-to-br from-purple-900 via-purple-800 to-orange-500 p-8 text-white shadow-2xl md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                ФЗ-152
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
                Политика обработки персональных данных
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-purple-100">
                Настоящая политика определяет порядок обработки персональных данных пользователей
                сайта и клиентов ООО «Чемпион и К», а также меры по обеспечению безопасности
                персональных данных. Редакция действует с 13 марта 2026 года.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/education-info/documents"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-purple-800 transition hover:bg-purple-50"
                >
                  <FileText className="h-5 w-5" />
                  Вернуться к документам
                </Link>
                <Link
                  to="/oferta#personal-data-consent"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-semibold text-white transition hover:bg-white/15"
                >
                  <ExternalLink className="h-5 w-5" />
                  Открыть согласие в оферте
                </Link>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <PolicySection icon={<Database className="h-5 w-5" />} title="1. Общие сведения об операторе">
                <PolicyTable rows={operatorRows} />
              </PolicySection>

              <PolicySection icon={<FileText className="h-5 w-5" />} title="2. Категории персональных данных">
                <PolicyTable rows={dataCategories} />
                <p className="mt-5 text-sm leading-7 text-gray-600">
                  Сайт не требует обязательного ввода персональных данных для обычного просмотра
                  большинства страниц. Обработка персональных данных начинается, когда пользователь
                  самостоятельно передает такие данные оператору или использует соответствующие
                  сервисы сайта.
                </p>
              </PolicySection>

              <PolicySection icon={<Shield className="h-5 w-5" />} title="3. Цели и правовые основания обработки">
                <PolicyTable rows={purposeRows} />
                <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Правовые основания
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-700">
                    {legalBasis.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-purple-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </PolicySection>

              <PolicySection icon={<Bot className="h-5 w-5" />} title="4. Особенности цифровых сервисов сайта">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-700">
                      AI-нутрициолог
                    </div>
                    <p className="mt-3 text-sm leading-7 text-gray-700">
                      При использовании AI-нутрициолога пользователь может вводить сведения о
                      ребенке и рационе. Такие данные сохраняются в браузере пользователя через
                      <code> localStorage </code> и могут направляться на серверные AI-endpoints
                      сайта для формирования аналитики и рекомендаций.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-700">
                      Квиз и AI-гайды
                    </div>
                    <p className="mt-3 text-sm leading-7 text-gray-700">
                      Ответы квиза используются для персонализации PDF-гайда по адаптации и
                      отправляются на внутренний API сайта. Если активирована AI-генерация,
                      данные могут дополнительно передаваться во внешний AI-сервис.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-700">
                      Telegram и внешние платформы
                    </div>
                    <p className="mt-3 text-sm leading-7 text-gray-700">
                      При переходе в Telegram-бот, RuTube или иные внешние сервисы обработка
                      данных осуществляется также владельцами соответствующих платформ по их
                      собственным политикам и правилам.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-700">
                      Браузерные хранилища
                    </div>
                    <p className="mt-3 text-sm leading-7 text-gray-700">
                      Для сохранения пользовательских настроек и результатов отдельных сервисов
                      сайт может использовать браузерные механизмы хранения данных, включая
                      <code> localStorage </code> и технические cookie.
                    </p>
                  </div>
                </div>
              </PolicySection>

              <PolicySection icon={<Lock className="h-5 w-5" />} title="5. Порядок обработки и меры защиты">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Действия с данными
                    </div>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-700">
                      {processingActions.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Меры безопасности
                    </div>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-700">
                      {securityMeasures.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-purple-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-7 text-gray-700">
                  Оператор хранит персональные данные не дольше, чем этого требуют цели обработки,
                  договорные обязательства и нормы законодательства Российской Федерации. По
                  достижении целей обработки данные подлежат удалению или обезличиванию, если иное
                  не требуется законом.
                </p>
              </PolicySection>

              <PolicySection icon={<Shield className="h-5 w-5" />} title="6. Права субъектов персональных данных">
                <ul className="space-y-3 text-sm leading-7 text-gray-700">
                  {rights.map((item) => (
                    <li key={item} className="flex gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                      <span className="mt-2 h-2 w-2 rounded-full bg-purple-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-7 text-gray-700">
                  Для реализации своих прав субъект персональных данных или его законный
                  представитель может направить запрос на адрес{" "}
                  <a href="mailto:wifimaxme@gmail.com" className="text-purple-700 hover:underline">
                    wifimaxme@gmail.com
                  </a>{" "}
                  с темой письма «Персональные данные». Оператор вправе запросить сведения,
                  необходимые для подтверждения личности заявителя и проверки его полномочий.
                </p>
              </PolicySection>

              <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-900">
                <div className="font-semibold uppercase tracking-[0.16em] text-amber-700">
                  Важно
                </div>
                <p className="mt-3">
                  Эта политика описывает общий порядок обработки персональных данных на сайте и
                  связанных цифровых сервисах. Согласие на обработку персональных данных в рамках
                  договора дополнительно отражено в разделе{" "}
                  <Link to="/oferta#personal-data-consent" className="font-semibold underline">
                    7.3 публичной оферты
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
