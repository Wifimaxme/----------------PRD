import { EducationLayout } from "../components/EducationLayout";

type InfoRow = {
  label: string;
  value: React.ReactNode;
};

const generalRows: InfoRow[] = [
  {
    label: "Полное наименование организации",
    value: "Общество с ограниченной ответственностью «Чемпион и К»",
  },
  {
    label: "Сокращенное наименование организации",
    value: "ООО «Чемпион и К»",
  },
  {
    label: "Организационно-правовая форма",
    value: "Общество с ограниченной ответственностью",
  },
  {
    label: "Руководитель",
    value: "Директор Рублевская Юлия Владимировна",
  },
  {
    label: "Место нахождения организации",
    value: "Российская Федерация, г. Новосибирск",
  },
  {
    label: "Юридический адрес",
    value: "630088, Новосибирская область, город Новосибирск, улица 9-ый бронный переулок, дом 37",
  },
];

const requisitesRows: InfoRow[] = [
  { label: "ИНН", value: "5403027269" },
  { label: "ОГРН", value: "1175476013888" },
  { label: "КПП", value: "540301001" },
  { label: "Банк", value: 'АО "ТБанк"' },
];

const scheduleRows: InfoRow[] = [
  { label: "Администрация", value: "Понедельник - пятница, с 09:00 до 18:00" },
  { label: "Учебно-тренировочные занятия", value: "Понедельник - пятница, с 17:00 до 19:00" },
  {
    label: "Дополнительная информация",
    value:
      "Занятия для дошкольников завершаются не позднее 19:00 в соответствии с требованиями СанПиН 1.2.3685-21.",
  },
];

const contactRows: InfoRow[] = [
  {
    label: "Телефон",
    value: (
      <a href="tel:+79138927059" className="text-purple-700 hover:underline">
        8-913-892-70-59
      </a>
    ),
  },
  {
    label: "Электронная почта",
    value: (
      <a href="mailto:wifimaxme@gmail.com" className="text-purple-700 hover:underline">
        wifimaxme@gmail.com
      </a>
    ),
  },
  {
    label: "Город осуществления деятельности",
    value: "Новосибирск",
  },
];

const educationRows: InfoRow[] = [
  {
    label: "Вид реализуемой программы",
    value: "Дополнительная общеразвивающая программа физкультурно-спортивной направленности «Футбол»",
  },
  {
    label: "Форма обучения",
    value: "Очная",
  },
  {
    label: "Возраст обучающихся",
    value: "3-7 лет",
  },
  {
    label: "Место реализации программы",
    value: "На базе муниципальных дошкольных образовательных учреждений г. Новосибирска",
  },
];

const activityAddresses = [
  "630019, Новосибирская область, город Новосибирск, улица Зорге, дом 239/1",
];

function InfoTable({ rows }: { rows: InfoRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[640px] border-collapse bg-white">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-gray-200 last:border-b-0">
              <th className="w-[34%] bg-gray-50 px-5 py-4 text-left align-top text-sm font-semibold text-gray-800">
                {row.label}
              </th>
              <td className="px-5 py-4 text-sm leading-7 text-gray-700">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="border-b border-gray-200 pb-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export function BasicInfo() {
  return (
    <EducationLayout title="Основные сведения">
      <div className="space-y-6">
        <section className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-5">
          <p className="text-sm leading-7 text-gray-700">
            В разделе размещены основные сведения об образовательной организации ООО «Чемпион и К»,
            включая информацию о руководителе, реквизитах, режиме работы, контактах и местах
            осуществления образовательной деятельности.
          </p>
        </section>

        <InfoSection id="general" title="Общая информация">
          <InfoTable rows={generalRows} />
        </InfoSection>

        <InfoSection id="requisites" title="Реквизиты организации">
          <InfoTable rows={requisitesRows} />
        </InfoSection>

        <InfoSection id="activity-addresses" title="Адреса осуществления образовательной деятельности">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 bg-gray-50 px-5 py-4 text-sm leading-7 text-gray-700">
              Образовательная деятельность осуществляется на базе муниципальных дошкольных образовательных
              учреждений г. Новосибирска.
            </div>
            <ul className="divide-y divide-gray-200">
              {activityAddresses.map((address) => (
                <li key={address} className="px-5 py-4 text-sm text-gray-700">
                  {address}
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600">
              Полный перечень адресов предоставляется по запросу.
            </div>
          </div>
        </InfoSection>

        <InfoSection id="schedule" title="Режим и график работы">
          <InfoTable rows={scheduleRows} />
        </InfoSection>

        <InfoSection id="contacts" title="Контактная информация">
          <InfoTable rows={contactRows} />
        </InfoSection>

        <InfoSection id="education-details" title="Сведения об образовательной деятельности">
          <InfoTable rows={educationRows} />
        </InfoSection>
      </div>
    </EducationLayout>
  );
}
