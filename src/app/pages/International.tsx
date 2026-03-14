import { EducationLayout } from "../components/EducationLayout";
import { Globe, Info } from "lucide-react";

export function International() {
  return (
    <EducationLayout title="Международное сотрудничество">
      <div className="space-y-8">
        <section>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-2">Информация о международном сотрудничестве</p>
              <p>
                В соответствии с требованиями законодательства Российской Федерации, 
                образовательные организации обязаны размещать сведения о наличии или 
                отсутствии международного сотрудничества.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            Договоры с иностранными организациями
          </h3>
          
          <div className="bg-white border-2 border-gray-300 p-8 rounded-lg text-center">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="font-bold text-xl mb-3">
              Международные договоры отсутствуют
            </h4>
            <p className="text-gray-700 max-w-2xl mx-auto">
              На текущий момент ООО «Чемпион и К» не имеет заключённых или планируемых 
              к заключению договоров с иностранными и (или) международными организациями 
              по вопросам образования и науки.
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4">Образовательная деятельность</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Направление</th>
                  <th className="border border-gray-300 p-3 text-center">Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">
                    Численность иностранных обучающихся по основным и дополнительным 
                    образовательным программам
                  </td>
                  <td className="border border-gray-300 p-3 text-center font-semibold">0 человек</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">
                    Численность иностранных педагогических и научных работников
                  </td>
                  <td className="border border-gray-300 p-3 text-center font-semibold">0 человек</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">
                    Иностранные и (или) международные организации, с которыми российской 
                    образовательной организацией заключены договоры по вопросам образования и науки
                  </td>
                  <td className="border border-gray-300 p-3 text-center font-semibold">Отсутствуют</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4">Используемые международные методики</h3>
          
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              Несмотря на отсутствие формальных международных договоров, в нашей образовательной 
              программе используются признанные мировые методики обучения футболу:
            </p>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Coerver Coaching</h4>
                <p className="text-sm text-gray-700">
                  Голландская методика, разработанная Вилом Коеверо, используется футбольными 
                  академиями по всему миру. Основана на принципе развития технических навыков 
                  от простого к сложному.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-2">FUNino</h4>
                <p className="text-sm text-gray-700">
                  Немецкая методика тренировок для детей младшего возраста, разработанная 
                  специалистами Немецкого футбольного союза (DFB). Формат игр 3×3 или 4×4 
                  с несколькими воротами.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Лицензии UEFA</h4>
                <p className="text-sm text-gray-700">
                  Наши тренеры имеют лицензии UEFA (Союз европейских футбольных ассоциаций) 
                  категории C, что подтверждает соответствие международным стандартам 
                  подготовки тренеров.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold mb-3">Актуальность информации</h4>
          <p className="text-sm text-gray-700">
            Данная информация актуальна на 12 марта 2026 года. В случае заключения международных 
            договоров или изменения статуса международного сотрудничества, сведения будут 
            незамедлительно обновлены на данной странице.
          </p>
        </section>

        <section className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Примечание:</strong> Несмотря на отсутствие международных договоров, 
            организация открыта к сотрудничеству и обмену опытом с зарубежными коллегами 
            в области детского спортивного образования.
          </p>
        </section>
      </div>
    </EducationLayout>
  );
}
