import { Link, useRouteError, isRouteErrorResponse } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function NotFound() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 404;
  const isNotFound = status === 404;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main" className="flex-1 container mx-auto px-4 py-24 text-center max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-600 mb-4">
          {isNotFound ? "Страница не найдена" : `Ошибка ${status}`}
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-5">
          {isNotFound ? "Здесь ничего нет" : "Что-то пошло не так"}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          {isNotFound
            ? "Возможно, ссылка устарела или вы ввели адрес с опечаткой. Не страшно — вернитесь на главную или запишитесь на пробное прямо сейчас."
            : "Мы уже разбираемся. Пока — вернитесь на главную или напишите нам, если вопрос срочный."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-purple-600 via-purple-700 to-orange-500 text-white font-bold px-6 py-3.5 shadow-[0_18px_36px_-18px_rgba(124,58,237,0.55)] hover:-translate-y-0.5 transition-all"
          >
            На главную
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold px-6 py-3.5 hover:border-slate-300 hover:bg-slate-50 transition"
          >
            Записаться на пробное
          </Link>
        </div>

        <p className="mt-10 text-sm text-gray-500">
          Или позвоните: <a href="tel:+79138927059" className="text-indigo-700 font-semibold underline">+7-913-892-70-59</a>
        </p>
      </main>

      <Footer />
    </div>
  );
}
