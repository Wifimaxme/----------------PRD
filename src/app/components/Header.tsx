import { Link, useLocation, useNavigate } from "react-router";
import { Menu, Phone } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS: { id: string; label: string }[] = [
  { id: "philosophy", label: "Методика" },
  { id: "coaches", label: "Тренеры" },
  { id: "prices", label: "Тарифы" },
  { id: "blog", label: "Блог" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // The app uses createHashRouter so anchor links can't just use href="#id"
  // (that would clobber the hash router). Instead we look up the element
  // and scroll, navigating home first if we're on a different route.
  const goToSection = (id: string) => () => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for the home tree to mount, then scroll.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={goToSection(item.id)}
                className="text-sm font-medium text-gray-700 transition hover:text-purple-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/education-info/basic"
              aria-current={location.pathname.startsWith("/education-info") ? "page" : undefined}
              className={`text-sm font-medium transition hover:text-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded ${
                location.pathname.startsWith("/education-info") ? "text-purple-700" : "text-gray-700"
              }`}
            >
              Сведения об организации
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+79138927059"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded"
            >
              <Phone className="w-4 h-4" />
              <span>8-913-892-70-59</span>
            </a>
          </div>

          <button
            className="rounded-xl border border-black/6 bg-white/45 p-2 transition hover:bg-white/70 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Открыть меню"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mb-4 border-t border-black/6 py-3 md:hidden">
            <div className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={goToSection(item.id)}
                  className="block w-full text-left py-2 text-sm font-medium text-gray-700"
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/education-info/basic"
                aria-current={location.pathname.startsWith("/education-info") ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  location.pathname.startsWith("/education-info") ? "text-purple-700" : "text-gray-700"
                }`}
              >
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
