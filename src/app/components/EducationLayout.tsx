import { Link, NavLink } from "react-router";
import { Eye, EyeOff, ZoomIn, ZoomOut, Type } from "lucide-react";
import { useState } from "react";

interface EducationLayoutProps {
  children: React.ReactNode;
  title: string;
}

const navigationItems = [
  { to: "/education-info/basic", label: "Основные сведения" },
  { to: "/education-info/structure", label: "Структура и органы управления" },
  { to: "/education-info/documents", label: "Документы" },
  { to: "/education-info/education", label: "Образование" },
  { to: "/education-info/staff", label: "Педагогический состав" },
  { to: "/education-info/materials", label: "Материально-техническое обеспечение" },
  { to: "/education-info/paid-services", label: "Платные услуги" },
  { to: "/education-info/finance", label: "Финансово-хозяйственная деятельность" },
  { to: "/education-info/vacancies", label: "Вакантные места" },
  { to: "/education-info/accessibility", label: "Доступная среда" },
  { to: "/education-info/international", label: "Международное сотрудничество" },
];

export function EducationLayout({ children, title }: EducationLayoutProps) {
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const toggleAccessibility = () => {
    setAccessibilityMode(!accessibilityMode);
  };

  const increaseFontSize = () => {
    setFontSize(Math.min(fontSize + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(Math.max(fontSize - 2, 14));
  };

  return (
    <div className={`min-h-screen ${accessibilityMode ? 'bg-black text-yellow-400' : 'bg-gray-50'}`}>
      {/* Top Bar */}
      <div className={`${accessibilityMode ? 'bg-gray-900' : 'bg-white'} border-b`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-purple-600 hover:text-purple-700 text-sm">
              ← Вернуться на главную
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={decreaseFontSize}
                className={`p-2 rounded hover:bg-gray-100 ${accessibilityMode ? 'hover:bg-gray-800' : ''}`}
                title="Уменьшить шрифт"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={increaseFontSize}
                className={`p-2 rounded hover:bg-gray-100 ${accessibilityMode ? 'hover:bg-gray-800' : ''}`}
                title="Увеличить шрифт"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={toggleAccessibility}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  accessibilityMode 
                    ? 'bg-yellow-400 text-black' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Версия для слабовидящих"
              >
                {accessibilityMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="text-sm">Версия для слабовидящих</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className={`${accessibilityMode ? 'bg-gray-900' : 'bg-white'} border-b py-6`}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center" style={{ fontSize: `${fontSize * 1.5}px` }}>
            Сведения об образовательной организации
          </h1>
          <p className="text-center mt-2 text-gray-600" style={{ fontSize: `${fontSize}px` }}>
            ООО «Чемпион и К»
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className={`${accessibilityMode ? 'bg-gray-800' : 'bg-white'} border-b sticky top-0 z-40`}>
        <div className="container mx-auto px-4">
          <nav className="flex overflow-x-auto gap-1 py-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `px-4 py-2 text-sm whitespace-nowrap rounded border transition ${
                    accessibilityMode
                      ? isActive
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : "border-transparent text-yellow-400 hover:bg-yellow-400 hover:text-black"
                      : isActive
                        ? "border-purple-200 bg-purple-100 text-purple-700 shadow-sm"
                        : "border-transparent text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                  }`
                }
                style={{ fontSize: `${fontSize * 0.875}px` }}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className={`${accessibilityMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-sm p-8`}>
          <h2 className="text-2xl font-bold mb-6" style={{ fontSize: `${fontSize * 1.5}px` }}>
            {title}
          </h2>
          <div style={{ fontSize: `${fontSize}px` }}>
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`${accessibilityMode ? 'bg-gray-900' : 'bg-gray-100'} border-t py-6 mt-12`}>
        <div className="container mx-auto px-4 text-center text-sm" style={{ fontSize: `${fontSize * 0.875}px` }}>
          <p>© 2026 ООО «Чемпион и К». ИНН: 5403027269, ОГРН: 1175476013888</p>
        </div>
      </div>
    </div>
  );
}
