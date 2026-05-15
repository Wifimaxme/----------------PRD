import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { User } from 'lucide-react';

/**
 * Mobile-only sticky CTA bar that appears after the hero is scrolled
 * past, so the primary signup action is always within thumb reach.
 *
 * Hidden on the /signup page itself (form is the page) and on
 * education-info subpages (regulatory section, no marketing CTAs).
 */
export default function StickyMobileCTA() {
    const [visible, setVisible] = useState(false);
    const location = useLocation();
    const path = location.pathname;
    const onSignup = path === '/signup';
    const onLicensing = path.startsWith('/education-info') || path === '/oferta' || path === '/privacy-policy';

    useEffect(() => {
        if (onSignup || onLicensing) {
            setVisible(false);
            return;
        }
        const onScroll = () => {
            setVisible(window.scrollY > 320);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [onSignup, onLicensing]);

    if (onSignup || onLicensing) return null;

    return (
        <div
            role="region"
            aria-label="Быстрые действия"
            className={`md:hidden fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
                visible ? 'translate-y-0' : 'translate-y-full'
            }`}
            aria-hidden={!visible}
        >
            <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.18)] px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
                <div className="grid grid-cols-2 gap-2">
                    <a
                        href="https://lk.champion-footboll.ru/"
                        target="_self"
                        className="flex items-center justify-center gap-2 bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-[0.98] transition text-sm"
                    >
                        <User className="w-4 h-4" aria-hidden="true" />
                        Личный кабинет
                    </a>
                    <Link
                        to="/signup"
                        className="text-center bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider py-3.5 rounded-xl shadow-md shadow-orange-500/30 active:scale-[0.98] transition text-sm"
                    >
                        Записаться
                    </Link>
                </div>
            </div>
        </div>
    );
}
