import { Link } from "react-router";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">Ч</span>
              </div>
              <div className="font-bold text-lg">Чемпион и К</div>
            </div>
            <p className="text-gray-400 text-sm">
              ООО «Чемпион и К»<br />
              ИНН: 5403027269<br />
              ОГРН: 1175476013888
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Контакты</h3>
            <div className="space-y-2 text-sm">
              <a href="tel:+79138927059" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <Phone className="w-4 h-4" />
                8-913-892-70-59
              </a>
              <a href="mailto:wifimaxme@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <Mail className="w-4 h-4" />
                wifimaxme@gmail.com
              </a>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 mt-1" />
                <span>г. Новосибирск</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Юридическая информация</h3>
            <div className="space-y-2 text-sm">
              <Link to="/education-info/basic" className="block text-gray-400 hover:text-white transition">
                Сведения об образовательной организации
              </Link>
              <Link to="/privacy-policy" className="block text-gray-400 hover:text-white transition">
                Политика обработки персональных данных
              </Link>
              <Link to="/oferta" className="block text-gray-400 hover:text-white transition">
                Публичная оферта
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
          © 2026 ООО «Чемпион и К». Все права защищены.
        </div>
      </div>
    </footer>
  );
}
