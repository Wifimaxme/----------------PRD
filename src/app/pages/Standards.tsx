import { EducationLayout } from "../components/EducationLayout";
import { BookOpenCheck } from "lucide-react";

export function Standards() {
  return (
    <EducationLayout title="Образовательные стандарты и требования">
      <div className="space-y-8">
        <section className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-full mt-1 shrink-0">
              <BookOpenCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-gray-700 leading-relaxed text-lg pt-1">
              <p>
                В настоящее время Федеральный государственный образовательный стандарт 
                дополнительного образования не разработан. Основным документом, 
                регламентирующим деятельность учреждений дополнительного образования, 
                является Федеральный закон от 29.12.2012 № 273-ФЗ «Об образовании 
                в Российской Федерации».
              </p>
            </div>
          </div>
        </section>
      </div>
    </EducationLayout>
  );
}
