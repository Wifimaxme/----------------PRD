import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Trophy, MapPin, Calendar, UserCheck, Users, RussianRuble, CircleDot, ArrowLeft, CheckCircle2 } from 'lucide-react';

const WIDGET_ID = "014n3Ytgl71ceXIGW8wK2EFs9WxitEj3lmTf";
const WIDGET_CONTAINER_ID = "SiteWidgetMoyklass87110";

export function Signup() {
    const navigate = useNavigate();
    const widgetHostRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const host = widgetHostRef.current;
        if (!host) return;

        host.innerHTML = `<div id="${WIDGET_CONTAINER_ID}"></div>`;

        const script = document.createElement('script');
        script.src = `https://app.moyklass.com/api/site/widget/?id=${WIDGET_ID}`;
        script.async = true;
        script.setAttribute('charset', 'UTF-8');
        host.appendChild(script);

        return () => {
            host.innerHTML = '';
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
            {/* Background elements */}
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

                {/* RIGHT COLUMN - MOYKLASS WIDGET */}
                <div className="w-full md:w-7/12 bg-indigo-900 relative overflow-y-auto">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="relative p-6 md:p-10 flex flex-col justify-center min-h-full">
                        
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl relative mt-8 md:mt-0">
                            {/* Orange badge at top */}
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-500 text-white font-black uppercase tracking-wider py-2 px-8 rounded-full shadow-lg shadow-orange-500/30 text-lg">
                                Заявка
                            </div>

                            <div className="mt-6">
                                {/* Контейнер для виджета Мой Класс */}
                                <div ref={widgetHostRef} className="min-h-[400px] w-full" />
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
        </div>
    );
}
