import { EducationLayout } from "../components/EducationLayout";
import { Wallet, FileText, Download, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { PRICING, formatPrice } from "../data/pricing";
import { ORGANIZATION } from "../data/organization";

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
                <span className="text-3xl font-bold text-purple-600">{formatPrice(PRICING.base)} ₽</span>
                <span className="text-gray-600"> / пакет из {PRICING.visitsPerSubscription} занятий</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• {PRICING.visitsPerSubscription} занятий в пакете</li>
                <li>• Пакет бессрочный — действует до использования всех занятий</li>
                <li>• 2 раза в неделю</li>
                <li>• Группы до 10 человек</li>
                <li>• 36 учебных недель в год</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-orange-500 text-white p-6 rounded-lg">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm inline-block mb-3">
                Выгода {formatPrice(PRICING.base - PRICING.privileged)} ₽
              </div>
              <h4 className="font-bold text-xl mb-2">Льготный тариф</h4>
              <div className="mb-4">
                <span className="text-3xl font-bold">{formatPrice(PRICING.privileged)} ₽</span>
                <span className="text-purple-100"> / пакет из {PRICING.visitsPerSubscription} занятий</span>
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
                  <li>• Каждое посещённое занятие — отдельно оказанная часть услуг, считается оказанной после окончания занятия (п. 3.5 Оферты)</li>
                  <li>• Факт посещения фиксируется фотофиксацией и отметкой в журнале или информационной системе (п. 5.8 Оферты)</li>
                  <li>• <strong>Пропущенное занятие не списывается</strong> из пакета и остаётся доступным — медицинские справки не требуются (п. 3.6 Оферты)</li>
                  <li>• Занятие, отменённое по инициативе школы, также не списывается; его можно посетить в другое время (п. 5.2 Оферты)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contract */}
        <section>
          <h3 className="font-bold text-lg mb-4">Договор об оказании платных образовательных услуг</h3>
          
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg mb-4">
            <h4 className="font-semibold mb-3">Публичная оферта</h4>
            <p className="text-sm text-gray-700 mb-4">
              Договор заключается в форме публичной оферты — отдельного бумажного договора
              не требуется. Договор считается заключённым в момент отправки заявки на сайте
              кнопкой «Отправить заявку», если до этого заказчик подтвердил принятие Оферты
              (п. 4.5). Оплата Пакета после предоставления ссылки на Оферту является акцептом
              соответствующего платного заказа и согласованием его условий.
            </p>
            <Link to="/oferta" className="inline-flex w-fit bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition items-center gap-2">
              <FileText className="w-5 h-5" />
              Перейти к тексту Оферты
            </Link>
            <p className="text-xs text-gray-600 mt-2">Текст публичной оферты размещен на сайте</p>
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
                  <strong>Срок действия:</strong> Срок использования Пакета не ограничен — он действует
                  до полного использования всех {PRICING.visitsPerSubscription} занятий. Срок обучения по
                  образовательной программе определяется самой программой (п. 2.5)
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
                  <strong>Порядок оплаты:</strong> Полная предоплата Пакета способами, доступными на сайте
                  и в личном кабинете. При безналичной оплате обязательство считается исполненным с момента
                  подтверждения банком исполнения распоряжения о переводе (пп. 3.3, 3.4)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">5.</span>
                <p>
                  <strong>Расторжение:</strong> Заказчик вправе отказаться от договора в любое время без
                  объяснения причин, направив заявление на {ORGANIZATION.email}. Стоимость одного занятия —
                  фактически уплаченная стоимость Пакета с учётом скидки, делённая на
                  {" "}{PRICING.visitsPerSubscription}; возвращается стоимость оставшихся занятий в течение
                  10 календарных дней тем же способом, которым была произведена оплата (пп. 8.1–8.7)
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
              Категории, размеры скидок и подтверждающие документы публикуются здесь в соответствии
              с п. 3.7 Оферты. Для перевода на льготный тариф необходимо предоставить один из
              следующих документов:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• Удостоверение многодетной семьи (для многодетных)</li>
              <li>• Заявление о записи двух детей из одной семьи (копии свидетельств о рождении)</li>
              <li>• Справка с места работы (для сотрудников ДОУ)</li>
            </ul>
            <p className="text-xs text-gray-600 mt-3">
              Документы можно предоставить тренеру или отправить на email: income@champion-footboll.ru
            </p>
          </div>
        </section>
      </div>
    </EducationLayout>
  );
}
