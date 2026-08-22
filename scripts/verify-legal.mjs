/**
 * Сверяет реестр редакций с фактическими файлами в public/legal.
 * Ловит три ошибки: файл потерян, файл перезаписан (хеш поехал),
 * запись в реестре есть, а файла нет — и наоборот.
 *
 * Запуск: npm run verify:legal
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const legalDir = join(root, "public", "legal");
const registryPath = join(root, "src", "app", "data", "legalDocuments.ts");

const source = readFileSync(registryPath, "utf8");
const entries = [...source.matchAll(
    /file:\s*"([^"]+)"[\s\S]*?sha256:\s*"([0-9a-f]{64})"[\s\S]*?bytes:\s*(\d+)/g
)].map(([, file, sha256, bytes]) => ({ file, sha256, bytes: Number(bytes) }));

if (entries.length === 0) {
    console.error("Не удалось разобрать реестр — проверьте формат legalDocuments.ts");
    process.exit(1);
}

let failed = 0;
for (const entry of entries) {
    const path = join(legalDir, entry.file);
    if (!existsSync(path)) {
        console.error(`ОТСУТСТВУЕТ  ${entry.file} — запись в реестре есть, файла нет`);
        failed++;
        continue;
    }
    const raw = readFileSync(path);
    const sha = createHash("sha256").update(raw).digest("hex");
    if (sha !== entry.sha256) {
        console.error(`ХЕШ НЕ СОВПАЛ  ${entry.file}\n  в реестре: ${entry.sha256}\n  фактически: ${sha}`);
        console.error("  Файл редакции перезаписан. Так делать нельзя: новая редакция — новое имя файла.");
        failed++;
        continue;
    }
    if (raw.length !== entry.bytes) {
        console.error(`РАЗМЕР НЕ СОВПАЛ  ${entry.file}: в реестре ${entry.bytes}, фактически ${raw.length}`);
        failed++;
        continue;
    }
    console.log(`ок  ${entry.file}  ${raw.length} байт  ${sha.slice(0, 16)}…`);
}

const known = new Set(entries.map(e => e.file));
for (const file of readdirSync(legalDir).filter(f => f.endsWith(".pdf"))) {
    if (!known.has(file)) {
        console.error(`НЕ В РЕЕСТРЕ  ${file} — файл лежит в public/legal, но записи о нём нет`);
        failed++;
    }
}

if (failed > 0) {
    console.error(`\nПроверка не пройдена: проблем — ${failed}`);
    process.exit(1);
}
console.log(`\nПроверка пройдена: редакций — ${entries.length}`);
