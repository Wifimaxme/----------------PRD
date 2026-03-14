import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect, Plugin } from "vite";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const MAX_BODY_SIZE_BYTES = 120_000;

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

interface Ingredient {
  name: string;
  quantity: string;
}

interface Meal {
  type: string;
  time: string;
  name: string;
  totalWeight: string;
  calories: number;
  macros: { p: number; f: number; c: number };
  ingredients: Ingredient[];
}

interface DayPlan {
  day: number;
  meals: Meal[];
  totalCalories: number;
  macros: { p: number; f: number; c: number };
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

interface MealAnalysisRequestBody {
  mealText?: string;
}

interface MealPlanRequestBody {
  profile?: Partial<ChildProfile>;
  goal?: NutritionGoal;
  mealsCount?: number;
  preferences?: NutritionPreference[];
}

interface NutritionInsightRequestBody {
  profile?: Partial<ChildProfile>;
  entries?: Partial<NutritionEntry>[];
}

interface MealAnalysisResponse {
  entry: NutritionEntry;
  source: "gemini" | "fallback";
  warning?: string;
}

interface MealPlanResponse {
  dailyPlans: DayPlan[];
  shoppingList: ShoppingCategory[];
  source: "gemini" | "fallback";
  warning?: string;
}

interface NutritionInsightResponse {
  insight: {
    text: string;
    status: "GOOD" | "UNDER" | "OVER";
  };
  source: "gemini" | "fallback";
  warning?: string;
}

interface MealTemplate {
  name: string;
  totalWeight: string;
  calories: number;
  macros: { p: number; f: number; c: number };
  ingredients: Ingredient[];
  tags: NutritionPreference[];
}

const DEFAULT_PROFILE: ChildProfile = {
  age: 5,
  weight: 22,
  height: 116,
  activity: "MEDIUM",
};

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  LOW: 1.35,
  MEDIUM: 1.5,
  HIGH: 1.65,
};

const GOAL_CALORIE_SHIFT: Record<NutritionGoal, number> = {
  BALANCE: 0,
  ENERGY: 120,
  RECOVERY: 80,
};

const BREAKFASTS: MealTemplate[] = [
  {
    name: "Овсяная каша с бананом и ягодами",
    totalWeight: "260 г",
    calories: 320,
    macros: { p: 10, f: 7, c: 54 },
    ingredients: [
      { name: "Овсяные хлопья", quantity: "45 г" },
      { name: "Растительное молоко", quantity: "180 мл" },
      { name: "Банан", quantity: "1 шт" },
      { name: "Ягоды", quantity: "60 г" },
    ],
    tags: ["NO_LACTOSE"],
  },
  {
    name: "Омлет с овощами и тостом",
    totalWeight: "240 г",
    calories: 305,
    macros: { p: 18, f: 15, c: 22 },
    ingredients: [
      { name: "Яйца", quantity: "2 шт" },
      { name: "Помидоры", quantity: "80 г" },
      { name: "Огурцы", quantity: "80 г" },
      { name: "Цельнозерновой хлеб", quantity: "2 ломт." },
    ],
    tags: ["MEAT", "POULTRY", "FISH", "NO_LACTOSE"],
  },
  {
    name: "Рисовая каша с яблоком",
    totalWeight: "250 г",
    calories: 295,
    macros: { p: 7, f: 5, c: 56 },
    ingredients: [
      { name: "Рис", quantity: "50 г" },
      { name: "Растительное молоко", quantity: "200 мл" },
      { name: "Яблоко", quantity: "1 шт" },
      { name: "Корица", quantity: "2 г" },
    ],
    tags: ["VEGETARIAN", "NO_LACTOSE"],
  },
  {
    name: "Творожная запеканка с грушей",
    totalWeight: "230 г",
    calories: 315,
    macros: { p: 21, f: 9, c: 34 },
    ingredients: [
      { name: "Творог", quantity: "140 г" },
      { name: "Яйцо", quantity: "1 шт" },
      { name: "Груша", quantity: "1 шт" },
      { name: "Овсяная мука", quantity: "20 г" },
    ],
    tags: ["MEAT", "POULTRY", "FISH"],
  },
];

