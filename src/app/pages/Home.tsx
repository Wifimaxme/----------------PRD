import { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Quiz } from "../components/Quiz";
import { Link } from "react-router";
import { 
  Heart, 
  Users, 
  Trophy, 
  Shield, 
  Smartphone, 
  Award,
  ArrowUpRight,
  Clock3,
  GraduationCap,
  Play,
  CheckCircle2,
  Star,
  QrCode,
  MessageCircle,
  PlayCircle,
  Send,
  Sparkles
} from "lucide-react";

const coaches = [
  {
    name: "Ильиных Александр",
    education: "Колледж Олимпийского резерва, НГПУ (факультет физической культуры)",
    experience: "10 лет тренерского стажа",
    badge: "ОФП и футбол",
    focus: "Системно выстраивает базу движения и помогает ребенку уверенно войти в спорт без перегруза.",
    gradientClass: "from-violet-700 via-purple-700 to-orange-500",
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
    gradientClass: "from-orange-500 via-rose-500 to-purple-700",
    quote: "Улыбки детей до и после тренировки, их честность и доброта",
    hobby: "Катание на коньках, настольные игры"
  },
  {
    name: "Юсупов Константин",
    education: "Среднее-специальное (физическая культура)",
    experience: "3 года тренерского стажа, 10 лет игрового стажа",
    badge: "Техника и игра",
    focus: "Держит высокий темп занятия и помогает детям быстрее почувствовать уверенность в игре один в один.",
    gradientClass: "from-indigo-700 via-violet-700 to-fuchsia-500",
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
    gradientClass: "from-slate-900 via-purple-800 to-orange-500",
    quote: "Горящие глаза детей, которые пришли заниматься любимым делом. Приятно наблюдать когда ребенок старается и доказывает что он все может"
  },
  {
    name: "Свитницкий Родион",
    education: "ООО МУЦД (Физическая культура и спорт)",
    experience: "5 лет тренерского стажа",
    badge: "Соревновательный дух",
    focus: "Сильная сторона - мотивация и настрой детей на постепенный рост через маленькие победы.",
    gradientClass: "from-purple-700 via-fuchsia-600 to-orange-400",
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
    gradientClass: "from-orange-600 via-rose-600 to-violet-700",
    achievements: "Победители соревнований на призы ФК Джуниор. Призеры международных турниров в составе ФК \"Спартак\". Призеры турниров ЕФЛ"
  },
  {
    name: "Пирогов Глеб",
    education: "Славгородский педагогический колледж (тренер по физической культуре)",
    achievement: "Игрок команды СФЛ",
    badge: "Педагогический подход",
    focus: "Внимательно ведет ребенка через первые этапы адаптации и регулярно усиливает практику новыми стажировками.",
    gradientClass: "from-indigo-800 via-purple-700 to-orange-500",
    note: "Регулярно проходит обучения и стажировки по категориям и программам"
  },
];

const coachSectionStats = [
  {
    value: "7 тренеров",
    label: "в команде школы",
    icon: Users,
  },
  {
    value: "3-10 лет",
    label: "практического стажа",
    icon: Clock3,
  },
  {
    value: "UEFA / РФС",
    label: "лицензии и игровой опыт",
    icon: Shield,
  },
];

const getCoachInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const funinoSignals = ["3×3 или 4×4", "4 мини-ворот", "Head Up", "Решения без страха"];

const funinoBenefits = [
  {
    title: "1. Максимум касаний",
    icon: Users,
    badge: "Постоянное вовлечение",
    description:
      "Каждый ребёнок находится в эпицентре событий и касается мяча десятки раз за матч. Никто не выпадает из игры и не скучает в ожидании своей очереди.",
    accentClass: "from-orange-500 to-amber-400",
    surfaceClass: "from-orange-50 to-amber-50",
    borderClass: "border-orange-200",
  },
  {
    title: "2. Когнитивное развитие",
    icon: Trophy,
    badge: "Игровой интеллект",
    description:
      "Четыре воротa заставляют постоянно сканировать поле, поднимать голову и самостоятельно выбирать лучшее решение. Так растут мышление и скорость реакции.",
    accentClass: "from-purple-600 to-fuchsia-500",
    surfaceClass: "from-purple-50 to-orange-50",
    borderClass: "border-purple-200",
  },
  {
    title: "3. Среда как учитель",
    icon: Heart,
    badge: "Без давления",
    description:
      "Тренер здесь не диктатор, а фасилитатор игры. Дети пробуют, ошибаются, придумывают и учатся принимать решения без страха критики.",
    accentClass: "from-rose-500 to-orange-400",
    surfaceClass: "from-rose-50 to-orange-50",
    borderClass: "border-rose-200",
  },
];

const blogPosts = [
  {
    title: "Как выбрать футбольные бутсы для малыша?",
    excerpt: "Полное руководство по выбору первой спортивной обуви для вашего ребенка.",
    image: "https://images.unsplash.com/photo-1761339236791-de5fe2d4bd36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBiYWxsJTIwZXF1aXBtZW50JTIwa2lkc3xlbnwxfHx8fDE3NzMzMjQ1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    href: "#",
  },
  {
    title: "Питание юного спортсмена: основы",
    excerpt: "Что должно быть в рационе ребенка, который занимается спортом.",
    image: "https://images.unsplash.com/photo-1587786520988-cc34f7f54993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNoaWxkJTIwcGxheWluZyUyMGJhbGx8ZW58MXx8fHwxNzczMzI0NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    href: "/ai-nutritionist",
    linkLabel: "Открыть AI нутрициолога →",
  },
  {
    title: "Мотивация без давления: как заинтересовать ребёнка?",
    excerpt: "Психологические приёмы для развития любви к спорту.",
    image: "https://images.unsplash.com/photo-1695049391011-c69383402fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwc29jY2VyJTIwdHJhaW5pbmclMjBjb2FjaHxlbnwxfHx8fDE3NzMzMjQ1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    href: "#",
  },
];

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

