import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Quiz } from "../components/Quiz";
import StickyMobileCTA from "../../components/StickyMobileCTA";
import { PRICING, PACKAGE_LABEL, PRICE_NOTE, formatPrice } from "../data/pricing";
import HeroFloatingShapes, { LkFloatingShapes } from "../../components/HeroFloatingShapes";
import { blogPosts } from "../data/blogPosts";
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
  LogIn,
  X,
  Compass,
  CalendarHeart,
} from "lucide-react";

interface Coach {
  name: string;
  photo?: string;
  experience: string;
  focus: string;
  bgClass: string;
  badges: string[];
  clubs?: { year: string; label: string; flag?: string }[];
}

const coaches: Coach[] = [
  {
    name: "Ильиных Александр",
    photo: "/images/coaches/ilyinikh.webp",
    experience: "10 лет тренерского стажа",
    focus: "База движения и мягкий вход в спорт.",
    bgClass: "bg-orange-500",
    badges: ["10 лет стажа", "КМС", "НГПУ ФФК"],
    clubs: [
      { year: "2021", label: "Manchester United", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
      { year: "2023", label: "Локомотив", flag: "🇷🇺" },
      { year: "2024-25", label: "Црвена Звезда", flag: "🇷🇸" },
    ],
  },
  {
    name: "Мензоров Максим",
    photo: "/images/coaches/menzorov.webp",
    experience: "6 лет тренерского стажа",
    focus: "Доверие через спокойный диалог.",
    bgClass: "bg-orange-600",
    badges: ["6 лет стажа", "1 разряд", "НГПУ ФФК"],
    clubs: [{ year: "Игрок", label: "ДЮСШ Новосибирск", flag: "🇷🇺" }],
  },
  {
    name: "Юсупов Константин",
    photo: "/images/coaches/yusupov.webp",
    experience: "3 года тренерского стажа, 10 лет игрового",
    focus: "Высокий темп и уверенность в игре 1×1.",
    bgClass: "bg-amber-600",
    badges: ["3 года стажа", "10 лет игры"],
    clubs: [
      { year: "Рубин", label: "Славгород" },
      { year: "Юность", label: "Славгород" },
      { year: "Сатурн", label: "Новосибирск" },
      { year: "Скорпион", label: "Новосибирск" },
    ],
  },
  {
    name: "Кулаков Максим",
    photo: "/images/coaches/kulakov.webp",
    experience: "5 лет тренерского стажа",
    focus: "Европейская методика и игровая подача.",
    bgClass: "bg-orange-500",
    badges: ["C-UEFA", "5 лет стажа", "СГУГиТ"],
    clubs: [
      { year: "2022", label: "Kimberly Cup, 1 место" },
      { year: "2023", label: "Лига Чемпионов Сибири, 1 место" },
      { year: "2023", label: "Кубок дружбы, 2 место" },
    ],
  },
  {
    name: "Слюсарь Александр",
    photo: "/images/coaches/svitnitsky.webp",
    experience: "5 лет тренерского стажа",
    focus: "Мотивация через маленькие победы.",
    bgClass: "bg-orange-600",
    badges: ["5 лет стажа", "ФКиС"],
    clubs: [{ year: "COPA JUNIOR", label: "Красноярск, призёр" }],
  },
  {
    name: "Долгаль Владимир",
    photo: "/images/coaches/bobin.webp",
    experience: "Тренерская и игровая практика",
    focus: "Соревновательный нерв и дисциплина.",
    bgClass: "bg-amber-600",
    badges: ["РФС C", "КМС", "СГУПС"],
    clubs: [
      { year: "Игрок", label: "Динамо Барнаул", flag: "🇷🇺" },
      { year: "Тренер", label: "ФК Спартак, ЕФЛ" },
    ],
  },
  {
    name: "Пирогов Глеб",
    photo: "/images/coaches/pirogov.webp",
    experience: "Педагог-тренер по физической культуре",
    focus: "Адаптация и регулярные стажировки.",
    bgClass: "bg-orange-500",
    badges: ["Педагогика", "Игрок СФЛ"],
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

const philosophyPillars = [
  {
    icon: Heart,
    label: "Интерес вместо давления",
    text: "Ребёнок включается через игру и чувство успеха, а не через страх ошибки и гонку за результатом.",
    accentClass: "from-rose-500 to-orange-400",
    tintClass: "bg-rose-50 text-rose-600",
  },
  {
    icon: CalendarHeart,
    label: "Бережно к дошкольнику",
    text: "Учитываем утомляемость, чувствительность к неудачам и потребность в частой смене деятельности — программа адаптирована под 3–7 лет.",
    accentClass: "from-purple-600 to-fuchsia-500",
    tintClass: "bg-purple-50 text-purple-600",
  },
  {
    icon: Compass,
    label: "Среда учит",
    text: "Упражнения и формат тренировки подсказывают ребёнку правильное действие и постепенно растят уверенность.",
    accentClass: "from-orange-500 to-amber-400",
    tintClass: "bg-orange-50 text-orange-600",
    examples: [
      "дриблинг как побег от монстров",
      "обводка как сбор сокровищ",
      "удар как спасение города",
    ],
  },
];

const pricingPlans = [
  {
    name: "Базовый",
    price: `${formatPrice(PRICING.base)} ₽`,
    note: `/ ${PACKAGE_LABEL}`,
    badge: "Основной тариф",
    features: [
      `${PRICING.visitsPerSubscription} занятий в месяц`,
      "2 раза в неделю",
      "Группы до 10 человек",
      "Тренировки прямо в детском саду",
    ],
    buttonClass: "bg-gray-900 text-white hover:bg-gray-800",
  },
  {
    name: "Льготный",
    price: `${formatPrice(PRICING.privileged)} ₽`,
    note: `/ ${PACKAGE_LABEL}`,
    badge: `Выгода ${formatPrice(PRICING.base - PRICING.privileged)} ₽`,
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

// Reads top-to-bottom (Level 5 → Level 1). Progression for the kid
// goes the other way — bottom up — so the bottom layer is the
// "foundation" and what every kid starts with.
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

// School-in-numbers headline stats. Three numeric cards animate with a
// count-up when the section enters the viewport; the fourth is a
// badge-style card surfacing the Минобр licence.
type SchoolStat =
  | {
      kind: "number";
      value: number;
      suffix: string;
      label: string;
      accentClass: string;
    }
  | {
      kind: "badge";
      valueLines: string[];
      label: string;
      accentClass: string;
    };

const schoolStats: SchoolStat[] = [
  {
    kind: "number",
    value: 10,
    suffix: " лет",
    label: "на рынке",
    accentClass: "from-purple-600 to-fuchsia-500",
  },
  {
    kind: "number",
    value: 30,
    suffix: "+",
    label: "детских садов-партнёров",
    accentClass: "from-indigo-700 to-purple-700",
  },
  {
    kind: "number",
    value: 2000,
    suffix: "+",
    label: "детей прошли обучение",
    accentClass: "from-orange-500 to-orange-600",
  },
  {
    kind: "number",
    value: 2,
    suffix: " раза",
    label: "в год — праздничные турниры",
    accentClass: "from-rose-500 to-orange-400",
  },
  {
    kind: "badge",
    valueLines: ["Круглый", "год"],
    label: "тренировки в зале и на улице",
    accentClass: "from-emerald-500 to-teal-500",
  },
  {
    kind: "badge",
    valueLines: ["Лицензия", "Минобра"],
    label: "программа аккредитована",
    accentClass: "from-amber-500 to-orange-500",
  },
];

// "Us vs them" comparison rows — drives the convenience value
// proposition by contrasting the typical kids-section experience with
// what we do in-садике.
const comparisonRows = [
  {
    usual: "Нужно везти ребёнка после сада",
    us: "Занятия проходят прямо в саду",
  },
  {
    usual: "Тренировки часто вечером",
    us: "Ребёнок занимается в привычной среде",
  },
  {
    usual: "Не всегда удобно родителям",
    us: "Не нужно менять семейный график",
  },
  {
    usual: "Группы могут быть разного возраста",
    us: "Программа адаптирована под дошкольников",
  },
];

// Lightweight count-up: animates an integer from 0 to `to` once the
// element scrolls into view. Pure rAF, no library.
function CountUp({ to, suffix = "", durationMs = 1400 }: { to: number; suffix?: string; durationMs?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || startedRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (!e?.isIntersecting || startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setVal(Math.round(eased * to));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, durationMs]);

  return (
    <span ref={ref}>
      {val.toLocaleString("ru-RU")}{suffix}
    </span>
  );
}

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
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const quizTriggerRef = useRef<HTMLButtonElement | null>(null);
  const quizWasOpenRef = useRef(false);

  // Lock body scroll while the quiz modal is open + return focus on close
  useEffect(() => {
    if (quizModalOpen) {
      quizWasOpenRef.current = true;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setQuizModalOpen(false);
      };
      window.addEventListener("keydown", onEsc);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onEsc);
      };
    }
    // Restore focus to the trigger when closing (WCAG modal focus management)
    if (quizWasOpenRef.current) {
      quizWasOpenRef.current = false;
      quizTriggerRef.current?.focus();
    }
  }, [quizModalOpen]);

  const handleHeroSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    navigate('/signup', { state: { phone: heroPhone } });
  };

  const featuredPost = blogPosts.find((post) => post.featured) ?? blogPosts[0];
  const secondaryPosts = blogPosts.filter((post) => post !== featuredPost);

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

      <main id="main">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-24 pt-20 sm:pt-24">
        <div className="absolute inset-0">
          <div className="absolute -left-16 -top-16 h-[28rem] w-[28rem] rounded-full bg-purple-300/55 blur-3xl hero-blob hero-blob-a"></div>
          <div className="absolute -right-24 top-8 h-[32rem] w-[32rem] rounded-full bg-orange-300/55 blur-3xl hero-blob hero-blob-b"></div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white/70"></div>
        </div>
        <HeroFloatingShapes />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="max-w-2xl">
              <div className="ui-eyebrow">
                <Sparkles className="h-4 w-4" />
                Футбольная школа для детей 3-7 лет
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-[1.02] tracking-tight text-gray-950 md:text-6xl">
                Футбол прямо<br className="hidden sm:inline" /> в саду вашего ребёнка
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 md:text-xl">
                Тренировки прямо в&nbsp;детском саду — без вечерней дороги и&nbsp;логистики.
              </p>

              {/* Inline phone-capture form — primary hero CTA */}
              <form
                onSubmit={handleHeroSubmit}
                className="mt-8 grid grid-cols-1 sm:grid-cols-[305px_1fr] gap-3 max-w-lg"
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

              <div className="mt-14 grid gap-5 border-t border-black/8 pt-6 sm:grid-cols-3">
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
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ${coach.bgClass}`}
                      title={coach.name}
                    >
                      {coach.photo ? (
                        <img
                          src={`${coach.photo}?v=5`}
                          alt={coach.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                          {getCoachInitials(coach.name)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-snug">
                  <span className="font-semibold text-gray-900">Тренеры</span>{' '}
                  с лицензиями <span className="font-semibold">C-UEFA</span>, КМС
                  и опытом в&nbsp;Манчестер Юнайтед, Локомотиве, Динамо
                </p>
              </div>
            </div>

            <motion.div
              className="relative lg:-mr-4 xl:-mr-8"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.6, ease: "easeOut", delay: 0.25 }}
            >
              <div className="pointer-events-none absolute -inset-6 bg-[radial-gradient(circle,rgba(124,58,237,0.18),transparent_62%)] blur-3xl"></div>
              <div
                id="hero-video"
                className="relative isolate aspect-video overflow-hidden rounded-[1.6rem] bg-gray-900 shadow-[0_40px_80px_-30px_rgba(15,23,42,0.45)]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 34%, black 100%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 34%, black 100%)",
                }}
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
                  loading="lazy"
                  onLoad={() => {
                    setIsHeroVideoReady(true);
                    requestHeroVideoPlayback();
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                {/* Light overlay only — keeps the video clearly visible */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#14031f]/40 to-transparent"></div>
                  <div className="absolute left-5 bottom-5 rounded-lg bg-black/35 backdrop-blur-sm px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90">
                    Видео запускается без звука
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* School in numbers — trust strip right under the hero */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-indigo-50/50 via-white to-orange-50/40 relative overflow-hidden">
        <div className="absolute -left-20 -top-10 h-64 w-64 rounded-full bg-purple-200/25 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-10 h-72 w-72 rounded-full bg-orange-200/25 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative">
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {schoolStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
                className="relative overflow-hidden rounded-[1.1rem] bg-white border border-black/6 p-4 shadow-[0_2px_14px_-6px_rgba(15,23,42,0.12)]"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.accentClass}`} />
                {stat.kind === "number" ? (
                  <div className={`text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-br ${stat.accentClass} bg-clip-text text-transparent leading-none`}>
                    <CountUp to={stat.value} suffix={stat.suffix} />
                  </div>
                ) : (
                  <div className={`text-xl md:text-2xl font-black tracking-tight bg-gradient-to-br ${stat.accentClass} bg-clip-text text-transparent leading-tight`}>
                    {stat.valueLines.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-xs leading-snug text-gray-600">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How a class flows — concrete 25-min breakdown */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="ui-eyebrow justify-center">
              <Sparkles className="h-4 w-4" />
              Что происходит на тренировке
            </div>
            <h2 className={sectionTitleClass}>
              30 минут — четыре чётких этапа
            </h2>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Разминка-разогрев",
                time: "5 мин",
                desc: "Подвижная игра под музыку, чтобы тело включилось без усилий.",
                accent: "from-emerald-500 to-teal-500",
              },
              {
                step: "02",
                title: "Контроль мяча",
                time: "7 мин",
                desc: "Простые упражнения с мячом: ведение, остановка, повороты с конусами.",
                accent: "from-indigo-700 to-purple-700",
              },
              {
                step: "03",
                title: "Передачи в паре",
                time: "8 мин",
                desc: "Работа на двоих — точность, остановка мяча, первый пас.",
                accent: "from-purple-600 to-fuchsia-500",
              },
              {
                step: "04",
                title: "Мини-игра 3×3",
                time: "10 мин",
                desc: "Главная награда: настоящий мини-матч, где ребёнок сразу применяет всё, что выучил.",
                accent: "from-orange-500 to-amber-400",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
                className="relative overflow-hidden rounded-[1.3rem] bg-white border border-black/6 p-5 sm:p-6 shadow-[0_2px_14px_-6px_rgba(15,23,42,0.12)]"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`} />
                <div className="flex items-baseline justify-between">
                  <span className={`text-3xl font-black bg-gradient-to-br ${item.accent} bg-clip-text text-transparent leading-none`}>
                    {item.step}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">
                    {item.time}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-gray-900 leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Comparison: typical section vs ФШ «Чемпион» */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="ui-eyebrow justify-center">
              <Sparkles className="h-4 w-4" />
              Почему именно мы
            </div>
            <h2 className={sectionTitleClass}>
              Удобно для семьи, серьёзно для ребёнка
            </h2>
          </div>

          <div className="mt-16 grid gap-4 lg:grid-cols-2 max-w-4xl mx-auto">
            {/* "Как обычно" — muted card */}
            <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-5 sm:p-6 relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-2">
                Как обычно
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-slate-700">
                Обычная секция
              </h3>
              <ul className="mt-6 space-y-3.5">
                {comparisonRows.map((row, i) => (
                  <motion.li
                    key={`u-${i}`}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
                    className="flex items-start gap-3 text-slate-600"
                  >
                    <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-white">
                      <X className="h-3.5 w-3.5" />
                    </span>
                    <span className="leading-snug">{row.usual}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* ФШ «Чемпион» — brand card */}
            <div className="rounded-[1.3rem] bg-gradient-to-br from-indigo-900 via-purple-700 to-orange-500 p-5 sm:p-6 text-white relative overflow-hidden shadow-[0_24px_60px_-30px_rgba(124,58,237,0.55)]">
              <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-orange-400/30 blur-3xl pointer-events-none" />
              <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-purple-400/30 blur-3xl pointer-events-none" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-200 mb-2">
                  Наш подход
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  ФШ «Чемпион»
                </h3>
                <ul className="mt-6 space-y-3.5">
                  {comparisonRows.map((row, i) => (
                    <motion.li
                      key={`m-${i}`}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: i * 0.05 + 0.05, duration: 0.3, ease: "easeOut" }}
                      className="flex items-start gap-3 text-white/95 font-medium"
                    >
                      <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <span className="leading-snug">{row.us}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
            <div>
              <div className="max-w-2xl">
                <div className="ui-eyebrow">
                  <Award className="h-4 w-4" />
                  Подход школы
                </div>
                <h2 className={sectionTitleClass}>
                  Учим через игру, не через муштру
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-gray-600">
                  Каждое занятие — это 3-4 маленькие победы, на которых ребёнок чувствует
                  «у меня получается». Этого достаточно, чтобы он сам захотел прийти и&nbsp;на
                  вторую тренировку, и на двадцатую.
                </p>

                <div className="mt-16 border-t border-black/8 pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-500">
                    Что это даёт ребёнку
                  </p>
                  <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:pr-8">
                    Спокойный старт в спорте — без давления, страха ошибки и сравнений с другими.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {philosophyPillars.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.label}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
                    className="rounded-[1.25rem] border border-black/6 bg-white/70 p-6 sm:p-8 relative overflow-hidden"
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accentClass}`} />

                    <div className="flex items-start gap-4">
                      <div className={`shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-2xl ${item.tintClass}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold tracking-tight text-gray-900 leading-tight">
                          {item.label}
                        </h3>
                        <p className="ui-body-sm mt-3 text-gray-700">{item.text}</p>

                        {item.examples && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.examples.map((ex) => (
                              <span
                                key={ex}
                                className="inline-flex items-center rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-medium text-orange-700"
                              >
                                {ex}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
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

                  {/* Methodology badges */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-semibold text-purple-700"
                      title="Методика Coerver Coaching — европейский подход к работе через микро-победы"
                    >
                      <Award className="h-3.5 w-3.5" />
                      Учим через микро-победы
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-700"
                      title="Формат FUNino 3×3 — четыре мини-ворот, больше касаний и решений на каждом занятии"
                    >
                      <Users className="h-3.5 w-3.5" />
                      Игры 3×3 — больше касаний у каждого
                    </span>
                  </div>

                  <div className="mt-6 border-l-2 border-purple-200 pl-5">
                    <p className="ui-body-sm text-gray-700">
                      Главная идея: ребёнок не перескакивает через фундамент, поэтому прогресс
                      ощущается спокойным и последовательным.
                    </p>
                  </div>
                </div>

                <div className="rounded-[1rem] border border-black/6 bg-white/38 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                      Пирамида развития
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-500">
                      ↑ путь развития
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col items-center gap-2">
                    {developmentPyramidLevels.map((layer, idx) => {
                      const Icon = layer.icon;
                      // Reverse stagger so the bottom (Уровень 1) appears first,
                      // matching the actual learning progression. The data is
                      // top-to-bottom (Уровень 5 → 2), so bottom = highest idx.
                      const bottomIdx = developmentPyramidLevels.length - idx; // 1-based from bottom
                      // Levels 5..2 → delays after the foundation appears.
                      const delay = (bottomIdx + 1) * 0.12; // foundation gets 0.12, then up

                      return (
                        <motion.div
                          key={layer.level}
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ delay, duration: 0.3, ease: "easeOut" }}
                          className={layer.widthClass}
                        >
                          <div
                            className={`relative overflow-hidden rounded-[0.9rem] bg-gradient-to-r ${layer.gradientClass} px-3 py-2.5 text-white shadow-[0_12px_24px_-16px_rgba(15,23,42,0.48)]`}
                          >
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_58%)]"></div>
                            <div className="relative flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
                                  {layer.level}
                                </p>
                                <p className="text-sm font-bold leading-tight text-white">
                                  {layer.title}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: 0.12, duration: 0.3, ease: "easeOut" }}
                      className="w-full"
                    >
                      <div className="rounded-[1rem] bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 px-4 py-3.5 text-white shadow-[0_12px_24px_-16px_rgba(15,23,42,0.62)]">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-100">
                          Уровень 1 · фундамент
                        </p>
                        <p className="mt-1 text-base font-black tracking-wide">Контроль мяча</p>
                        <p className="mt-1 text-xs font-medium text-indigo-100">
                          Чувство мяча и уверенный базовый контроль
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* What happens after signup */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="ui-eyebrow justify-center">
              <Sparkles className="h-4 w-4" />
              Что будет, если оставить телефон
            </div>
            <h2 className={sectionTitleClass}>
              Три простых шага, ничего сложного
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Согласуем время",
                desc: "Менеджер позвонит в течение часа, подскажет, в каких садах ближайшие группы, и подберёт удобный день.",
                accent: "from-emerald-500 to-teal-500",
              },
              {
                step: "2",
                title: "Тренер придёт в группу за ребёнком",
                desc: "В назначенное время тренер заходит в группу и ведёт ребёнка в спортзал. Форма не нужна — спортивная одежда, мяч и манишку выдадим.",
                accent: "from-indigo-700 to-purple-700",
              },
              {
                step: "3",
                title: "30 минут занятия",
                desc: "Ребёнок занимается со своей группой по нашей программе. После — короткий отчёт тренера, что было и как ребёнок включился.",
                accent: "from-orange-500 to-amber-400",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
                className="relative overflow-hidden rounded-[1.3rem] bg-white border border-black/6 p-6 shadow-[0_2px_14px_-6px_rgba(15,23,42,0.12)]"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.accent}`} />
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${s.accent} text-white text-lg font-black shadow-md`}>
                  {s.step}
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Inline phone-capture form — repeated CTA, same handler as hero */}
          <div className="mt-12 max-w-2xl mx-auto text-center">
            <p className="text-base text-gray-700">
              Оставьте телефон — менеджер позвонит в течение часа.
            </p>
            <form
              onSubmit={handleHeroSubmit}
              className="mt-5 grid grid-cols-1 sm:grid-cols-[305px_1fr] gap-3 max-w-lg mx-auto"
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
                Записаться на пробное
              </button>
            </form>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Первое занятие бесплатно
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Без обязательств
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section id="coaches" className="py-32 bg-slate-50/60">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="ui-eyebrow">
              <Sparkles className="h-4 w-4" />
              Наставники школы
            </div>
            <h2 className={sectionTitleClass}>
              Тренерский состав, которому родители доверяют с первого занятия
            </h2>
          </div>

          <div className="mt-14 -mx-4 px-4 snap-x snap-proximity overflow-x-auto overscroll-y-auto pb-5 [scrollbar-width:thin] [scrollbar-color:rgba(147,51,234,0.45)_transparent]">
            <div className="flex w-max gap-4">
            {coaches.map((coach, index) => (
              <motion.article
                key={coach.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                className="group w-[270px] sm:w-[290px] shrink-0 snap-start flex flex-col overflow-hidden rounded-[1.25rem] bg-white border border-black/6 shadow-[0_2px_12px_-6px_rgba(15,23,42,0.12)] hover:shadow-[0_24px_40px_-24px_rgba(15,23,42,0.25)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Photo / fallback */}
                <div className={`relative aspect-square overflow-hidden ${coach.photo ? "bg-gradient-to-b from-orange-50 via-white to-indigo-50" : coach.bgClass}`}>
                  {coach.photo ? (
                    <img
                      src={`${coach.photo}?v=5`}
                      alt={coach.name}
                      loading="lazy"
                      className="absolute inset-x-0 top-0 h-[120%] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white">
                      <span className="text-7xl font-black tracking-tight">
                        {getCoachInitials(coach.name)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-900">
                    №{String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute inset-x-4 bottom-3">
                    <h3 className="text-xl font-black text-white leading-tight drop-shadow-sm">
                      {coach.name}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Опыт
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {coach.experience}
                  </p>

                  {/* Credential pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {coach.badges.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-700"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-gray-600 flex-1">
                    {coach.focus}
                  </p>

                  {/* Clubs / internships timeline */}
                  {coach.clubs && coach.clubs.length > 0 && (
                    <div className="mt-5 border-t border-black/6 pt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-purple-500 mb-2">
                        Стажировки и клубы
                      </p>
                      <ul className="space-y-1.5">
                        {coach.clubs.map((c, i) => (
                          <li key={i} className="flex items-baseline gap-2.5 text-sm">
                            <span className="shrink-0 inline-flex items-center justify-center min-w-[3.5rem] rounded-md bg-indigo-900/95 text-white text-[11px] font-bold px-1.5 py-0.5 tracking-wide">
                              {c.year}
                            </span>
                            <span className="text-gray-700 leading-snug">
                              {c.label}
                              {c.flag && <span className="ml-1.5">{c.flag}</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parent testimonials */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="ui-eyebrow justify-center">
              <Sparkles className="h-4 w-4" />
              Что говорят родители
            </div>
            <h2 className={sectionTitleClass}>
              Истории семей, которые с&nbsp;нами уже играют
            </h2>
          </div>

          <div className="mt-16 grid gap-5 lg:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                quote:
                  "Сын первые две недели плакал у двери. Сейчас сам берёт сумку и спрашивает в понедельник: «Когда футбол?». Тренер ни разу не повысил голос — Михаил это чувствует.",
                author: "Анна",
                detail: "мама Михаила, 4 года · сад №32",
                initial: "А",
                tint: "from-orange-500 to-rose-500",
              },
              {
                quote:
                  "Записали ради социализации, через год Кирилл сам тащит нас на «свои» мини-турниры. Удобно, что не возим — занятие проходит в его же саду, в знакомых стенах.",
                author: "Дмитрий",
                detail: "папа Кирилла, 6 лет · сад №436",
                initial: "Д",
                tint: "from-indigo-700 to-purple-700",
              },
              {
                quote:
                  `Близнецы — Глеб и Стёпа. Льгота для двоих детей реальная: ${PRICING.privileged} ₽ за каждого. Никаких скрытых счетов, не пропустили — не списали. Просто и по-человечески.`,
                author: "Юлия",
                detail: "мама близнецов, 3 года · сад №59",
                initial: "Ю",
                tint: "from-purple-600 to-fuchsia-500",
              },
            ].map((t, i) => (
              <motion.figure
                key={t.author}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
                className="relative overflow-hidden rounded-[1.3rem] bg-white border border-black/6 p-6 sm:p-7 shadow-[0_2px_14px_-6px_rgba(15,23,42,0.12)] flex flex-col"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.tint}`} />
                <div className="text-5xl font-black leading-none text-purple-200 select-none">“</div>
                <blockquote className="mt-2 text-base leading-relaxed text-gray-700 flex-1">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-black/6 pt-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.tint} text-white font-bold`}>
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{t.author}</div>
                    <div className="text-xs text-gray-500">{t.detail}</div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="prices" className="py-32 bg-amber-50/40">
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
      <section id="personal-account" className="py-32 overflow-hidden bg-slate-50/50">
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

              <div className="mt-14 space-y-6">
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

              <div className="mt-14 flex flex-col gap-4 sm:flex-row">
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

      {/* Quiz banner — opens the quiz in a modal */}
      <section className="py-16 bg-indigo-50/40">
        <div className="container mx-auto px-4">
          <button
            ref={quizTriggerRef}
            type="button"
            onClick={() => setQuizModalOpen(true)}
            className="group mx-auto block w-full max-w-4xl rounded-[1.4rem] bg-white border border-black/6 p-6 sm:p-7 text-left shadow-[0_2px_14px_-6px_rgba(15,23,42,0.12)] hover:border-purple-300 hover:shadow-[0_24px_50px_-30px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 transition-all"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-orange-500 shadow-[0_10px_22px_-12px_rgba(124,58,237,0.6)]">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-purple-500">
                  Бесплатный PDF-гайд
                </p>
                <h3 className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-gray-900 leading-snug">
                  3 вопроса — и забираете персональный гайд по адаптации ребёнка к спорту
                </h3>
              </div>
              <span className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-purple-600 to-orange-500 text-white font-bold px-6 py-3.5 text-sm whitespace-nowrap shadow-[0_10px_22px_-10px_rgba(124,58,237,0.5)] group-hover:shadow-[0_14px_28px_-10px_rgba(124,58,237,0.6)] transition-shadow">
                Открыть тест
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* FAQ — parent's predictable doubts */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="ui-eyebrow justify-center">
              <Sparkles className="h-4 w-4" />
              Частые вопросы
            </div>
            <h2 className={sectionTitleClass}>
              Что обычно спрашивают родители
            </h2>
          </div>

          <div className="mt-14 grid gap-3 max-w-3xl mx-auto">
            {[
              {
                q: "Что если ребёнок плачет на первом занятии?",
                a: "Это нормально для дошкольника. Тренер не уговаривает и не давит — просто остаётся рядом, привлекает игрой. Большинство детей включаются на 2-3 тренировке. Если адаптация не идёт — поможем понять, что подходит именно вашему ребёнку.",
              },
              {
                q: "Что нужно взять с собой на пробное?",
                a: "Только спортивную одежду и кроссовки на сменку. Мяч, манишку и конусы выдаст тренер. Воды — обычная бутылочка. Никаких бутс на первое занятие не нужно.",
              },
              {
                q: "Что если ребёнок заболел и пропустил занятия?",
                a: "Занятие списывается из абонемента, только если ребёнок присутствовал на занятии. Пропуски не требуют справок. Возвращаемся, когда выздоровел.",
              },
              {
                q: "А если в моём саду вы не работаете?",
                a: "Сейчас мы в более чем 30 садах Новосибирска. Если в вашем нас ещё нет — оставьте телефон, свяжемся с заведующей вашего сада и обсудим возможность открыть группу в вашем.",
              },
              {
                q: "Что если ребёнку не понравится?",
                a: "Пробное бесплатно и ни к чему не обязывает. Если после первой тренировки понимаете, что не идёт — никаких списаний, оплат, обязательств. Это нормальная история для дошкольников.",
              },
              {
                q: "Какая скидка для многодетных и сотрудников ДОУ?",
                a: `Льготный тариф ${formatPrice(PRICING.privileged)} ₽ ${PRICE_NOTE} (вместо ${formatPrice(PRICING.base)} ₽) — для многодетных семей, опекунов, сотрудников детского сада и семей, у которых занимаются двое и больше детей.`,
              },
            ].map((f, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
                className="group rounded-[1rem] border border-black/6 bg-white p-5 sm:p-6 shadow-[0_1px_8px_-4px_rgba(15,23,42,0.08)] hover:border-purple-200 transition"
              >
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-gray-900 leading-snug">
                    {f.q}
                  </span>
                  <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-50 text-purple-700 text-lg leading-none transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600">
                  {f.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden border-t border-black/8 px-2 pt-10">
            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-purple-200/40 blur-3xl"></div>
            <div className="absolute -right-6 bottom-0 h-44 w-44 rounded-full bg-orange-200/45 blur-3xl"></div>

            <div className="relative">
              <div className="max-w-2xl mx-auto text-center">
                <div className="ui-eyebrow justify-center">
                  <Sparkles className="h-4 w-4" />
                  Следующий шаг
                </div>
                <h2 className={sectionTitleClass}>
                  Готовы начать?
                </h2>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
                {/* New client → /signup */}
                <Link
                  to="/signup"
                  className="group relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-purple-600 via-purple-700 to-orange-500 p-7 sm:p-8 text-white shadow-[0_24px_60px_-30px_rgba(124,58,237,0.55)] hover:shadow-[0_30px_70px_-30px_rgba(124,58,237,0.7)] hover:-translate-y-0.5 transition-all"
                >
                  <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-orange-400/30 blur-3xl pointer-events-none" />
                  <div className="relative">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-200">
                      Я новый клиент
                    </p>
                    <h3 className="mt-3 text-2xl font-black tracking-tight">
                      Записаться на пробное занятие
                    </h3>
                    <p className="mt-3 text-sm text-white/85 leading-relaxed">
                      Первое занятие бесплатно, без обязательств.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white">
                      Перейти к записи
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>

                {/* Existing client → LK */}
                <a
                  href="https://lk.champion-footboll.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-[1.4rem] bg-white border border-indigo-200 p-7 sm:p-8 hover:border-indigo-400 hover:shadow-[0_20px_50px_-25px_rgba(15,23,42,0.25)] hover:-translate-y-0.5 transition-all"
                >
                  <div className="relative">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700">
                      Уже занимаемся
                    </p>
                    <h3 className="mt-3 text-2xl font-black tracking-tight text-gray-900">
                      Войти в личный кабинет
                    </h3>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                      Расписание, оплата и связь с тренером в&nbsp;одном месте.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-indigo-700">
                      Открыть кабинет
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Blog Section */}
      <section id="blog" className="py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-[0.74fr_1.26fr] lg:items-end">
            <div className="max-w-xl">
              <div className="ui-eyebrow">
                <Sparkles className="h-4 w-4" />
                База знаний
              </div>
              <h2 className={sectionTitleClass}>
                Материалы для родителей
              </h2>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="ui-card ui-hover-lift overflow-hidden rounded-[1.7rem]">
              <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="h-72 w-full object-cover lg:h-full"
                />
                <div className="flex flex-col justify-between p-7 sm:p-8">
                  <div>
                    <div className="inline-flex rounded-full bg-[#f5f0ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-purple-700">
                      {featuredPost.category}
                    </div>
                    <h3 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      {featuredPost.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-gray-600">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col items-start gap-4 border-t border-black/8 pt-5">
                    <p className="text-sm leading-relaxed text-gray-500">
                      Инструмент помогает быстро получить рекомендации по детскому рациону прямо на сайте.
                    </p>
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className={`${primaryButtonClass} w-full sm:w-auto mt-2 px-6 py-3 font-bold`}
                    >
                      Читать далее →
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            <div className="space-y-6">
              {secondaryPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="ui-card-soft ui-hover-lift overflow-hidden rounded-[1.45rem] block"
                >
                  <div className="grid grid-cols-[7rem_1fr] gap-0 sm:grid-cols-[8.5rem_1fr]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full min-h-[10.5rem] w-full object-cover"
                    />
                    <div className="p-5">
                      <div className="inline-flex rounded-full bg-[#f8f6f2] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-600">
                        {post.category}
                      </div>
                      <h3 className="mt-4 text-xl font-bold tracking-tight text-gray-900">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
                      <div className="mt-5 border-t border-black/8 pt-4">
                        <span className="text-sm font-semibold text-purple-700 hover:underline">
                          Читать далее →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
      <StickyMobileCTA />

      {/* Quiz modal */}
      {quizModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setQuizModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Экспресс-тест для родителей: получить PDF-гайд"
        >
          <div
            className="relative w-full max-w-3xl my-4 sm:my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuizModalOpen(false)}
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 hover:scale-105 transition"
              aria-label="Закрыть тест"
            >
              <X className="w-5 h-5" />
            </button>
            <Quiz />
          </div>
        </div>
      )}
    </div>
  );
}
