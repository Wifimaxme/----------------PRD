import { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Gift,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { downloadGuidePdf } from "../utils/guidePdf";
import { generateQuizGuidePayload } from "../utils/geminiGuide";

interface Question {
  id: number;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Сколько лет вашему ребёнку?",
    options: ["3-4 года", "4-5 лет", "5-6 лет", "6-7 лет"],
  },
  {
    id: 2,
    question: "Посещал ли ваш ребёнок ранее спортивные секции?",
    options: ["Да, и ему понравилось", "Да, но быстро бросил", "Нет, это первый опыт"],
  },
  {
    id: 3,
    question: "Что больше всего волнует вас?",
    options: [
      "Боюсь, что ребёнок не адаптируется",
      "Нет времени возить в секцию",
      "Не уверен в квалификации тренеров",
      "Все устраивает, готов попробовать",
    ],
  },
];

const LEADS_ENDPOINT =
  ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_LEADS_ENDPOINT) ||
  "https://lk.champion-footboll.ru/api/leads";

function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7") && digits.length <= 10) digits = "7" + digits;
  return "+" + digits.slice(0, 11);
}

function isValidPhone(value: string): boolean {
  return /^\+7\d{10}$/.test(value);
}

// Maps the age-range answer from question 1 to a synthetic ISO DOB so
// the MoyKlass /api/leads endpoint (which validates dob) accepts the
// quiz lead. The exact day isn't relevant — manager will refine when
// they follow up.
function ageRangeToDob(ageRange: string | undefined): string {
  const currentYear = new Date().getFullYear();
  const map: Record<string, number> = {
    "3-4 года": 4,
    "4-5 лет": 5,
    "5-6 лет": 6,
    "6-7 лет": 7,
  };
  const yearsOld = ageRange ? map[ageRange] ?? 5 : 5;
  return `${currentYear - yearsOld}-01-15`;
}

