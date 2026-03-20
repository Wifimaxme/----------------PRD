import { EducationLayout } from "../components/EducationLayout";
import { Globe } from "lucide-react";

export function International() {
  return (
    <EducationLayout title="Международное сотрудничество">
      <div className="space-y-8">
        <section className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-full mt-1 shrink-0">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-gray-700 leading-relaxed text-lg pt-1">
              <p className="mb-4">
                ООО «Чемпион и К» не имеет заключенных (и не планирует) договоров с иностранными / 
                международными организациями по вопросам образования и науки.
              </p>
              <p>
                Международная аккредитация образовательных программ не предусмотрена.
              </p>
            </div>
          </div>
        </section>
      </div>
    </EducationLayout>
  );
}
