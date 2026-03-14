import { useState } from "react";
import { EducationLayout } from "../components/EducationLayout";
import { GraduationCap, Calendar, Clock, FileText, CheckCircle2 } from "lucide-react";
import { downloadEducationProgramPdf } from "../utils/educationProgramPdf";

export function Education() {
  const [isDownloadingProgram, setIsDownloadingProgram] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleProgramDownload = async () => {
    setIsDownloadingProgram(true);
    setDownloadError(null);

    try {
      await downloadEducationProgramPdf();
    } catch (error) {
      console.error(error);
      setDownloadError("Не удалось подготовить PDF программы. Попробуйте еще раз.");
    } finally {
      setIsDownloadingProgram(false);
    }
  };

  return (
    <EducationLayout title="Образование">
      <div className="space-y-8">
        {/* Program */}
        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            Образовательная программа
          </h3>
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg space-y-3">
            <p className="font-semibold">
              Дополнительная общеразвивающая программа физкультурно-спортивной направленности «Футбол»
            </p>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Возраст обучающихся:</p>
                <p className="font-semibold">3-7 лет</p>
              </div>
              <div>
                <p className="text-gray-600">Форма обучения:</p>
                <p className="font-semibold">Очная</p>
              </div>
              <div>
                <p className="text-gray-600">Составители программы:</p>
                <p className="font-semibold">Бондаренко А.Ю. (лицензия «С»), Окунев И.Н. (лицензия «С» UEFA)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar */}
        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Учебный план и календарный график
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Параметр</th>
                  <th className="border border-gray-300 p-3 text-left">Значение</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">Учебный период</td>
                  <td className="border border-gray-300 p-3 font-semibold">36 учебных недель (сентябрь - май)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Частота занятий</td>
                  <td className="border border-gray-300 p-3 font-semibold">2 раза в неделю</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Общее количество занятий</td>
                  <td className="border border-gray-300 p-3 font-semibold">72 занятия в год</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Контрольные занятия</td>
                  <td className="border border-gray-300 p-3 font-semibold">2 занятия (декабрь, май)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SanPin */}
        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Регламент СанПиН 1.2.3685-21 (Таблица 6.6)
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700">
              <strong>Важно:</strong> Продолжительность тренировок строго дифференцирована по возрастным группам 
              в соответствии с санитарными нормами и правилами.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="border border-purple-500 p-3 text-left">Возрастная группа</th>
                  <th className="border border-purple-500 p-3 text-left">Максимальная продолжительность</th>
                  <th className="border border-purple-500 p-3 text-left">Наполняемость группы</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">3-4 года</td>
                  <td className="border border-gray-300 p-3 font-bold text-purple-600">до 15 минут</td>
                  <td className="border border-gray-300 p-3">до 10 человек</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">4-5 лет</td>
                  <td className="border border-gray-300 p-3 font-bold text-purple-600">до 20 минут</td>
                  <td className="border border-gray-300 p-3">до 10 человек</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">5-6 лет</td>
                  <td className="border border-gray-300 p-3 font-bold text-purple-600">до 25 минут</td>
                  <td className="border border-gray-300 p-3">до 10 человек</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">6-7 лет</td>
                  <td className="border border-gray-300 p-3 font-bold text-purple-600">до 30 минут</td>
                  <td className="border border-gray-300 p-3">до 10 человек</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              Окончание занятий для всех возрастных групп строго до 19:30 в соответствии с требованиями СанПиН.
            </p>
          </div>
        </section>

        {/* Program Sections */}
        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Разделы программы
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-purple-300 p-4 rounded-lg">
              <h4 className="font-bold mb-2 text-purple-700">ОФП</h4>
              <p className="text-sm text-gray-600">Общая физическая подготовка</p>
              <ul className="mt-3 space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Развитие координации</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Укрепление мышц</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Развитие выносливости</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-orange-300 p-4 rounded-lg">
              <h4 className="font-bold mb-2 text-orange-700">СФП</h4>
              <p className="text-sm text-gray-600">Специальная физическая подготовка</p>
              <ul className="mt-3 space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5" />
                  <span>Футбольная ловкость</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5" />
                  <span>Скоростные качества</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5" />
                  <span>Работа с мячом</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-purple-300 p-4 rounded-lg">
              <h4 className="font-bold mb-2 text-purple-700">ТТМ</h4>
              <p className="text-sm text-gray-600">Технико-тактическое мастерство</p>
              <ul className="mt-3 space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Техника владения мячом</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Игровое мышление</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Взаимодействие в команде</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Download */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold mb-4">Документы для скачивания</h4>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => void handleProgramDownload()}
              disabled={isDownloadingProgram}
              className="w-full md:w-auto bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 disabled:cursor-wait disabled:opacity-70"
            >
              <FileText className="w-5 h-5" />
              {isDownloadingProgram ? "Готовим PDF..." : "Скачать полную образовательную программу (PDF)"}
            </button>
            <p className="text-xs text-gray-600 mt-2">
              PDF формируется автоматически на основе данных официального раздела сайта.
            </p>
            {downloadError ? (
              <p className="text-sm text-red-600 mt-2">{downloadError}</p>
            ) : null}
          </div>
        </section>
      </div>
    </EducationLayout>
  );
}