const SNACKS: MealTemplate[] = [
  {
    name: "Йогурт с ягодами",
    totalWeight: "170 г",
    calories: 150,
    macros: { p: 8, f: 4, c: 18 },
    ingredients: [
      { name: "Йогурт", quantity: "120 г" },
      { name: "Ягоды", quantity: "50 г" },
    ],
    tags: ["MEAT", "POULTRY", "FISH"],
  },
  {
    name: "Яблоко и горсть орехов",
    totalWeight: "150 г",
    calories: 180,
    macros: { p: 4, f: 10, c: 18 },
    ingredients: [
      { name: "Яблоко", quantity: "1 шт" },
      { name: "Орехи", quantity: "20 г" },
    ],
    tags: ["MEAT", "POULTRY", "FISH", "VEGETARIAN", "NO_LACTOSE"],
  },
  {
    name: "Смузи банан-клубника",
    totalWeight: "220 мл",
    calories: 165,
    macros: { p: 5, f: 4, c: 29 },
    ingredients: [
      { name: "Банан", quantity: "1 шт" },
      { name: "Клубника", quantity: "80 г" },
      { name: "Растительный йогурт", quantity: "120 г" },
    ],
    tags: ["VEGETARIAN", "NO_LACTOSE"],
  },
  {
    name: "Хумус с овощными палочками",
    totalWeight: "180 г",
    calories: 170,
    macros: { p: 6, f: 8, c: 18 },
    ingredients: [
      { name: "Хумус", quantity: "70 г" },
      { name: "Морковь", quantity: "70 г" },
      { name: "Огурцы", quantity: "70 г" },
    ],
    tags: ["VEGETARIAN", "NO_LACTOSE"],
  },
];

const LUNCHES: MealTemplate[] = [
  {
    name: "Куриный суп с овощами",
    totalWeight: "320 г",
    calories: 360,
    macros: { p: 24, f: 11, c: 34 },
    ingredients: [
      { name: "Куриное филе", quantity: "120 г" },
      { name: "Картофель", quantity: "120 г" },
      { name: "Морковь", quantity: "60 г" },
      { name: "Лук", quantity: "30 г" },
    ],
    tags: ["POULTRY", "NO_LACTOSE"],
  },
  {
    name: "Индейка с гречкой и огурцом",
    totalWeight: "330 г",
    calories: 410,
    macros: { p: 28, f: 12, c: 45 },
    ingredients: [
      { name: "Филе индейки", quantity: "130 г" },
      { name: "Гречка", quantity: "60 г" },
      { name: "Огурцы", quantity: "100 г" },
      { name: "Оливковое масло", quantity: "8 г" },
    ],
    tags: ["POULTRY", "NO_LACTOSE"],
  },
  {
    name: "Рыбные тефтели с картофельным пюре",
    totalWeight: "320 г",
    calories: 390,
    macros: { p: 26, f: 12, c: 40 },
    ingredients: [
      { name: "Филе белой рыбы", quantity: "140 г" },
      { name: "Картофель", quantity: "160 г" },
      { name: "Морковь", quantity: "60 г" },
      { name: "Оливковое масло", quantity: "8 г" },
    ],
    tags: ["FISH", "NO_LACTOSE"],
  },
  {
    name: "Чечевичный суп и цельнозерновой хлеб",
    totalWeight: "320 г",
    calories: 350,
    macros: { p: 17, f: 8, c: 49 },
    ingredients: [
      { name: "Чечевица", quantity: "70 г" },
      { name: "Морковь", quantity: "60 г" },
      { name: "Помидоры", quantity: "100 г" },
      { name: "Цельнозерновой хлеб", quantity: "2 ломт." },
    ],
    tags: ["VEGETARIAN", "NO_LACTOSE"],
  },
];

const DINNERS: MealTemplate[] = [
  {
    name: "Паста с курицей и брокколи",
    totalWeight: "300 г",
    calories: 380,
    macros: { p: 25, f: 11, c: 43 },
    ingredients: [
      { name: "Паста цельнозерновая", quantity: "65 г" },
      { name: "Куриное филе", quantity: "110 г" },
      { name: "Брокколи", quantity: "120 г" },
      { name: "Оливковое масло", quantity: "8 г" },
    ],
    tags: ["POULTRY", "NO_LACTOSE"],
  },
  {
    name: "Рыба с рисом и овощами",
    totalWeight: "290 г",
    calories: 360,
    macros: { p: 24, f: 10, c: 40 },
    ingredients: [
      { name: "Филе лосося", quantity: "110 г" },
      { name: "Рис", quantity: "55 г" },
      { name: "Овощная смесь", quantity: "120 г" },
      { name: "Оливковое масло", quantity: "8 г" },
    ],
    tags: ["FISH", "NO_LACTOSE"],
  },
  {
    name: "Овощное рагу с фасолью",
    totalWeight: "310 г",
    calories: 340,
    macros: { p: 16, f: 9, c: 48 },
    ingredients: [
      { name: "Фасоль", quantity: "90 г" },
      { name: "Кабачки", quantity: "120 г" },
      { name: "Помидоры", quantity: "100 г" },
      { name: "Болгарский перец", quantity: "80 г" },
    ],
    tags: ["VEGETARIAN", "NO_LACTOSE"],
  },
  {
    name: "Тефтели из индейки с булгуром",
    totalWeight: "300 г",
    calories: 375,
    macros: { p: 27, f: 12, c: 38 },
    ingredients: [
      { name: "Филе индейки", quantity: "120 г" },
      { name: "Булгур", quantity: "55 г" },
      { name: "Огурцы", quantity: "100 г" },
      { name: "Помидоры", quantity: "100 г" },
    ],
    tags: ["POULTRY", "NO_LACTOSE"],
  },
];

function readRequestBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let body = "";
    let size = 0;

    req.on("data", (chunk: Buffer | string) => {
      const chunkString = typeof chunk === "string" ? chunk : chunk.toString("utf8");
      size += Buffer.byteLength(chunkString);

      if (size > MAX_BODY_SIZE_BYTES) {
        reject(new Error("Request body is too large."));
        req.destroy();
        return;
      }

      body += chunkString;
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function sanitizeNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function sanitizeProfile(rawProfile?: Partial<ChildProfile>): ChildProfile {
  const profile = rawProfile || {};

  const activity =
    profile.activity === "LOW" || profile.activity === "MEDIUM" || profile.activity === "HIGH"
      ? profile.activity
      : DEFAULT_PROFILE.activity;

  return {
    age: clamp(Math.round(sanitizeNumber(profile.age, DEFAULT_PROFILE.age)), 3, 12),
    weight: clamp(Math.round(sanitizeNumber(profile.weight, DEFAULT_PROFILE.weight)), 12, 60),
    height: clamp(Math.round(sanitizeNumber(profile.height, DEFAULT_PROFILE.height)), 90, 170),
    activity,
  };
}

function sanitizeEntries(rawEntries?: Partial<NutritionEntry>[]) {
  const entries = Array.isArray(rawEntries) ? rawEntries : [];

  return entries
    .map((entry) => ({
      id: String(entry.id || `entry_${Date.now()}`),
      date: String(entry.date || new Date().toISOString()),
      name: String(entry.name || "Прием пищи"),
      calories: clamp(Math.round(sanitizeNumber(entry.calories, 0)), 0, 2500),
      p: clamp(Math.round(sanitizeNumber(entry.p, 0)), 0, 200),
      f: clamp(Math.round(sanitizeNumber(entry.f, 0)), 0, 200),
      c: clamp(Math.round(sanitizeNumber(entry.c, 0)), 0, 300),
      type: "INTAKE" as const,
    }))
    .filter((entry) => entry.calories > 0);
}

function sanitizeMealText(rawMealText?: string) {
  return String(rawMealText || "").trim().slice(0, 300);
}

function sanitizeGoal(rawGoal?: string): NutritionGoal {
  return rawGoal === "ENERGY" || rawGoal === "RECOVERY" ? rawGoal : "BALANCE";
}

function sanitizeMealsCount(rawMealsCount?: number) {
  return clamp(Math.round(sanitizeNumber(rawMealsCount, 4)), 3, 5);
}

function sanitizePreferences(rawPreferences?: NutritionPreference[]) {
  const preferences = Array.isArray(rawPreferences) ? rawPreferences : [];
  const allowed: NutritionPreference[] = [
    "MEAT",
    "POULTRY",
    "FISH",
    "VEGETARIAN",
    "NO_LACTOSE",
  ];

  const unique = preferences.filter((item): item is NutritionPreference =>
    allowed.includes(item),
  );

  return unique.length > 0 ? Array.from(new Set(unique)) : ["POULTRY", "FISH"];
}

function calculateBmr(profile: ChildProfile) {
  return Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5);
}

function calculateDailyTarget(profile: ChildProfile, goal: NutritionGoal = "BALANCE") {
  const bmr = calculateBmr(profile);
  const target = Math.round(bmr * ACTIVITY_FACTORS[profile.activity] + GOAL_CALORIE_SHIFT[goal]);
  return clamp(target, 1100, 2600);
}

async function requestGeminiContent(apiKey: string, prompt: string, responseMimeType?: string) {
  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: "Ты детский спортивный нутрициолог. Пишешь безопасно, конкретно и только по заданному формату.",
          },
        ],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.5,
        topP: 0.9,
        maxOutputTokens: 2200,
        ...(responseMimeType ? { responseMimeType } : {}),
      },
    }),
  });

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
    error?: {
      message?: string;
    };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message || "Gemini request failed.");
  }

  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}

