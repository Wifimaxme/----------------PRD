import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import {
    Trophy, MapPin, Calendar, UserCheck, Users, RussianRuble, CircleDot,
    ArrowLeft, CheckCircle2, Loader2, AlertCircle
} from 'lucide-react';

const LEADS_ENDPOINT =
    ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_LEADS_ENDPOINT)
    || 'https://lk.champion-footboll.ru/api/leads';

type Status = 'idle' | 'submitting' | 'success' | 'error';

function normalizePhone(input: string): string {
    let digits = input.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7') && digits.length <= 10) digits = '7' + digits;
    return '+' + digits.slice(0, 11);
}

function isValidPhone(value: string): boolean {
    return /^\+7\d{10}$/.test(value);
}

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

// `value` совпадает с названием варианта `client_type` в MoyKlass
// (alias=client_type, multiselect). Бэкенд сам подменит на id.
const PRIVILEGE_OPTIONS = [
    { value: '', label: 'Без льготы (обычный тариф 2760 ₽)' },
    { value: 'Многодетный', label: 'Многодетная семья' },
    { value: 'Опекун', label: 'Опекун' },
    { value: 'Сотрудник', label: 'Сотрудник детского сада' },
    { value: '2 детей', label: '2+ детей в нашей школе' },
];

export function Signup() {
    const navigate = useNavigate();
    const location = useLocation();
    const prefillPhone =
        typeof (location.state as { phone?: unknown } | null)?.phone === 'string'
            ? (location.state as { phone: string }).phone
            : '+7';

    const [childName, setChildName] = useState('');
    const [phone, setPhone] = useState(prefillPhone);

    useEffect(() => {
        // Если пользователь пришёл с главной с заранее набранным телефоном —
        // фокусируемся сразу на следующем поле (имя), а телефон уже заполнен.
        if (prefillPhone !== '+7') {
            const nameInput = document.querySelector<HTMLInputElement>('input[type="text"]');
            nameInput?.focus();
        }
    }, [prefillPhone]);
    const [dob, setDob] = useState('');
    const [kindergarten, setKindergarten] = useState('');
    const [group, setGroup] = useState('');
    const [privilege, setPrivilege] = useState('');
    const [consent, setConsent] = useState(false);

    const [status, setStatus] = useState<Status>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [touched, setTouched] = useState(false);

    const phoneValid = isValidPhone(phone);
    const dobValid = !!dob && dob <= todayIso();
    const formValid = childName.trim().length >= 2 && phoneValid && dobValid && consent;

    async function handleSubmit(event: { preventDefault: () => void }) {
        event.preventDefault();
        setTouched(true);
        if (!formValid || status === 'submitting') return;

        if (!LEADS_ENDPOINT) {
            setStatus('error');
            setErrorMessage('Сервис записи временно не настроен. Позвоните по телефону +7-913-892-70-59 — мы примем заявку.');
            return;
        }

        setStatus('submitting');
        setErrorMessage('');

        try {
            const response = await fetch(LEADS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    childName: childName.trim(),
                    phone,
                    dob,
                    kindergarten: kindergarten.trim() || null,
                    group: group.trim() || null,
                    privilege: privilege || null,
                    source: 'champion-footboll.ru/signup',
                }),
            });

            if (!response.ok) {
                const text = await response.text().catch(() => '');
                throw new Error(text || `HTTP ${response.status}`);
            }

            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMessage(
                err instanceof Error && err.message
                    ? `Не удалось отправить заявку: ${err.message}. Позвоните по +7-913-892-70-59.`
                    : 'Не удалось отправить заявку. Позвоните по +7-913-892-70-59.'
            );
        }
    }

    return (
        <main id="main" className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-64 bg-indigo-900 skew-y-3 transform origin-top-left -z-10"></div>
            <div className="absolute bottom-0 right-0 w-full h-64 bg-indigo-900 -skew-y-3 transform origin-bottom-right -z-10"></div>

            <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[640px] z-10 relative">

                {/* LEFT COLUMN - INFORMATION */}
                <div className="w-full md:w-5/12 relative text-slate-900 bg-white flex flex-col overflow-hidden">
                    <div className="p-8 md:p-10 flex flex-col h-full bg-gradient-to-b from-indigo-50 to-white">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-slate-500 hover:text-indigo-700 flex items-center space-x-2 transition-colors mb-6 w-fit"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Вернуться назад</span>
                        </button>

                        <div className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-black text-indigo-900 uppercase tracking-tight leading-tight">
                                Запишись <br/>
                                <span className="text-orange-500">на футбол</span>
                            </h1>
                            <p className="text-indigo-800 font-bold mt-2 uppercase tracking-wide">
                                Первое пробное занятие бесплатно!
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center space-x-4">
                                <div className="bg-orange-500 p-2.5 rounded-full text-white shrink-0 shadow-md shadow-orange-500/30"><CircleDot className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="text-indigo-900 font-bold text-sm uppercase">Что?</h3>
                                    <p className="text-slate-600 text-sm font-medium">Футбол</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-indigo-800 p-2.5 rounded-full text-white shrink-0 shadow-md shadow-indigo-800/30"><MapPin className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="text-indigo-900 font-bold text-sm uppercase">Где?</h3>
                                    <p className="text-slate-600 text-sm font-medium">Прямо в саду</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-orange-500 p-2.5 rounded-full text-white shrink-0 shadow-md shadow-orange-500/30"><Calendar className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="text-indigo-900 font-bold text-sm uppercase">Когда?</h3>
                                    <p className="text-slate-600 text-sm font-medium">С сентября по май (2 раза в неделю)</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-indigo-800 p-2.5 rounded-full text-white shrink-0 shadow-md shadow-indigo-800/30"><UserCheck className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="text-indigo-900 font-bold text-sm uppercase">Кто?</h3>
                                    <p className="text-slate-600 text-sm font-medium">Профессиональные тренеры</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-orange-500 p-2.5 rounded-full text-white shrink-0 shadow-md shadow-orange-500/30"><Users className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="text-indigo-900 font-bold text-sm uppercase">Для кого?</h3>
                                    <p className="text-slate-600 text-sm font-medium">Для детей от 3 до 7 лет</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 pt-2">
                                <div className="bg-indigo-800 p-2.5 rounded-full text-white shrink-0 shadow-md shadow-indigo-800/30 mt-1"><RussianRuble className="w-5 h-5" /></div>
                                <div className="flex-1">
                                    <h3 className="text-indigo-900 font-bold text-sm uppercase">Сколько стоит?</h3>
                                    <p className="text-slate-800 text-base font-bold">2760 ₽/месяц</p>

                                    <div className="mt-3 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                                        <div className="inline-block bg-indigo-800 text-white text-xs font-bold px-2 py-1 rounded-md mb-2">1960 ₽/МЕСЯЦ:</div>
                                        <ul className="text-xs text-slate-600 space-y-1">
                                            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0"/> для многодетных семей</li>
                                            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0"/> для детей с опекунами</li>
                                            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0"/> для детей воспитателей</li>
                                            <li className="flex items-start gap-1.5 leading-tight"><CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5"/> для 2х и более детей из одной семьи</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 pt-4 pb-2">
                                <div className="bg-orange-500 p-2.5 rounded-full text-white shrink-0 shadow-md shadow-orange-500/30 mt-1"><Trophy className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="text-indigo-900 font-bold text-sm uppercase">Что получите вы?</h3>
                                    <p className="text-slate-600 text-xs font-medium leading-relaxed mt-1">Ребенка занимающегося футболом профессионально, без необходимости водить в дополнительные секции после сада.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - APPLICATION FORM */}
                <div className="w-full md:w-7/12 bg-indigo-900 relative overflow-y-auto">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="relative p-6 md:p-10 flex flex-col justify-center min-h-full">

                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl relative mt-8 md:mt-0">
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-500 text-white font-black uppercase tracking-wider py-2 px-8 rounded-full shadow-lg shadow-orange-500/30 text-lg">
                                Заявка
                            </div>

                            <div className="mt-6">
                                {status === 'success' ? (
                                    <div className="text-center py-8">
                                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                            <CheckCircle2 className="w-9 h-9 text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-black text-indigo-900 mb-2">Заявка отправлена!</h2>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Мы перезвоним вам по номеру <strong>{phone}</strong> в ближайшее время и подберём удобное время для пробного занятия.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setChildName(''); setPhone('+7'); setDob('');
                                                setKindergarten(''); setGroup(''); setPrivilege('');
                                                setConsent(false); setTouched(false); setStatus('idle');
                                            }}
                                            className="mt-6 text-indigo-700 hover:text-indigo-900 text-sm font-semibold underline"
                                        >
                                            Записать ещё одного ребёнка
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                                        {/* Фамилия и Имя ребёнка */}
                                        <div>
                                            <label htmlFor="signup-childname" className="sr-only">
                                                Фамилия и имя ребёнка
                                            </label>
                                            <input
                                                id="signup-childname"
                                                type="text"
                                                value={childName}
                                                onChange={(e) => setChildName(e.target.value)}
                                                placeholder="Фамилия и Имя ребёнка*"
                                                autoComplete="off"
                                                required
                                                aria-required="true"
                                                aria-invalid={touched && childName.trim().length < 2}
                                                className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition text-slate-900 placeholder:text-slate-400"
                                                disabled={status === 'submitting'}
                                            />
                                            {touched && childName.trim().length < 2 && (
                                                <p className="text-xs text-red-600 mt-1 ml-1">Введите имя ребёнка</p>
                                            )}
                                        </div>

                                        {/* Телефон */}
                                        <div>
                                            <label htmlFor="signup-phone" className="sr-only">
                                                Телефон в формате +7XXXXXXXXXX
                                            </label>
                                            <input
                                                id="signup-phone"
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(normalizePhone(e.target.value))}
                                                onBlur={() => setPhone(p => normalizePhone(p))}
                                                onFocus={(e) => {
                                                    const el = e.currentTarget;
                                                    requestAnimationFrame(() => {
                                                        if (el.selectionStart !== null && el.selectionStart < 2) {
                                                            el.setSelectionRange(el.value.length, el.value.length);
                                                        }
                                                    });
                                                }}
                                                onClick={(e) => {
                                                    const el = e.currentTarget;
                                                    if (el.selectionStart !== null && el.selectionStart < 2) {
                                                        el.setSelectionRange(el.value.length, el.value.length);
                                                    }
                                                }}
                                                placeholder="+7 (___) ___-__-__"
                                                autoComplete="tel"
                                                inputMode="tel"
                                                required
                                                aria-required="true"
                                                aria-invalid={touched && !phoneValid}
                                                className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition text-slate-900 placeholder:text-slate-400"
                                                disabled={status === 'submitting'}
                                            />
                                            {touched && !phoneValid && (
                                                <p className="text-xs text-red-600 mt-1 ml-1">Введите телефон в формате +7XXXXXXXXXX</p>
                                            )}
                                        </div>

                                        {/* Номер детского сада */}
                                        <div>
                                            <label htmlFor="signup-kindergarten" className="sr-only">
                                                Номер детского сада
                                            </label>
                                            <input
                                                id="signup-kindergarten"
                                                type="text"
                                                value={kindergarten}
                                                onChange={(e) => setKindergarten(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                inputMode="numeric"
                                                placeholder="Номер сада*"
                                                required
                                                aria-required="true"
                                                className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition text-slate-900 placeholder:text-slate-400"
                                                disabled={status === 'submitting'}
                                            />
                                        </div>

                                        {/* Группа в саду */}
                                        <div>
                                            <label htmlFor="signup-group" className="sr-only">
                                                Название или номер группы в детском саду
                                            </label>
                                            <input
                                                id="signup-group"
                                                type="text"
                                                value={group}
                                                onChange={(e) => setGroup(e.target.value)}
                                                placeholder="Группа в саду*"
                                                required
                                                aria-required="true"
                                                className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition text-slate-900 placeholder:text-slate-400"
                                                disabled={status === 'submitting'}
                                            />
                                        </div>

                                        {/* Дата рождения */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">
                                                Дата рожд. уч-ка<span className="text-orange-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={dob}
                                                onChange={(e) => setDob(e.target.value)}
                                                max={todayIso()}
                                                className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition text-slate-900 placeholder:text-slate-400"
                                                disabled={status === 'submitting'}
                                            />
                                            {touched && !dobValid && (
                                                <p className="text-xs text-red-600 mt-1 ml-1">Укажите дату рождения</p>
                                            )}
                                        </div>

                                        {/* Льгота */}
                                        <div>
                                            <select
                                                value={privilege}
                                                onChange={(e) => setPrivilege(e.target.value)}
                                                className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition text-slate-900"
                                                disabled={status === 'submitting'}
                                            >
                                                <option value="">Льгота</option>
                                                {PRIVILEGE_OPTIONS.filter(o => o.value).map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                            {privilege && (
                                                <p className="text-xs text-orange-600 font-semibold mt-1 ml-1">
                                                    Льготная стоимость: 1960 ₽/месяц
                                                </p>
                                            )}
                                        </div>

                                        {status === 'error' && errorMessage && (
                                            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                                                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                                <p className="text-xs text-red-700 leading-relaxed">{errorMessage}</p>
                                            </div>
                                        )}

                                        {/* Submit button */}
                                        <button
                                            type="submit"
                                            disabled={status === 'submitting'}
                                            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider py-4 rounded-xl transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 mt-2"
                                        >
                                            {status === 'submitting' ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Отправляем…
                                                </>
                                            ) : (
                                                'Отправить заявку!'
                                            )}
                                        </button>

                                        {/* Согласие на обработку ПДн — под кнопкой */}
                                        <label className="flex items-start gap-3 cursor-pointer pt-2">
                                            <input
                                                type="checkbox"
                                                checked={consent}
                                                onChange={(e) => setConsent(e.target.checked)}
                                                disabled={status === 'submitting'}
                                                className="mt-0.5 w-4 h-4 rounded border-2 border-slate-300 text-indigo-700 focus:ring-indigo-500 cursor-pointer shrink-0"
                                            />
                                            <span className="text-xs text-slate-600 leading-relaxed">
                                                Я согласен(на) на обработку своих персональных данных и соглашаюсь с{' '}
                                                <Link to="/privacy-policy" className="text-indigo-700 underline hover:text-indigo-900">политикой конфиденциальности</Link>.{' '}
                                                <Link to="/oferta" className="text-indigo-700 underline hover:text-indigo-900">Подробнее</Link>
                                            </span>
                                        </label>
                                        {touched && !consent && (
                                            <p className="text-xs text-red-600 -mt-2 ml-7">Подтвердите согласие</p>
                                        )}

                                        <p className="text-[11px] text-slate-500 text-center leading-relaxed pt-1">
                                            Или позвоните: <a href="tel:+79138927059" className="text-indigo-700 font-semibold">+7-913-892-70-59</a>
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 text-center px-4">
                            <p className="font-handwriting text-3xl md:text-4xl text-orange-400 rotate-[-2deg]">
                                Для нас футбол не бизнес,<br/>
                                <span className="text-white text-4xl md:text-5xl">для нас это жизнь!</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
