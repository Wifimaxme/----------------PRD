import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect, Plugin } from "vite";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const MAX_BODY_SIZE_BYTES = 32_000;

interface QuizGuideAnswer {
  question: string;
  answer: string;
}

interface QuizGuideRequestBody {
  answers?: QuizGuideAnswer[];
}

interface GuideResponsePayload {
  fileName: string;
  content: string;
  source: "gemini" | "fallback";
  warning?: string;
}

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

function sanitizeAnswers(body: QuizGuideRequestBody) {
  const answers = Array.isArray(body.answers) ? body.answers : [];

  return answers
    .map((item) => ({
      question: String(item?.question ?? "").trim(),
      answer: String(item?.answer ?? "").trim(),
    }))
    .filter((item) => item.question && item.answer);
}

function createGuidePrompt(answers: QuizGuideAnswer[]) {
  const profile = answers
    .map(
      (item, index) =>
        `${index + 1}. Вопрос: ${item.question}\nОтвет родителя: ${item.answer}`,
    )
    .join("\n\n");

  return `Сформируй персональный гайд по мягкой адаптации ребенка к первой футбольной тренировке.

Контекст:
- Это детская футбольная школа.
- Тон: теплый, уверенный, конкретный, без канцелярита.
- Язык: русский.
- Аудитория: родители детей 3-7 лет.
- Не упоминай скидки, акции, платные предложения и Gemini.
- Не ставь диагнозы и не давай медицинских обещаний.
- Не выдумывай факты вне ответов родителей, но делай полезные выводы из них.
- Ответ оформи в Markdown.

Структура ответа:
1. Заголовок.
2. Краткий профиль ребенка на 2-3 предложения.
3. Что поможет адаптации перед первым занятием.
4. Как родителю правильно подготовить ребенка в день тренировки.
5. Что взять с собой.
6. Что сказать ребенку до и после тренировки.
7. На что обратить внимание после пробного занятия.
8. Короткий чек-лист на 5 пунктов.

Ответы родителя:
${profile}`;
}

function getAnswerByQuestion(answers: QuizGuideAnswer[], questionPart: string) {
  return (
    answers.find((item) => item.question.includes(questionPart))?.answer ||
    "Не указано"
  );
}

