import { EducationLayout } from "../components/EducationLayout";

export function Vacancies() {
  return (
    <EducationLayout title="Вакантные места для приёма (перевода) обучающихся">
      <div className="space-y-8">
        <section className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <p className="text-gray-700 leading-relaxed">
            Приём обучающихся осуществляется на места с оплатой стоимости за счёт средств физических и (или) 
            юридических лиц по всем образовательным программам без ограничений. Квоты и контрольные цифры 
            на количество вакантных мест для приёма (перевода) за счет бюджетных ассигнований федерального бюджета, 
            бюджетов субъекта Российской Федерации или местных бюджетов не установлены.
          </p>
        </section>
      </div>
    </EducationLayout>
  );
}
