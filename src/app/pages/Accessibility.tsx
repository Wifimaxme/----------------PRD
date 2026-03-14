import { EducationLayout } from "../components/EducationLayout";
import { Heart, Users, Building, CheckCircle2 } from "lucide-react";

export function Accessibility() {
  return (
    <EducationLayout title="Доступная среда">
      <div className="space-y-8">
        <section>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
            <p className="text-gray-700">
              ООО «Чемпион и К» стремится обеспечить доступность образовательных услуг для всех детей, 
              включая детей с ограниченными возможностями здоровья (ОВЗ) и инвалидностью.
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-600" />
            Инфраструктурная доступность
          </h3>
          
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Условие доступности</th>
                  <th className="border border-gray-300 p-3 text-center">Наличие</th>
                  <th className="border border-gray-300 p-3 text-left">Примечание</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">Пандусы на входе</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </td>
                  <td className="border border-gray-300 p-3 text-sm">
                    На большинстве площадок (базовые ДОУ)
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">Широкие дверные проёмы</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </td>
                  <td className="border border-gray-300 p-3 text-sm">
                    Во всех используемых помещениях
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Расположение залов на 1-м этаже</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </td>
                  <td className="border border-gray-300 p-3 text-sm">
                    Преимущественно на первом этаже или с лифтом
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">Адаптированные санузлы</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className="text-orange-600 font-bold">~</span>
                  </td>
                  <td className="border border-gray-300 p-3 text-sm">
                    Частично (зависит от конкретного ДОУ)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Важно:</strong> Занятия проводятся на базе муниципальных детских садов. 
              Уровень доступности может различаться в зависимости от конкретного учреждения. 
              Мы готовы помочь подобрать наиболее подходящую площадку с учётом индивидуальных потребностей.
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Условия для обучения детей с ОВЗ
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 p-5 rounded-lg">
              <h4 className="font-semibold mb-3">Доступные программы</h4>
              <p className="text-sm text-gray-700 mb-3">
                Наша образовательная программа может быть адаптирована для детей с различными 
                особенностями развития при согласовании с родителями и тренером.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Индивидуальный подход к нагрузке и темпу освоения программы</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Возможность присутствия родителя на занятии</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Малые группы (до 10 человек) для максимального внимания каждому ребёнку</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-lg">
              <h4 className="font-semibold mb-3">Подготовка тренеров</h4>
              <p className="text-sm text-gray-700">
                Наши тренеры имеют опыт работы с детьми разного уровня подготовки и готовы 
                применять методы, учитывающие индивидуальные особенности каждого ребёнка.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-600" />
            Инклюзивный футбол и социальное партнёрство
          </h3>
          
          <div className="bg-gradient-to-br from-purple-600 to-orange-500 text-white p-6 rounded-lg mb-4">
            <h4 className="font-bold text-xl mb-3">Сотрудничество с СБФ «Только вместе»</h4>
            <p className="text-purple-100 mb-4">
              Мы активно поддерживаем проекты инклюзивного футбола и сотрудничаем с 
              Сибирским благотворительным фондом «Только вместе», помогая детям с особенностями 
              развития заниматься спортом.
            </p>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-sm">
                Наша миссия — сделать футбол доступным для всех детей, независимо от их 
                физических и интеллектуальных особенностей. Спорт объединяет и развивает!
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-purple-300 p-5 rounded-lg">
              <h4 className="font-semibold mb-2">Наши принципы</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Равные возможности для всех детей</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Уважение индивидуальности каждого ребёнка</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Создание безопасной и поддерживающей среды</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-orange-300 p-5 rounded-lg">
              <h4 className="font-semibold mb-2">Специальные инициативы</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-orange-600 mt-0.5" />
                  <span>Благотворительные занятия для детей с ОВЗ</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-orange-600 mt-0.5" />
                  <span>Участие в инклюзивных фестивалях</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-orange-600 mt-0.5" />
                  <span>Повышение квалификации тренеров по работе с детьми с ОВЗ</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
          <h4 className="font-semibold mb-3">Как получить консультацию?</h4>
          <p className="text-sm text-gray-700 mb-4">
            Если у вас есть вопросы о возможности посещения занятий ребёнком с особенностями развития, 
            мы готовы провести индивидуальную консультацию и подобрать оптимальные условия.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+79138927059"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-center"
            >
              Позвонить: 8-913-892-70-59
            </a>
            <a
              href="mailto:wifimaxme@gmail.com"
              className="bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition text-center"
            >
              Написать на email
            </a>
          </div>
        </section>

        <section className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            Информация о специальных условиях для обучения инвалидов и лиц с ОВЗ регулярно обновляется. 
            Мы постоянно работаем над улучшением доступности наших услуг.
          </p>
        </section>
      </div>
    </EducationLayout>
  );
}