function parseJsonText<T>(text: string): T {
  return JSON.parse(text.replace(/```json|```/g, "").trim()) as T;
}

function buildMealEntry(name: string, calories: number, p: number, f: number, c: number): NutritionEntry {
  return {
    id: `nutrition_${Date.now()}`,
    date: new Date().toISOString(),
    name,
    calories,
    p,
    f,
    c,
    type: "INTAKE",
  };
}

function buildFallbackMealAnalysis(mealText: string) {
  const lowerCaseText = mealText.toLowerCase();
  const library = [
    { keywords: ["овсян", "каша"], name: "Овсяная каша", calories: 220, p: 7, f: 5, c: 36 },
    { keywords: ["банан"], name: "Банан", calories: 90, p: 1, f: 0, c: 21 },
    { keywords: ["йогур"], name: "Йогурт", calories: 110, p: 7, f: 4, c: 10 },
    { keywords: ["куриц", "курин"], name: "Курица", calories: 160, p: 28, f: 4, c: 0 },
    { keywords: ["индей"], name: "Индейка", calories: 150, p: 27, f: 3, c: 0 },
    { keywords: ["рыб", "лосос", "треск"], name: "Рыба", calories: 150, p: 24, f: 5, c: 0 },
    { keywords: ["рис"], name: "Рис", calories: 160, p: 3, f: 1, c: 35 },
    { keywords: ["греч"], name: "Гречка", calories: 150, p: 5, f: 2, c: 28 },
    { keywords: ["макарон", "паст"], name: "Паста", calories: 180, p: 6, f: 2, c: 34 },
    { keywords: ["суп"], name: "Суп", calories: 180, p: 8, f: 6, c: 22 },
    { keywords: ["твор"], name: "Творог", calories: 140, p: 18, f: 5, c: 4 },
    { keywords: ["яблок"], name: "Яблоко", calories: 75, p: 0, f: 0, c: 19 },
    { keywords: ["омлет", "яйц"], name: "Омлет", calories: 180, p: 13, f: 12, c: 3 },
    { keywords: ["салат", "овощ"], name: "Овощи", calories: 60, p: 2, f: 2, c: 8 },
    { keywords: ["сыр"], name: "Сыр", calories: 110, p: 7, f: 8, c: 1 },
  ];

  const matchedItems = library.filter((item) =>
    item.keywords.some((keyword) => lowerCaseText.includes(keyword)),
  );

  if (matchedItems.length === 0) {
    return buildMealEntry(
      mealText || "Блюдо по описанию",
      320,
      14,
      11,
      38,
    );
  }

  const summary = matchedItems.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      p: acc.p + item.p,
      f: acc.f + item.f,
      c: acc.c + item.c,
    }),
    { calories: 0, p: 0, f: 0, c: 0 },
  );

  return buildMealEntry(
    mealText || matchedItems.map((item) => item.name).join(", "),
    clamp(summary.calories, 120, 850),
    clamp(summary.p, 4, 60),
    clamp(summary.f, 2, 35),
    clamp(summary.c, 8, 100),
  );
}

function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function buildFallbackInsight(profile: ChildProfile, entries: NutritionEntry[]) {
  const today = getTodayDateKey();
  const intake = entries
    .filter((entry) => entry.date.startsWith(today))
    .reduce((sum, entry) => sum + entry.calories, 0);

  const target = calculateDailyTarget(profile);
  const balance = intake - target;

  if (balance < -180) {
    return {
      text: `Сегодня рацион пока легче рекомендуемого уровня. К ужину можно добавить сложные углеводы и источник белка, например кашу с индейкой, рыбой или творожным блюдом.`,
      status: "UNDER" as const,
    };
  }

  if (balance > 180) {
    return {
      text: `Сегодня рацион уже достаточно плотный. Вечером лучше оставить легкий вариант: овощи, суп или кисломолочный продукт по переносимости без тяжелых сладостей.`,
      status: "OVER" as const,
    };
  }

  return {
    text: `Баланс питания сегодня близок к комфортному. Сохраняйте понятный режим, воду в течение дня и спокойный ужин без перегруза.`,
    status: "GOOD" as const,
  };
}

