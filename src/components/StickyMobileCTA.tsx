import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Phone } from 'lucide-react';

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
            className={`md:hidden fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
                visible ? 'translate-y-0' : 'translate-y-full'
            }`}
            aria-hidden={!visible}
        >
            <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.18)] px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center gap-2">
                    <a
                        href="tel:+79138927059"
                        className="shrink-0 w-11 h-11 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center active:scale-95 transition"
                        aria-label="Позвонить"
                    >
                        <Phone className="w-5 h-5" />
                    </a>
                    <Link
                        to="/signup"
                        className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider py-3.5 rounded-xl shadow-md shadow-orange-500/30 active:scale-[0.98] transition text-sm"
                    >
                        Записаться на пробное
                    </Link>
                </div>
            </div>
        </div>
    );
}
