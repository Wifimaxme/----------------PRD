import { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Quiz } from "../components/Quiz";
import StickyMobileCTA from "../../components/StickyMobileCTA";
import HeroFloatingShapes, { LkFloatingShapes } from "../../components/HeroFloatingShapes";
import { Link, useNavigate } from "react-router";
import { 
  Heart, 
  Users, 
  Trophy, 
  Shield, 
  Smartphone,
  Award,
  CheckCircle2,
  Star,
  MessageCircle,
  PlayCircle,
  Send,
  Sparkles,
  QrCode,
  LogIn
} from "lucide-react";

const coaches = [
  {
    name: "Ильиных Александр",
    education: "Колледж Олимпийского резерва, НГПУ (факультет физической культуры)",
    experience: "10 лет тренерского стажа",
    badge: "ОФП и футбол",
    focus: "Системно выстраивает базу движения и помогает ребенку уверенно войти в спорт без перегруза.",
    bgClass: "bg-orange-500",
    internships: [
      "2021г - Манчестер Юнайтед (Англия 🏴󠁧󠁢󠁥󠁮󠁧󠁿)",
      "2023г - Локомотив (Россия 🇷🇺)",
      "2024-2025г - Црвена Звезда (Сербия 🇷🇸)"
    ],
    specialty: "Тренер по футболу ⚽️ и ОФП 🏃🏻‍♂️"
  },
  {
    name: "Мензоров Максим Дмитриевич",
    education: "Новосибирский Колледж Олимпийского Резерва, высшее НГПУ (ФФК)",
    achievement: "1 взрослый разряд по футболу, игрок ДЮСШ Новосибирск",
    experience: "6 лет тренерского стажа",
    badge: "Игровой опыт",
    focus: "Собирает доверие через спокойную коммуникацию и превращает тренировку в понятный детям ритуал успеха.",
    bgClass: "bg-orange-600",
    quote: "Улыбки детей до и после тренировки, их честность и доброта",
    hobby: "Катание на коньках, настольные игры"
  },
  {
    name: "Юсупов Константин",
    education: "Среднее-специальное (физическая культура)",
    experience: "3 года тренерского стажа, 10 лет игрового стажа",
    badge: "Техника и игра",
    focus: "Держит высокий темп занятия и помогает детям быстрее почувствовать уверенность в игре один в один.",
    bgClass: "bg-amber-600",
    teams: "«Рубин» Славгород, «Юность» Славгород, «Семеновка» Славгород, «Сатурн» Новосибирск, «Скорпион» Новосибирск",
    quote: "В работе с детьми нравятся их энергия и эмоции"
  },
  {
    name: "Кулаков Максим Станиславович",
    education: "Высшее (СГУГиТ)",
    license: "Лицензия C-UEFA",
    experience: "5 лет тренерского стажа, 7 лет игрового стажа",
    badge: "UEFA C",
    focus: "Соединяет европейскую методику с понятной ребенку игровой подачей и вниманием к деталям техники.",
    bgClass: "bg-orange-500",
    quote: "Горящие глаза детей, которые пришли заниматься любимым делом. Приятно наблюдать когда ребенок старается и доказывает что он все может"
  },
  {
    name: "Свитницкий Родион",
    education: "ООО МУЦД (Физическая культура и спорт)",
    experience: "5 лет тренерского стажа",
    badge: "Соревновательный дух",
    focus: "Сильная сторона - мотивация и настрой детей на постепенный рост через маленькие победы.",
    bgClass: "bg-orange-600",
    achievements: "Победители и призеры COPA JUNIOR г.Красноярск",
    credo: "Футбол - жизнь",
    hobby: "Футбол и активный отдых"
  },
  {
    name: "Дмитрий Бобин",
    education: "СГУПС (Новосибирск)",
    license: "Тренерская лицензия РФС категории C",
    achievement: "КМС по футболу, бывший игрок ФК Динамо (Барнаул)",
    badge: "РФС C и КМС",
    focus: "Добавляет в занятия соревновательный нерв и дисциплину, не ломая детскую мотивацию.",
    bgClass: "bg-amber-600",
    achievements: "Победители соревнований на призы ФК Джуниор. Призеры международных турниров в составе ФК \"Спартак\". Призеры турниров ЕФЛ"
  },
  {
    name: "Пирогов Глеб",
    education: "Славгородский педагогический колледж (тренер по физической культуре)",
    achievement: "Игрок команды СФЛ",
    badge: "Педагогический подход",
    focus: "Внимательно ведет ребенка через первые этапы адаптации и регулярно усиливает практику новыми стажировками.",
    bgClass: "bg-orange-500",
    note: "Регулярно проходит обучения и стажировки по категориям и программам"
  },
];

const getCoachInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const heroHighlights = [
  {
    value: "2 раза в неделю",
    label: "тренировки проходят прямо в садике",
  },
  {
    value: "до 10 детей",
    label: "в группе, чтобы видеть каждого",
  },
  {
    value: "3-7 лет",
    label: "программа под дошкольный возраст",
  },
];

const aboutHighlights = [
  {
    id: "01",
    title: "Мы воспитываем чемпионов",
    description:
      "Команда тренеров помогает ребёнку расти через дисциплину, спортивный дух, выносливость и уважение к партнёрам по игре.",
  },
  {
    id: "02",
    title: "Удобное расположение",
    description:
      "Занятия проходят в детском саду, поэтому родителям не нужно перестраивать вечернюю логистику и тратить время на поездки.",
  },
  {
    id: "03",
    title: "Турниры и праздники",
    description:
      "Регулярно проводим игровые события, где ребёнок показывает прогресс, а родители видят, что спорт ассоциируется с радостью.",
  },
  {
    id: "04",
    title: "Внимание каждому",
    description:
      "Маленькие группы и адаптированная программа помогают не потеряться в потоке и двигаться в комфортном темпе.",
  },
];

const philosophyPillars = [
  {
    label: "Интерес вместо давления",
    text: "Ребёнок включается через игру и чувство успеха, а не через страх ошибки и гонку за результатом.",
  },
  {
    label: "Возраст 3-7 лет",
    text: "Учитываем утомляемость, чувствительность к неудачам и потребность в частой смене деятельности.",
  },
  {
    label: "Среда помогает учиться",
    text: "Упражнения и формат тренировки подсказывают ребёнку правильное действие и постепенно растят уверенность.",
  },
];

const philosophyExamples = [
  "дриблинг как побег от монстров",
  "обводка как сбор сокровищ",
  "удар как спасение города",
];

const funinoSignals = ["3×3 или 4×4", "4 мини-ворот", "Head Up", "Решения без страха"];

const funinoBenefits = [
  {
    title: "1. Максимум касаний",
    icon: Users,
    badge: "Постоянное вовлечение",
    description:
      "Каждый ребёнок чаще работает с мячом и не выпадает из игры в ожидании своей очереди.",
    accentClass: "from-orange-500 to-amber-400",
    surfaceClass: "from-orange-50 to-amber-50",
    borderClass: "border-orange-200",
  },
  {
    title: "2. Когнитивное развитие",
    icon: Trophy,
    badge: "Игровой интеллект",
    description:
      "Четыре воротa заставляют сканировать поле, поднимать голову и самому выбирать решение.",
    accentClass: "from-purple-600 to-fuchsia-500",
    surfaceClass: "from-purple-50 to-orange-50",
    borderClass: "border-purple-200",
  },
  {
    title: "3. Среда как учитель",
    icon: Heart,
    badge: "Без давления",
    description:
      "Тренер направляет игру, а дети пробуют, ошибаются и учатся принимать решения без страха критики.",
    accentClass: "from-rose-500 to-orange-400",
    surfaceClass: "from-rose-50 to-orange-50",
    borderClass: "border-rose-200",
  },
];

const pricingPlans = [
  {
    name: "Базовый",
    price: "2 760 ₽",
    note: "/ месяц",
    badge: "Основной тариф",
    features: [
      "8 занятий в месяц",
      "2 раза в неделю",
      "Группы до 10 человек",
      "Тренировки прямо в детском саду",
    ],
    buttonClass: "bg-gray-900 text-white hover:bg-gray-800",
  },
  {
    name: "Льготный",
    price: "1 960 ₽",
    note: "/ месяц",
    badge: "Выгода до 30%",
    highlighted: true,
    features: [
      "Для многодетных семей",
      "При записи двоих детей",
      "Для детей сотрудников ДОУ",
      "Все условия базового тарифа",
    ],
    buttonClass: "bg-purple-700 text-white hover:bg-purple-800",
  },
];

