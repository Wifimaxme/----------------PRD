import { EducationLayout } from "../components/EducationLayout";
import { Users, UserCircle, Award } from "lucide-react";

export function Structure() {
  return (
    <EducationLayout title="Структура и органы управления образовательной организацией">
      <div className="space-y-8">
        <section>
          <h3 className="font-bold text-lg mb-4">Схема управления организацией</h3>
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="max-w-2xl mx-auto">
              <div className="bg-purple-600 text-white p-4 rounded-lg text-center mb-8">
                <UserCircle className="w-12 h-12 mx-auto mb-2" />
                <p className="font-bold">Директор</p>
                <p className="text-sm">Рублевская Юлия Владимировна</p>
                <p className="text-xs text-purple-100 mt-1">Единоличный исполнительный орган</p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="w-1 h-12 bg-gray-300"></div>
              </div>

              <div className="bg-white border-2 border-purple-300 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h4 className="font-bold">Тренерско-педагогический состав</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <Award className="w-4 h-4 text-purple-600 mb-1" />
                    <p className="font-semibold">Максим Кулаков</p>
                    <p className="text-xs text-gray-600">Лицензия C-UEFA</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <Award className="w-4 h-4 text-purple-600 mb-1" />
                    <p className="font-semibold">Дмитрий Бобин</p>
                    <p className="text-xs text-gray-600">Лицензия РФС C</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <Award className="w-4 h-4 text-purple-600 mb-1" />
                    <p className="font-semibold">Константин Юсупов</p>
                    <p className="text-xs text-gray-600">Тренер</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <Award className="w-4 h-4 text-purple-600 mb-1" />
                    <p className="font-semibold">Родион Свитницкий</p>
                    <p className="text-xs text-gray-600">Тренер</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <Award className="w-4 h-4 text-purple-600 mb-1" />
                    <p className="font-semibold">Глеб Пирогов</p>
                    <p className="text-xs text-gray-600">Тренер</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4">Положения о структурных подразделениях</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              Образовательная организация не имеет обособленных структурных подразделений.
              Все тренерско-педагогические работники непосредственно подчиняются директору.
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4">Органы управления</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Наименование органа</th>
                  <th className="border border-gray-300 p-3 text-left">Руководитель</th>
                  <th className="border border-gray-300 p-3 text-left">Полномочия</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">Директор</td>
                  <td className="border border-gray-300 p-3">Рублевская Юлия Владимировна</td>
                  <td className="border border-gray-300 p-3">
                    Единоличный исполнительный орган, осуществляющий текущее руководство
                    деятельностью организации
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </EducationLayout>
  );
}
