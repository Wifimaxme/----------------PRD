import { EducationLayout } from "../components/EducationLayout";
import { Award } from "lucide-react";

export function Scholarships() {
  return (
    <EducationLayout title="Стипендии и меры поддержки обучающихся">
      <div className="space-y-8">
        <section className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-full mt-1 shrink-0">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-gray-700 leading-relaxed text-lg pt-1">
              <p className="mb-4">
                В организации ООО «Чемпион и К» стипендии и иные виды материальной или социальной 
                поддержки обучающихся не предусмотрены.
              </p>
              <p>
                Организация ООО «Чемпион и К» не располагает общежитием и интернатом для обучающихся.
              </p>
            </div>
          </div>
        </section>
      </div>
    </EducationLayout>
  );
}