const personalAccountSteps = [
  {
    step: "01",
    title: "Доступ в систему",
    description: "Обратитесь к администратору школы и запишитесь на бесплатное пробное занятие. Личный кабинет станет доступен сразу после записи.",
  },
  {
    step: "02",
    title: "Удобный вход",
    description: "Авторизуйтесь в личном кабинете через «MAX - бот», по номеру телефона или через Telegram-бот — без запоминания паролей.",
  },
  {
    step: "03",
    title: "Оплачивайте онлайн",
    description: "Вносите оплату за обучение, проверяйте баланс и следите за историей платежей в реальном времени.",
  },
];

const sectionTitleClass = "mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-[3.25rem] md:leading-[1.02]";
const subsectionTitleClass = "mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-[2.55rem] md:leading-[1.06]";
const primaryButtonClass = "ui-button-primary";
const secondaryButtonClass = "ui-button-secondary";
const secondaryButtonCompactClass = "ui-button-secondary px-5 py-3 text-sm";

const developmentPyramidLevels = [
  {
    level: "Уровень 5",
    title: "Игра в команде",
    icon: Trophy,
    widthClass: "w-full sm:w-[56%]",
    gradientClass: "from-amber-400 via-orange-400 to-orange-500",
    borderClass: "border-amber-200",
  },
  {
    level: "Уровень 4",
    title: "Точные передачи",
    icon: Users,
    widthClass: "w-full sm:w-[68%]",
    gradientClass: "from-orange-500 via-orange-500 to-rose-500",
    borderClass: "border-orange-200",
  },
  {
    level: "Уровень 3",
    title: "Сложные финты",
    icon: Star,
    widthClass: "w-full sm:w-[80%]",
    gradientClass: "from-fuchsia-500 via-purple-500 to-purple-600",
    borderClass: "border-fuchsia-200",
  },
  {
    level: "Уровень 2",
    title: "Игра 1×1",
    icon: Shield,
    widthClass: "w-full sm:w-[92%]",
    gradientClass: "from-violet-600 via-purple-600 to-indigo-600",
    borderClass: "border-violet-200",
  },
];

const RUTUBE_ORIGIN = "https://rutube.ru";
const HERO_VIDEO_SRC =
  "https://rutube.ru/play/embed/721b945fc4c0e87084fcbdf80a690335?p=8wZJQPDWMe-wnxvAsbgzFg&autoplay=true";

function normalizeHeroPhone(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (!digits.startsWith('7') && digits.length <= 10) digits = '7' + digits;
  return '+' + digits.slice(0, 11);
}

