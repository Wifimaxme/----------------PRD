/**
 * Сверяет манифест редакций с фактическими файлами в public/legal.
 *
 * Ловит: потерянный файл, перезаписанный файл (хеш поехал), файл без записи
 * в манифесте, несоответствие имени единой схеме, больше одной действующей
 * редакции у документа.
 *
 * Запуск: npm run verify:legal
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const legalDir = join(root, "public", "legal");
const manifestPath = join(legalDir, "manifest.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const items = manifest.items ?? [];
if (items.length === 0) {
    console.error("Манифест пуст или не разобран");
    process.exit(1);
}

const NAME_PATTERN = /^[a-z0-9-]+-\d{4}-\d{2}-\d{2}-r\d+\.pdf$/;
let failed = 0;

for (const item of items) {
    const path = join(legalDir, item.file);

    if (!NAME_PATTERN.test(item.file)) {
        console.error(`ИМЯ НЕ ПО СХЕМЕ  ${item.file} — ожидается <id>-<YYYY-MM-DD>-r<N>.pdf`);
        failed++;
    }
    if (item.url !== `/legal/${item.file}`) {
        console.error(`URL НЕ СОВПАЛ  ${item.file}: в манифесте ${item.url}`);
        failed++;
    }
    if (!existsSync(path)) {
        console.error(`ОТСУТСТВУЕТ  ${item.file} — запись в манифесте есть, файла нет`);
        failed++;
        continue;
    }

    const raw = readFileSync(path);
    const sha = createHash("sha256").update(raw).digest("hex");
    if (sha !== item.sha256) {
        console.error(`ХЕШ НЕ СОВПАЛ  ${item.file}\n  в манифесте: ${item.sha256}\n  фактически:  ${sha}`);
        console.error("  Файл редакции перезаписан. Так нельзя: новая редакция — новое имя файла.");
        failed++;
        continue;
    }
    if (raw.length !== item.bytes) {
        console.error(`РАЗМЕР НЕ СОВПАЛ  ${item.file}: в манифесте ${item.bytes}, фактически ${raw.length}`);
        failed++;
        continue;
    }
    console.log(`ок  ${item.file}  ${raw.length} байт  ${sha.slice(0, 16)}…`);
}

const byDocument = new Map();
for (const item of items) {
    byDocument.set(item.id, (byDocument.get(item.id) ?? 0) + (item.current ? 1 : 0));
}
for (const [id, count] of byDocument) {
    if (count !== 1) {
        console.error(`ДЕЙСТВУЮЩИХ РЕДАКЦИЙ ${count}  документ ${id} — должна быть ровно одна`);
        failed++;
    }
}

const known = new Set(items.map(i => i.file));
for (const file of readdirSync(legalDir).filter(f => f.endsWith(".pdf"))) {
    if (!known.has(file)) {
        console.error(`НЕ В МАНИФЕСТЕ  ${file} — файл лежит в public/legal, но записи о нём нет`);
        failed++;
    }
}

if (failed > 0) {
    console.error(`\nПроверка не пройдена: проблем — ${failed}`);
    process.exit(1);
}
console.log(`\nПроверка пройдена: редакций — ${items.length}`);
