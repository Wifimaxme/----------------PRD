import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  BarChart3,
  ClipboardList,
  RefreshCw,
  Sparkles,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type ActivityLevel = "LOW" | "MEDIUM" | "HIGH";
type NutritionGoal = "BALANCE" | "ENERGY" | "RECOVERY";
type NutritionPreference =
  | "MEAT"
  | "POULTRY"
  | "FISH"
  | "VEGETARIAN"
  | "NO_LACTOSE";

interface ChildProfile {
  age: number;
  weight: number;
  height: number;
  activity: ActivityLevel;
}

interface NutritionEntry {
  id: string;
  date: string;
  name: string;
  calories: number;
  p: number;
  f: number;
  c: number;
  type: "INTAKE";
}

interface ShoppingItem {
  name: string;
  quantity: string;
  checked?: boolean;
}

interface ShoppingCategory {
  category: string;
  items: ShoppingItem[];
}

interface Meal {
  type: string;
  time: string;
  name: string;
  totalWeight: string;
  calories: number;
  macros: { p: number; f: number; c: number };
  ingredients: Array<{ name: string; quantity: string }>;
}

interface DayPlan {
  day: number;
  meals: Meal[];
  totalCalories: number;
  macros: { p: number; f: number; c: number };
}

interface Insight {
  text: string;
  status: "GOOD" | "UNDER" | "OVER";
}

const STORAGE_KEYS = {
  profile: "championik_ai_nutrition_profile",
  entries: "championik_ai_nutrition_entries",
  plan: "championik_ai_nutrition_plan",
  shoppingList: "championik_ai_nutrition_shopping_list",
} as const;

const DEFAULT_PROFILE: ChildProfile = {
  age: 5,
  weight: 22,
  height: 116,
  activity: "MEDIUM",
};

const GOALS: Array<{ id: NutritionGoal; label: string; description: string }> = [
  {
    id: "BALANCE",
    label: "Баланс",
    description: "Спокойный базовый рацион на каждый день.",
  },
  {
    id: "ENERGY",
    label: "Энергия",
    description: "Чуть плотнее в дни с активностью и тренировками.",
  },
  {
    id: "RECOVERY",
    label: "Восстановление",
    description: "Акцент на белок, воду и мягкий режим после нагрузки.",
  },
];

const PREFERENCES: Array<{
  id: NutritionPreference;
  label: string;
  description: string;
}> = [
  { id: "POULTRY", label: "Птица", description: "Курица и индейка" },
  { id: "FISH", label: "Рыба", description: "Рыбные блюда" },
  { id: "MEAT", label: "Мясо", description: "Говядина и мясные блюда" },
  { id: "VEGETARIAN", label: "Без мяса", description: "Растительные блюда" },
  { id: "NO_LACTOSE", label: "Без лактозы", description: "Подбор без молочных продуктов" },
];

const ACTIVITY_LEVELS: Array<{
  id: ActivityLevel;
  label: string;
  description: string;
}> = [
  { id: "LOW", label: "Низкая", description: "Спокойный день без большой активности" },
  { id: "MEDIUM", label: "Средняя", description: "Обычный день ребенка 3-7 лет" },
  { id: "HIGH", label: "Высокая", description: "Активный день с тренировкой и прогулками" },
];

