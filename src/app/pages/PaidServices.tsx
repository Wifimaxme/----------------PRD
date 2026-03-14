import { EducationLayout } from "../components/EducationLayout";
import { Wallet, FileText, Download, AlertCircle } from "lucide-react";

export function PaidServices() {
  return (
    <EducationLayout title="Платные образовательные услуги">
      <div className="space-y-8">
        {/* Pricing */}
        <section>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-600" />
            Стоимость обучения
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border-2 border-purple-300 p-6 rounded-lg">
              <h4 className="font-bold text-xl mb-2">Базовый тариф</h4>
              <div className="mb-4">
                <span className="text-3xl font-bold text-purple-600">2 760 ₽</span>
                <span className="text-gray-600"> / месяц</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 8 занятий в месяц</li>
                <li>• 2 раза в неделю</li>
                <li>• Группы до 10 человек</li>
                <li>• 36 учебных недель в год</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-orange-500 text-white p-6 rounded-lg">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm inline-block mb-3">
                Скидка 30%
              </div>
              <h4 className="font-bold text-xl mb-2">Льготный тариф</h4>
              <div className="mb-4">
                <span className="text-3xl font-bold">1 950 ₽</span>
                <span className="text-purple-100"> / месяц</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Для многодетных семей</li>
                <li>• При записи двоих детей из одной семьи</li>
                <li>• Для детей сотрудников ДОУ</li>
                <li>• Все условия базового тарифа</li>
              </ul>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Важные условия оплаты:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Услуга считается оказанной по факту проведения занятия</li>
                  <li>• Пропуски не компенсируются и не влияют на списание средств</li>
                  <li>• Справки о болезни не требуются</li>
                  <li>• Перерасчет стоимости за неявки не производится</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Order */}
        <section>
          <h3 className="font-bold text-lg mb-4">Приказ об утверждении стоимости</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-semibold">Приказ № 01/2024 от 01.09.2024</p>
                <p className="text-sm text-gray-600">Об утверждении стоимости платных образовательных услуг</p>
              </div>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Скачать
            </button>
          </div>
        </section>

        {/* Contract */}
        <section>
          <h3 className="font-bold text-lg mb-4">Договор об оказании платных образовательных услуг</h3>
          
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg mb-4">
            <h4 className="font-semibold mb-3">Публичная оферта</h4>
            <p className="text-sm text-gray-700 mb-4">
              Договор заключается в форме публичной оферты. Оплата услуг через сайт является 
              акцептом (принятием) условий договора.
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Скачать договор-оферту (PDF)
            </button>
            <p className="text-xs text-gray-600 mt-2">Документ заверен УКЭП директора</p>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Основные условия договора:</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">1.</span>
                <p>
                  <strong>Предмет договора:</strong> Оказание платных образовательных услуг по программе 
                  дополнительного образования детей физкультурно-спортивной направленности «Футбол»
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">2.</span>
                <p>
                  <strong>Срок действия:</strong> С момента оплаты до окончания оплаченного периода
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">3.</span>
                <p>
                  <strong>Стоимость:</strong> Согласно выбранному тарифу (Базовый или Льготный)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">4.</span>
                <p>
                  <strong>Порядок оплаты:</strong> Оплата производится до начала календарного месяца 
                  через систему онлайн-эквайринга Т-Банк
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">5.</span>
                <p>
                  <strong>Расторжение:</strong> Возможно в любой момент по инициативе заказчика с 
                  возвратом средств за неоказанные занятия (пропорционально)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section>
          <h3 className="font-bold text-lg mb-4">Способы оплаты</h3>
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="font-bold text-black">Т</span>
              </div>
              <div>
                <p className="font-semibold">Эквайринг Т-Банк</p>
                <p className="text-sm text-gray-600">Безопасная оплата банковской картой</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p>Принимаются к оплате:</p>
              <div className="flex gap-3 items-center">
                <div className="bg-gray-100 px-3 py-1 rounded">Visa</div>
                <div className="bg-gray-100 px-3 py-1 rounded">Mastercard</div>
                <div className="bg-gray-100 px-3 py-1 rounded">МИР</div>
              </div>
              <p className="text-xs text-gray-600 mt-3">
                Все платежи защищены по стандарту PCI DSS. Данные карты не передаются третьим лицам.
              </p>
            </div>
          </div>
        </section>

        {/* Льготы Documentation */}
        <section>
          <h3 className="font-bold text-lg mb-4">Подтверждение права на льготный тариф</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-3">
              Для получения скидки 30% необходимо предоставить один из следующих документов:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• Удостоверение многодетной семьи (для многодетных)</li>
              <li>• Заявление о записи двух детей из одной семьи (копии свидетельств о рождении)</li>
              <li>• Справка с места работы (для сотрудников ДОУ)</li>
            </ul>
            <p className="text-xs text-gray-600 mt-3">
              Документы можно предоставить тренеру или отправить на email: wifimaxme@gmail.com
            </p>
          </div>
        </section>
      </div>
    </EducationLayout>
  );
}
