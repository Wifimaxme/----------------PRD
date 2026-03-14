import { Link } from "react-router";
import { FileText, Users, GraduationCap, Building, Wallet, Briefcase, Heart, Globe } from "lucide-react";

const sections = [
  {
    title: "Основные сведения",
    icon: Building,
    description: "Полное наименование, руководитель, реквизиты, адреса, режим работы, контакты",
    link: "/education-info/basic",
  },
  {
    title: "Структура и органы управления",
    icon: Users,
    description: "Схема управления организацией и структурные подразделения",
    link: "/education-info/structure",
  },
  {
    title: "Документы",
    icon: FileText,
    description: "Устав, свидетельства, правила, оферта, политика обработки ПДн",
    link: "/education-info/documents",
  },
  {
    title: "Образование",
    icon: GraduationCap,
    description: "Программа, учебный план, календарный график, регламент СанПиН",
    link: "/education-info/education",
  },
  {
    title: "Руководство. Педагогический состав",
    icon: Users,
    description: "Информация о тренерском составе, образование, лицензии",
    link: "/education-info/staff",
  },
  {
    title: "Материально-техническое обеспечение",
    icon: Building,
    description: "Помещения, инвентарь, охрана здоровья",
    link: "/education-info/materials",
  },
  {
    title: "Платные образовательные услуги",
    icon: Wallet,
    description: "Стоимость обучения, договор-оферта, условия оплаты",
    link: "/education-info/paid-services",
  },
  {
    title: "Финансово-хозяйственная деятельность",
    icon: Briefcase,
    description: "Информация о финансировании и расходовании средств",
    link: "/education-info/finance",
  },
  {
    title: "Вакантные места для приёма",
    icon: Users,
    description: "Информация о доступных местах в группах",
    link: "/education-info/vacancies",
  },
  {
    title: "Доступная среда",
    icon: Heart,
    description: "Условия для лиц с ОВЗ, инклюзивные проекты",
    link: "/education-info/accessibility",
  },
  {
    title: "Международное сотрудничество",
    icon: Globe,
    description: "Сведения о международных договорах",
    link: "/education-info/international",
  },
];

export function EducationInfo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-purple-600 hover:text-purple-700 text-sm mb-4 inline-block">
            ← Вернуться на главную
          </Link>
          <h1 className="text-3xl font-bold text-center">
            Сведения об образовательной организации
          </h1>
          <p className="text-center mt-2 text-gray-600">
            ООО «Чемпион и К»
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-700">
            Данный раздел содержит полную информацию об образовательной организации в соответствии 
            с требованиями <strong>Приказа Рособрнадзора № 1493</strong> и необходим для прохождения 
            процедуры лицензирования образовательной деятельности.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Link
                key={index}
                to={section.link}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border border-gray-200 hover:border-purple-300"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{section.title}</h3>
                <p className="text-sm text-gray-600">{section.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2026 ООО «Чемпион и К». ИНН: 5403027269, ОГРН: 1175476013888</p>
        </div>
      </div>
    </div>
  );
}
