import { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Gift,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { downloadGuidePdf } from "../utils/guidePdf";

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

export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isDownloadingGuide, setIsDownloadingGuide] = useState(false);
  const [guideError, setGuideError] = useState<string | null>(null);
  const [guideNotice, setGuideNotice] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setGuideError(null);
    setGuideNotice(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setGuideError(null);
    setGuideNotice(null);
  };

  const handleGuideDownload = async () => {
    setIsDownloadingGuide(true);
    setGuideError(null);

    try {
      const response = await fetch("/api/quiz-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: questions.map((question, index) => ({
            question: question.question,
            answer: answers[index] ?? "",
          })),
        }),
      });

      const payload = (await response.json()) as {
        content?: string;
        fileName?: string;
        error?: string;
        source?: "gemini" | "fallback";
        warning?: string;
      };

      if (!response.ok || !payload.content) {
        throw new Error(payload.error || "Не удалось сформировать гайд.");
      }

      await downloadGuidePdf(payload.content, payload.fileName);
      setGuideNotice(payload.source === "fallback" ? payload.warning || "Скачан шаблонный гайд." : null);
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

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-[0_32px_80px_-36px_rgba(124,58,237,0.45)]"
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500"></div>
        <div className="absolute -top-12 right-0 h-40 w-40 rounded-full bg-orange-100 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-purple-100 blur-3xl"></div>

        <div className="relative p-8 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Гайд готов
          </div>

          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-start">
            <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-purple-600 to-orange-500 shadow-lg shadow-purple-200">
              <Gift className="h-9 w-9 text-white" />
            </div>

            <div className="text-left">
              <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                Персональные рекомендации готовы
              </h3>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
                Мы собрали короткий PDF-гайд по адаптации к первой тренировке.
                Первое пробное занятие по-прежнему бесплатно, а гайд можно
                сохранить сразу после прохождения теста.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {answerSummary.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-gray-100 bg-gray-50/80 p-4 text-left"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                  {item.label}
                </div>
                <div className="mt-2 text-sm font-semibold leading-relaxed text-gray-800">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-purple-100 bg-gradient-to-br from-purple-50 to-orange-50 p-5 text-left">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-600">
                  Что внутри PDF
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
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
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-200 disabled:cursor-not-allowed disabled:from-purple-400 disabled:to-orange-300"
            >
              <Download className="h-5 w-5" />
              {isDownloadingGuide ? "Готовим PDF..." : "Скачать PDF-гайд"}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-4 font-semibold text-gray-600 transition hover:border-purple-300 hover:text-purple-700"
            >
              <RotateCcw className="h-5 w-5" />
              Пройти заново
            </button>
          </div>

          {guideError ? (
            <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {guideError}
            </div>
          ) : null}
          {guideNotice ? (
            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {guideNotice}
            </div>
          ) : null}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-[0_32px_80px_-36px_rgba(124,58,237,0.45)]"
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500"></div>
      <div className="absolute -top-12 right-0 h-40 w-40 rounded-full bg-purple-100 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-orange-100 blur-3xl"></div>

      <div className="relative p-8 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
            <Sparkles className="h-4 w-4" />
            Экспресс-тест для родителей
          </div>
          <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
            Вопрос {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-8 text-left">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            {questions[currentQuestion].question}
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
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
            className="group w-full rounded-[1.5rem] border border-gray-200 bg-white px-5 py-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-orange-50 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-100 font-bold text-gray-500 transition group-hover:bg-white group-hover:text-purple-600">
                0{index + 1}
              </div>
              <span className="flex-1 text-base font-semibold text-gray-700 group-hover:text-gray-900">
                {option}
              </span>
              <ChevronRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-purple-600" />
            </div>
          </button>
        ))}

        <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50/80 px-5 py-4 text-sm leading-relaxed text-gray-600">
          После последнего ответа вы сразу получите персональный PDF-гайд по
          адаптации ребенка к первой тренировке.
        </div>
      </div>
    </motion.div>
  );
}