export function Home() {
  const [isHeroVideoReady, setIsHeroVideoReady] = useState(false);
  const heroVideoRef = useRef<HTMLIFrameElement | null>(null);

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
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-orange-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                ⚽ Футбольная школа для детей 3-7 лет
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Футбол в вашем детском саду
              </h1>
              <p className="text-xl mb-8 text-purple-100">
                Больше чем просто игра — мы тренируем прямо в детском саду. 
                Забираете домой счастливого ребёнка, не тратя время на поездки.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('telegram-bot')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-purple-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                >
                  Записаться на пробное занятие
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('hero-video')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    requestHeroVideoPlayback();
                  }}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition flex items-center justify-center gap-2 group"
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Смотреть видео
                </button>
              </div>
            </div>
            <div className="relative">
              <div
                id="hero-video"
                className="rounded-2xl shadow-2xl overflow-hidden aspect-video bg-gray-900 relative isolate"
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
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/45 via-transparent to-orange-500/35"></div>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#14031f]/80 via-[#14031f]/20 to-transparent"></div>
                  <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#14031f]/45 to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-orange-400/20 to-transparent"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] animate-pulse"></div>
                  <div className="absolute left-6 bottom-6 rounded-full bg-black/35 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
                    Видео запускается без звука
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About School Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">О ШКОЛЕ</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl font-black text-purple-200 mb-6 group-hover:text-purple-600 transition-colors">01</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Мы воспитываем Чемпионов</h3>
                <p className="text-gray-600 leading-relaxed">
                  Педагогический состав собран из профессиональных квалифицированных тренеров с опытом игры в большом футболе. Мы воспитываем в детях стремление к победе, дисциплину, выносливость, спортивный дух и командную работу.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl font-black text-orange-200 mb-6 group-hover:text-orange-500 transition-colors">02</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Удобное расположение</h3>
                <p className="text-gray-600 leading-relaxed">
                  Мы занимаемся с детьми в стенах детского сада. Мы не отнимаем время у родителей после детского сада. Вы приводите домой уставшего, но счастливого ребенка.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl font-black text-purple-200 mb-6 group-hover:text-purple-600 transition-colors">03</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Турниры и соревнования</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ежегодно мы устраиваем отчетные турниры, праздники и прочие спортивные мероприятия, где вы можете оценить прогресс вашего ребенка, а также повеселиться вместе с ним, показав своим примером, что спорт — это круто.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl font-black text-orange-200 mb-6 group-hover:text-orange-500 transition-colors">04</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Внимание каждому</h3>
                <p className="text-gray-600 leading-relaxed">
                  Мы собираем небольшие группы (обычно это 8 ребят), чтобы тренер мог уделить внимание каждому ребенку во время тренировки. Мы уделили огромное внимание программе и сделали ее максимально увлекательной и развивающей, в том числе с учетом помещения, в котором мы работаем.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Готов ли ваш ребёнок к спорту?
            </h2>
            <p className="text-gray-600 text-lg">
              Пройдите короткий тест и получите персональные рекомендации и PDF-гайд по адаптации
            </p>
          </div>
          <Quiz />
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Наша философия и методика
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Заинтересовываем, а не заставляем — педагогика радости
            </p>
          </div>

          {/* Pedagogical Approach */}
          <div className="max-w-6xl mx-auto mb-16">
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-orange-500 rounded-3xl p-1 mb-8">
              <div className="bg-white rounded-3xl p-8 md:p-12">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                    Базовый принцип: Педагогика радости
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-2xl p-6 border-2 border-purple-100">
                    <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                      Мы радикально отходим от устаревшей модели «муштры и игры на результат». 
                      Для детей 3-7 лет мы заменяем скучную тренировку на <span className="font-bold text-purple-700">увлекательное приключение</span>.
                    </p>
                  </div>
                  
                  <p className="text-gray-700 text-lg leading-relaxed text-center">
                    Мы строго учитываем возрастную психологию и физиологию дошкольников: быструю утомляемость, 
                    потребность в частой смене деятельности, слабую координацию и ранимость при неудачах.
                  </p>
                </div>
              </div>
            </div>

            {/* Game scenarios cards */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 mb-6">
                <p className="font-bold text-white text-xl flex items-center gap-3 justify-center">
                  <Trophy className="w-6 h-6" />
                  Каждое упражнение — это игровой сюжет
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    1
                  </div>
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">⚽</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-800">Ведение мяча</h4>
                  <p className="text-gray-600 text-sm mb-2">Не просто дриблинг, а</p>
                  <p className="font-bold text-purple-700">«Побег от сказочных монстров»</p>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-300">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    2
                  </div>
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">💎</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-800">Обводка конусов</h4>
                  <p className="text-gray-600 text-sm mb-2">Захватывающий квест</p>
                  <p className="font-bold text-orange-600">«Сбор волшебных сокровищ»</p>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    3
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🐉</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-800">Удары по воротам</h4>
                  <p className="text-gray-600 text-sm mb-2">Героическая миссия</p>
                  <p className="font-bold text-purple-700">«Спасение города от дракона»</p>
                </div>
              </div>
            </div>

            {/* Bottom quote */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-orange-500 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-orange-500 rounded-2xl p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                  Это нивелирует стресс и формирует устойчивую внутреннюю мотивацию и искреннюю любовь к спорту на всю жизнь
                </p>
              </div>
            </div>
          </div>

          {/* Coerver Coaching Deep Dive */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Европейская методика Coerver Coaching</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_30px_70px_-42px_rgba(124,58,237,0.45)] sm:p-8">
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500"></div>
                  <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-purple-100 blur-3xl"></div>
                  <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-orange-100 blur-3xl"></div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
                      <Award className="h-4 w-4" />
                      Coerver Coaching
                    </div>
                    <h4 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
                      Пирамида развития
                    </h4>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
                      Навыки наслаиваются постепенно: от чувства мяча и уверенного контроля до
                      чтения игры и взаимодействия в команде.
                    </p>

                    <div className="mt-8 flex flex-col items-center gap-2.5">
                      {developmentPyramidLevels.map((layer) => {
                        const Icon = layer.icon;

                        return (
                          <div key={layer.level} className={`${layer.widthClass} transition-transform duration-300 hover:-translate-y-0.5`}>
                            <div
                              className={`relative overflow-hidden rounded-[1.5rem] border ${layer.borderClass} bg-gradient-to-r ${layer.gradientClass} px-4 py-4 text-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.65)]`}
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_58%)]"></div>
                              <div className="relative flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                                    {layer.level}
                                  </p>
                                  <p className="text-base font-black leading-tight text-white">
                                    {layer.title}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="w-full transition-transform duration-300 hover:-translate-y-0.5">
                        <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-300 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 px-5 py-5 text-white shadow-[0_22px_50px_-32px_rgba(15,23,42,0.85)]">
                          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_55%)]"></div>
                          <div className="relative flex flex-col items-center text-center">
                            <div className="mb-2 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-100 backdrop-blur-sm">
                              <Award className="h-4 w-4" />
                              Фундамент
                              <Award className="h-4 w-4" />
                            </div>
                            <p className="text-lg font-black tracking-wide text-white">
                              Ball Mastery
                            </p>
                            <p className="mt-1 text-sm font-medium text-indigo-100">
                              Чувство мяча и уверенный базовый контроль
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-[1.5rem] border border-purple-100 bg-purple-50/80 px-5 py-4">
                      <p className="text-sm leading-relaxed text-gray-700">
                        <strong>Принцип:</strong> ребёнок не перескакивает через базу. Каждый
                        следующий уровень опирается на уже освоенный навык, поэтому обучение идёт
                        спокойно и без перегруза.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Концепция «от простого к сложному»</strong> — в основе лежит
                    «Пирамида развития игрока», фундаментом которой является абсолютное чувство
                    мяча (Ball Mastery).
                  </p>
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    Мы постепенно и бережно наслаиваем навыки: от базового контроля мяча подошвой
                    до игры 1×1, сложных финтов и точных передач.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/70 p-6">
                  <p className="text-sm leading-relaxed text-gray-700">
                    <strong>Результат:</strong> Каждый ребенок учится виртуозно владеть своим телом
                    и мячом, приобретая огромную уверенность в себе еще до того, как начнет
                    играть в большой команде.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FUNino Deep Dive */}
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-[2.25rem] border border-gray-200 bg-white shadow-[0_30px_80px_-42px_rgba(249,115,22,0.28)]">
              <div className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-orange-100 blur-3xl"></div>
              <div className="absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-purple-100 blur-3xl"></div>
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-purple-500"></div>

              <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.02fr_0.98fr] lg:p-10">
                <div className="relative overflow-hidden rounded-[1.9rem] border border-orange-100 bg-gradient-to-br from-[#fff7ed] via-white to-[#fff1f2] p-6 lg:p-8">
                  <div className="absolute -right-12 top-0 h-36 w-36 rounded-full bg-orange-200/50 blur-3xl"></div>
                  <div className="absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-purple-100/60 blur-3xl"></div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700 shadow-sm">
                      <Sparkles className="h-4 w-4" />
                      Формат FUNino
                    </div>
                    <h3 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                      Инновационный подход Хорста Вайна, где ребёнок постоянно внутри игры
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-gray-700">
                      В традиционном формате малыши часто сбиваются в толпу вокруг одного мяча.
                      В результате один играет, остальные ждут. FUNino меняет саму среду:
                      маленькие составы, четыре ворота и постоянный выбор вариантов действия.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {funinoSignals.map((signal) => (
                        <span
                          key={signal}
                          className="rounded-full border border-white/80 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-700 shadow-sm"
                        >
                          {signal}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-orange-100 bg-white/80 p-5 shadow-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500">
                          Почему это работает
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                          Поле перестаёт быть местом ожидания. Ребёнок чаще двигается, чаще
                          получает мяч и быстрее включается в игровой процесс.
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] border border-slate-900/10 bg-slate-900 p-5 text-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.65)]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                          Ключевая идея
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-100">
                          Не диктовать каждое действие, а построить такую игру, в которой ребёнок
                          сам видит варианты и учится принимать решения.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-[1.6rem] border border-orange-200 bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-4 text-center text-white shadow-[0_22px_45px_-30px_rgba(249,115,22,0.85)]">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/85">
                        Суть метода
                      </p>
                      <p className="mt-1 text-lg font-black">
                        FUNino — это динамичная игра 3×3 или 4×4 на поле с четырьмя воротами
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[1.9rem] border border-slate-200 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(241,245,249,0.94)_32%,rgba(226,232,240,0.96)_100%)] p-4 sm:p-5">
                  <style>
                    {`
                      @keyframes funinoBallRoute {
                        0%, 8% { left: 50%; top: 50%; transform: translate(-50%, -50%) scale(1); }
                        18% { left: 72%; top: 30%; transform: translate(-50%, -50%) scale(1.06); }
                        32% { left: 57%; top: 41%; transform: translate(-50%, -50%) scale(0.94); }
                        46% { left: 28%; top: 67%; transform: translate(-50%, -50%) scale(1.08); }
                        60% { left: 69%; top: 72%; transform: translate(-50%, -50%) scale(1); }
                        74% { left: 29%; top: 29%; transform: translate(-50%, -50%) scale(1.04); }
                        100% { left: 50%; top: 50%; transform: translate(-50%, -50%) scale(1); }
                      }
                      @keyframes funinoPulse {
                        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
                        50% { transform: translate(-50%, -50%) scale(1.16); opacity: 1; }
                      }
                      @keyframes funinoScan {
                        0% { transform: translate(-50%, -50%) rotate(0deg); }
                        100% { transform: translate(-50%, -50%) rotate(360deg); }
                      }
                      @keyframes funinoHint {
                        0%, 12% { opacity: 0; transform: translateY(10px) scale(0.96); }
                        18%, 34% { opacity: 1; transform: translateY(0) scale(1); }
                        42%, 100% { opacity: 0; transform: translateY(-8px) scale(0.98); }
                      }
                    `}
                  </style>

                  <div className="relative h-[22rem] overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,#155b46_0%,#0f3f34_100%)] shadow-[0_28px_60px_-36px_rgba(15,23,42,0.7)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_40%)]"></div>
                    <div className="absolute inset-5 rounded-[1.45rem] border border-white/15"></div>
                    <div className="absolute inset-y-5 left-1/2 w-px -translate-x-1/2 bg-white/15"></div>
                    <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"></div>

                    <div className="absolute left-4 top-[22%] h-12 w-5 -translate-y-1/2 rounded-r-md border-r border-y border-white/70 bg-white/10"></div>
                    <div className="absolute left-4 top-[68%] h-12 w-5 -translate-y-1/2 rounded-r-md border-r border-y border-white/70 bg-white/10"></div>
                    <div className="absolute right-4 top-[22%] h-12 w-5 -translate-y-1/2 rounded-l-md border-l border-y border-white/70 bg-white/10"></div>
                    <div className="absolute right-4 top-[68%] h-12 w-5 -translate-y-1/2 rounded-l-md border-l border-y border-white/70 bg-white/10"></div>

                    {[
                      { left: "22%", top: "28%", color: "bg-orange-400", delay: "0s" },
                      { left: "35%", top: "58%", color: "bg-white/90", delay: "0.5s" },
                      { left: "50%", top: "50%", color: "bg-purple-300", delay: "0.8s" },
                      { left: "66%", top: "36%", color: "bg-white/90", delay: "1.1s" },
                      { left: "75%", top: "67%", color: "bg-orange-300", delay: "1.5s" },
                      { left: "50%", top: "24%", color: "bg-white/80", delay: "1.8s" },
                    ].map((player, index) => (
                      <div
                        key={`${player.left}-${player.top}-${index}`}
                        className="absolute h-4 w-4"
                        style={{
                          left: player.left,
                          top: player.top,
                          animation: `funinoPulse 2.8s ease-in-out ${player.delay} infinite`,
                        }}
                      >
                        <div className={`h-full w-full rounded-full border-2 border-white/55 ${player.color} shadow-[0_0_18px_rgba(255,255,255,0.2)]`}></div>
                      </div>
                    ))}

                    <div
                      className="absolute h-6 w-6 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.5)]"
                      style={{ animation: "funinoBallRoute 8s cubic-bezier(0.4, 0, 0.2, 1) infinite" }}
                    >
                      <div className="absolute inset-[5px] rounded-full bg-slate-900/15"></div>
                    </div>

                    <div
                      className="absolute left-1/2 top-1/2 h-24 w-24 rounded-full border border-dashed border-white/30"
                      style={{ animation: "funinoScan 6s linear infinite" }}
                    >
                      <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300"></div>
                    </div>

                    {[
                      { label: "касание", left: "13%", top: "13%", delay: "0.1s" },
                      { label: "обзор", left: "67%", top: "14%", delay: "2.6s" },
                      { label: "решение", left: "39%", top: "80%", delay: "5s" },
                    ].map((hint) => (
                      <div
                        key={hint.label}
                        className="absolute rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm"
                        style={{
                          left: hint.left,
                          top: hint.top,
                          animation: `funinoHint 8s ease-in-out ${hint.delay} infinite`,
                        }}
                      >
                        {hint.label}
                      </div>
                    ))}

                    <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
                      Анимация принципа
                    </div>

                    <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2">
                      {["каждый в игре", "голова поднята", "решение сам"].map((item) => (
                        <div
                          key={item}
                          className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-[1.4rem] border border-white/70 bg-white/80 p-4 shadow-sm">
                    <p className="text-sm leading-relaxed text-gray-700">
                      Поле само подталкивает ребёнка к действию: открыться, посмотреть по сторонам,
                      выбрать свободные ворота и быстро включиться в следующий эпизод.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 border-t border-gray-100 px-6 pb-6 sm:px-8 sm:pb-8 lg:grid-cols-3 lg:px-10 lg:pb-10">
                {funinoBenefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className={`rounded-[1.75rem] border ${benefit.borderClass} bg-gradient-to-br ${benefit.surfaceClass} p-6 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)]`}
                    >
                      <div className={`flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br ${benefit.accentClass} text-white shadow-lg`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="mt-5 inline-flex rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-600 shadow-sm">
                        {benefit.badge}
                      </div>
                      <h4 className="mt-4 text-xl font-bold text-gray-900">{benefit.title}</h4>
                      <p className="mt-3 text-sm leading-relaxed text-gray-700">
                        {benefit.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Coerver Coaching</h3>
              <p className="text-gray-600 text-sm">
                Методика от простого к сложному для развития технических навыков
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Формат FUNino</h3>
              <p className="text-gray-600 text-sm">
                Игра 3×3 или 4×4 с несколькими воротами для максимального развития мышления
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Геймификация</h3>
              <p className="text-gray-600 text-sm">
                Система карточек, наклеек и достижений для поддержания мотивации
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Бережный подход</h3>
              <p className="text-gray-600 text-sm">
                Адаптация без стресса, индивидуальный подход к каждому ребёнку
              </p>
            </div>
          </div>

          {/* HeroAcademy App */}
          <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-orange-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-[0_20px_50px_-12px_rgba(147,51,234,0.5)] relative overflow-hidden border border-white/10">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

            {/* Intro Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16 relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
                  <span className="animate-pulse">✨</span>
                  <span className="text-sm font-bold tracking-wider uppercase text-yellow-300">Ключевая инновация</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black leading-tight">
                  Фиджитал-приложение <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">HeroAcademy</span>
                </h3>
                <p className="text-xl font-bold border-l-4 border-orange-500 pl-4 py-1 text-white/90">
                  «Мы превращаем экранное время в здоровье, силу и навыки»
                </p>
                <p className="text-lg text-purple-100 leading-relaxed opacity-90">
                  Прямое обращение к главной боли современных родителей — зависимости детей от гаджетов. 
                  Мы не пытаемся запретить телефоны, мы делаем их мощнейшим инструментом физического развития!
                </p>
              </div>
              
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative bg-white/5 backdrop-blur-xl rounded-[3rem] p-3 flex items-center justify-center h-[30rem] w-full max-w-[15rem] border border-white/20 shadow-[0_0_40px_rgba(249,115,22,0.3)] overflow-hidden group">
                  <style>
                    {`
                      @keyframes heroFloatUp {
                        0% { opacity: 0; transform: translateY(15px) scale(0.8); }
                        20% { opacity: 1; transform: translateY(0px) scale(1.1); }
                        80% { opacity: 1; transform: translateY(-30px) scale(1); }
                        100% { opacity: 0; transform: translateY(-45px) scale(0.9); }
                      }
                      @keyframes heroFillProgress {
                        0% { width: 0%; }
                        40% { width: 100%; }
                        50% { width: 100%; opacity: 1; }
                        55% { width: 100%; opacity: 0; }
                        60% { width: 0%; opacity: 0; }
                        65% { width: 0%; opacity: 1; }
                        100% { width: 0%; }
                      }
                      @keyframes heroPulseGlow {
                        0%, 100% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.1); }
                        50% { box-shadow: 0 0 25px rgba(255, 165, 0, 0.5); }
                      }
                      @keyframes heroBounceBall {
                        0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
                        50% { transform: translateY(-40px) rotate(180deg) scale(1.05); }
                      }
                    `}
                  </style>

                  {/* Phone Screen Mockup */}
                  <div className="relative w-full h-full bg-gradient-to-b from-purple-950 to-indigo-950 rounded-[2.25rem] border border-white/10 overflow-hidden flex flex-col shadow-inner">
                    
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-b-3xl z-10 flex items-end justify-center pb-1">
                      <div className="w-12 h-1 bg-white/20 rounded-full"></div>
                    </div>
                    
                    {/* App Content */}
                    <div className="flex-1 px-5 pt-14 pb-5 flex flex-col items-center justify-center relative">
                      
                      {/* Background UI elements */}
                      <div className="absolute top-12 left-2 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>
                      <div className="absolute bottom-24 right-2 w-24 h-24 bg-orange-500/20 rounded-full blur-xl"></div>

                      {/* Floating points/rewards */}
                      <div className="absolute top-1/4 right-4 font-black text-orange-400 text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-20" style={{ animation: 'heroFloatUp 3s infinite ease-out' }}>
                        +50 XP
                      </div>
                      <div className="absolute top-1/3 left-5 font-bold text-yellow-300 text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-20" style={{ animation: 'heroFloatUp 3s infinite ease-out 1.5s' }}>
                        ⭐
                      </div>

                      {/* Animated Ball */}
                      <div className="relative w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center mb-12 backdrop-blur-md border border-white/30" style={{ animation: 'heroPulseGlow 2s infinite' }}>
                        <div className="text-6xl drop-shadow-2xl" style={{ animation: 'heroBounceBall 1s infinite ease-in-out' }}>
                          ⚽
                        </div>
                      </div>

                      {/* Level Info */}
                      <div className="w-full mb-8 mt-auto z-10">
                        <div className="flex justify-between items-center mb-2 px-1 text-sm font-bold text-white">
                          <span>Уровень 5</span>
                          <span className="text-orange-400">Дриблер</span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-white/10 shadow-inner">
                          <div className="bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-400 h-full rounded-full relative" style={{ animation: 'heroFillProgress 5s infinite ease-in-out' }}>
                            <div className="absolute inset-0 bg-white/30" style={{ animation: 'heroPulseGlow 1s infinite' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Activity Card */}
                      <div className="w-full bg-white/10 rounded-2xl p-3 backdrop-blur-xl border border-white/20 flex items-center gap-3 shadow-lg z-10 group-hover:bg-white/20 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/30 to-purple-500/30 flex items-center justify-center shrink-0 border border-white/10">
                          <Smartphone className="w-6 h-6 text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] text-white/70 mb-0.5 uppercase tracking-wider font-bold truncate">Текущее задание</div>
                          <div className="text-base font-black text-white truncate">Чеканка мяча</div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="h-20 bg-black/40 flex justify-around items-center px-6 border-t border-white/10 backdrop-blur-2xl pb-3">
                      <div className="w-10 h-1.5 rounded-full bg-white/20"></div>
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)] -mt-8 border-4 border-indigo-950 z-10 relative overflow-hidden group-hover:scale-110 transition-transform">
                        <div className="absolute inset-0 bg-white/30 animate-ping" style={{ animationDuration: '2s' }}></div>
                        <Play className="w-6 h-6 text-white fill-white ml-1 relative z-10" />
                      </div>
                      <div className="w-10 h-1.5 rounded-full bg-white/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works Steps */}
            <div className="relative z-10 mb-12">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/50"></div>
                <h4 className="text-2xl font-black uppercase tracking-widest text-center">Как это работает</h4>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/50"></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 relative">
                <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 bg-white/10 border-t border-dashed border-white/30 z-0"></div>
                
                {[
                  { step: 1, title: 'Подготовка', desc: 'Ребенок ставит смартфон на штатив или у стены, открывая приложение' },
                  { step: 2, title: 'Тренировка', desc: 'Выполняет футбольные челленджи: дриблинг, чеканка, финты перед камерой' },
                  { step: 3, title: 'Награды', desc: 'Получает очки опыта, открывает новые навыки и прокачивает аватара' }
                ].map((item) => (
                  <div key={item.step} className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 relative z-10 flex flex-col items-center text-center hover:bg-white/10 transition-all hover:-translate-y-2 group shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 animate-spin-slow opacity-50 blur-sm"></div>
                      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-gray-900 to-black border border-white/20 flex items-center justify-center font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
                        {item.step}
                      </div>
                    </div>
                    <h5 className="font-bold text-xl mb-3 text-white">{item.title}</h5>
                    <p className="text-purple-200 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          {/* Computer Vision Feature */}
          <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white/10 mb-8 relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] group hover:border-white/20 transition-all duration-500">
            <style>
              {`
                @keyframes cvScanline {
                  0% { top: 0; opacity: 0; }
                  10% { opacity: 0.5; }
                  90% { opacity: 0.5; }
                  100% { top: 100%; opacity: 0; }
                }
                @keyframes cvBounce {
                  0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
                  50% { transform: translateY(-70px) scale(0.95) rotate(180deg); }
                }
                @keyframes cvBoxTrack {
                  0%, 100% { transform: translateY(0) scale(1); border-color: rgba(34, 197, 94, 0.8); }
                  50% { transform: translateY(-70px) scale(0.95); border-color: rgba(59, 130, 246, 0.8); }
                }
                @keyframes cvCountScroll {
                  0%, 31% { transform: translateY(0); }
                  33%, 64% { transform: translateY(-20px); }
                  66%, 98% { transform: translateY(-40px); }
                  100% { transform: translateY(0); }
                }
                @keyframes cvPulse {
                  0%, 100% { transform: scale(1); opacity: 0.8; }
                  50% { transform: scale(1.5); opacity: 1; box-shadow: 0 0 10px rgba(59, 130, 246, 0.8); }
                }
              `}
            </style>

            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Smartphone className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-2xl font-bold">Computer Vision & ИИ</h4>
                </div>
                
                <p className="text-purple-100 text-lg mb-8 leading-relaxed">
                  Камера смартфона, усиленная нейросетями, в реальном времени распознает движения тела и мяча. 
                  Она автоматически подсчитывает элементы и оценивает правильность техники!
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    'Автоматический подсчет касаний',
                    'Оценка правильности техники',
                    'Мгновенная обратная связь',
                    'Распознавание движений тела'
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5 hover:bg-black/30 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                      <span className="text-sm font-medium text-white/90">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CV Animation Window */}
              <div className="w-full max-w-[340px] h-[240px] bg-gray-900 rounded-2xl overflow-hidden relative border-2 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.4)] flex-shrink-0 font-mono group-hover:border-blue-500/30 transition-colors duration-500">
                {/* REC indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-30 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-xs text-white tracking-widest font-bold">REC</span>
                </div>

                {/* Top right stats */}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-30">
                  <div className="bg-black/60 backdrop-blur-sm rounded-md px-3 py-1.5 border border-white/10 flex items-center gap-3 shadow-lg">
                    <span className="text-[10px] text-white/70 font-bold">КАСАНИЙ</span>
                    <div className="h-[24px] overflow-hidden relative w-[24px]">
                      <div className="absolute top-0 left-0 w-full flex flex-col text-green-400 font-black text-xl" style={{ animation: 'cvCountScroll 2s infinite' }}>
                        <span className="h-[24px] flex items-center justify-center">14</span>
                        <span className="h-[24px] flex items-center justify-center">15</span>
                        <span className="h-[24px] flex items-center justify-center">16</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm rounded-md px-3 py-1.5 border border-white/10 shadow-lg">
                    <span className="text-[10px] text-white/70 mr-2 font-bold">ТЕХНИКА</span>
                    <span className="text-xs text-blue-400 font-black">ОТЛИЧНО</span>
                  </div>
                </div>

                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                {/* Scanline */}
                <div className="absolute left-0 right-0 h-1 bg-green-400/50 shadow-[0_0_20px_rgba(34,197,94,1)] z-20" style={{ animation: 'cvScanline 3s infinite linear' }}></div>

                {/* Skeleton Tracking */}
                <div className="absolute bottom-8 left-[40%] -translate-x-1/2 w-20 h-32 flex items-end justify-center">
                  {/* Bounding box */}
                  <div className="absolute inset-0 border-2 border-blue-400/40 border-dashed rounded-lg flex justify-center z-0 bg-blue-500/5">
                    <span className="text-[8px] font-bold text-blue-300 bg-gray-900 px-2 rounded-full border border-blue-400/40 absolute -top-3 whitespace-nowrap">USER_TRACK</span>
                  </div>
                  
                  {/* Skeleton lines & nodes */}
                  <div className="relative w-full h-full z-10">
                    {/* Head */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-8 border-2 border-blue-400 rounded-full flex items-center justify-center bg-gray-900">
                      <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,1)]" style={{ animation: 'cvPulse 1s infinite' }}></div>
                    </div>
                    {/* Spine */}
                    <div className="absolute top-11 left-1/2 w-[2px] h-10 bg-blue-400 -translate-x-1/2 shadow-[0_0_5px_rgba(96,165,250,0.8)]"></div>
                    {/* Shoulders */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-14 h-[2px] bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)]">
                      <div className="absolute -left-1 -top-[3px] w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,1)]" style={{ animation: 'cvPulse 1s infinite 0.2s' }}></div>
                      <div className="absolute -right-1 -top-[3px] w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,1)]" style={{ animation: 'cvPulse 1s infinite 0.4s' }}></div>
                    </div>
                    {/* Legs */}
                    <div className="absolute top-[84px] left-1/2 w-[2px] h-12 bg-blue-400 origin-top rotate-[25deg] shadow-[0_0_5px_rgba(96,165,250,0.8)]">
                      <div className="absolute bottom-0 -left-[3px] w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,1)]" style={{ animation: 'cvPulse 1s infinite 0.6s' }}></div>
                    </div>
                    <div className="absolute top-[84px] left-1/2 w-[2px] h-12 bg-blue-400 origin-top -rotate-[20deg] shadow-[0_0_5px_rgba(96,165,250,0.8)]">
                      <div className="absolute bottom-0 -left-[3px] w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,1)]" style={{ animation: 'cvPulse 1s infinite 0.8s' }}></div>
                    </div>
                  </div>
                </div>

                {/* Ball Tracking */}
                <div className="absolute bottom-8 right-10 z-10">
                  <div className="absolute -inset-3 border-2 border-green-500 border-dashed rounded-lg flex justify-center z-0 bg-green-500/10" style={{ animation: 'cvBoxTrack 2s infinite ease-in-out' }}>
                    <span className="text-[8px] font-bold text-green-300 bg-gray-900 px-2 rounded-full border border-green-500/50 absolute -top-3 whitespace-nowrap">BALL: 99%</span>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(255,255,255,1)] relative z-10" style={{ animation: 'cvBounce 2s infinite ease-in-out' }}>
                    ⚽
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RPG Gamification Feature */}
          <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white/10 mb-8 relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] group hover:border-white/20 transition-all duration-500">
            <style>
              {`
                @keyframes rpgCardFloat {
                  0%, 100% { transform: translateY(0) rotate(-2deg); }
                  50% { transform: translateY(-15px) rotate(2deg); filter: drop-shadow(0 0 30px rgba(234, 179, 8, 0.4)); }
                }
                @keyframes rpgShine {
                  0% { transform: translateX(-150%) skewX(-45deg); }
                  20%, 100% { transform: translateX(250%) skewX(-45deg); }
                }
                @keyframes rpgCoinBounce {
                  0%, 100% { transform: translateY(0) scale(1); }
                  50% { transform: translateY(-15px) scale(1.1); }
                }
                @keyframes rpgLevelUp {
                  0% { opacity: 0; transform: scale(0.5) translateY(20px); }
                  20% { opacity: 1; transform: scale(1.2) translateY(0); }
                  80% { opacity: 1; transform: scale(1) translateY(-10px); }
                  100% { opacity: 0; transform: scale(0.8) translateY(-30px); }
                }
                @keyframes rpgStatPulse {
                  0%, 100% { color: #facc15; text-shadow: none; }
                  50% { color: #4ade80; text-shadow: 0 0 10px rgba(74, 222, 128, 0.8); transform: scale(1.1); }
                }
              `}
            </style>

            <div className="flex flex-col lg:flex-row-reverse gap-12 items-center mb-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h4 className="text-2xl font-bold">Глубокая RPG-геймификация</h4>
                </div>
                
                <p className="text-purple-100 text-lg mb-6 leading-relaxed">
                  Скучные домашние тренировки превращаются в захватывающий цифровой квест! Выполняй задания, получай опыт и прокачивай свою карточку игрока.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-bold border border-yellow-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                    <Star className="w-4 h-4 fill-yellow-300" /> +500 XP
                  </span>
                  <span className="bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-bold border border-orange-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                    🔥 Новый уровень
                  </span>
                  <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-bold border border-purple-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    💎 Редкий лут
                  </span>
                </div>
              </div>

              {/* FUT Card Animation Area */}
              <div className="w-full max-w-[320px] relative shrink-0 h-[380px] flex justify-center items-center">
                
                {/* Floating Coins/Gems */}
                <div className="absolute top-6 left-2 w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full border-[3px] border-yellow-100 shadow-[0_0_20px_rgba(250,204,21,0.8)] flex items-center justify-center font-black text-yellow-900 text-xl z-0" style={{ animation: 'rpgCoinBounce 2.5s infinite ease-in-out' }}>¢</div>
                <div className="absolute bottom-12 right-2 w-10 h-10 bg-gradient-to-br from-fuchsia-400 to-purple-600 rotate-45 border-2 border-fuchsia-200 shadow-[0_0_20px_rgba(192,132,252,0.8)] z-0 rounded-sm" style={{ animation: 'rpgCoinBounce 3s infinite ease-in-out 0.5s' }}></div>

                {/* Level Up Text */}
                <div className="absolute -top-4 right-0 font-black text-4xl text-green-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] z-20 italic tracking-wider" style={{ animation: 'rpgLevelUp 4s infinite' }}>
                  LEVEL UP!
                </div>

                {/* FUT Card */}
                <div className="w-[240px] h-[330px] bg-gradient-to-br from-yellow-300 via-yellow-600 to-yellow-900 rounded-t-3xl rounded-b-xl p-1 relative z-10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]" style={{ animation: 'rpgCardFloat 5s infinite ease-in-out' }}>
                  <div className="absolute inset-0 overflow-hidden rounded-t-3xl rounded-b-xl z-20 pointer-events-none">
                    <div className="w-full h-[200%] bg-gradient-to-tr from-transparent via-white/80 to-transparent absolute top-0 -left-[100%]" style={{ animation: 'rpgShine 4s infinite ease-in-out' }}></div>
                  </div>
                  
                  <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-t-[1.6rem] rounded-b-lg p-5 flex flex-col items-center border border-yellow-500/50 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-yellow-500 via-transparent to-transparent"></div>
                    
                    {/* Card Header */}
                    <div className="w-full flex justify-between items-start mb-3 relative z-10">
                      <div className="flex flex-col items-center">
                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 leading-none drop-shadow-md">85</span>
                        <span className="text-sm text-yellow-600 font-black tracking-widest mt-1">OVR</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center border-[3px] border-yellow-500/50 shadow-inner">
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>
                    
                    {/* Player Image Placeholder */}
                    <div className="w-32 h-32 bg-gradient-to-b from-white/10 to-transparent rounded-full flex items-center justify-center border-2 border-white/10 mb-4 relative z-10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                      <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
                      <div className="absolute -bottom-3 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 text-black text-xs font-black px-4 py-1.5 rounded-md shadow-lg uppercase tracking-widest border border-yellow-200">
                        Champion
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-500/70 to-transparent my-3 relative z-10"></div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full text-sm font-mono relative z-10 px-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 font-sans font-medium">СКО</span>
                        <span className="font-black text-yellow-500 text-base" style={{ animation: 'rpgStatPulse 2s infinite' }}>88</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 font-sans font-medium">ДРИ</span>
                        <span className="font-black text-yellow-500 text-base">92</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 font-sans font-medium">УДР</span>
                        <span className="font-black text-yellow-500 text-base">81</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 font-sans font-medium">ЗАЩ</span>
                        <span className="font-black text-yellow-500 text-base">45</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 font-sans font-medium">ПАС</span>
                        <span className="font-black text-yellow-500 text-base">86</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 font-sans font-medium">ФИЗ</span>
                        <span className="font-black text-yellow-500 text-base" style={{ animation: 'rpgStatPulse 2s infinite 1s' }}>79</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  title: 'Цифровая карточка',
                  desc: 'Как в FIFA FUT! Прокачивай Скорость, Дриблинг, Удар. Видишь рост с 65 до 70 — это реальная мотивация!',
                  icon: '🎴'
                },
                {
                  title: 'Виртуальный магазин',
                  desc: 'Зарабатывай монеты за тренировки и покупай премиум-бутсы, эффекты для аватара и крутые фоны.',
                  icon: '🛒'
                },
                {
                  title: 'Бейджи и достижения',
                  desc: 'Получай звания «Волшебник дриблинга» или «Мастер паса» за освоение блоков упражнений.',
                  icon: '🎖️'
                }
              ].map((card, i) => (
                <div key={i} className="bg-black/20 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition duration-300 flex flex-col items-start gap-3 group/card">
                  <div className="text-2xl bg-white/10 p-3 rounded-xl group-hover/card:scale-110 transition-transform">{card.icon}</div>
                  <h5 className="font-bold text-yellow-400 text-lg">{card.title}</h5>
                  <p className="text-sm text-purple-100 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Connection */}
          <div className="relative z-10 bg-gradient-to-r from-orange-500 to-purple-600 rounded-3xl p-[2px] overflow-hidden shadow-2xl">
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-[22px] p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(249,115,22,0.4)] rotate-3">
                <MessageCircle className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold animate-bounce">1</div>
              </div>
              <div>
                <h4 className="text-2xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Прямая связь с тренером</h4>
                <p className="text-purple-100 text-lg leading-relaxed">
                  Все данные синхронизируются с дашбордом тренера. На следующей тренировке в саду он уже знает о достижениях: 
                  <span className="text-white font-bold italic block mt-3 bg-white/5 p-4 rounded-xl border border-white/10 text-left">
                    «Саша, я видел, ты вчера сделал 100 переступов дома, ты настоящий чемпион! 🌟»
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section
        id="coaches"
        className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fff8f5_50%,#f6f2ff_100%)] py-24"
      >
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-purple-100 blur-3xl"></div>
        <div className="absolute -right-16 top-32 h-80 w-80 rounded-full bg-orange-100 blur-3xl"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent"></div>

        <div className="container relative mx-auto px-4">
          <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-700 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                Наставники школы
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                Тренерский состав, которому родители доверяют с первого занятия
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                Команда практиков с лицензиями, игровым опытом и бережным подходом к дошкольникам.
                Здесь важны не только регалии, но и то, как тренер умеет включить ребёнка в игру,
                снять страх ошибки и закрепить интерес к спорту.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-[30rem]">
              {coachSectionStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.value}
                    className="rounded-[1.5rem] border border-white/80 bg-white/85 p-4 shadow-[0_18px_40px_-28px_rgba(124,58,237,0.28)] backdrop-blur-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-orange-500 text-white shadow-lg shadow-purple-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-lg font-black text-gray-900">{stat.value}</p>
                    <p className="text-sm leading-relaxed text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:thin] [scrollbar-color:rgba(147,51,234,0.45)_transparent]">
            <div className="flex w-max gap-6 pr-4">
              {coaches.map((coach, index) => {
                const profileFacts = [
                  { label: "Квалификация", value: coach.achievement },
                  { label: "Результаты", value: coach.achievements },
                  { label: "Специализация", value: coach.specialty },
                  { label: "Игровой путь", value: coach.teams },
                  { label: "Развитие", value: coach.note },
                ].filter((item): item is { label: string; value: string } => Boolean(item.value));

                return (
                  <article
                    key={coach.name}
                    className="group relative w-[21rem] shrink-0 snap-start overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_28px_80px_-42px_rgba(76,29,149,0.38)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_34px_90px_-42px_rgba(124,58,237,0.42)] md:w-[24rem]"
                  >
                    <div className={`relative min-h-[18rem] overflow-hidden bg-gradient-to-br ${coach.gradientClass} p-6 text-white`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_32%)]"></div>
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),transparent_42%,rgba(15,23,42,0.28)_100%)]"></div>
                      <div className="absolute -right-10 top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl"></div>
                      <div className="absolute -left-8 bottom-4 h-28 w-28 rounded-full bg-black/10 blur-2xl"></div>
                      <div className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
                        <Award className="h-5 w-5" />
                      </div>

                      <div className="relative z-10 flex h-full flex-col justify-between">
                        <div className="inline-flex w-max items-center gap-2 rounded-full border border-white/15 bg-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <span>{coach.badge}</span>
                        </div>

                        <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] backdrop-blur-md">
                          <div className="flex items-end justify-between gap-4">
                            <div>
                              <h3 className="text-2xl font-black leading-tight">{coach.name}</h3>
                              <p className="mt-2 text-sm leading-relaxed text-white/80">
                                {coach.focus}
                              </p>
                            </div>
                            <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-[1.75rem] border border-white/20 bg-black/10 text-3xl font-black tracking-[0.08em] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] sm:flex">
                              {getCoachInitials(coach.name)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {coach.license && (
                          <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                            {coach.license}
                          </span>
                        )}
                        {coach.experience && (
                          <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                            {coach.experience}
                          </span>
                        )}
                      </div>

                      <div className="mt-5 rounded-[1.35rem] border border-gray-100 bg-gray-50/80 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-sm">
                            <GraduationCap className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                              Образование
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-gray-700">
                              {coach.education}
                            </p>
                          </div>
                        </div>
                      </div>

                      {profileFacts.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {profileFacts.map((fact) => (
                            <div
                              key={`${coach.name}-${fact.label}`}
                              className="rounded-[1.2rem] border border-gray-100 bg-white p-4 shadow-sm"
                            >
                              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                                {fact.label}
                              </p>
                              <p className="mt-1 text-sm leading-relaxed text-gray-700">
                                {fact.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {coach.internships && (
                        <div className="mt-4 rounded-[1.35rem] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-500">
                            Стажировки и практика
                          </p>
                          <div className="mt-3 space-y-2">
                            {coach.internships.map((internship) => (
                              <div key={internship} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="mt-1 h-2 w-2 rounded-full bg-orange-400"></span>
                                <span>{internship}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(coach.quote || coach.credo || coach.hobby) && (
                        <div className="mt-4 rounded-[1.35rem] border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-4">
                          {coach.quote && (
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-sm">
                                <MessageCircle className="h-5 w-5" />
                              </div>
                              <p className="text-sm italic leading-relaxed text-gray-700">
                                "{coach.quote}"
                              </p>
                            </div>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2">
                            {coach.credo && (
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-purple-700 shadow-sm">
                                Кредо: {coach.credo}
                              </span>
                            )}
                            {coach.hobby && (
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                                Хобби: {coach.hobby}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[1.75rem] border border-gray-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">
                В официальном разделе собраны сведения о педагогическом составе и квалификации.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                Если нужен строгий формат для проверки документов, откройте образовательный раздел сайта.
              </p>
            </div>
            <Link
              to="/education-info/staff"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Открыть официальный раздел
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="prices" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Тарифы и оплата
            </h2>
            <p className="text-gray-600 text-lg">
              Прозрачные цены с возможностью онлайн-оплаты
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Базовый</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">2 760 ₽</span>
                <span className="text-gray-600"> / месяц</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  8 занятий в месяц
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  2 раза в неделю
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  Группы до 10 человек
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  Прямо в вашем детском саду
                </li>
              </ul>
              <button 
                onClick={() => document.getElementById('telegram-bot')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Оплатить онлайн
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-orange-500 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                Выгода 30%
              </div>
              <h3 className="text-2xl font-bold mb-4">Льготный</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">1 950 ₽</span>
                <span className="text-purple-100"> / месяц</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Для многодетных семей
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  При записи двоих детей
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Для детей сотрудников ДОУ
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Все те же условия
                </li>
              </ul>
              <button 
                onClick={() => document.getElementById('telegram-bot')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-white text-purple-700 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Оплатить онлайн
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
            <p className="text-sm text-gray-700">
              <strong>Важно:</strong> Услуга считается оказанной по факту проведения занятия. 
              Пропуски не компенсируются и не требуют предоставления справок. 
              Подробности в <Link to="/oferta" className="text-purple-600 hover:underline">публичной оферте</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Telegram Bot Section */}
      <section id="telegram-bot" className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="text-white space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <MessageCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-medium tracking-wide">УДОБНАЯ ОПЛАТА И УПРАВЛЕНИЕ</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  Ваш личный <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Telegram-бот</span>
                </h2>
                
                <p className="text-lg text-purple-100 leading-relaxed">
                  Мы сделали процесс оплаты и управления абонементом максимально простым. 
                  Перейдите в наш бот, чтобы оплатить занятия в пару кликов, следить за расписанием 
                  и получать важные уведомления.
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-bold text-orange-400">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Отсканируйте QR-код</h4>
                      <p className="text-purple-200 text-sm">Или нажмите на кнопку ниже, если вы со смартфона</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-bold text-orange-400">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Авторизуйтесь</h4>
                      <p className="text-purple-200 text-sm">Бот привяжет ваш аккаунт к номеру телефона</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-bold text-orange-400">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Оплачивайте в 1 клик</h4>
                      <p className="text-purple-200 text-sm">Безопасная оплата картой или через СБП</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <a href="https://t.me/ChampionikBot" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                    <Send className="w-5 h-5" />
                    Перейти в бота
                  </a>
                  <a href="https://rutube.ru/video/private/959ee2dd9aed926a54474ed088b3b7d0/?p=1bC7v88oJgV-xAbU5823dg" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                    <PlayCircle className="w-5 h-5" />
                    Видеоинструкция
                  </a>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <div className="relative group">
                  {/* Glowing effect behind QR */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-purple-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
                  
                  <div className="relative bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 transform group-hover:scale-105 transition duration-500">
                    <div className="w-full flex justify-between items-center mb-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-xs text-gray-400 font-medium">championik_bot</div>
                    </div>
                    
                    {/* Placeholder for actual QR code */}
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-2 rounded-2xl overflow-hidden">
                      <img 
                        src="/images/qr-code.png" 
                        alt="QR Code ChampionikBot" 
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    
                    <div className="text-center">
                      <p className="font-bold text-gray-800 text-lg">Наведите камеру</p>
                      <p className="text-gray-500 text-sm">чтобы открыть Telegram</p>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-6 -right-6 bg-white p-3 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                    <span className="text-2xl">⚡️</span>
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                    <span className="text-2xl">💳</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              База знаний для родителей
            </h2>
            <p className="text-gray-600 text-lg">
              Полезные статьи о спорте, питании и психологии
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  {post.href.startsWith("/") ? (
                    <Link to={post.href} className="text-purple-600 font-semibold hover:underline">
                      {post.linkLabel || "Читать далее →"}
                    </Link>
                  ) : (
                    <a href={post.href} className="text-purple-600 font-semibold hover:underline">
                      Читать далее →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CSR Section */}
      <section className="py-20 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Социальная ответственность
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              Мы поддерживаем проекты инклюзивного футбола и сотрудничаем с 
              Сибирским благотворительным фондом «Только вместе», помогая детям 
              с особенностями развития заниматься спортом.
            </p>
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              Узнать больше о наших проектах
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Запишитесь на бесплатное пробное занятие и познакомьтесь с нашими тренерами
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('telegram-bot')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-purple-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Записаться на пробное занятие
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition">
              Связаться с нами
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
