import { EducationLayout } from "../components/EducationLayout";
import { Users, CheckCircle2, Calendar } from "lucide-react";

export function Vacancies() {
  return (
    <EducationLayout title="Вакантные места для приёма (перевода) обучающихся">
      <div className="space-y-8">
        <section>
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg mb-6">
            <p className="text-gray-700">
              Информация о количестве вакантных мест для приёма (перевода) обучающихся по программе 
              дополнительного образования физкультурно-спортивной направленности «Футбол» 
              на <strong>2025/2026 учебный год</strong>.
            </p>
          </div>

          <div className="bg-green-50 border-2 border-green-300 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-lg">Набор открыт!</h3>
            </div>
            <p className="text-gray-700">
              Мы приглашаем детей 3-7 лет на занятия футболом. Запись доступна в течение всего учебного года.
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Наличие свободных мест по возрастным группам
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="border border-purple-500 p-3 text-left">Возрастная группа</th>
                  <th className="border border-purple-500 p-3 text-left">Площадка (ДОУ)</th>
                  <th className="border border-purple-500 p-3 text-center">Наполняемость</th>
                  <th className="border border-purple-500 p-3 text-center">Вакантных мест</th>
                  <th className="border border-purple-500 p-3 text-center">Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">3-4 года</td>
                  <td className="border border-gray-300 p-3">МКДОУ д/с № 12</td>
                  <td className="border border-gray-300 p-3 text-center">7/10</td>
                  <td className="border border-gray-300 p-3 text-center font-bold text-green-600">3</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Доступно
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">4-5 лет</td>
                  <td className="border border-gray-300 p-3">МКДОУ д/с № 12</td>
                  <td className="border border-gray-300 p-3 text-center">8/10</td>
                  <td className="border border-gray-300 p-3 text-center font-bold text-green-600">2</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Доступно
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">5-6 лет</td>
                  <td className="border border-gray-300 p-3">МКДОУ д/с № 25</td>
                  <td className="border border-gray-300 p-3 text-center">9/10</td>
                  <td className="border border-gray-300 p-3 text-center font-bold text-green-600">1</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Доступно
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">6-7 лет</td>
                  <td className="border border-gray-300 p-3">МКДОУ д/с № 38</td>
                  <td className="border border-gray-300 p-3 text-center">6/10</td>
                  <td className="border border-gray-300 p-3 text-center font-bold text-green-600">4</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Доступно
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">3-4 года</td>
                  <td className="border border-gray-300 p-3">МКДОУ д/с № 47</td>
                  <td className="border border-gray-300 p-3 text-center">5/10</td>
                  <td className="border border-gray-300 p-3 text-center font-bold text-green-600">5</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Доступно
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">5-6 лет</td>
                  <td className="border border-gray-300 p-3">МКДОУ д/с № 89</td>
                  <td className="border border-gray-300 p-3 text-center">10/10</td>
                  <td className="border border-gray-300 p-3 text-center font-bold text-gray-500">0</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Лист ожидания
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            * Данные обновляются еженедельно. Последнее обновление: 12 марта 2026 г.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Общая статистика
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-purple-300 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">15</div>
              <p className="text-gray-700">Всего групп</p>
            </div>
            <div className="bg-white border-2 border-green-300 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">25</div>
              <p className="text-gray-700">Свободных мест</p>
            </div>
            <div className="bg-white border-2 border-orange-300 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">10</div>
              <p className="text-gray-700">Макс. размер группы</p>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h4 className="font-semibold mb-3">Как записаться?</h4>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                1
              </div>
              <p>
                Заполните форму записи на сайте или позвоните по телефону{" "}
                <a href="tel:+79138927059" className="text-purple-600 hover:underline font-semibold">
                  8-913-892-70-59
                </a>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                2
              </div>
              <p>Выберите удобную площадку и возрастную группу</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                3
              </div>
              <p>Приходите на бесплатное пробное занятие</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                4
              </div>
              <p>При желании продолжить — оплачиваете абонемент онлайн</p>
            </div>
          </div>
        </section>

        <section className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Обратите внимание:</strong> Норматив наполняемости групп — до 10 человек. 
            Такой размер группы позволяет тренеру уделить внимание каждому ребёнку и обеспечить 
            индивидуальный подход.
          </p>
        </section>
      </div>
    </EducationLayout>
  );
}
