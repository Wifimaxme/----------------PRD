import { EducationLayout } from "../components/EducationLayout";
import { FileText, Download, Shield } from "lucide-react";

type DocumentItem = {
  id: string;
  name: string;
  type: string;
  size: string;
  signed: boolean;
  href?: string;
};

const documents: DocumentItem[] = [
  {
    id: "charter",
    name: "Устав ООО «Чемпион и К»",
    type: "PDF",
    size: "2.4 МБ",
    signed: true,
  },
  {
    id: "inn",
    name: "Свидетельство ИНН",
    type: "PDF",
    size: "0.8 МБ",
    signed: true,
  },
  {
    id: "ogrn",
    name: "Свидетельство ОГРН",
    type: "PDF",
    size: "0.9 МБ",
    signed: true,
  },
  {
    id: "student-rules",
    name: "Правила внутреннего распорядка обучающихся",
    type: "PDF",
    size: "1.2 МБ",
    signed: true,
  },
  {
    id: "admission-rules",
    name: "Правила приема, отчисления и перевода обучающихся",
    type: "PDF",
    size: "1.5 МБ",
    signed: true,
  },
  {
    id: "public-offer",
    name: "Публичный Договор-оферта на оказание платных образовательных услуг",
    type: "HTML",
    size: "полный текст",
    signed: false,
    href: "/oferta",
  },
  {
    id: "privacy-policy",
    name: "Политика обработки персональных данных (ФЗ-152)",
    type: "HTML",
    size: "редакция от 13.03.2026",
    signed: false,
    href: "/privacy-policy",
  },
  {
    id: "personal-data-consent",
    name: "Согласие на обработку персональных данных родителей и детей",
    type: "Оферта",
    size: "раздел 7.3",
    signed: false,
    href: "/oferta#personal-data-consent",
  },
];

export function Documents() {
  return (
    <EducationLayout title="Документы">
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
          <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Важно:</p>
            <p>
              Документы и обязательные сведения размещаются в машиночитаемом формате либо в виде
              отдельных HTML-страниц сайта. Для части документов используются ссылки на
              соответствующие разделы оферты и локальных актов.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {documents.map((doc) => {
            const isAvailable = Boolean(doc.href);

            return (
              <div
                key={doc.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">{doc.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        {doc.signed && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-green-600">
                              <Shield className="w-3 h-3" />
                              Подписан УКЭП
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {isAvailable ? (
                    <a
                      href={doc.href}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      Открыть
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="bg-gray-100 text-gray-400 cursor-not-allowed px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      Скоро
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Дополнительная информация</h4>
          <p className="text-sm text-gray-700">
            Для получения оригиналов документов или дополнительной информации обращайтесь 
            по адресу электронной почты{" "}
            <a href="mailto:wifimaxme@gmail.com" className="text-purple-600 hover:underline">
              wifimaxme@gmail.com
            </a>{" "}
            или по телефону{" "}
            <a href="tel:+79138927059" className="text-purple-600 hover:underline">
              8-913-892-70-59
            </a>
          </p>
        </div>
      </div>
    </EducationLayout>
  );
}
