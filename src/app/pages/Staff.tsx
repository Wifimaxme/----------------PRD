import { EducationLayout } from "../components/EducationLayout";
import { Award, GraduationCap, Trophy } from "lucide-react";

const staff = [
  {
    name: "Бобин Дмитрий",
    position: "Тренер",
    education: "СГУПС (Новосибирск)",
    license: "Тренерская лицензия РФС категории «C»",
    achievements: "КМС по футболу, экс-игрок ФК «Динамо» (Барнаул)",
  },
  {
    name: "Кулаков Максим Станиславович",
    position: "Тренер",
    education: "Высшее (СГУГиТ)",
    license: "Тренерская лицензия C-UEFA",
    experience: "Игровой стаж: 7 лет, тренерский стаж: 5 лет",
  },
  {
    name: "Свитницкий Родион",
    position: "Тренер",
    education: "ООО МУЦД (Физическая культура и спорт, тренер)",
    experience: "Тренерский стаж: 5 лет",
  },
  {
    name: "Юсупов Константин",
    position: "Тренер",
    education: "Среднее-специальное (физическая культура)",
    experience: "Тренерский стаж: 3 года, игровой стаж: 10 лет",
  },
  {
    name: "Пирогов Глеб",
    position: "Тренер",
    education: "Славгородский педагогический колледж (тренер по физической культуре)",
    achievements: "Игрок команды СФЛ",
  },
];

export function Staff() {
  return (
    <EducationLayout title="Руководство. Педагогический (научно-педагогический) состав">
      <div className="space-y-6">
        {/* Director */}
        <section className="bg-purple-50 border-2 border-purple-300 p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Руководитель организации
          </h3>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-lg">Рублевская Юлия Владимировна</p>
            <p className="text-gray-600">Директор</p>
          </div>
        </section>

        {/* Coaching Staff */}
        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            Тренерско-педагогический состав
          </h3>
          
          <div className="space-y-4">
            {staff.map((person, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1">{person.name}</h4>
                    <p className="text-sm text-purple-600 mb-3">{person.position}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-gray-600">Образование:</p>
                          <p className="font-semibold">{person.education}</p>
                        </div>
                      </div>

                      {person.license && (
                        <div className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                          {person.license}
                        </div>
                      )}

                      {person.experience && (
                        <div className="flex items-start gap-2 mt-2">
                          <Trophy className="w-4 h-4 text-gray-500 mt-0.5" />
                          <p className="text-gray-700">{person.experience}</p>
                        </div>
                      )}

                      {person.achievements && (
                        <div className="flex items-start gap-2 mt-2">
                          <Trophy className="w-4 h-4 text-orange-500 mt-0.5" />
                          <p className="text-gray-700 font-medium">{person.achievements}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary Table */}
        <section>
          <h3 className="font-bold text-lg mb-4">Сводная информация о кадровом обеспечении</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">ФИО</th>
                  <th className="border border-gray-300 p-3 text-left">Должность</th>
                  <th className="border border-gray-300 p-3 text-left">Образование</th>
                  <th className="border border-gray-300 p-3 text-left">Квалификация</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((person, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-300 p-3 font-semibold">{person.name}</td>
                    <td className="border border-gray-300 p-3">{person.position}</td>
                    <td className="border border-gray-300 p-3 text-sm">{person.education}</td>
                    <td className="border border-gray-300 p-3 text-sm">
                      {person.license || "Тренер"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            Все тренеры имеют соответствующее образование и регулярно проходят повышение квалификации. 
            Средний тренерский стаж составляет более 4 лет.
          </p>
        </div>
      </div>
    </EducationLayout>
  );
}