export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [phase, setPhase] = useState<"questions" | "lead" | "result">("questions");
  const [isDownloadingGuide, setIsDownloadingGuide] = useState(false);
  const [guideError, setGuideError] = useState<string | null>(null);
  const [guideNotice, setGuideNotice] = useState<string | null>(null);

  // Lead capture step state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("+7");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [leadTouched, setLeadTouched] = useState(false);

  const phoneValid = isValidPhone(leadPhone);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setGuideError(null);
    setGuideNotice(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setPhase("lead");
    }
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setPhase("questions");
    setGuideError(null);
    setGuideNotice(null);
    setLeadName("");
    setLeadPhone("+7");
    setLeadSent(false);
    setLeadTouched(false);
  };

  const submitLead = async () => {
    setLeadTouched(true);
    if (!phoneValid || leadSubmitting) return;

    setLeadSubmitting(true);
    try {
      await fetch(LEADS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName: leadName.trim() || "Заявка с теста",
          phone: leadPhone,
          dob: ageRangeToDob(answers[0]),
          group: answers[1] ?? null,
          privilege: null,
          source: `champion-footboll.ru/quiz · ${answers.join(" / ")}`,
        }),
      }).catch((err) => {
        console.warn("[quiz] lead submission failed", err);
      });
      setLeadSent(true);
    } finally {
      setLeadSubmitting(false);
      setPhase("result");
    }
  };

  const skipLead = () => {
    setPhase("result");
  };

  const handleGuideDownload = async () => {
    setIsDownloadingGuide(true);
    setGuideError(null);

    try {
      const answersRaw = questions.map((question, index) => ({
        question: question.question,
        answer: answers[index] ?? "",
      }));

      const payload = await generateQuizGuidePayload(answersRaw);

      if ("error" in payload) {
        throw new Error(payload.error as string);
      }
      if (!("content" in payload) || !payload.content) {
        throw new Error("Не удалось сформировать гайд.");
      }

      await downloadGuidePdf(payload.content, payload.fileName);
      setGuideNotice(null);
    } catch (error) {
      setGuideError(
        error instanceof Error
          ? error.message
          : "Не удалось скачать гайд. Попробуйте еще раз.",
      );
    } finally {
      setIsDownloadingGuide(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answerSummary = questions.map((question, index) => ({
    label: question.question.replace("?", ""),
    value: answers[index] ?? "",
  }));

  // ───────────────────────── Lead capture step ─────────────────────────
  if (phase === "lead") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[1.25rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0.34))]"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500" />

        <div className="relative p-7 md:p-8">
          <div className="ui-eyebrow">
            <Sparkles className="h-4 w-4" />
            Последний шаг
          </div>

          <h3 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
            Куда отправить персональный разбор от тренера?
          </h3>
          <p className="ui-body mt-3 max-w-2xl">
            PDF-гайд скачается сразу. А мы перезвоним по телефону в течение дня —
            расскажем, как мягко начать именно для вашего ребёнка, и предложим
            время бесплатного пробного занятия.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="quiz-name" className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                Имя ребёнка
              </label>
              <input
                id="quiz-name"
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Например, Михаил"
                autoComplete="given-name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition text-slate-900 placeholder:text-slate-400 text-base"
                disabled={leadSubmitting}
              />
            </div>
            <div>
              <label htmlFor="quiz-phone" className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                Телефон родителя <span className="text-orange-500">*</span>
              </label>
              <input
                id="quiz-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={leadPhone}
                onChange={(e) => setLeadPhone(normalizePhone(e.target.value))}
                onBlur={() => setLeadPhone((p) => normalizePhone(p))}
                onFocus={(e) => {
                  const el = e.currentTarget;
                  requestAnimationFrame(() => {
                    if (el.selectionStart !== null && el.selectionStart < 2) {
                      el.setSelectionRange(el.value.length, el.value.length);
                    }
                  });
                }}
                placeholder="+7 (___) ___-__-__"
                aria-required="true"
                aria-invalid={leadTouched && !phoneValid}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition text-slate-900 placeholder:text-slate-400 text-base"
                disabled={leadSubmitting}
              />
              {leadTouched && !phoneValid && (
                <p className="text-xs text-red-600 mt-1 ml-1">
                  Введите телефон в формате +7XXXXXXXXXX
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={submitLead}
              disabled={leadSubmitting}
              className="ui-button-primary inline-flex flex-1 bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-4 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {leadSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Отправляем…
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Получить гайд и звонок тренера
                </>
              )}
            </button>
            <button
              onClick={skipLead}
              disabled={leadSubmitting}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition px-4 py-3"
            >
              Просто скачать гайд →
            </button>
          </div>

          <p className="ui-body-sm mt-4 text-gray-500">
            Нажимая «получить гайд», вы соглашаетесь, что мы перезвоним по
            указанному телефону. Никаких рассылок и спама.
          </p>
        </div>
      </motion.div>
    );
  }

  // ───────────────────────── Result step ─────────────────────────
  if (phase === "result") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[1.25rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0.34))]"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500" />

        <div className="relative p-7 md:p-8">
          <div className="ui-eyebrow text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {leadSent ? "Заявка отправлена" : "Гайд готов"}
          </div>

          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-orange-500">
              <Gift className="h-9 w-9 text-white" />
            </div>

            <div className="text-left">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                {leadSent ? "Тренер свяжется с вами в течение дня" : "Персональные рекомендации готовы"}
              </h3>
              <p className="ui-body mt-3 max-w-2xl">
                {leadSent
                  ? "Мы сохранили ваши ответы и перезвоним по номеру, который вы указали. PDF-гайд можно скачать прямо сейчас, ниже."
                  : "Мы собрали короткий PDF-гайд по адаптации к первой тренировке. Первое пробное занятие по-прежнему бесплатно."}
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden border-y border-black/8 md:grid md:grid-cols-3 md:divide-x md:divide-black/6">
            {answerSummary.map((item) => (
              <div
                key={item.label}
                className="border-b border-black/6 px-0 py-4 text-left last:border-b-0 md:border-b-0 md:px-4"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {item.label}
                </div>
                <div className="mt-2 text-sm font-semibold leading-relaxed text-gray-800">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-l-2 border-purple-200 pl-4 text-left">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-600">
                  Что внутри PDF
                </div>
                <p className="ui-body-sm mt-2">
                  Рекомендации перед первым занятием, список вещей, фразы для
                  поддержки ребёнка и короткий чек-лист для родителя.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleGuideDownload}
              disabled={isDownloadingGuide}
              className="ui-button-primary inline-flex flex-1 bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-4 disabled:cursor-not-allowed disabled:from-purple-400 disabled:to-orange-300"
            >
              <Download className="h-5 w-5" />
              {isDownloadingGuide ? "Готовим PDF..." : "Скачать PDF-гайд"}
            </button>
            <button
              onClick={reset}
              className="ui-button-secondary inline-flex px-6 py-4 text-gray-600"
            >
              <RotateCcw className="h-5 w-5" />
              Пройти заново
            </button>
          </div>

          {guideError ? (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-600">
              {guideError}
            </div>
          ) : null}
          {guideNotice ? (
            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/90 px-4 py-3 text-sm text-amber-700">
              {guideNotice}
            </div>
          ) : null}
        </div>
      </motion.div>
    );
  }

  // ───────────────────────── Questions ─────────────────────────
  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[1.25rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0.34))]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500" />

      <div className="relative p-7 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="ui-eyebrow">
            <Sparkles className="h-4 w-4" />
            Экспресс-тест для родителей
          </div>
          <div className="text-sm font-semibold text-gray-500">
            Вопрос {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 overflow-hidden rounded-full bg-black/6">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-8 text-left">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {questions[currentQuestion].question}
          </h3>
          <p className="ui-body mt-3 max-w-2xl">
            Ответ поможет подобрать спокойные рекомендации по адаптации и
            подготовить PDF-гайд без лишней теории.
          </p>
        </div>
      </div>

      <div className="relative space-y-3 px-8 pb-8 md:px-10 md:pb-10">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="group w-full rounded-[0.95rem] border border-black/6 bg-white/35 px-5 py-4 text-left transition hover:border-purple-200 hover:bg-white/78"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f2eb] font-bold text-gray-500 transition group-hover:bg-white group-hover:text-purple-600">
                0{index + 1}
              </div>
              <span className="flex-1 text-base font-semibold text-gray-700 group-hover:text-gray-900">
                {option}
              </span>
              <ChevronRight className="h-5 w-5 text-gray-500 transition group-hover:translate-x-0.5 group-hover:text-purple-600" />
            </div>
          </button>
        ))}

        <div className="ui-body-sm border-t border-black/8 pt-4">
          После последнего ответа сможете оставить телефон, чтобы тренер
          перезвонил и подсказал по адаптации, или просто скачать PDF-гайд.
        </div>
      </div>
    </motion.div>
  );
}
