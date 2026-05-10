import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
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
  LogIn,
  X,
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
    photo: "/images/coaches/ilyinikh.png",
    experience: "10 лет тренерского стажа",
    focus: "Системно выстраивает базу движения и помогает ребёнку уверенно войти в спорт без перегруза.",
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
    photo: "/images/coaches/menzorov.png",
    experience: "6 лет тренерского стажа",
    focus: "Собирает доверие через спокойную коммуникацию и превращает тренировку в понятный детям ритуал успеха.",
    bgClass: "bg-orange-600",
    badges: ["6 лет стажа", "1 разряд", "НГПУ ФФК"],
    clubs: [{ year: "Игрок", label: "ДЮСШ Новосибирск", flag: "🇷🇺" }],
  },
  {
    name: "Юсупов Константин",
    photo: "/images/coaches/yusupov.png",
    experience: "3 года тренерского стажа, 10 лет игрового",
    focus: "Держит высокий темп занятия и помогает детям быстрее почувствовать уверенность в игре один в один.",
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
    photo: "/images/coaches/kulakov.png",
    experience: "5 лет тренерского стажа",
    focus: "Соединяет европейскую методику с понятной ребёнку игровой подачей и вниманием к деталям техники.",
    bgClass: "bg-orange-500",
    badges: ["C-UEFA", "5 лет стажа", "СГУГиТ"],
    clubs: [
      { year: "2022", label: "Kimberly Cup, 1 место" },
      { year: "2023", label: "Лига Чемпионов Сибири, 1 место" },
      { year: "2023", label: "Кубок дружбы, 2 место" },
    ],
  },
  {
    name: "Свитницкий Родион",
    photo: "/images/coaches/svitnitsky.png",
    experience: "5 лет тренерского стажа",
    focus: "Сильная сторона — мотивация и настрой детей на постепенный рост через маленькие победы.",
    bgClass: "bg-orange-600",
    badges: ["5 лет стажа", "ФКиС"],
    clubs: [{ year: "COPA JUNIOR", label: "Красноярск, призёр" }],
  },
  {
    name: "Дмитрий Бобин",
    photo: "/images/coaches/bobin.png",
    experience: "Тренерская и игровая практика",
    focus: "Добавляет в занятия соревновательный нерв и дисциплину, не ломая детскую мотивацию.",
    bgClass: "bg-amber-600",
    badges: ["РФС C", "КМС", "СГУПС"],
    clubs: [
      { year: "Игрок", label: "Динамо Барнаул", flag: "🇷🇺" },
      { year: "Тренер", label: "ФК Спартак, ЕФЛ" },
    ],
  },
  {
    name: "Пирогов Глеб",
    photo: "/images/coaches/pirogov.png",
    experience: "Педагог-тренер по физической культуре",
    focus: "Внимательно ведёт ребёнка через первые этапы адаптации и регулярно усиливает практику новыми стажировками.",
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

const blogPosts = [
  {
    title: "Как выбрать футбольные бутсы для малыша?",
    excerpt: "Полное руководство по выбору первой спортивной обуви для вашего ребенка.",
    category: "Экипировка",
    image: "https://images.unsplash.com/photo-1622659097509-4d56de14539e?auto=format&fit=crop&q=80&w=1080",
    href: "#",
  },
  {
    title: "Питание юного спортсмена: основы",
    excerpt: "Что должно быть в рационе ребенка, который занимается спортом.",
    category: "Питание",
    featured: true,
    image: "https://images.unsplash.com/photo-1627747776910-6d7e50f57c7e?auto=format&fit=crop&q=80&w=1080",
    href: "#",
  },
  {
    title: "Мотивация без давления: как заинтересовать ребёнка?",
    excerpt: "Психологические приёмы для развития любви к спорту.",
    category: "Психология",
    image: "https://images.unsplash.com/photo-1701872324421-f537bc8f61de?auto=format&fit=crop&q=80&w=1080",
    href: "#",
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-24 pt-20 sm:pt-24">
        <div className="absolute inset-0">
          <div className="absolute -left-16 -top-16 h-[28rem] w-[28rem] rounded-full bg-purple-300/55 blur-3xl hero-blob hero-blob-a"></div>
          <div className="absolute -right-24 top-8 h-[32rem] w-[32rem] rounded-full bg-orange-300/55 blur-3xl hero-blob hero-blob-b"></div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white/70"></div>
        </div>
        <HeroFloatingShapes />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
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
                          src={`${coach.photo}?v=4`}
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
                className="relative isolate aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-gray-900 shadow-[0_40px_80px_-30px_rgba(15,23,42,0.45)]"
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
                transition={{ delay: i * 0.06, duration: 0.45, ease: "easeOut" }}
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

      {/* About School Section */}
      <section id="about" className="py-32">
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

      {/* Comparison: typical section vs ФШ «Чемпион» */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="ui-eyebrow">
              <Sparkles className="h-4 w-4" />
              Почему именно мы
            </div>
            <h2 className={sectionTitleClass}>
              Удобно для семьи, серьёзно для ребёнка
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Сравните, как обычно устроены детские секции — и как у&nbsp;нас.
            </p>
          </div>

          <div className="mt-16 grid gap-4 lg:grid-cols-2">
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
                    transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
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
                      transition={{ delay: i * 0.08 + 0.05, duration: 0.4, ease: "easeOut" }}
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
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Команда практиков с лицензиями, игровым опытом и бережным подходом к дошкольникам.
              Важны не только регалии, но и то, как тренер умеет включить ребёнка в игру и
              удержать его интерес.
            </p>
          </div>

          <div className="mt-14 -mx-4 px-4 snap-x snap-mandatory overflow-x-auto pb-5 [scrollbar-width:thin] [scrollbar-color:rgba(147,51,234,0.45)_transparent]">
            <div className="flex w-max gap-4">
            {coaches.map((coach, index) => (
              <motion.article
                key={coach.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
                className="group w-[270px] sm:w-[290px] shrink-0 snap-start flex flex-col overflow-hidden rounded-[1.25rem] bg-white border border-black/6 shadow-[0_2px_12px_-6px_rgba(15,23,42,0.12)] hover:shadow-[0_24px_40px_-24px_rgba(15,23,42,0.25)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Photo / fallback */}
                <div className={`relative aspect-square overflow-hidden ${coach.photo ? "bg-gradient-to-b from-orange-50 via-white to-indigo-50" : coach.bgClass}`}>
                  {coach.photo ? (
                    <img
                      src={`${coach.photo}?v=4`}
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
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
                        className="inline-flex items-center rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700"
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

      {/* Philosophy Section */}
      <section id="philosophy" className="py-32">
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

                <div className="mt-16 border-t border-black/8 pt-5">
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

                  {/* Methodology badges */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-semibold text-purple-700">
                      <Award className="h-3.5 w-3.5" />
                      По методике Coerver Coaching
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-700">
                      <Users className="h-3.5 w-3.5" />
                      Формат FUNino 3×3
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
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
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
                          transition={{ delay, duration: 0.4, ease: "easeOut" }}
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
                      transition={{ delay: 0.12, duration: 0.4, ease: "easeOut" }}
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

      {/* Quiz Section */}
      <section className="py-32 bg-indigo-50/40">
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

          <div className="mt-16">
            <Quiz />
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
                    <a
                      href={featuredPost.href}
                      className={`${primaryButtonClass} w-full sm:w-auto mt-2 px-6 py-3 font-bold`}
                    >
                      Читать далее →
                    </a>
                  </div>
                </div>
              </div>
            </article>

            <div className="space-y-6">
              {secondaryPosts.map((post) => (
                <article
                  key={post.title}
                  className="ui-card-soft ui-hover-lift overflow-hidden rounded-[1.45rem]"
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
                        <a href={post.href} className="text-sm font-semibold text-purple-700 hover:underline">
                          Читать далее →
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
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