function createBulletList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function buildFallbackGuide(answers: QuizGuideAnswer[]) {
  const age = getAnswerByQuestion(answers, "Сколько лет");
  const experience = getAnswerByQuestion(answers, "Посещал ли");
  const concern = getAnswerByQuestion(answers, "Что больше всего волнует");

  const ageProfileByRange: Record<string, string> = {
    "3-4 года":
      "Ребёнку особенно важны короткие объяснения, спокойный темп и ощущение безопасности рядом со взрослым.",
    "4-5 лет":
      "Ребёнок уже хорошо включается в игровые правила, если заранее понимает, что его ждёт и зачем это нужно.",
    "5-6 лет":
      "В этом возрасте детям помогает понятная цель на занятие и ощущение личного успеха даже в небольших упражнениях.",
    "6-7 лет":
      "Ребёнок уже лучше держит внимание на задаче, поэтому ему полезно заранее проговорить роль в команде и простые правила тренировки.",
  };

  const experienceProfileByType: Record<string, string> = {
    "Да, и ему понравилось":
      "У ребёнка уже есть позитивный опыт секций, поэтому адаптацию лучше строить через знакомое чувство интереса и удовольствия.",
    "Да, но быстро бросил":
      "У ребёнка был предыдущий опыт, но важно не повторить сценарий с завышенными ожиданиями и лишним давлением.",
    "Нет, это первый опыт":
      "Это первый опыт спортивной секции, поэтому ключевая задача родителя — снизить тревогу и сделать старт максимально понятным.",
  };

  const concernAdviceByType: Record<
    string,
    {
      before: string;
      trainingDay: string;
      phrases: string;
      after: string;
    }
  > = {
    "Боюсь, что ребёнок не адаптируется": {
      before:
        "За 2-3 дня до тренировки расскажите ребёнку короткий сценарий: кто встретит, что будут делать и когда вы вернётесь за ним.",
      trainingDay:
        "В день занятия избегайте спешки и новых перегрузок, чтобы эмоции ушли именно в тренировку, а не в дорогу и сборы.",
      phrases:
        "Сделайте акцент не на результате, а на безопасности: «Ты просто познакомишься, а я потом спрошу, что тебе понравилось».",
      after:
        "После занятия смотрите не только на эмоции сразу после выхода, но и на то, как быстро ребёнок восстанавливается и вспоминает понравившиеся моменты.",
    },
    "Нет времени возить в секцию": {
      before:
        "Соберите одежду и воду с вечера и заранее проговорите короткий ритуал сборов, чтобы день тренировки не ощущался дополнительной нагрузкой.",
      trainingDay:
        "Опирайтесь на предсказуемость: одинаковое время, одна и та же сумка, короткие спокойные сборы без спешки.",
      phrases:
        "Говорите просто: «Сегодня у тебя тренировка в садике, потом я тебя заберу и ты расскажешь, что нового попробовал».",
      after:
        "Оцените, насколько удобно ребёнку включаться в тренировочный день без усталости и перегруза по расписанию.",
    },
    "Не уверен в квалификации тренеров": {
      before:
        "Перед первым занятием подготовьте 2-3 конкретных вопроса тренеру: как проходит адаптация новичков, как поддерживают детей и на что обращают внимание в начале.",
      trainingDay:
        "Понаблюдайте, как тренер даёт инструкции, держит внимание группы и реагирует на ошибки ребёнка в безопасной, поддерживающей форме.",
      phrases:
        "Ребёнку стоит сказать: «Ты идёшь знакомиться и играть, а я посмотрю, чтобы тебе было спокойно и понятно».",
      after:
        "После занятия обратите внимание, может ли ребёнок своими словами объяснить, что делал на тренировке и чувствовал ли поддержку тренера.",
    },
    "Все устраивает, готов попробовать": {
      before:
        "Сохраните лёгкий настрой и заранее опишите тренировку как интересное знакомство с мячом, играми и новыми движениями.",
      trainingDay:
        "В день тренировки поддержите хороший темп без давления и не перегружайте ребёнка дополнительными обещаниями или ожиданиями.",
      phrases:
        "Лучше всего работают спокойные формулировки: «Попробуй, познакомься, а потом вместе обсудим, что было самым интересным».",
      after:
        "После занятия обратите внимание, что вызвало у ребёнка живой интерес и что можно закрепить до следующей тренировки.",
    },
  };

  const ageSpecificTrainingDay: Record<string, string> = {
    "3-4 года":
      "Для возраста 3-4 года особенно важно использовать одну-две очень простые инструкции и не перегружать ребёнка вопросами по дороге.",
    "4-5 лет":
      "Для возраста 4-5 лет хорошо работает понятный ритуал: переоделись, попили воды, поздоровались с тренером, пошли играть.",
    "5-6 лет":
      "Для возраста 5-6 лет можно заранее предложить маленькую цель: внимательно слушать тренера и попробовать одно новое упражнение.",
    "6-7 лет":
      "Для возраста 6-7 лет полезно заранее обсудить, что тренировка — это и игра, и умение работать по правилам вместе с другими детьми.",
  };

  const phraseByExperience: Record<string, string> = {
    "Да, и ему понравилось":
      "Напомните ребёнку о прошлом удачном опыте: что раньше нравилось на занятиях и что может понравиться снова.",
    "Да, но быстро бросил":
      "Не сравнивайте с прошлой секцией и не обещайте, что «теперь точно понравится» — лучше дать пространство спокойно попробовать ещё раз.",
    "Нет, это первый опыт":
      "Перед стартом полезно поиграть дома в мини-репетицию: мяч, команды «старт», «стоп», короткая похвала за попытку.",
  };

  const afterByExperience: Record<string, string> = {
    "Да, и ему понравилось":
      "После пробного занятия сравните не результат, а эмоциональный отклик: появился ли интерес продолжать и было ли ребёнку комфортно в группе.",
    "Да, но быстро бросил":
      "После занятия важно не давить вопросом «ну что, теперь будешь ходить?», а сначала спокойно собрать впечатления и понять, что помогло или мешало включиться.",
    "Нет, это первый опыт":
      "После первого занятия важно оценить базовые сигналы адаптации: захотел ли ребёнок рассказать о тренировке, вспоминал ли тренера и упражнения дома.",
  };

  const thingsToBring = [
    "Удобную спортивную форму по погоде и сменную футболку.",
    "Бутылку воды с понятной ребёнку крышкой.",
    "Лёгкую спортивную обувь, в которой ребёнок уже ходил и чувствует себя уверенно.",
    "Небольшой пакет для сменных вещей.",
  ];

  const checklist = [
    "С вечера подготовить форму, обувь и воду.",
    "Коротко рассказать ребёнку, как пройдёт тренировка.",
    "Не перегружать утро спешкой и длинными объяснениями.",
    "После занятия сначала похвалить за участие, а уже потом задавать вопросы.",
    "Отметить, что именно вызвало интерес или тревогу, чтобы обсудить это перед следующим посещением.",
  ];

  const concernAdvice =
    concernAdviceByType[concern] || concernAdviceByType["Боюсь, что ребёнок не адаптируется"];

  const profile = [
    `Возрастной ориентир: ${age}. ${ageProfileByRange[age] || ageProfileByRange["5-6 лет"]}`,
    `Опыт секций: ${experience}. ${experienceProfileByType[experience] || experienceProfileByType["Нет, это первый опыт"]}`,
    `Главный родительский запрос: ${concern}. Это значит, что в первом занятии особенно важно снизить тревогу и закрепить у ребёнка ощущение понятного, доброжелательного старта.`,
  ];

  const beforeTraining = [
    concernAdvice.before,
    phraseByExperience[experience] || phraseByExperience["Нет, это первый опыт"],
    "Лучше говорить о тренировке как о знакомстве и игре, а не как о проверке способностей ребёнка.",
  ];

  const trainingDay = [
    concernAdvice.trainingDay,
    ageSpecificTrainingDay[age] || ageSpecificTrainingDay["5-6 лет"],
    "Перед выходом достаточно одного спокойного ориентира: кто встречает, что сначала будет разминка, а после тренировки вы обсудите впечатления.",
  ];

  const thingsToSay = [
    concernAdvice.phrases,
    "До тренировки используйте короткие фразы без давления: «Можно просто попробовать», «Тебе не нужно быть лучшим с первого раза».",
    "После тренировки задавайте открытые вопросы: «Что запомнилось?», «Какое упражнение было самым весёлым?», «С кем ты познакомился?».",
  ];

  const afterTraining = [
    concernAdvice.after,
    afterByExperience[experience] || afterByExperience["Нет, это первый опыт"],
    "Если ребёнок устал или растерялся, это не признак неудачи: важнее динамика между первым и следующим посещением, чем впечатление одной минуты после выхода.",
  ];

  return `# Персональный гайд по адаптации к первой футбольной тренировке

## Краткий профиль ребёнка
${profile.join("\n\n")}

## Что поможет адаптации перед первым занятием
${createBulletList(beforeTraining)}

## Как подготовить ребёнка в день тренировки
${createBulletList(trainingDay)}

## Что взять с собой
${createBulletList(thingsToBring)}

## Что сказать ребёнку до и после тренировки
${createBulletList(thingsToSay)}

## На что обратить внимание после пробного занятия
${createBulletList(afterTraining)}

## Чек-лист родителя
${createBulletList(checklist)}
`;
}

