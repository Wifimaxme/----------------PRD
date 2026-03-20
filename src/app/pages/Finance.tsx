import { EducationLayout } from "../components/EducationLayout";
import { TrendingUp, PieChart, FileText } from "lucide-react";

export function Finance() {
  return (
    <EducationLayout title="Финансово-хозяйственная деятельность">
      <div className="space-y-8">
        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Источники финансирования
          </h3>
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              Образовательная деятельность ООО «Чемпион и К» осуществляется за счёт средств 
              физических лиц (родителей/законных представителей обучающихся).
            </p>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Финансирование:</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div className="bg-gradient-to-r from-purple-600 to-orange-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ width: '100%' }}>
                    100% — Платные образовательные услуги
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Образовательная организация является негосударственной образовательной организацией, поэтому не имеет бюджетного финансирования. В связи с этим вся его финансовая деятельность основывается на доходах, получаемых от оказания образовательных услуг. Полученные средства расходуются на обеспечение и развитие образовательного процесса, развития используемых технологий и совершенствование методик преподавания.
              </p>
            </div>
          </div>
        </section>

        

        <section>
          
          
          

          
        </section>

        

        <section className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold mb-3">Контроль финансовой деятельности</h4>
          <p className="text-sm text-gray-700">
            Финансовая деятельность организации ведётся в соответствии с законодательством РФ. 
            Бухгалтерский учёт осуществляется с использованием специализированного программного 
            обеспечения. Отчётность предоставляется в налоговые органы в установленные сроки.
          </p>
        </section>
      </div>
    </EducationLayout>
  );
}
