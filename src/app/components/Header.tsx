import { Link } from "react-router";
import { Menu, Phone, Mail } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">Ч</span>
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">Чемпион и К</div>
              <div className="text-xs text-gray-600">Футбол в вашем детском саду</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#philosophy" className="text-gray-700 hover:text-purple-600 transition">
              Методика
            </a>
            <a href="#coaches" className="text-gray-700 hover:text-purple-600 transition">
              Тренеры
            </a>
            <a href="#prices" className="text-gray-700 hover:text-purple-600 transition">
              Тарифы
            </a>
            <a href="#blog" className="text-gray-700 hover:text-purple-600 transition">
              Блог
            </a>
            <Link to="/education-info/basic" className="text-gray-700 hover:text-purple-600 transition">
              Сведения об организации
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+79138927059" className="flex items-center gap-2 text-gray-700 hover:text-purple-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm">8-913-892-70-59</span>
            </a>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="#philosophy" className="block py-2 text-gray-700">
              Методика
            </a>
            <a href="#coaches" className="block py-2 text-gray-700">
              Тренеры
            </a>
            <a href="#prices" className="block py-2 text-gray-700">
              Тарифы
            </a>
            <a href="#blog" className="block py-2 text-gray-700">
              Блог
            </a>
            <Link to="/education-info/basic" className="block py-2 text-gray-700">
              Сведения об организации
            </Link>
            <a href="tel:+79138927059" className="block py-2 text-gray-700">
              8-913-892-70-59
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
