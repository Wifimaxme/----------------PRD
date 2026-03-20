import { EducationLayout } from "../components/EducationLayout";
import { Building, Package, Heart } from "lucide-react";

export function Materials() {
  return (
    <EducationLayout title="Материально-техническое обеспечение и оснащённость образовательного процесса">
      <div className="space-y-8">
        {/* Equipment & Facilities */}
        <section>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <ul className="space-y-3 text-gray-800">
              <li className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <span>спортивный или музыкальный зал;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <span>мячи по количеству детей или подгруппы;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <span>обручи, скамейки, дорожки, координационные элементы;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <span>манишки или цветные ленты;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <span>ворота или обозначенные цели;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <span>насос для накачки мячей;</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Special Conditions */}
        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-600" />
            О специальных условиях для получения образования инвалидами и лицами с ограниченными возможностями здоровья
          </h3>
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              Специальных условий для обучения инвалидов и лиц с ограниченными возможностями здоровья нет.
            </p>
          </div>
        </section>


      </div>
    </EducationLayout>
  );
}
