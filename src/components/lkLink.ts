/**
 * Личный кабинет живёт на отдельном поддомене. Общая точка правды для ссылок
 * на него, чтобы адрес и правило открытия вкладки не расходились по страницам.
 */
export const LK_URL = 'https://lk.champion-footboll.ru/';

/**
 * На десктопе открываем ЛК в новой вкладке — сайт остаётся под рукой.
 * Внутри Telegram и на мобильных новая вкладка теряется, поэтому там переходим
 * в текущем окне.
 */
export function shouldOpenLkInNewTab(): boolean {
    if (typeof navigator === 'undefined') return true;
    const ua = navigator.userAgent || '';
    const isTelegram = /Telegram/i.test(ua);
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
    return !(isTelegram || isMobile);
}
