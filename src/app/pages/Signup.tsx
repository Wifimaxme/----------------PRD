import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import {
    Trophy, MapPin, Calendar, UserCheck, Users, RussianRuble, CircleDot,
    ArrowLeft, CheckCircle2, Loader2, AlertCircle, UserCircle
} from 'lucide-react';
import { LK_URL, shouldOpenLkInNewTab } from '../../components/lkLink';
import { PRICING, PRICE_NOTE, formatPrice } from '../data/pricing';
import { currentRevision, legalFileUrl } from '../data/legalDocuments';

const LEADS_ENDPOINT =
    ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_LEADS_ENDPOINT)
    || 'https://lk.champion-footboll.ru/api/leads';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Ошибка, текст которой прислал бэкенд в поле `error`.
 *
 * Показываем его как есть: причину отказа знает приёмная сторона, а не форма.
 * Собирать свою строку из кода ответа нельзя — так родитель видел «HTTP 503»
 * вместо объяснения. Приём общий для 400, 502, 503 и любого другого отказа:
 * поменяется причина на бэкенде — текст поедет сам, править форму не придётся.
 */
class ServerMessageError extends Error {}

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

/**
 * Нижняя граница даты рождения — 18 лет назад.
 *
 * Оферта определяет Ребёнка как несовершеннолетнее лицо, а MoyKlass отвергает
 * даты раньше 1901-01-01 с ошибкой «The date must be at least 1901-01-01 and
 * no later than today». Раньше мы проверяли только «не в будущем», поэтому
 * опечатка в годе (0202, 1899) проходила форму и падала уже в CRM — родитель
 * видел техническую ошибку вместо подсказки.
 */
function minDobIso(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().slice(0, 10);
}

// `value` совпадает с названием варианта `client_type` в MoyKlass
// (alias=client_type, multiselect). Бэкенд сам подменит на id.
const PRIVILEGE_OPTIONS = [
    { value: '', label: `Без льготы (обычный тариф ${PRICING.base} ₽)` },
    { value: 'Многодетный', label: 'Многодетная семья' },
    { value: 'Опекун', label: 'Опекун' },
    { value: 'Сотрудник', label: 'Сотрудник детского сада' },
    { value: '2 детей', label: '2+ детей в нашей школе' },
];

// Все поля формы обязательны, кроме «Льготы» — она сознательно необязательная,
// пустое значение означает обычный тариф.
type FieldName =
    | 'parentName' | 'childName' | 'phone' | 'kindergarten' | 'group' | 'dob'
    | 'consent' | 'photoConsent';

// Порядок сверху вниз по форме: по нему ищем первое незаполненное поле,
// чтобы проскроллить и сфокусировать именно его.
const FIELD_ORDER: FieldName[] = [
    'parentName', 'childName', 'phone', 'kindergarten', 'group', 'dob',
    'consent', 'photoConsent',
];

const BASE_FIELD_CLASS =
    'w-full px-5 py-4 rounded-xl border focus:ring-2 focus:outline-none transition text-slate-900 placeholder:text-slate-400';
const VALID_FIELD_CLASS = 'border-slate-200 bg-white focus:border-indigo-500 focus:ring-indigo-100';
const INVALID_FIELD_CLASS = 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200';

function fieldClass(invalid: boolean): string {
    return `${BASE_FIELD_CLASS} ${invalid ? INVALID_FIELD_CLASS : VALID_FIELD_CLASS}`;
}


/**
 * Тексты возле галочек заданы сегментами, чтобы показанный на экране текст и
 * значение shownText в acceptances строились из одного источника. Юридически
 * значимо не то, что написано в документе, а то, что человек видел, — поэтому
 * дублировать строку отдельно нельзя, разъедется.
 */
type ConsentSegment = { text: string; to?: string };

