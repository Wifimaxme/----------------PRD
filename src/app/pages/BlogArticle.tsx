import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getBlogPost, blogPosts } from "../data/blogPosts";

export function BlogArticle() {
    const { slug = "" } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const post = getBlogPost(slug);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }, [slug]);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-24 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Статья не найдена</h1>
                    <p className="mt-4 text-gray-600">
                        Возможно, ссылка устарела. Вернитесь к&nbsp;другим материалам.
                    </p>
                    <Link
                        to="/"
                        className="inline-block mt-8 text-indigo-700 underline hover:text-indigo-900"
                    >
                        ← На главную
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                <article className="container mx-auto px-4 py-16 max-w-3xl">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-700 transition mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Назад
                    </button>

                    <div className="inline-flex rounded-full bg-[#f5f0ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-purple-700">
                        {post.category}
                    </div>

                    <h1 className="mt-5 text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                        {post.title}
                    </h1>

                    <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {post.readingTime} чтения
                    </div>

                    <img
                        src={post.image}
                        alt={post.title}
                        className="mt-10 w-full h-72 sm:h-96 object-cover rounded-[1.5rem] shadow-[0_30px_70px_-30px_rgba(15,23,42,0.35)]"
                    />

                    <p className="mt-10 text-lg md:text-xl leading-relaxed text-gray-700 font-medium">
                        {post.excerpt}
                    </p>

                    <div className="mt-8 space-y-5">
                        {post.body.map((para, i) => {
                            if (para.startsWith("## ")) {
                                return (
                                    <h2
                                        key={i}
                                        className="mt-12 text-2xl md:text-3xl font-bold tracking-tight text-gray-900"
                                    >
                                        {para.replace(/^##\s+/, "")}
                                    </h2>
                                );
                            }
                            return (
                                <p
                                    key={i}
                                    className="text-base md:text-lg leading-relaxed text-gray-700"
                                >
                                    {para}
                                </p>
                            );
                        })}
                    </div>

                    <div className="mt-16 rounded-[1.4rem] bg-gradient-to-br from-purple-600 via-purple-700 to-orange-500 p-8 text-white text-center shadow-[0_24px_60px_-30px_rgba(124,58,237,0.55)]">
                        <h3 className="text-2xl font-black">
                            Готовы попробовать?
                        </h3>
                        <p className="mt-3 text-white/90 leading-relaxed max-w-lg mx-auto">
                            Первое занятие бесплатно. Без обязательств — просто чтобы понять,
                            подойдёт ли футбол вашему ребёнку.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 mt-6 rounded-xl bg-white text-indigo-900 font-black uppercase tracking-wider px-6 py-3 shadow-md hover:scale-105 transition"
                        >
                            Записаться на пробное →
                        </Link>
                    </div>
                </article>

                {otherPosts.length > 0 && (
                    <section className="border-t border-black/8 py-16">
                        <div className="container mx-auto px-4 max-w-5xl">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                Другие материалы
                            </h2>
                            <div className="mt-8 grid gap-6 sm:grid-cols-2">
                                {otherPosts.map((p) => (
                                    <Link
                                        key={p.slug}
                                        to={`/blog/${p.slug}`}
                                        className="group overflow-hidden rounded-[1.4rem] border border-black/6 bg-white shadow-[0_2px_12px_-6px_rgba(15,23,42,0.12)] hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.25)] hover:-translate-y-1 transition-all"
                                    >
                                        <img
                                            src={p.image}
                                            alt={p.title}
                                            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="p-5">
                                            <div className="inline-flex rounded-full bg-[#f8f6f2] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-600">
                                                {p.category}
                                            </div>
                                            <h3 className="mt-3 text-lg font-bold tracking-tight text-gray-900 leading-snug">
                                                {p.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                                {p.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