export function Home() {
  const [isHeroVideoReady, setIsHeroVideoReady] = useState(false);
  const heroVideoRef = useRef<HTMLIFrameElement | null>(null);
  const navigate = useNavigate();
  const [heroPhone, setHeroPhone] = useState('+7');

  const handleHeroSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    navigate('/signup', { state: { phone: heroPhone } });
  };

  const requestHeroVideoPlayback = () => {
    const playerWindow = heroVideoRef.current?.contentWindow;

    if (!playerWindow) {
      return;
    }

    [
      { type: "player:mute" },
      { type: "player:setVolume", data: { volume: 0 } },
      { type: "player:play", data: {} },
    ].forEach((command) => {
      playerWindow.postMessage(JSON.stringify(command), RUTUBE_ORIGIN);
    });
  };

  useEffect(() => {
    const timeoutIds: number[] = [];

    const scheduleMutedAutoplay = () => {
      [150, 500, 1400].forEach((delay) => {
        timeoutIds.push(window.setTimeout(() => {
          requestHeroVideoPlayback();
        }, delay));
      });
    };

    const handlePlayerMessage = (event: MessageEvent<string>) => {
      if (event.origin !== RUTUBE_ORIGIN || typeof event.data !== "string") {
        return;
      }

      try {
        const message = JSON.parse(event.data) as { type?: string };

        if (message.type === "player:ready") {
          scheduleMutedAutoplay();
        }
      } catch {
        return;
      }
    };

    window.addEventListener("message", handlePlayerMessage);
    scheduleMutedAutoplay();

    return () => {
      window.removeEventListener("message", handlePlayerMessage);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-16 sm:pt-20">
        <div className="absolute inset-0">
          <div className="absolute -left-16 -top-16 h-[28rem] w-[28rem] rounded-full bg-purple-300/55 blur-3xl hero-blob hero-blob-a"></div>
          <div className="absolute -right-24 top-8 h-[32rem] w-[32rem] rounded-full bg-orange-300/55 blur-3xl hero-blob hero-blob-b"></div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white/70"></div>
        </div>
        <HeroFloatingShapes />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div className="max-w-2xl">
              <div className="ui-eyebrow">
                <Sparkles className="h-4 w-4" />
                Футбольная школа для детей 3-7 лет
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-[1.02] tracking-tight text-gray-950 md:text-6xl">
                Футбол в вашем детском саду
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 md:text-xl">
                Больше чем просто игра: тренировки проходят прямо в детском саду, а
                ребёнок приходит в спорт мягко, с интересом и без лишней логистики для семьи.
              </p>

              {/* Inline phone-capture form — primary hero CTA */}
              <form
                onSubmit={handleHeroSubmit}
                className="mt-8 grid grid-cols-1 sm:grid-cols-[230px_1fr] gap-3 max-w-md"
              >
                <input
                  type="tel"
                  inputMode="tel"
                  value={heroPhone}
                  onChange={(e) => setHeroPhone(normalizeHeroPhone(e.target.value))}
                  onFocus={(e) => {
                    const el = e.currentTarget;
                    requestAnimationFrame(() => {
                      if (el.selectionStart !== null && el.selectionStart < 2) {
                        el.setSelectionRange(el.value.length, el.value.length);
                      }
                    });
                  }}
                  placeholder="+7 (___) ___-__-__"
                  className="px-4 py-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition text-slate-900 placeholder:text-slate-400 text-base"
                  aria-label="Телефон для записи на пробное"
                />
                <button
                  type="submit"
                  className={`${primaryButtonClass} whitespace-nowrap py-4 text-base font-bold`}
                >
                  Записаться
                </button>
              </form>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Первое занятие бесплатно
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Без обязательств
                </span>
              </div>

              <div className="mt-10 grid gap-5 border-t border-black/8 pt-6 sm:grid-cols-3">
                {heroHighlights.map((item, index) => (
                  <div
                    key={item.value}
                    className={`min-w-0 ${index > 0 ? "sm:border-l sm:border-black/8 sm:pl-5" : ""}`}
                  >
                    <div className="text-base font-bold text-gray-900">{item.value}</div>
                    <div className="mt-1 text-sm leading-relaxed text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Coaches trust strip — moved below stats per design feedback */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {coaches.slice(0, 5).map((coach) => (
                    <div
                      key={coach.name}
                      className={`w-9 h-9 rounded-full ${coach.bgClass} text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-sm`}
                      title={coach.name}
                    >
                      {getCoachInitials(coach.name)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-snug">
                  <span className="font-semibold text-gray-900">{coaches.length} тренеров</span>{' '}
                  с лицензиями <span className="font-semibold">C-UEFA</span>, КМС
                  и опытом в&nbsp;Манчестер Юнайтед, Локомотиве, Динамо
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 bg-[radial-gradient(circle,rgba(124,58,237,0.14),transparent_62%)] blur-2xl"></div>
              <div
                id="hero-video"
                className="relative isolate aspect-video overflow-hidden rounded-[1.35rem] border border-black/8 bg-gray-900 shadow-[0_24px_48px_-32px_rgba(15,23,42,0.38)]"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-orange-500 transition-opacity duration-700 ${
                    isHeroVideoReady ? 'opacity-0' : 'opacity-100'
                  }`}
                ></div>

                <iframe
                  ref={heroVideoRef}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                    isHeroVideoReady ? 'opacity-100' : 'opacity-0'
                  }`}
                  src={HERO_VIDEO_SRC}
                  title="Тренировки в детской футбольной школе Чемпион и К"
                  frameBorder="0"
                  onLoad={() => {
                    setIsHeroVideoReady(true);
                    requestHeroVideoPlayback();
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/38 via-transparent to-orange-500/28"></div>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#14031f]/80 via-[#14031f]/20 to-transparent"></div>
                  <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#14031f]/45 to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-orange-400/20 to-transparent"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] animate-pulse"></div>
                  <div className="absolute left-6 bottom-6 rounded-lg bg-black/28 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/82">
                    Видео запускается без звука
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About School Section */}
      <section id="about" className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <div className="max-w-xl">
              <div className="ui-eyebrow">
                <Users className="h-4 w-4" />
                О школе
              </div>
              <h2 className={sectionTitleClass}>
                Спокойный вход в спорт без перегруза для ребёнка и родителей
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                Мы строим занятия вокруг детского возраста, ритма семьи и реальной
                вовлечённости ребёнка. Поэтому школа ощущается не как ещё одна секция, а как
                естественная часть жизни в садике.
              </p>
              <div className="ui-body-sm mt-8 border-l-2 border-purple-200 pl-5">
                Маленькие группы, тренировки прямо в детском саду и бережная программа помогают
                ребёнку чувствовать себя увереннее уже с первых занятий.
              </div>
            </div>

            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {aboutHighlights.map((item) => (
                <article key={item.id} className="border-l border-black/8 pl-5">
                  <div className="relative mb-5 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-500 shadow-[0_8px_16px_rgba(234,88,12,0.25)]">
                    <div className="absolute inset-0 opacity-15">
                      <svg viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="4" className="h-full w-full">
                        <polygon points="50,25 74,42 65,71 35,71 26,42" fill="black" />
                        <line x1="50" y1="25" x2="50" y2="0" />
                        <line x1="26" y1="42" x2="0" y2="30" />
                        <line x1="74" y1="42" x2="100" y2="30" />
                        <line x1="35" y1="71" x2="15" y2="100" />
                        <line x1="65" y1="71" x2="85" y2="100" />
                      </svg>
                    </div>
                    <span className="relative z-10 text-3xl font-black text-white" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                      {item.id}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                    {item.title}
                  </h3>
                  <p className="ui-body-sm mt-3">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section className="py-24 bg-slate-50/60">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="ui-eyebrow">
              <Sparkles className="h-4 w-4" />
              Наставники школы
            </div>
            <h2 className={sectionTitleClass}>
              Тренерский состав, которому родители доверяют с первого занятия
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Команда практиков с лицензиями, игровым опытом и бережным подходом к дошкольникам.
              Важны не только регалии, но и то, как тренер умеет включить ребёнка в игру и
              удержать его интерес.
            </p>
          </div>

          <div className="mt-8 snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:thin] [scrollbar-color:rgba(147,51,234,0.45)_transparent]">
            <div className="flex w-max gap-5 pr-4">
              {coaches.map((coach, index) => {
                const coachHighlights = [
                  { label: "Опыт", value: coach.experience },
                  {
                    label: "Квалификация",
                    value: coach.license ?? coach.achievement ?? coach.specialty ?? coach.education,
                  },
                  {
                    label: "Фокус",
                    value: coach.achievements ?? coach.teams ?? coach.note ?? coach.education,
                  },
                ].filter((item): item is { label: string; value: string } => Boolean(item.value));

                return (
                  <article
                    key={coach.name}
                    className="group w-[18.5rem] shrink-0 snap-start md:w-[20rem]"
                  >
                    <div
                      className="relative isolate overflow-hidden rounded-[1.35rem] bg-orange-600 px-5 pb-6 pt-5 text-white"
                    >


                      <div className="relative z-10 flex min-h-[7rem] flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/82">
                            {String(index + 1).padStart(2, "0")} • {coach.badge}
                          </div>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/58">
                            Наставник
                          </span>
                        </div>

                        <div className="mt-4 flex items-end gap-4">
                          <div className="pb-1">
                            <h3 className="text-2xl font-black leading-tight">{coach.name}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-white/82">
                              {coach.focus}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        {coachHighlights.map((item) => (
                          <div
                            key={`${coach.name}-${item.label}`}
                            className="border-t border-black/8 pt-4"
                          >
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                              {item.label}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-gray-700">{item.value}</p>
                          </div>
                        ))}

                      {coach.quote && (
                        <div className="border-t border-black/8 pt-4">
                          <p className="text-sm italic leading-relaxed text-gray-600">
                            "{coach.quote}"
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
            <div className="lg:sticky lg:top-24">
              <div className="max-w-2xl">
                <div className="ui-eyebrow">
                  <Award className="h-4 w-4" />
                  Подход школы
                </div>
                <h2 className={sectionTitleClass}>
                  Наша философия и методика
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-gray-600">
                  Мы не строим обучение вокруг давления и результата любой ценой. Ребёнок входит в
                  спорт через понятную игровую среду, постепенное освоение навыков и ощущение, что у
                  него получается.
                </p>

                <div className="mt-12 border-t border-black/8 pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-500">
                    Главный эффект
                  </p>
                  <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:pr-8">
                    Ребёнок сохраняет доверие к спорту на старте, потому что чувствует безопасность,
                    интерес и постепенный рост.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {philosophyPillars.map((item, index) => (
                <article
                  key={item.label}
                  className="rounded-[1.25rem] border border-black/6 bg-white/50 p-6 sm:p-8"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-500">
                    Принцип 0{index + 1}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
                    {item.label}
                  </h3>
                  <p className="ui-body-sm mt-3 text-gray-700">{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-24 border-t border-black/8 pt-10">
            <div className="grid gap-24">
              <article className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
                <div className="max-w-xl">
                  <h3 className={subsectionTitleClass}>
                    Методика от простого к сложному
                  </h3>
                  <p className="ui-body mt-4">
                    Пирамида развития помогает двигаться по понятной логике: сначала чувство мяча и
                    базовый контроль, затем игра один в один, финты, передачи и командное действие.
                  </p>

                  <div className="mt-6 border-l-2 border-purple-200 pl-5">
                    <p className="ui-body-sm text-gray-700">
                      Главная идея: ребёнок не перескакивает через фундамент, поэтому прогресс
                      ощущается спокойным и последовательным.
                    </p>
                  </div>
                </div>

                <div className="rounded-[1rem] border border-black/6 bg-white/38 p-4 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Пирамида развития
                  </p>
                  <div className="mt-4 flex flex-col items-center gap-2">
                    {developmentPyramidLevels.map((layer) => {
                      const Icon = layer.icon;

                      return (
                        <div key={layer.level} className={`${layer.widthClass}`}>
                          <div
                            className={`relative overflow-hidden rounded-[0.9rem] bg-gradient-to-r ${layer.gradientClass} px-3 py-2.5 text-white shadow-[0_12px_24px_-16px_rgba(15,23,42,0.48)]`}
                          >
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_58%)]"></div>
                            <div className="relative flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="text-left">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
                                  {layer.level}
                                </p>
                                <p className="text-sm font-bold leading-tight text-white">
                                  {layer.title}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="w-full">
                      <div className="rounded-[1rem] bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 px-4 py-3.5 text-center text-white shadow-[0_12px_24px_-16px_rgba(15,23,42,0.62)]">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-100">
                          Фундамент
                        </p>
                        <p className="mt-1 text-base font-black tracking-wide">Контроль мяча</p>
                        <p className="mt-1 text-xs font-medium text-indigo-100">
                          Чувство мяча и уверенный базовый контроль
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="prices" className="py-24 bg-amber-50/40">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:gap-14">
            <div className="max-w-xl">
              <div className="ui-eyebrow">
                <CheckCircle2 className="h-4 w-4" />
                Тарифы и оплата
              </div>
              <h2 className={sectionTitleClass}>
                Прозрачные условия без скрытых сценариев
              </h2>
            </div>

            <div className="border-y border-black/8">
              <div className="grid divide-y divide-black/8 md:grid-cols-2 md:divide-x md:divide-y-0">
                {pricingPlans.map((plan) => (
                  <article
                    key={plan.name}
                    className={`relative p-7 sm:p-8 ${plan.highlighted ? "bg-[linear-gradient(180deg,rgba(124,58,237,0.03),rgba(249,115,22,0.04))]" : ""}`}
                  >
                    <div
                      className={`absolute left-0 top-8 bottom-8 w-1 rounded-r-full ${plan.highlighted ? "bg-gradient-to-b from-purple-600 to-orange-400" : "bg-black/10"}`}
                    ></div>
                    <div className="pl-4">
                      <div className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${plan.highlighted ? "text-purple-700" : "text-gray-500"}`}>
                        {plan.badge}
                      </div>
                      <h3 className="mt-4 text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <div className="mt-4 flex items-end gap-2">
                        <span className="text-4xl font-black tracking-tight text-gray-900">{plan.price}</span>
                        <span className="pb-1 text-sm font-medium text-gray-500">{plan.note}</span>
                      </div>

                      <div className="mt-6 space-y-3">
                        {plan.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => document.getElementById('personal-account')?.scrollIntoView({ behavior: 'smooth' })}
                        className={`mt-8 inline-flex w-full items-center justify-center ${plan.highlighted ? secondaryButtonClass : primaryButtonClass}`}
                      >
                        Оплатить онлайн
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="border-t border-black/8 px-7 py-5 sm:px-8">
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <p className="text-sm leading-relaxed text-gray-600">
                    <strong>Важно:</strong> услуга считается оказанной по факту проведения занятия.
                    Пропуски не компенсируются и не требуют предоставления справок. Подробности в{" "}
                    <Link to="/oferta" className="font-semibold text-purple-700 hover:underline">
                      публичной оферте
                    </Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Account Section */}
      <section id="personal-account" className="py-24 overflow-hidden bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <div className="max-w-xl">
              <div className="ui-eyebrow ui-eyebrow-warm">
                <LogIn className="h-4 w-4" />
                Личный кабинет родителя
              </div>
              <h2 className={sectionTitleClass}>
                Управляйте обучением в один клик
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                Мы запустили современный Личный кабинет. Теперь вся информация о занятиях, 
                оплате и успехах ребёнка доступна в одном месте — с компьютера или смартфона.
              </p>

              <div className="mt-10 space-y-6">
                {personalAccountSteps.map((item) => (
                  <div key={item.step} className="group relative border-l-2 border-orange-100 pl-8 transition-colors hover:border-orange-500 pb-2">
                    <div className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-orange-200 text-[10px] font-bold text-orange-600 shadow-sm group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-gray-900">{item.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="https://lk.champion-footboll.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${primaryButtonClass} flex items-center justify-center gap-2`}
                >
                  <LogIn className="h-5 w-5" />
                  Личный кабинет
                </a>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-orange-200/55 blur-3xl hero-blob hero-blob-a"></div>
              <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-purple-200/55 blur-3xl hero-blob hero-blob-b"></div>

              <LkFloatingShapes />

              <div className="relative z-10 mx-auto w-full max-w-[320px]">
                {/* iPhone Mockup Container */}
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[3rem] border-[10px] border-slate-900 bg-slate-900 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.4)]">
                  {/* Notch */}
                  <div className="absolute left-1/2 top-0 z-20 h-7 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900"></div>
                  
                  {/* Screen Content */}
                  <div className="h-full w-full bg-[#101010]">
                    <img
                      src="/images/lk-screen.jpg"
                      alt="Личный кабинет интерфейс"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                
                {/* Decorative glow */}
                <div className="absolute -inset-4 -z-10 rounded-[4rem] bg-orange-500/10 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-24 bg-indigo-50/40">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="ui-eyebrow">
              <Sparkles className="h-4 w-4" />
              Персональный маршрут
            </div>
            <h2 className={sectionTitleClass}>
              Понять, как мягко начать именно вашему ребёнку
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              После знакомства с форматом можно перейти к самому спокойному действию: ответить на
              три коротких вопроса и забрать PDF-гайд по адаптации без звонков и лишних шагов.
            </p>
          </div>

          <div className="mt-12">
            <Quiz />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden border-t border-black/8 px-2 pt-10">
            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-purple-200/40 blur-3xl"></div>
            <div className="absolute -right-6 bottom-0 h-44 w-44 rounded-full bg-orange-200/45 blur-3xl"></div>

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="ui-eyebrow">
                  <Sparkles className="h-4 w-4" />
                  Следующий шаг
                </div>
                <h2 className={sectionTitleClass}>
                  Войдите в личный кабинет и управляйте обучением ребенка
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                  Все оплаты, расписание и связь с администратором в одном месте. 
                  Начните с бесплатного пробного занятия.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <a
                  href="https://lk.champion-footboll.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={primaryButtonClass}
                >
                  Войти в Личный кабинет
                </a>
                <button
                  onClick={() => document.getElementById('personal-account')?.scrollIntoView({ behavior: 'smooth' })}
                  className={secondaryButtonClass}
                >
                  Как это работает?
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