function cloneMealTemplate(template: MealTemplate, type: string, time: string): Meal {
  return {
    type,
    time,
    name: template.name,
    totalWeight: template.totalWeight,
    calories: template.calories,
    macros: { ...template.macros },
    ingredients: template.ingredients.map((ingredient) => ({ ...ingredient })),
  };
}

function chooseTemplatesForPreferences(
  templates: MealTemplate[],
  preferences: NutritionPreference[],
) {
  if (preferences.includes("VEGETARIAN")) {
    const vegetarianTemplates = templates.filter((template) =>
      template.tags.includes("VEGETARIAN"),
    );

    if (vegetarianTemplates.length > 0) {
      return vegetarianTemplates;
    }
  }

  let filteredTemplates = templates;

  if (preferences.includes("NO_LACTOSE")) {
    const lactoseFreeTemplates = filteredTemplates.filter((template) =>
      template.tags.includes("NO_LACTOSE"),
    );

    if (lactoseFreeTemplates.length > 0) {
      filteredTemplates = lactoseFreeTemplates;
    }
  }

  const proteinPreferences = preferences.filter((preference) =>
    preference === "MEAT" || preference === "POULTRY" || preference === "FISH",
  );

  if (proteinPreferences.length === 0) {
    return filteredTemplates;
  }

  const preferredTemplates = filteredTemplates.filter((template) =>
    proteinPreferences.some((preference) => template.tags.includes(preference)),
  );

  return preferredTemplates.length > 0 ? preferredTemplates : filteredTemplates;
}

function buildDayMeals(dayIndex: number, mealsCount: number, preferences: NutritionPreference[]) {
  const breakfasts = chooseTemplatesForPreferences(BREAKFASTS, preferences);
  const snacks = chooseTemplatesForPreferences(SNACKS, preferences);
  const lunches = chooseTemplatesForPreferences(LUNCHES, preferences);
  const dinners = chooseTemplatesForPreferences(DINNERS, preferences);

  const mealSlots =
    mealsCount === 3
      ? [
          ["Завтрак", "08:00", breakfasts[dayIndex % breakfasts.length]],
          ["Обед", "13:00", lunches[(dayIndex + 1) % lunches.length]],
          ["Ужин", "18:00", dinners[(dayIndex + 2) % dinners.length]],
        ]
      : mealsCount === 4
        ? [
            ["Завтрак", "08:00", breakfasts[dayIndex % breakfasts.length]],
            ["Перекус", "11:00", snacks[(dayIndex + 1) % snacks.length]],
            ["Обед", "13:30", lunches[(dayIndex + 2) % lunches.length]],
            ["Ужин", "18:00", dinners[(dayIndex + 3) % dinners.length]],
          ]
        : [
            ["Завтрак", "08:00", breakfasts[dayIndex % breakfasts.length]],
            ["Перекус", "10:30", snacks[(dayIndex + 1) % snacks.length]],
            ["Обед", "13:30", lunches[(dayIndex + 2) % lunches.length]],
            ["Полдник", "16:30", snacks[(dayIndex + 3) % snacks.length]],
            ["Ужин", "18:30", dinners[(dayIndex + 4) % dinners.length]],
          ];

  return mealSlots.map(([type, time, template]) =>
    cloneMealTemplate(template as MealTemplate, String(type), String(time)),
  );
}

function sumDayMacros(meals: Meal[]) {
  return meals.reduce(
    (acc, meal) => ({
      p: acc.p + meal.macros.p,
      f: acc.f + meal.macros.f,
      c: acc.c + meal.macros.c,
    }),
    { p: 0, f: 0, c: 0 },
  );
}

function parseQuantity(quantity: string) {
  const match = quantity.match(/(\d+(?:[.,]\d+)?)\s*(г|мл|шт|ломт\.)/i);

  if (!match) {
    return null;
  }

  return {
    amount: Number(match[1].replace(",", ".")),
    unit: match[2],
  };
}

function getShoppingCategory(name: string) {
  const normalized = name.toLowerCase();

  if (/(кур|индей|рыб|яйц|твор|йогур|фасоль|чечев|молок)/.test(normalized)) {
    return "Белки и молочные продукты";
  }

  if (/(рис|греч|овся|паста|булгур|хлеб|мука)/.test(normalized)) {
    return "Крупы и хлеб";
  }

  if (/(банан|яблок|груш|ягод|клубник)/.test(normalized)) {
    return "Фрукты и ягоды";
  }

  if (/(огур|помид|морков|лук|брокк|кабач|перец|овощ|картоф)/.test(normalized)) {
    return "Овощи";
  }

  return "Прочее";
}

