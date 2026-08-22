/**
 * Реестр редакций юридических документов.
 *
 * ГЛАВНОЕ ПРАВИЛО: файл в /public/legal НИКОГДА не перезаписывается.
 * Новая редакция — новое имя файла и новая запись в начале списка revisions.
 * Всё остальное здесь производно от этого правила.
 *
 * Почему так: текст страницы живёт внутри JS-бандла, и любая пересборка сайта
 * меняет его байты, даже когда сам документ не менялся. Привязать к такому
 * хеш нельзя. Канонический артефакт — статический PDF: он не пересобирается,
 * байты стабильны, SHA-256 постоянен, ссылка вечная.
 *
 * Дата редакции содержится в тексте самого PDF, а не подставляется рядом с
 * ним переменной, — иначе дату можно поменять, не тронув текст, и наоборот.
 *
 * При добавлении редакции:
 *   1. Выгрузить документ из Google Docs в PDF.
 *   2. Положить в public/legal под новым именем с версией.
 *   3. Посчитать `shasum -a 256 public/legal/<файл>` и размер в байтах.
 *   4. Добавить запись первой в revisions, снять current у прежней.
 *   5. Прогнать `npm run verify:legal` — сверит хеши и размеры с файлами.
 */

export type LegalRevision = {
    /** Имя файла в /legal. Версия в имени, файл неизменен. */
    file: string;
    /** Как редакция обозначена в тексте самого документа. */
    revision: string;
    /** Дата редакции по тексту документа, ISO. null — если документ версионируется номером. */
    effectiveFrom: string | null;
    /** Дата размещения этой редакции на сайте, ISO. */
    publishedOn: string;
    /** SHA-256 байтов файла, hex в нижнем регистре. */
    sha256: string;
    /** Размер файла в байтах. */
    bytes: number;
    /** Действующая редакция документа. Ровно одна на документ. */
    current: boolean;
};

export type LegalDocument = {
    id: string;
    title: string;
    /** Страница сайта с текстом действующей редакции, если она есть. */
    page: string | null;
    /** Редакции, новые сверху. */
    revisions: LegalRevision[];
};

export const LEGAL_DOCUMENTS: LegalDocument[] = [
    {
        id: "oferta",
        title: "Публичная оферта на оказание услуг",
        page: "/oferta",
        revisions: [
            {
                file: "oferta-2026-08-20.pdf",
                revision: "Редакция от 20 августа 2026 года",
                effectiveFrom: "2026-08-20",
                publishedOn: "2026-08-22",
                sha256: "3e04b85962b007b90d127a8624c728d80ce764b16a02676864131e7d6534fd55",
                bytes: 193905,
                current: true,
            },
        ],
    },
    {
        id: "privacy-policy",
        title: "Политика в отношении обработки персональных данных",
        page: "/privacy-policy",
        revisions: [
            {
                file: "privacy-policy-2026-08-22.pdf",
                revision: "Редакция от 22 августа 2026 года",
                effectiveFrom: "2026-08-22",
                publishedOn: "2026-08-22",
                sha256: "457a3f09c1aa4e70a78107e746c411b3473db0b40fe5faf58a1e8d1b8b7316f6",
                bytes: 233115,
                current: true,
            },
        ],
    },
    {
        id: "photo-consent",
        title:
            "Согласие законного представителя на фото- и видеосъёмку ребёнка, использование его изображения и предоставление фото- и видеоотчётов",
        page: "/photo-consent",
        revisions: [
            {
                file: "photo-consent-r2.pdf",
                revision: "Редакция № 2",
                effectiveFrom: null,
                publishedOn: "2026-08-22",
                sha256: "faab50f60f5c13a883c3fb9a0a436af77938756654c22e071777392aee86386b",
                bytes: 86809,
                current: true,
            },
        ],
    },
];

/** Публичный путь к файлу редакции. */
export function legalFileUrl(revision: LegalRevision): string {
    return `/legal/${revision.file}`;
}

/** Действующая редакция документа по его id. */
export function currentRevision(documentId: string): LegalRevision | undefined {
    return LEGAL_DOCUMENTS.find(doc => doc.id === documentId)?.revisions.find(rev => rev.current);
}

/** «193905» → «189 КБ» для показа рядом со ссылкой. */
export function formatBytes(bytes: number): string {
    return `${Math.round(bytes / 1024)} КБ`;
}
