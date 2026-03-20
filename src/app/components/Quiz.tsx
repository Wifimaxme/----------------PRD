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

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[1.25rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0.34))]"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500"></div>

        <div className="relative p-7 md:p-8">
          <div className="ui-eyebrow text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Гайд готов
          </div>

          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-orange-500">
              <Gift className="h-9 w-9 text-white" />
            </div>

            <div className="text-left">
              <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                Персональные рекомендации готовы
              </h3>
              <p className="ui-body mt-3 max-w-2xl">
                Мы собрали короткий PDF-гайд по адаптации к первой тренировке.
                Первое пробное занятие по-прежнему бесплатно, а гайд можно
                сохранить сразу после прохождения теста.
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden border-y border-black/8 md:grid md:grid-cols-3 md:divide-x md:divide-black/6">
            {answerSummary.map((item) => (
              <div
                key={item.label}
                className="border-b border-black/6 px-0 py-4 text-left last:border-b-0 md:border-b-0 md:px-4"
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

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[1.25rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0.34))]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500"></div>

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
            ></div>
          </div>
        </div>

        <div className="mt-8 text-left">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
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
              <ChevronRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-purple-600" />
            </div>
          </button>
        ))}

        <div className="ui-body-sm border-t border-black/8 pt-4">
          После последнего ответа вы сразу получите персональный PDF-гайд по
          адаптации ребенка к первой тренировке.
        </div>
      </div>
    </motion.div>
  );
}