function buildShoppingListFromPlans(dailyPlans: DayPlan[]) {
  const categoryMap = new Map<
    string,
    Map<string, { amount: number; unit: string | null; occurrences: number }>
  >();

  dailyPlans.forEach((day) => {
    day.meals.forEach((meal) => {
      meal.ingredients.forEach((ingredient) => {
        const category = getShoppingCategory(ingredient.name);
        const parsed = parseQuantity(ingredient.quantity);
        const categoryItems = categoryMap.get(category) || new Map();
        const current = categoryItems.get(ingredient.name) || {
          amount: 0,
          unit: parsed?.unit || null,
          occurrences: 0,
        };

        categoryItems.set(ingredient.name, {
          amount: current.amount + (parsed?.amount || 0),
          unit: current.unit || parsed?.unit || null,
          occurrences: current.occurrences + 1,
        });
        categoryMap.set(category, categoryItems);
      });
    });
  });

  return Array.from(categoryMap.entries()).map(([category, items]) => ({
    category,
    items: Array.from(items.entries()).map(([name, value]) => ({
      name,
      quantity:
        value.unit && value.amount > 0
          ? `${Math.round(value.amount)} ${value.unit}`
          : `${value.occurrences} порц.`,
      checked: false,
    })),
  }));
}

function buildFallbackMealPlan(
  profile: ChildProfile,
  goal: NutritionGoal,
  mealsCount: number,
  preferences: NutritionPreference[],
) {
  const dayCount = 7;
  const dailyPlans: DayPlan[] = Array.from({ length: dayCount }, (_, index) => {
    const baseMeals = buildDayMeals(index, mealsCount, preferences);
    const target = calculateDailyTarget(profile, goal);
    const baseCalories = baseMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const adjustment = target - baseCalories;

    const meals =
      adjustment > 120 && baseMeals.length >= 4
        ? baseMeals.map((meal, mealIndex) =>
            mealIndex === 1 || mealIndex === 2
              ? {
                  ...meal,
                  calories: meal.calories + 40,
                  macros: {
                    p: meal.macros.p + 2,
                    f: meal.macros.f + 1,
                    c: meal.macros.c + 5,
                  },
                }
              : meal,
          )
        : baseMeals;

    const macros = sumDayMacros(meals);

    return {
      day: index + 1,
      meals,
      totalCalories: meals.reduce((sum, meal) => sum + meal.calories, 0),
      macros,
    };
  });

  return {
    dailyPlans,
    shoppingList: buildShoppingListFromPlans(dailyPlans),
  };
}

async function analyzeMealWithGemini(apiKey: string, mealText: string) {
  const prompt = `Оцени обычную детскую порцию блюда по описанию. Верни только JSON со структурой:
{
  "name": "Короткое название блюда",
  "calories": 0,
  "p": 0,
  "f": 0,
  "c": 0
}
Блюдо: ${mealText}`;

  const text = await requestGeminiContent(apiKey, prompt, "application/json");
  const parsed = parseJsonText<{
    name?: string;
    calories?: number;
    p?: number;
    f?: number;
    c?: number;
  }>(text);

  return buildMealEntry(
    String(parsed.name || mealText || "Блюдо"),
    clamp(Math.round(sanitizeNumber(parsed.calories, 0)), 80, 1200),
    clamp(Math.round(sanitizeNumber(parsed.p, 0)), 0, 80),
    clamp(Math.round(sanitizeNumber(parsed.f, 0)), 0, 60),
    clamp(Math.round(sanitizeNumber(parsed.c, 0)), 0, 140),
  );
}