const OFERTA_CONSENT_SEGMENTS: ConsentSegment[] = [
    { text: 'Я принимаю условия ' },
    { text: 'Оферты', to: '/oferta' },
    { text: ' и Правил «Чемпион и К», подтверждаю, что являюсь законным представителем ребёнка, и согласен(на) на обработку персональных данных — своих и ребёнка — в соответствии с ' },
    { text: 'политикой конфиденциальности', to: '/privacy-policy' },
    { text: '.' },
];

const PHOTO_CONSENT_SEGMENTS: ConsentSegment[] = [
    { text: 'Как законный представитель ребёнка, даю ООО «Чемпион и К» согласие на его фото- и видеосъёмку во время занятий и использование материалов в закрытых отчётах. ' },
    { text: 'Условия согласия', to: 'PHOTO_CONSENT_PDF' },
];

function segmentsToText(segments: ConsentSegment[]): string {
    return segments.map(segment => segment.text).join('').trim();
}


/** Рисует подпись галочки из сегментов — тех самых, что уходят в shownText. */
function ConsentLabel({ segments, pdfHref }: { segments: ConsentSegment[]; pdfHref?: string }) {
    const linkClass = 'text-indigo-700 underline hover:text-indigo-900';
    return (
        <span className="text-xs text-slate-600 leading-relaxed">
            {segments.map((segment, index) => {
                if (!segment.to) return <span key={index}>{segment.text}</span>;
                if (segment.to === 'PHOTO_CONSENT_PDF') {
                    return (
                        <a key={index} href={pdfHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                            {segment.text}
                        </a>
                    );
                }
                return (
                    <Link key={index} to={segment.to} className={linkClass}>
                        {segment.text}
                    </Link>
                );
            })}
        </span>
    );
}

export function Signup() {
    const navigate = useNavigate();
    const location = useLocation();
    const prefillPhone =
        typeof (location.state as { phone?: unknown } | null)?.phone === 'string'
            ? (location.state as { phone: string }).phone
            : '+7';

    // Предпросмотр экрана успеха без реальной отправки заявки: #/signup?preview=success.
    // Только в dev — прод-сборка вычищает эту ветку, боевой бэкенд заявки с
    // localhost всё равно не принимает (CORS разрешён только для champion-footboll.ru).
    const isDev = !!(import.meta as unknown as { env?: Record<string, unknown> }).env?.DEV;
    const previewSuccess =
        isDev && new URLSearchParams(location.search).get('preview') === 'success';

    const [parentName, setParentName] = useState('');
    const [childName, setChildName] = useState('');
    const [phone, setPhone] = useState(previewSuccess ? '+79138927059' : prefillPhone);

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
    const [photoConsent, setPhotoConsent] = useState(false);

    const openLkInNewTab = shouldOpenLkInNewTab();
    // Ссылка ведёт на неизменяемый PDF той редакции, которую подтверждает родитель.
    const consentPdf = currentRevision('photo-consent');
    const ofertaPdf = currentRevision('oferta');

    /**
     * Акцепт Оферты и согласие на съёмку — два самостоятельных юридических
     * акта: п. 4.7 Оферты прямо говорит, что акцепт не заменяет отдельного
     * согласия. Поэтому два элемента, а не один флаг.
     *
     * Хеш присылает клиент: форма знает, какую именно редакцию она показала
     * на экране, сервер этого не знает.
     */
    function buildAcceptances() {
        const acts: {
            documentId: string;
            revision: string;
            file: string;
            sha256: string;
            shownText: string;
        }[] = [];

        if (ofertaPdf) {
            acts.push({
                documentId: ofertaPdf.id,
                revision: ofertaPdf.revision,
                file: ofertaPdf.file,
                sha256: ofertaPdf.sha256,
                shownText: segmentsToText(OFERTA_CONSENT_SEGMENTS),
            });
        }
        if (consentPdf) {
            acts.push({
                documentId: consentPdf.id,
                revision: consentPdf.revision,
                file: consentPdf.file,
                sha256: consentPdf.sha256,
                shownText: segmentsToText(PHOTO_CONSENT_SEGMENTS),
            });
        }
        return acts;
    }

    const [status, setStatus] = useState<Status>(previewSuccess ? 'success' : 'idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    // Ошибка поля показывается либо после ухода из него, либо после попытки отправки.
    const [touchedFields, setTouchedFields] = useState<Partial<Record<FieldName, boolean>>>({});
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const fieldRefs = useRef<Partial<Record<FieldName, HTMLElement | null>>>({});

    const errors: Partial<Record<FieldName, string>> = {};
    if (parentName.trim().length < 2) errors.parentName = 'Введите фамилию и имя родителя';
    if (childName.trim().length < 2) errors.childName = 'Введите фамилию и имя ребёнка';
    if (!isValidPhone(phone)) errors.phone = 'Введите телефон в формате +7XXXXXXXXXX';
    if (!kindergarten.trim()) errors.kindergarten = 'Укажите номер детского сада';
    if (!group.trim()) errors.group = 'Укажите группу в саду';
    if (!dob) errors.dob = 'Укажите дату рождения';
    else if (dob > todayIso()) errors.dob = 'Дата рождения не может быть в будущем';
    else if (dob < minDobIso()) errors.dob = 'Проверьте год рождения — занятия для детей';
    if (!consent) errors.consent = 'Подтвердите принятие Оферты и согласие на обработку персональных данных';
    if (!photoConsent) errors.photoConsent = 'Без согласия на фото- и видеосъёмку занятия не проводятся (п. 7.4.7 Оферты)';

    const formValid = FIELD_ORDER.every(field => !errors[field]);

    // Сводка над кнопкой — только про незаполненные поля ввода. У согласия своя
    // подпись под чекбоксом, дублировать её обобщённым текстом не нужно.
    const hasEmptyFields = FIELD_ORDER.some(
        field => field !== 'consent' && field !== 'photoConsent' && errors[field]
    );

    function showError(field: FieldName): string | undefined {
        return submitAttempted || touchedFields[field] ? errors[field] : undefined;
    }

    function markTouched(field: FieldName) {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
    }

    function focusFirstInvalid() {
        const firstInvalid = FIELD_ORDER.find(field => errors[field]);
        if (!firstInvalid) return;
        const el = fieldRefs.current[firstInvalid];
        if (!el) return;
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        el.focus({ preventScroll: true });
    }

    async function handleSubmit(event: { preventDefault: () => void }) {
        event.preventDefault();
        setSubmitAttempted(true);
        if (status === 'submitting') return;
        if (!formValid) {
            focusFirstInvalid();
            return;
        }

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
                    parentName: parentName.trim(),
                    childName: childName.trim(),
                    phone,
                    dob,
                    kindergarten: kindergarten.trim(),
                    group: group.trim(),
                    privilege: privilege || null,
                    source: 'champion-footboll.ru/signup',
                    acceptances: buildAcceptances(),
                }),
            });

            if (!response.ok) {
                const raw = await response.text().catch(() => '');
                let serverMessage = '';
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed && typeof parsed.error === 'string') {
                        serverMessage = parsed.error.trim();
                    }
                } catch {
                    // Тело не JSON — покажем общий текст ниже.
                }
                if (serverMessage) throw new ServerMessageError(serverMessage);
                throw new Error(raw || `HTTP ${response.status}`);
            }

            setStatus('success');
        } catch (err) {
            setStatus('error');
            const callUs = 'Позвоните по +7-913-892-70-59.';
            if (err instanceof ServerMessageError) {
                // Текст бэкенда самодостаточен, свой заголовок не добавляем.
                // Точку ставим сами, если её нет, — иначе фразы слипаются.
                const message = /[.!?…]$/.test(err.message) ? err.message : `${err.message}.`;
                setErrorMessage(`${message} ${callUs}`);
            } else if (err instanceof Error && err.message) {
                setErrorMessage(`Не удалось отправить заявку: ${err.message}. ${callUs}`);
            } else {
                setErrorMessage(`Не удалось отправить заявку. ${callUs}`);
            }
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
                                    <p className="text-slate-800 text-base font-bold">{formatPrice(PRICING.base)} ₽ {PRICE_NOTE}</p>

                                    <div className="mt-3 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                                        <div className="inline-block bg-indigo-800 text-white text-xs font-bold px-2 py-1 rounded-md mb-2">{formatPrice(PRICING.privileged)} ₽ ЗА ПАКЕТ:</div>
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

                                        {/* Заявка уже создала ученика в CRM, поэтому вход в ЛК открыт
                                            по тому же номеру — отдельная регистрация не нужна. */}
                                        <a
                                            href={LK_URL}
                                            target={openLkInNewTab ? '_blank' : '_self'}
                                            rel={openLkInNewTab ? 'noopener noreferrer' : undefined}
                                            className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white font-black uppercase tracking-wider py-4 rounded-xl transition shadow-lg shadow-indigo-700/30"
                                        >
                                            <UserCircle className="w-5 h-5" />
                                            Войти в личный кабинет
                                        </a>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-2">
                                            Вход по тому же номеру <strong>{phone}</strong> — пароль не нужен.
                                        </p>

                                        <button
                                            onClick={() => {
                                                setParentName(''); setChildName(''); setPhone('+7'); setDob('');
                                                setKindergarten(''); setGroup(''); setPrivilege('');
                                                setConsent(false); setPhotoConsent(false); setStatus('idle');
                                                setTouchedFields({}); setSubmitAttempted(false);
                                            }}
                                            className="mt-5 text-slate-600 hover:text-indigo-800 text-sm font-semibold underline"
                                        >
                                            Записать ещё одного ребёнка
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                                        {/* Фамилия и Имя родителя — п. 4.1 Оферты */}
                                        <div>
                                            <label htmlFor="signup-parentname" className="sr-only">
                                                Фамилия и имя родителя
                                            </label>
                                            <input
                                                id="signup-parentname"
                                                ref={(el) => { fieldRefs.current.parentName = el; }}
                                                type="text"
                                                value={parentName}
                                                onChange={(e) => setParentName(e.target.value)}
                                                onBlur={() => markTouched('parentName')}
                                                placeholder="Фамилия и Имя родителя*"
                                                autoComplete="name"
                                                required
                                                aria-required="true"
                                                aria-invalid={!!showError('parentName')}
                                                aria-describedby={showError('parentName') ? 'signup-parentname-error' : undefined}
                                                className={fieldClass(!!showError('parentName'))}
                                                disabled={status === 'submitting'}
                                            />
                                            {showError('parentName') && (
                                                <p id="signup-parentname-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600 mt-1 ml-1">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                    {errors.parentName}
                                                </p>
                                            )}
                                        </div>

                                        {/* Фамилия и Имя ребёнка */}
                                        <div>
                                            <label htmlFor="signup-childname" className="sr-only">
                                                Фамилия и имя ребёнка
                                            </label>
                                            <input
                                                id="signup-childname"
                                                ref={(el) => { fieldRefs.current.childName = el; }}
                                                type="text"
                                                value={childName}
                                                onChange={(e) => setChildName(e.target.value)}
                                                onBlur={() => markTouched('childName')}
                                                placeholder="Фамилия и Имя ребёнка*"
                                                autoComplete="off"
                                                required
                                                aria-required="true"
                                                aria-invalid={!!showError('childName')}
                                                aria-describedby={showError('childName') ? 'signup-childname-error' : undefined}
                                                className={fieldClass(!!showError('childName'))}
                                                disabled={status === 'submitting'}
                                            />
                                            {showError('childName') && (
                                                <p id="signup-childname-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600 mt-1 ml-1">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                    {errors.childName}
                                                </p>
                                            )}
                                        </div>

                                        {/* Телефон */}
                                        <div>
                                            <label htmlFor="signup-phone" className="sr-only">
                                                Телефон в формате +7XXXXXXXXXX
                                            </label>
                                            <input
                                                id="signup-phone"
                                                ref={(el) => { fieldRefs.current.phone = el; }}
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(normalizePhone(e.target.value))}
                                                onBlur={() => { setPhone(p => normalizePhone(p)); markTouched('phone'); }}
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
                                                aria-invalid={!!showError('phone')}
                                                aria-describedby={showError('phone') ? 'signup-phone-error' : undefined}
                                                className={fieldClass(!!showError('phone'))}
                                                disabled={status === 'submitting'}
                                            />
                                            {showError('phone') && (
                                                <p id="signup-phone-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600 mt-1 ml-1">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>

                                        {/* Номер детского сада */}
                                        <div>
                                            <label htmlFor="signup-kindergarten" className="sr-only">
                                                Номер детского сада
                                            </label>
                                            <input
                                                id="signup-kindergarten"
                                                ref={(el) => { fieldRefs.current.kindergarten = el; }}
                                                type="text"
                                                value={kindergarten}
                                                onChange={(e) => setKindergarten(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                onBlur={() => markTouched('kindergarten')}
                                                inputMode="numeric"
                                                placeholder="Номер сада*"
                                                required
                                                aria-required="true"
                                                aria-invalid={!!showError('kindergarten')}
                                                aria-describedby={showError('kindergarten') ? 'signup-kindergarten-error' : undefined}
                                                className={fieldClass(!!showError('kindergarten'))}
                                                disabled={status === 'submitting'}
                                            />
                                            {showError('kindergarten') && (
                                                <p id="signup-kindergarten-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600 mt-1 ml-1">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                    {errors.kindergarten}
                                                </p>
                                            )}
                                        </div>

                                        {/* Группа в саду */}
                                        <div>
                                            <label htmlFor="signup-group" className="sr-only">
                                                Название или номер группы в детском саду
                                            </label>
                                            <input
                                                id="signup-group"
                                                ref={(el) => { fieldRefs.current.group = el; }}
                                                type="text"
                                                value={group}
                                                onChange={(e) => setGroup(e.target.value)}
                                                onBlur={() => markTouched('group')}
                                                placeholder="Группа в саду*"
                                                required
                                                aria-required="true"
                                                aria-invalid={!!showError('group')}
                                                aria-describedby={showError('group') ? 'signup-group-error' : undefined}
                                                className={fieldClass(!!showError('group'))}
                                                disabled={status === 'submitting'}
                                            />
                                            {showError('group') && (
                                                <p id="signup-group-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600 mt-1 ml-1">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                    {errors.group}
                                                </p>
                                            )}
                                        </div>

                                        {/* Дата рождения */}
                                        <div>
                                            <label htmlFor="signup-dob" className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">
                                                Дата рожд. уч-ка<span className="text-orange-500">*</span>
                                            </label>
                                            <input
                                                id="signup-dob"
                                                ref={(el) => { fieldRefs.current.dob = el; }}
                                                type="date"
                                                value={dob}
                                                onChange={(e) => setDob(e.target.value)}
                                                onBlur={() => markTouched('dob')}
                                                min={minDobIso()}
                                                max={todayIso()}
                                                required
                                                aria-required="true"
                                                aria-invalid={!!showError('dob')}
                                                aria-describedby={showError('dob') ? 'signup-dob-error' : undefined}
                                                className={fieldClass(!!showError('dob'))}
                                                disabled={status === 'submitting'}
                                            />
                                            {showError('dob') && (
                                                <p id="signup-dob-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600 mt-1 ml-1">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                    {errors.dob}
                                                </p>
                                            )}
                                        </div>

                                        {/* Льгота */}
                                        <div>
                                            <select
                                                value={privilege}
                                                onChange={(e) => setPrivilege(e.target.value)}
                                                className={`${BASE_FIELD_CLASS} ${VALID_FIELD_CLASS}`}
                                                disabled={status === 'submitting'}
                                            >
                                                <option value="">Льгота (если есть)</option>
                                                {PRIVILEGE_OPTIONS.filter(o => o.value).map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                            {privilege && (
                                                <p className="text-xs text-orange-600 font-semibold mt-1 ml-1">
                                                    Льготная стоимость: {formatPrice(PRICING.privileged)} ₽ {PRICE_NOTE}
                                                </p>
                                            )}
                                        </div>

                                        {submitAttempted && hasEmptyFields && (
                                            <div role="alert" className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                                                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                                <p className="text-xs text-red-700 leading-relaxed">
                                                    Чтобы отправить заявку, заполните поля, отмеченные красным.
                                                </p>
                                            </div>
                                        )}

                                        {status === 'error' && errorMessage && (
                                            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                                                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                                <p className="text-xs text-red-700 leading-relaxed">{errorMessage}</p>
                                            </div>
                                        )}

                                        {/* Согласия — над кнопкой: по п. 4.1 Оферты подтверждаются ДО отправки формы */}
                                        <label className="flex items-start gap-3 cursor-pointer pt-2">
                                            <input
                                                type="checkbox"
                                                ref={(el) => { fieldRefs.current.consent = el; }}
                                                checked={consent}
                                                onChange={(e) => { setConsent(e.target.checked); markTouched('consent'); }}
                                                disabled={status === 'submitting'}
                                                required
                                                aria-required="true"
                                                aria-invalid={!!showError('consent')}
                                                aria-describedby={showError('consent') ? 'signup-consent-error' : undefined}
                                                className={`mt-0.5 w-4 h-4 rounded border-2 text-indigo-700 cursor-pointer shrink-0 ${
                                                    showError('consent')
                                                        ? 'border-red-500 ring-2 ring-red-200 focus:ring-red-500'
                                                        : 'border-slate-300 focus:ring-indigo-500'
                                                }`}
                                            />
                                            <ConsentLabel segments={OFERTA_CONSENT_SEGMENTS} />
                                        </label>
                                        {showError('consent') && (
                                            <p id="signup-consent-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600 -mt-2 ml-7">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                {errors.consent}
                                            </p>
                                        )}

                                        {/* Отдельное согласие на фото- и видеосъёмку — п. 7.4.3 Оферты */}
                                        <label className="flex items-start gap-3 cursor-pointer pt-1">
                                            <input
                                                type="checkbox"
                                                ref={(el) => { fieldRefs.current.photoConsent = el; }}
                                                checked={photoConsent}
                                                onChange={(e) => { setPhotoConsent(e.target.checked); markTouched('photoConsent'); }}
                                                disabled={status === 'submitting'}
                                                required
                                                aria-required="true"
                                                aria-invalid={!!showError('photoConsent')}
                                                aria-describedby={showError('photoConsent') ? 'signup-photoconsent-error' : undefined}
                                                className={`mt-0.5 w-4 h-4 rounded border-2 text-indigo-700 cursor-pointer shrink-0 ${
                                                    showError('photoConsent')
                                                        ? 'border-red-500 ring-2 ring-red-200 focus:ring-red-500'
                                                        : 'border-slate-300 focus:ring-indigo-500'
                                                }`}
                                            />
                                            <ConsentLabel
                                                segments={PHOTO_CONSENT_SEGMENTS}
                                                pdfHref={consentPdf ? legalFileUrl(consentPdf) : '/photo-consent'}
                                            />
                                        </label>
                                        {showError('photoConsent') && (
                                            <p id="signup-photoconsent-error" role="alert" className="flex items-center gap-1.5 text-xs text-red-600 -mt-2 ml-7">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                {errors.photoConsent}
                                            </p>
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
                                                'Отправить заявку'
                                            )}
                                        </button>

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
