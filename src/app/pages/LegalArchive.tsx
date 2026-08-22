import { useEffect } from "react";
import { Link } from "react-router";
import { FileText, Download, ShieldCheck } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  LEGAL_DOCUMENTS,
  formatBytes,
  legalFileUrl,
  type LegalRevision,
} from "../data/legalDocuments";

/**
 * Архив редакций юридических документов.
 *
 * Требование: старые редакции должны воспроизводиться. Поэтому здесь каждая
 * редакция — постоянная ссылка на неизменный PDF плюс его SHA-256, по которому
 * можно подтвердить, что скачанный файл байт в байт тот же, что был размещён.
 */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
}

function RevisionCard({ revision }: { revision: LegalRevision }) {
  const url = legalFileUrl(revision);
  return (
    <div
      className={`rounded-2xl border p-5 ${
        revision.current ? "border-purple-300 bg-purple-50/50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-gray-900">{revision.revision}</h3>
            {revision.current ? (
              <span className="rounded-full bg-purple-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                действующая
              </span>
            ) : (
              <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                архивная
              </span>
            )}
          </div>
          <dl className="mt-3 space-y-1 text-sm text-gray-600">
            {revision.effectiveFrom && (
              <div>
                <dt className="inline font-semibold text-gray-800">Дата редакции: </dt>
                <dd className="inline">{formatDate(revision.effectiveFrom)}</dd>
              </div>
            )}
            <div>
              <dt className="inline font-semibold text-gray-800">Размещена на сайте: </dt>
              <dd className="inline">{formatDate(revision.publishedOn)}</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-gray-800">Файл: </dt>
              <dd className="inline break-all">
                {revision.file} · {formatBytes(revision.bytes)} · {revision.bytes} байт
              </dd>
            </div>
          </dl>
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-800">SHA-256:</p>
            <p className="mt-1 break-all rounded-lg bg-gray-100 px-3 py-2 font-mono text-xs leading-5 text-gray-700">
              {revision.sha256}
            </p>
          </div>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          <Download className="h-4 w-4" />
          Открыть PDF
        </a>
      </div>
    </div>
  );
}

export function LegalArchive() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main id="main" className="flex-1 container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Архив редакций документов</h1>
            </div>
            <div className="mt-5 space-y-3 text-sm leading-7 text-gray-700">
              <p>
                Здесь хранятся все редакции публичной оферты и согласий — действующие и архивные.
                Каждая редакция размещена отдельным файлом, который никогда не перезаписывается:
                новая редакция получает новое имя и новый адрес. Ранее размещённые файлы остаются
                доступными по прежним ссылкам.
              </p>
              <p>
                Рядом с каждой редакцией указан SHA-256 её файла. По нему можно проверить, что
                скачанный документ побайтово совпадает с тем, который был размещён на сайте:{" "}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">
                  shasum -a 256 имя-файла.pdf
                </code>
                .
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {LEGAL_DOCUMENTS.map((doc) => (
              <section
                key={doc.id}
                id={doc.id}
                className="scroll-mt-28 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-8"
              >
                <div className="flex items-start gap-3 border-b border-gray-200 pb-4">
                  <FileText className="mt-1 h-5 w-5 shrink-0 text-purple-700" />
                  <div>
                    <h2 className="text-lg font-bold leading-snug text-gray-900">{doc.title}</h2>
                    {doc.page && (
                      <Link
                        to={doc.page}
                        className="mt-1 inline-block text-sm font-semibold text-purple-700 underline hover:text-purple-800"
                      >
                        Читать текст действующей редакции на сайте
                      </Link>
                    )}
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  {doc.revisions.map((revision) => (
                    <RevisionCard key={revision.file} revision={revision} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8">
            <Link
              to="/education-info/documents"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Вернуться к документам
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