async function generateNutritionPlanWithGemini(
  apiKey: string,
  profile: ChildProfile,
  goal: NutritionGoal,
  mealsCount: number,
  preferences: NutritionPreference[],
) {
  const prompt = `Составь недельный план питания для ребенка и список покупок. Условия:
- Возраст: ${profile.age}
- Рост: ${profile.height} см
- Вес: ${profile.weight} кг
- Активность: ${profile.activity}
- Цель: ${goal}
- Приемов пищи в день: ${mealsCount}
- Предпочтения: ${preferences.join(", ")}
- Тон рекомендаций безопасный, без жестких диет и экстремального дефицита.

Верни только JSON со структурой:
{
  "dailyPlans": [
    {
      "day": 1,
      "meals": [
        {
          "type": "Завтрак",
          "time": "08:00",
          "name": "Название",
          "totalWeight": "250 г",
          "calories": 320,
          "macros": { "p": 12, "f": 8, "c": 42 },
          "ingredients": [
            { "name": "Овсяные хлопья", "quantity": "45 г" }
          ]
        }
      ],
      "totalCalories": 1350,
      "macros": { "p": 60, "f": 45, "c": 180 }
    }
  ],
  "shoppingList": [
    {
      "category": "Крупы и хлеб",
      "items": [
        { "name": "Овсяные хлопья", "quantity": "350 г" }
      ]
    }
  ]
}`;

  const text = await requestGeminiContent(apiKey, prompt, "application/json");
  const parsed = parseJsonText<{
    dailyPlans?: DayPlan[];
    shoppingList?: ShoppingCategory[];
  }>(text);

  const dailyPlans = Array.isArray(parsed.dailyPlans)
    ? parsed.dailyPlans.map((day, index) => ({
        day: clamp(Math.round(sanitizeNumber(day.day, index + 1)), 1, 14),
        meals: Array.isArray(day.meals)
          ? day.meals.map((meal) => ({
              type: String(meal.type || "Прием пищи"),
              time: String(meal.time || "12:00"),
              name: String(meal.name || "Блюдо"),
              totalWeight: String(meal.totalWeight || "200 г"),
              calories: clamp(Math.round(sanitizeNumber(meal.calories, 0)), 80, 1200),
              macros: {
                p: clamp(Math.round(sanitizeNumber(meal.macros?.p, 0)), 0, 80),
                f: clamp(Math.round(sanitizeNumber(meal.macros?.f, 0)), 0, 60),
                c: clamp(Math.round(sanitizeNumber(meal.macros?.c, 0)), 0, 160),
              },
              ingredients: Array.isArray(meal.ingredients)
                ? meal.ingredients.map((ingredient) => ({
                    name: String(ingredient.name || "Продукт"),
                    quantity: String(ingredient.quantity || "1 порц."),
                  }))
                : [],
            }))
          : [],
        totalCalories: clamp(Math.round(sanitizeNumber(day.totalCalories, 0)), 900, 2600),
        macros: {
          p: clamp(Math.round(sanitizeNumber(day.macros?.p, 0)), 0, 200),
          f: clamp(Math.round(sanitizeNumber(day.macros?.f, 0)), 0, 150),
          c: clamp(Math.round(sanitizeNumber(day.macros?.c, 0)), 0, 350),
        },
      }))
    : [];

  const shoppingList = Array.isArray(parsed.shoppingList)
    ? parsed.shoppingList.map((category) => ({
        category: String(category.category || "Покупки"),
        items: Array.isArray(category.items)
          ? category.items.map((item) => ({
              name: String(item.name || "Продукт"),
              quantity: String(item.quantity || "1 порц."),
              checked: false,
            }))
          : [],
      }))
    : [];

  if (dailyPlans.length === 0) {
    throw new Error("Gemini returned an empty meal plan.");
  }

  return {
    dailyPlans,
    shoppingList: shoppingList.length > 0 ? shoppingList : buildShoppingListFromPlans(dailyPlans),
  };
}

async function generateNutritionInsightWithGemini(
  apiKey: string,
  profile: ChildProfile,
  entries: NutritionEntry[],
) {
  const today = getTodayDateKey();
  const intake = entries
    .filter((entry) => entry.date.startsWith(today))
    .reduce((sum, entry) => sum + entry.calories, 0);
  const target = calculateDailyTarget(profile);
  const balance = intake - target;

  const prompt = `Проанализируй текущий рацион ребенка за сегодня и верни только JSON:
{
  "text": "Короткий совет до 2 предложений",
  "status": "GOOD" | "UNDER" | "OVER"
}

Данные:
- Возраст: ${profile.age}
- Вес: ${profile.weight} кг
- Рост: ${profile.height} см
- Активность: ${profile.activity}
- Рекомендуемая энергия на день: ${target} ккал
- Уже съедено: ${intake} ккал
- Баланс: ${balance}

Если сильный недобор, порекомендуй мягко добавить белок и сложные углеводы.
Если баланс близок к норме, похвали и посоветуй сохранить режим.
Если перебор, предложи легкий ужин без давления и без жёстких запретов.`;

  const text = await requestGeminiContent(apiKey, prompt, "application/json");
  const parsed = parseJsonText<{
    text?: string;
    status?: "GOOD" | "UNDER" | "OVER";
  }>(text);

  return {
    text: String(parsed.text || "Рацион сегодня выглядит ровным и спокойным."),
    status:
      parsed.status === "UNDER" || parsed.status === "OVER" || parsed.status === "GOOD"
        ? parsed.status
        : "GOOD",
  };
}