async function generateGuide(apiKey: string, answers: QuizGuideAnswer[]) {
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
            text: "Ты методист детской футбольной школы и пишешь практичные персональные рекомендации для родителей.",
          },
        ],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: createGuidePrompt(answers) }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1400,
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

  const content = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!content) {
    throw new Error("Gemini returned an empty guide.");
  }

  return content;
}

function buildFilename() {
  const date = new Date().toISOString().slice(0, 10);
  return `guide-adaptation-${date}.pdf`;
}

export function createQuizGuideMiddleware(apiKey?: string): Connect.NextHandleFunction {
  return (req, res, next) => {
    const pathname = req.url ? new URL(req.url, "http://localhost").pathname : "";

    if (req.method !== "POST" || pathname !== "/api/quiz-guide") {
      next();
      return;
    }

    void (async () => {
      if (!apiKey) {
        sendJson(res, 500, {
          error: "На сервере не настроен GEMINI_API_KEY. Добавьте его в .env и перезапустите сайт.",
        });
        return;
      }

      try {
        const rawBody = await readRequestBody(req);
        const parsedBody = JSON.parse(rawBody || "{}") as QuizGuideRequestBody;
        const answers = sanitizeAnswers(parsedBody);

        if (answers.length === 0) {
          sendJson(res, 400, {
            error: "Для генерации гайда нужны ответы из квиза.",
          });
          return;
        }

        try {
          const content = await generateGuide(apiKey, answers);
          const payload: GuideResponsePayload = {
            fileName: buildFilename(),
            content,
            source: "gemini",
          };

          sendJson(res, 200, payload);
        } catch {
          const payload: GuideResponsePayload = {
            fileName: buildFilename(),
            content: buildFallbackGuide(answers),
            source: "fallback",
            warning:
              "Gemini временно недоступен, поэтому скачан персональный шаблонный гайд.",
          };

          sendJson(res, 200, payload);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Не удалось сгенерировать гайд.";

        sendJson(res, 500, { error: message });
      }
    })();
  };
}

export function geminiGuideApiPlugin(apiKey?: string): Plugin {
  const middleware = createQuizGuideMiddleware(apiKey);

  return {
    name: "gemini-guide-api",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
