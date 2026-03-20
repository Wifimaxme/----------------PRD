import { Link } from "react-router";
import { Menu, Phone } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/6 bg-[rgba(252,250,247,0.82)] backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-orange-500 shadow-[0_16px_26px_-22px_rgba(124,58,237,0.55)]">
              <span className="text-white font-bold text-xl">Ч</span>
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">Чемпион и К</div>
              <div className="text-xs text-gray-600">Футбол в вашем детском саду</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#philosophy" className="text-sm font-medium text-gray-700 transition hover:text-purple-600">
              Методика
            </a>
            <a href="#coaches" className="text-sm font-medium text-gray-700 transition hover:text-purple-600">
              Тренеры
            </a>
            <a href="#prices" className="text-sm font-medium text-gray-700 transition hover:text-purple-600">
              Тарифы
            </a>
            <a href="#blog" className="text-sm font-medium text-gray-700 transition hover:text-purple-600">
              Блог
            </a>
            <Link to="/education-info/basic" className="text-sm font-medium text-gray-700 transition hover:text-purple-600">
              Сведения об организации
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+79138927059"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-purple-600"
            >
              <Phone className="w-4 h-4" />
              <span>8-913-892-70-59</span>
            </a>
          </div>

          <button
            className="rounded-xl border border-black/6 bg-white/45 p-2 transition hover:bg-white/70 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mb-4 border-t border-black/6 py-3 md:hidden">
            <div className="space-y-2">
              <a href="#philosophy" className="block py-2 text-sm font-medium text-gray-700">
                Методика
              </a>
              <a href="#coaches" className="block py-2 text-sm font-medium text-gray-700">
                Тренеры
              </a>
              <a href="#prices" className="block py-2 text-sm font-medium text-gray-700">
                Тарифы
              </a>
              <a href="#blog" className="block py-2 text-sm font-medium text-gray-700">
                Блог
              </a>
              <Link to="/education-info/basic" className="block py-2 text-sm font-medium text-gray-700">
                Сведения об организации
              </Link>
              <a href="tel:+79138927059" className="block py-2 text-sm font-medium text-gray-700">
                8-913-892-70-59
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