function readStoredJson<T>(key: string, fallback: T) {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatDateLabel(dateString: string) {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

function calculateBmr(profile: ChildProfile) {
  return Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5);
}

function calculateDailyTarget(profile: ChildProfile) {
  const factor =
    profile.activity === "LOW" ? 1.35 : profile.activity === "HIGH" ? 1.65 : 1.5;
  return Math.round(calculateBmr(profile) * factor);
}

function getInsightToneClasses(status: Insight["status"]) {
  if (status === "UNDER") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }

  if (status === "OVER") {
    return "border-purple-200 bg-purple-50 text-purple-900";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-900";
}

export function AINutritionist() {
  const [profile, setProfile] = useState<ChildProfile>(() =>
    readStoredJson<ChildProfile>(STORAGE_KEYS.profile, DEFAULT_PROFILE),
  );
  const [entries, setEntries] = useState<NutritionEntry[]>(() =>
    readStoredJson<NutritionEntry[]>(STORAGE_KEYS.entries, []),
  );
  const [mealText, setMealText] = useState("");
  const [isAnalyzingMeal, setIsAnalyzingMeal] = useState(false);
  const [mealNotice, setMealNotice] = useState<string | null>(null);
  const [mealError, setMealError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"dashboard" | "plan" | "journal">("dashboard");
  const [goal, setGoal] = useState<NutritionGoal>("BALANCE");
  const [mealsCount, setMealsCount] = useState(4);
  const [preferences, setPreferences] = useState<NutritionPreference[]>([
    "POULTRY",
    "FISH",
  ]);
  const [planData, setPlanData] = useState<DayPlan[]>(() =>
    readStoredJson<DayPlan[]>(STORAGE_KEYS.plan, []),
  );
  const [shoppingList, setShoppingList] = useState<ShoppingCategory[]>(() =>
    readStoredJson<ShoppingCategory[]>(STORAGE_KEYS.shoppingList, []),
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [planView, setPlanView] = useState<"menu" | "list">("menu");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planNotice, setPlanNotice] = useState<string | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);

  const [insight, setInsight] = useState<Insight | null>(null);
  const [isRefreshingInsight, setIsRefreshingInsight] = useState(false);
  const [insightNotice, setInsightNotice] = useState<string | null>(null);
  const [insightError, setInsightError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.plan, JSON.stringify(planData));
  }, [planData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.shoppingList, JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    if (selectedDayIndex > Math.max(planData.length - 1, 0)) {
      setSelectedDayIndex(0);
    }
  }, [planData.length, selectedDayIndex]);

  const todayKey = new Date().toISOString().slice(0, 10);

  const dailyTarget = useMemo(() => calculateDailyTarget(profile), [profile]);
  const bmr = useMemo(() => calculateBmr(profile), [profile]);

  const todayEntries = useMemo(
    () => entries.filter((entry) => entry.date.startsWith(todayKey)),
    [entries, todayKey],
  );

  const todayIntake = useMemo(
    () => todayEntries.reduce((sum, entry) => sum + entry.calories, 0),
    [todayEntries],
  );

  const todayMacros = useMemo(
    () =>
      todayEntries.reduce(
        (sum, entry) => ({
          p: sum.p + entry.p,
          f: sum.f + entry.f,
          c: sum.c + entry.c,
        }),
        { p: 0, f: 0, c: 0 },
      ),
    [todayEntries],
  );

  const calorieBalance = todayIntake - dailyTarget;

  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      const intake = entries
        .filter((entry) => entry.date.startsWith(key))
        .reduce((sum, entry) => sum + entry.calories, 0);

      return {
        key,
        label: date.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "short",
        }),
        intake,
        target: dailyTarget,
      };
    });
  }, [dailyTarget, entries]);

  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (leftEntry, rightEntry) =>
          new Date(rightEntry.date).getTime() - new Date(leftEntry.date).getTime(),
      ),
    [entries],
  );

  const currentDayPlan = planData[selectedDayIndex];

  const refreshInsight = async (silent = false) => {
    if (!silent) {
      setInsightError(null);
    }

    setIsRefreshingInsight(true);

    try {
      const response = await fetch("/api/nutrition/insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile,
          entries,
        }),
      });

      const payload = (await response.json()) as {
        insight?: Insight;
        warning?: string;
        source?: "gemini" | "fallback";
        error?: string;
      };

      if (!response.ok || !payload.insight) {
        throw new Error(payload.error || "Не удалось получить совет нутрициолога.");
      }

      setInsight(payload.insight);
      setInsightNotice(payload.source === "fallback" ? payload.warning || null : null);
    } catch (error) {
      if (!silent) {
        setInsightError(
          error instanceof Error ? error.message : "Не удалось получить совет нутрициолога.",
        );
      }
    } finally {
      setIsRefreshingInsight(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshInsight(true);
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [
    profile.age,
    profile.height,
    profile.weight,
    profile.activity,
    entries,
  ]);

  const handleAnalyzeMeal = async () => {
    if (!mealText.trim()) {
      setMealError("Сначала опишите, что ребенок ел или будет есть.");
      return;
    }

    setMealError(null);
    setMealNotice(null);
    setIsAnalyzingMeal(true);

    try {
      const response = await fetch("/api/nutrition/analyze-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mealText,
        }),
      });

      const payload = (await response.json()) as {
        entry?: NutritionEntry;
        warning?: string;
        source?: "gemini" | "fallback";
        error?: string;
      };

      if (!response.ok || !payload.entry) {
        throw new Error(payload.error || "Не удалось разобрать блюдо.");
      }

      setEntries((currentEntries) => [payload.entry as NutritionEntry, ...currentEntries]);
      setMealText("");
      setMealNotice(payload.source === "fallback" ? payload.warning || null : null);
      setActiveTab("journal");
    } catch (error) {
      setMealError(error instanceof Error ? error.message : "Не удалось разобрать блюдо.");
    } finally {
      setIsAnalyzingMeal(false);
    }
  };

  const handleGeneratePlan = async () => {
    setPlanError(null);
    setPlanNotice(null);
    setIsGeneratingPlan(true);

    try {
      const response = await fetch("/api/nutrition/meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile,
          goal,
          mealsCount,
          preferences,
        }),
      });

      const payload = (await response.json()) as {
        dailyPlans?: DayPlan[];
        shoppingList?: ShoppingCategory[];
        warning?: string;
        source?: "gemini" | "fallback";
        error?: string;
      };

      if (!response.ok || !payload.dailyPlans || !payload.shoppingList) {
        throw new Error(payload.error || "Не удалось подготовить недельный рацион.");
      }

      setPlanData(payload.dailyPlans);
      setShoppingList(payload.shoppingList);
      setSelectedDayIndex(0);
      setPlanNotice(payload.source === "fallback" ? payload.warning || null : null);
      setPlanView("menu");
      setActiveTab("plan");
    } catch (error) {
      setPlanError(
        error instanceof Error ? error.message : "Не удалось подготовить недельный рацион.",
      );
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleTogglePreference = (preferenceId: NutritionPreference) => {
    setPreferences((currentPreferences) =>
      currentPreferences.includes(preferenceId)
        ? currentPreferences.filter((item) => item !== preferenceId)
        : [...currentPreferences, preferenceId],
    );
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries((currentEntries) => currentEntries.filter((entry) => entry.id !== entryId));
  };

  const handleClearJournal = () => {
    setEntries([]);
  };

  const toggleShoppingItem = (categoryIndex: number, itemIndex: number) => {
    setShoppingList((currentList) =>
      currentList.map((category, currentCategoryIndex) => {
        if (currentCategoryIndex !== categoryIndex) {
          return category;
        }

        return {
          ...category,
          items: category.items.map((item, currentItemIndex) =>
            currentItemIndex === itemIndex
              ? { ...item, checked: !item.checked }
              : item,
          ),
        };
      }),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-orange-500 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-12 right-0 h-72 w-72 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-orange-300 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-14 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад на главную
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                AI-инструмент для родителей
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                AI нутрициолог для юного спортсмена
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-purple-100">
                Функция вдохновлена модулем AI-нутрициолога из HeroAcademy, но
                адаптирована под сайт «Чемпион и К»: быстрый разбор блюда,
                недельный рацион, список покупок и спокойные рекомендации без
                лишней сложности.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/12 p-5 backdrop-blur-sm border border-white/15">
                <div className="text-sm uppercase tracking-[0.2em] text-white/70">BMR</div>
                <div className="mt-3 text-3xl font-black">{bmr}</div>
                <div className="text-sm text-white/75">базовый расход</div>
              </div>
              <div className="rounded-3xl bg-white/12 p-5 backdrop-blur-sm border border-white/15">
                <div className="text-sm uppercase tracking-[0.2em] text-white/70">Цель</div>
                <div className="mt-3 text-3xl font-black">{dailyTarget}</div>
                <div className="text-sm text-white/75">ккал в день</div>
              </div>
              <div className="rounded-3xl bg-white/12 p-5 backdrop-blur-sm border border-white/15">
                <div className="text-sm uppercase tracking-[0.2em] text-white/70">Сегодня</div>
                <div className="mt-3 text-3xl font-black">{todayIntake}</div>
                <div className="text-sm text-white/75">ккал учтено</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="space-y-6">
              <div className="rounded-[2rem] bg-white p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Профиль ребенка</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Эти параметры используются для советов по рациону и генерации меню.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                      Возраст
                    </span>
                    <input
                      type="number"
                      min={3}
                      max={12}
                      value={profile.age}
                      onChange={(event) =>
                        setProfile((currentProfile) => ({
                          ...currentProfile,
                          age: Math.max(3, Number(event.target.value || 3)),
                        }))
                      }
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-900 outline-none transition focus:border-purple-500"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                      Вес
                    </span>
                    <input
                      type="number"
                      min={12}
                      max={60}
                      value={profile.weight}
                      onChange={(event) =>
                        setProfile((currentProfile) => ({
                          ...currentProfile,
                          weight: Math.max(12, Number(event.target.value || 12)),
                        }))
                      }
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-900 outline-none transition focus:border-purple-500"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                      Рост
                    </span>
                    <input
                      type="number"
                      min={90}
                      max={170}
                      value={profile.height}
                      onChange={(event) =>
                        setProfile((currentProfile) => ({
                          ...currentProfile,
                          height: Math.max(90, Number(event.target.value || 90)),
                        }))
                      }
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-900 outline-none transition focus:border-purple-500"
                    />
                  </label>
                </div>

                <div className="mt-6 space-y-2">
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Активность
                  </span>
                  {ACTIVITY_LEVELS.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() =>
                        setProfile((currentProfile) => ({
                          ...currentProfile,
                          activity: activity.id,
                        }))
                      }
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        profile.activity === activity.id
                          ? "border-purple-500 bg-purple-50 text-purple-900"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300"
                      }`}
                    >
                      <div className="font-semibold">{activity.label}</div>
                      <div className="text-sm text-gray-500">{activity.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-orange-500 text-white">
                    <UtensilsCrossed className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Разбор блюда</h2>
                    <p className="text-sm text-gray-500">Добавляет прием пищи в журнал</p>
                  </div>
                </div>

                <textarea
                  value={mealText}
                  onChange={(event) => setMealText(event.target.value)}
                  placeholder="Например: овсяная каша с бананом и йогуртом"
                  className="mt-5 h-32 w-full rounded-[1.5rem] border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-900 outline-none transition focus:border-purple-500"
                />

                <button
                  onClick={handleAnalyzeMeal}
                  disabled={isAnalyzingMeal}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-4 font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAnalyzingMeal ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Анализируем блюдо...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Добавить в журнал через AI
                    </>
                  )}
                </button>

                {mealError ? (
                  <p className="mt-3 text-sm text-red-500">{mealError}</p>
                ) : null}
                {mealNotice ? (
                  <p className="mt-3 text-sm text-amber-600">{mealNotice}</p>
                ) : null}
              </div>

              <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
                <div className="font-semibold uppercase tracking-[0.16em] text-amber-700">
                  Важно
                </div>
                <p className="mt-3 leading-relaxed">
                  Этот инструмент помогает быстро сориентироваться по рациону,
                  но не заменяет консультацию педиатра или очного детского
                  нутрициолога, особенно при аллергиях, заболеваниях ЖКТ и
                  особенностях развития.
                </p>
              </div>
            </aside>

            <main className="space-y-6">
              <div className="rounded-[2rem] bg-white p-3 shadow-lg border border-gray-100">
                <div className="grid gap-3 md:grid-cols-3">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`rounded-[1.25rem] px-5 py-4 text-left transition ${
                      activeTab === "dashboard"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-50 text-gray-700 hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <BarChart3 className="h-5 w-5" />
                      Дашборд
                    </div>
                    <div className="mt-2 text-sm opacity-80">
                      Баланс калорий и совет на сегодня
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("plan")}
                    className={`rounded-[1.25rem] px-5 py-4 text-left transition ${
                      activeTab === "plan"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-50 text-gray-700 hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Sparkles className="h-5 w-5" />
                      Рацион
                    </div>
                    <div className="mt-2 text-sm opacity-80">
                      Недельный план питания и список покупок
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("journal")}
                    className={`rounded-[1.25rem] px-5 py-4 text-left transition ${
                      activeTab === "journal"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-50 text-gray-700 hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <ClipboardList className="h-5 w-5" />
                      Журнал
                    </div>
                    <div className="mt-2 text-sm opacity-80">
                      Все добавленные блюда и БЖУ
                    </div>
                  </button>
                </div>
              </div>

              {activeTab === "dashboard" ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-[2rem] bg-white p-6 shadow-lg border border-gray-100">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Сегодня съедено
                      </div>
                      <div className="mt-4 text-4xl font-black text-gray-900">
                        {todayIntake}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">ккал по журналу</div>
                    </div>

                    <div className="rounded-[2rem] bg-white p-6 shadow-lg border border-gray-100">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Рекомендация
                      </div>
                      <div className="mt-4 text-4xl font-black text-purple-700">
                        {dailyTarget}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">ккал на день</div>
                    </div>

                    <div className="rounded-[2rem] bg-white p-6 shadow-lg border border-gray-100">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Баланс
                      </div>
                      <div
                        className={`mt-4 text-4xl font-black ${
                          calorieBalance > 180
                            ? "text-orange-500"
                            : calorieBalance < -180
                              ? "text-blue-600"
                              : "text-emerald-600"
                        }`}
                      >
                        {calorieBalance > 0 ? "+" : ""}
                        {calorieBalance}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">ккал к цели</div>
                    </div>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="rounded-[2rem] bg-white p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Динамика за 7 дней
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Сравнение фактического рациона с текущей целевой нормой
                          </p>
                        </div>
                        <button
                          onClick={() => void refreshInsight(false)}
                          disabled={isRefreshingInsight}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-purple-300 hover:text-purple-700 disabled:opacity-60"
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${
                              isRefreshingInsight ? "animate-spin" : ""
                            }`}
                          />
                          Обновить совет
                        </button>
                      </div>

                      <div className="mt-6 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 8, right: 0, left: -24 }}>
                            <XAxis
                              dataKey="label"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fontSize: 11, fill: "#6b7280" }}
                            />
                            <Tooltip
                              formatter={(value: number) => [`${value} ккал`, "Рацион"]}
                              labelFormatter={(label) => `Дата: ${label}`}
                              contentStyle={{
                                borderRadius: 18,
                                border: "1px solid #f3f4f6",
                                boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
                              }}
                            />
                            <ReferenceLine
                              y={dailyTarget}
                              stroke="#fb923c"
                              strokeDasharray="5 5"
                            />
                            <Bar dataKey="intake" fill="#7c3aed" radius={[10, 10, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div
                        className={`rounded-[2rem] border p-6 ${getInsightToneClasses(
                          insight?.status || "GOOD",
                        )}`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.16em]">
                              Совет AI нутрициолога
                            </div>
                            <p className="mt-3 text-sm leading-relaxed">
                              {insight?.text ||
                                "После первого приема пищи или обновления профиля здесь появится короткая рекомендация."}
                            </p>
                          </div>
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/70">
                            <Sparkles className="h-6 w-6" />
                          </div>
                        </div>
                      </div>

                      {insightError ? (
                        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                          {insightError}
                        </div>
                      ) : null}

                      {insightNotice ? (
                        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
                          {insightNotice}
                        </div>
                      ) : null}

                      <div className="rounded-[2rem] bg-white p-6 shadow-lg border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Сегодня по БЖУ</h3>
                        <div className="mt-5 space-y-4">
                          <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-500">Белки</span>
                              <span className="font-semibold text-gray-900">
                                {todayMacros.p} г
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-blue-100">
                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{ width: `${Math.min(todayMacros.p * 2, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-500">Жиры</span>
                              <span className="font-semibold text-gray-900">
                                {todayMacros.f} г
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-orange-100">
                              <div
                                className="h-full rounded-full bg-orange-400"
                                style={{ width: `${Math.min(todayMacros.f * 2, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-500">Углеводы</span>
                              <span className="font-semibold text-gray-900">
                                {todayMacros.c} г
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-emerald-100">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${Math.min(todayMacros.c / 2, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "plan" ? (
                <div className="space-y-6">
                  <div className="rounded-[2rem] bg-white p-6 shadow-lg border border-gray-100">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                      <div className="max-w-2xl">
                        <h3 className="text-xl font-bold text-gray-900">
                          Недельный рацион
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                          Этот блок повторяет ключевую логику AI нутрициолога из
                          HeroAcademy: цель рациона, предпочтения, количество
                          приемов пищи и генерация меню вместе со списком покупок.
                        </p>
                      </div>

                      <button
                        onClick={handleGeneratePlan}
                        disabled={isGeneratingPlan}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-4 font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isGeneratingPlan ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            Генерируем рацион...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" />
                            Сгенерировать рацион
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      <div>
                        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                          Цель
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                          {GOALS.map((goalItem) => (
                            <button
                              key={goalItem.id}
                              onClick={() => setGoal(goalItem.id)}
                              className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                                goal === goalItem.id
                                  ? "border-purple-500 bg-purple-50 text-purple-900"
                                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300"
                              }`}
                            >
                              <div className="font-semibold">{goalItem.label}</div>
                              <div className="mt-1 text-sm text-gray-500">
                                {goalItem.description}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                            Приемов пищи
                          </span>
                          <span className="text-sm font-semibold text-gray-700">
                            {mealsCount}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={3}
                          max={5}
                          step={1}
                          value={mealsCount}
                          onChange={(event) => setMealsCount(Number(event.target.value))}
                          className="w-full accent-purple-600"
                        />
                        <div className="mt-2 flex justify-between text-xs text-gray-500">
                          <span>3 приема</span>
                          <span>4 приема</span>
                          <span>5 приемов</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Предпочтения
                      </div>
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        {PREFERENCES.map((preference) => (
                          <button
                            key={preference.id}
                            onClick={() => handleTogglePreference(preference.id)}
                            className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                              preferences.includes(preference.id)
                                ? "border-purple-500 bg-purple-50 text-purple-900"
                                : "border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300"
                            }`}
                          >
                            <div className="font-semibold">{preference.label}</div>
                            <div className="mt-1 text-sm text-gray-500">
                              {preference.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {planError ? (
                      <p className="mt-4 text-sm text-red-500">{planError}</p>
                    ) : null}
                    {planNotice ? (
                      <p className="mt-4 text-sm text-amber-600">{planNotice}</p>
                    ) : null}
                  </div>

                  {planData.length > 0 ? (
                    <div className="rounded-[2rem] bg-white p-6 shadow-lg border border-gray-100">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {planData.map((dayPlan, index) => (
                            <button
                              key={dayPlan.day}
                              onClick={() => setSelectedDayIndex(index)}
                              className={`min-w-[96px] rounded-2xl border px-4 py-3 text-center transition ${
                                selectedDayIndex === index
                                  ? "border-purple-500 bg-purple-50 text-purple-900"
                                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300"
                              }`}
                            >
                              <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                День
                              </div>
                              <div className="mt-1 text-lg font-black">{dayPlan.day}</div>
                            </button>
                          ))}
                        </div>

                        <div className="flex rounded-2xl bg-gray-100 p-1">
                          <button
                            onClick={() => setPlanView("menu")}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                              planView === "menu"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500"
                            }`}
                          >
                            Меню
                          </button>
                          <button
                            onClick={() => setPlanView("list")}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                              planView === "list"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500"
                            }`}
                          >
                            Покупки
                          </button>
                        </div>
                      </div>

                      {planView === "menu" && currentDayPlan ? (
                        <div className="mt-6 space-y-4">
                          <div className="grid gap-4 md:grid-cols-4">
                            <div className="rounded-2xl bg-gray-50 p-4">
                              <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                Ккал
                              </div>
                              <div className="mt-2 text-2xl font-black text-gray-900">
                                {currentDayPlan.totalCalories}
                              </div>
                            </div>
                            <div className="rounded-2xl bg-gray-50 p-4">
                              <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                Белки
                              </div>
                              <div className="mt-2 text-2xl font-black text-blue-600">
                                {currentDayPlan.macros.p} г
                              </div>
                            </div>
                            <div className="rounded-2xl bg-gray-50 p-4">
                              <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                Жиры
                              </div>
                              <div className="mt-2 text-2xl font-black text-orange-500">
                                {currentDayPlan.macros.f} г
                              </div>
                            </div>
                            <div className="rounded-2xl bg-gray-50 p-4">
                              <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                Углеводы
                              </div>
                              <div className="mt-2 text-2xl font-black text-emerald-600">
                                {currentDayPlan.macros.c} г
                              </div>
                            </div>
                          </div>

                          {currentDayPlan.meals.map((meal, index) => (
                            <div
                              key={`${meal.time}_${meal.name}_${index}`}
                              className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-5"
                            >
                              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                  <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                    {meal.type} • {meal.time}
                                  </div>
                                  <h4 className="mt-2 text-xl font-bold text-gray-900">
                                    {meal.name}
                                  </h4>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {meal.totalWeight}
                                  </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-4">
                                  <div className="rounded-2xl bg-white px-4 py-3">
                                    <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                      Ккал
                                    </div>
                                    <div className="mt-1 font-bold text-gray-900">
                                      {meal.calories}
                                    </div>
                                  </div>
                                  <div className="rounded-2xl bg-white px-4 py-3">
                                    <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                      Б
                                    </div>
                                    <div className="mt-1 font-bold text-blue-600">
                                      {meal.macros.p}
                                    </div>
                                  </div>
                                  <div className="rounded-2xl bg-white px-4 py-3">
                                    <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                      Ж
                                    </div>
                                    <div className="mt-1 font-bold text-orange-500">
                                      {meal.macros.f}
                                    </div>
                                  </div>
                                  <div className="rounded-2xl bg-white px-4 py-3">
                                    <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                      У
                                    </div>
                                    <div className="mt-1 font-bold text-emerald-600">
                                      {meal.macros.c}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-5">
                                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                                  Состав
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {meal.ingredients.map((ingredient) => (
                                    <span
                                      key={`${meal.name}_${ingredient.name}`}
                                      className="rounded-full bg-white px-3 py-2 text-sm text-gray-600 shadow-sm border border-gray-100"
                                    >
                                      {ingredient.name} • {ingredient.quantity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {planView === "list" ? (
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                          {shoppingList.map((category, categoryIndex) => (
                            <div
                              key={category.category}
                              className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-5"
                            >
                              <h4 className="text-lg font-bold text-gray-900">
                                {category.category}
                              </h4>
                              <div className="mt-4 space-y-3">
                                {category.items.map((item, itemIndex) => (
                                  <label
                                    key={`${category.category}_${item.name}`}
                                    className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={Boolean(item.checked)}
                                      onChange={() =>
                                        toggleShoppingItem(categoryIndex, itemIndex)
                                      }
                                      className="mt-1 h-4 w-4 rounded border-gray-300 accent-purple-600"
                                    />
                                    <span className="flex-1">
                                      <span className="block font-medium text-gray-900">
                                        {item.name}
                                      </span>
                                      <span className="block text-sm text-gray-500">
                                        {item.quantity}
                                      </span>
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {activeTab === "journal" ? (
                <div className="rounded-[2rem] bg-white p-6 shadow-lg border border-gray-100">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Журнал питания
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Здесь сохраняются все блюда, добавленные через AI-разбор.
                      </p>
                    </div>

                    {entries.length > 0 ? (
                      <button
                        onClick={handleClearJournal}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                        Очистить журнал
                      </button>
                    ) : null}
                  </div>

                  {sortedEntries.length === 0 ? (
                    <div className="mt-8 rounded-[1.75rem] border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                        <ClipboardList className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="mt-5 text-lg font-bold text-gray-900">
                        Журнал пока пуст
                      </h4>
                      <p className="mt-2 text-sm text-gray-500">
                        Опишите любое блюдо слева, и AI добавит его в журнал с
                        примерной калорийностью и БЖУ.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-8 space-y-4">
                      {sortedEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-5"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                {formatDateLabel(entry.date)} •{" "}
                                {new Date(entry.date).toLocaleTimeString("ru-RU", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <h4 className="mt-2 text-lg font-bold text-gray-900">
                                {entry.name}
                              </h4>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                                <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                  Ккал
                                </div>
                                <div className="mt-1 font-bold text-gray-900">
                                  {entry.calories}
                                </div>
                              </div>
                              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                                <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                  Б
                                </div>
                                <div className="mt-1 font-bold text-blue-600">
                                  {entry.p}
                                </div>
                              </div>
                              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                                <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                  Ж
                                </div>
                                <div className="mt-1 font-bold text-orange-500">
                                  {entry.f}
                                </div>
                              </div>
                              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                                <div className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                  У
                                </div>
                                <div className="mt-1 font-bold text-emerald-600">
                                  {entry.c}
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-500 transition hover:border-red-200 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                                Удалить
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
