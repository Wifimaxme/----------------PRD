import manifest from "../../../public/legal/manifest.json";

/**
 * Реестр редакций юридических документов.
 *
 * ГЛАВНОЕ ПРАВИЛО: файл в /public/legal НИКОГДА не перезаписывается.
 * Новая редакция — новое имя файла и новая запись. Всё остальное производно.
 *
 * Почему так: текст страницы живёт внутри JS-бандла, и любая пересборка сайта
 * меняет его байты, даже когда документ не менялся. Привязать к такому хеш
 * нельзя. Канонический артефакт — статический PDF: он не пересобирается,
 * байты стабильны, SHA-256 постоянен, ссылка вечная.
 *
 * Дата редакции содержится в тексте самого PDF и продублирована в тексте
 * страницы — она не подставляется переменной, иначе дату можно поменять,
 * не тронув текст, и наоборот.
 *
 * Источник данных — public/legal/manifest.json. Тот же самый файл отдаётся
 * наружу по адресу /legal/manifest.json, поэтому машиночитаемый реестр и
 * страницы сайта физически не могут разойтись.
 *
 * Схема имени файла: <id>-<publishedOn>-r<N>.pdf — единая для всех документов.
 *
 * При добавлении редакции:
 *   1. Выгрузить документ из Google Docs в PDF.
 *   2. Положить в public/legal под новым именем по схеме выше.
 *   3. Посчитать `shasum -a 256 public/legal/<файл>` и размер в байтах.
 *   4. Добавить запись в manifest.json, снять current у прежней редакции.
 *   5. Прогнать `npm run verify:legal`.
 */

export type LegalRevision = {
    /** Идентификатор документа: oferta, privacy-policy, photo-consent. */
    id: string;
    title: string;
    /** Страница сайта с текстом редакции, если она есть. */
    page: string | null;
    /** Имя файла в /legal. Версия в имени, файл неизменен. */
    file: string;
    /** Постоянная ссылка на файл. */
    url: string;
    /** Как редакция обозначена в тексте самого документа. */
    revision: string;
    /** Дата редакции по тексту документа, ISO. null — если версионируется номером. */
    effectiveFrom: string | null;
    /** Дата размещения редакции на сайте, ISO. */
    publishedOn: string;
    /** SHA-256 байтов файла, hex в нижнем регистре. */
    sha256: string;
    /** Размер файла в байтах. */
    bytes: number;
    /** Действующая редакция документа. Ровно одна на документ. */
    current: boolean;
};

export const LEGAL_REVISIONS: LegalRevision[] = manifest.items as LegalRevision[];

/** Редакции, сгруппированные по документу: новые сверху. */
export function revisionsByDocument(): { id: string; title: string; page: string | null; revisions: LegalRevision[] }[] {
    const order: string[] = [];
    const grouped = new Map<string, LegalRevision[]>();

    for (const revision of LEGAL_REVISIONS) {
        if (!grouped.has(revision.id)) {
            grouped.set(revision.id, []);
            order.push(revision.id);
        }
        grouped.get(revision.id)!.push(revision);
    }

    return order.map(id => {
        const revisions = grouped.get(id)!;
        return { id, title: revisions[0].title, page: revisions[0].page, revisions };
    });
}

/** Действующая редакция документа по его id. */
export function currentRevision(documentId: string): LegalRevision | undefined {
    return LEGAL_REVISIONS.find(rev => rev.id === documentId && rev.current);
}

/** Постоянная ссылка на файл редакции. */
export function legalFileUrl(revision: LegalRevision): string {
    return revision.url;
}

/** «193905» → «189 КБ» для показа рядом со ссылкой. */
export function formatBytes(bytes: number): string {
    return `${Math.round(bytes / 1024)} КБ`;
}
