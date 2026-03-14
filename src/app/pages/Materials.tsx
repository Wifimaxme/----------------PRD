import { EducationLayout } from "../components/EducationLayout";
import { Building, Package, Heart } from "lucide-react";

export function Materials() {
  return (
    <EducationLayout title="Материально-техническое обеспечение и оснащённость образовательного процесса">
      <div className="space-y-8">
        {/* Facilities */}
        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-600" />
            Помещения для занятий
          </h3>
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700">
              Занятия проводятся в спортивных и физкультурных залах муниципальных дошкольных 
              образовательных учреждений г. Новосибирска. Все помещения соответствуют требованиям 
              СанПиН по площади, высоте потолков и освещённости.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Параметр</th>
                  <th className="border border-gray-300 p-3 text-left">Требование</th>
                  <th className="border border-gray-300 p-3 text-left">Соответствие</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">Площадь зала</td>
                  <td className="border border-gray-300 p-3">Не менее 50 м²</td>
                  <td className="border border-gray-300 p-3 text-green-600 font-semibold">✓ Соответствует</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">Высота потолков</td>
                  <td className="border border-gray-300 p-3">Не менее 3 м</td>
                  <td className="border border-gray-300 p-3 text-green-600 font-semibold">✓ Соответствует</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Освещённость</td>
                  <td className="border border-gray-300 p-3">Естественное и искусственное</td>
                  <td className="border border-gray-300 p-3 text-green-600 font-semibold">✓ Соответствует</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">Вентиляция</td>
                  <td className="border border-gray-300 p-3">Приточно-вытяжная</td>
                  <td className="border border-gray-300 p-3 text-green-600 font-semibold">✓ Соответствует</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Equipment */}
        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            Спортивный инвентарь
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-semibold mb-3 text-purple-700">Футбольное оборудование</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Футбольные мячи размер №3 (для детей 6-8 лет)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Волейбольные и теннисные мячи (для малышей 3-5 лет)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Малые ворота (размер адаптирован для дошкольников)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Манишки (жилеты) двух расцветок для деления на команды</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-semibold mb-3 text-orange-700">Тренировочное оборудование</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Конусы и маркеры для разметки</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Тренировочные стойки и барьеры</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Гимнастические кольца и палки</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Координационные лестницы</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Health & Safety */}
        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-600" />
            Охрана здоровья обучающихся
          </h3>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Медицинское обеспечение</h4>
              <p className="text-sm text-gray-700">
                В каждом дошкольном учреждении, на базе которого проводятся занятия, имеется 
                медицинский кабинет для оказания первой доврачебной помощи. Доступ к медицинским 
                кабинетам обеспечен в соответствии с договорами с детскими садами.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Питьевой режим</h4>
              <p className="text-sm text-gray-700">
                Во время занятий обеспечивается доступ к питьевой воде. В залах установлены 
                кулеры или предоставляется бутилированная вода.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Безопасность</h4>
              <p className="text-sm text-gray-700">
                Все помещения соответствуют требованиям пожарной безопасности. Тренеры прошли 
                обучение по оказанию первой помощи. На занятиях поддерживается оптимальная 
                физическая нагрузка в соответствии с возрастом и СанПиН.
              </p>
            </div>
          </div>
        </section>

        {/* Access */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold mb-3">Доступность помещений</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-2">Для обучающихся:</p>
              <p className="text-gray-700">
                Все помещения находятся на первом этаже или имеют доступ по пандусам. 
                Двери достаточной ширины для прохода.
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Для родителей:</p>
              <p className="text-gray-700">
                Родители могут присутствовать на занятиях по согласованию с тренером. 
                Предусмотрены зоны ожидания.
              </p>
            </div>
          </div>
        </section>
      </div>
    </EducationLayout>
  );
}