function createNutritionApiMiddleware(apiKey?: string): Connect.NextHandleFunction {
  return (req, res, next) => {
    const pathname = req.url ? new URL(req.url, "http://localhost").pathname : "";

    if (req.method !== "POST") {
      next();
      return;
    }

    void (async () => {
      try {
        const rawBody = await readRequestBody(req);
        const parsedBody = JSON.parse(rawBody || "{}") as
          | MealAnalysisRequestBody
          | MealPlanRequestBody
          | NutritionInsightRequestBody;

        if (pathname === "/api/nutrition/analyze-meal") {
          const mealText = sanitizeMealText(
            (parsedBody as MealAnalysisRequestBody).mealText,
          );

          if (!mealText) {
            sendJson(res, 400, {
              error: "Опишите блюдо, чтобы получить разбор.",
            });
            return;
          }

          if (!apiKey) {
            const payload: MealAnalysisResponse = {
              entry: buildFallbackMealAnalysis(mealText),
              source: "fallback",
              warning: "Gemini недоступен, поэтому использована шаблонная оценка блюда.",
            };
            sendJson(res, 200, payload);
            return;
          }

          try {
            const payload: MealAnalysisResponse = {
              entry: await analyzeMealWithGemini(apiKey, mealText),
              source: "gemini",
            };
            sendJson(res, 200, payload);
          } catch {
            const payload: MealAnalysisResponse = {
              entry: buildFallbackMealAnalysis(mealText),
              source: "fallback",
              warning: "Gemini временно недоступен, поэтому использована шаблонная оценка блюда.",
            };
            sendJson(res, 200, payload);
          }
          return;
        }

        if (pathname === "/api/nutrition/meal-plan") {
          const body = parsedBody as MealPlanRequestBody;
          const profile = sanitizeProfile(body.profile);
          const goal = sanitizeGoal(body.goal);
          const mealsCount = sanitizeMealsCount(body.mealsCount);
          const preferences = sanitizePreferences(body.preferences);

          if (!apiKey) {
            const fallbackPlan = buildFallbackMealPlan(
              profile,
              goal,
              mealsCount,
              preferences,
            );
            const payload: MealPlanResponse = {
              ...fallbackPlan,
              source: "fallback",
              warning: "Gemini недоступен, поэтому загружен шаблонный недельный рацион.",
            };
            sendJson(res, 200, payload);
            return;
          }

          try {
            const aiPlan = await generateNutritionPlanWithGemini(
              apiKey,
              profile,
              goal,
              mealsCount,
              preferences,
            );
            const payload: MealPlanResponse = {
              ...aiPlan,
              source: "gemini",
            };
            sendJson(res, 200, payload);
          } catch {
            const fallbackPlan = buildFallbackMealPlan(
              profile,
              goal,
              mealsCount,
              preferences,
            );
            const payload: MealPlanResponse = {
              ...fallbackPlan,
              source: "fallback",
              warning: "Gemini временно недоступен, поэтому загружен шаблонный недельный рацион.",
            };
            sendJson(res, 200, payload);
          }
          return;
        }

        if (pathname === "/api/nutrition/insight") {
          const body = parsedBody as NutritionInsightRequestBody;
          const profile = sanitizeProfile(body.profile);
          const entries = sanitizeEntries(body.entries);

          if (!apiKey) {
            const payload: NutritionInsightResponse = {
              insight: buildFallbackInsight(profile, entries),
              source: "fallback",
              warning: "Gemini недоступен, поэтому совет собран по базовым правилам.",
            };
            sendJson(res, 200, payload);
            return;
          }

          try {
            const payload: NutritionInsightResponse = {
              insight: await generateNutritionInsightWithGemini(apiKey, profile, entries),
              source: "gemini",
            };
            sendJson(res, 200, payload);
          } catch {
            const payload: NutritionInsightResponse = {
              insight: buildFallbackInsight(profile, entries),
              source: "fallback",
              warning: "Gemini временно недоступен, поэтому совет собран по базовым правилам.",
            };
            sendJson(res, 200, payload);
          }
          return;
        }

        next();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Не удалось обработать nutrition-запрос.";
        sendJson(res, 500, { error: message });
      }
    })();
  };
}

export function geminiNutritionApiPlugin(apiKey?: string): Plugin {
  const middleware = createNutritionApiMiddleware(apiKey);

  return {
    name: "gemini-nutrition-api",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
