#!/usr/bin/env bash
#
# Выкладка сайта в Yandex Cloud: бакет champion-footboll-site в папке site,
# перед ним CDN с доменом champion-footboll.ru. Запуск: npm run deploy:yc
#
# Кэширование задаём здесь, заголовком Cache-Control на каждом объекте:
#   assets/*       имена с хешем, содержимое под именем не меняется — год;
#   legal/*.pdf    редакции реестра неизменяемы по правилу из manifest.json — год;
#   fonts/*        имена без хеша, но шрифты меняются редко — 30 дней;
#   всё остальное  (index.html, manifest.json, boot-recovery.js, регуляторные
#                  PDF) — no-cache: браузер и CDN каждый раз перепроверяют.
#
# Порядок загрузки важен: сначала файлы, на которые ссылается index.html, и
# только потом сам index.html. Иначе посетитель в промежутке получит новый
# html со ссылками на ещё не загруженные чанки — белый экран.
#
# Старые файлы из бакета не удаляем: вкладка, открытая со вчерашней сборкой,
# продолжит подгружать свои чанки. Удалять что-то с сайта — только руками:
#   yc storage s3 rm s3://champion-footboll-site/<путь>

set -euo pipefail

BUCKET=champion-footboll-site
FOLDER_ID=b1gf8r4op180s4743snf
YEAR="public, max-age=31536000, immutable"
MONTH="public, max-age=2592000"
REVALIDATE="no-cache"

cd "$(dirname "$0")/.."

npm run verify:legal
npm run build

JS="text/javascript; charset=utf-8"
CSS="text/css; charset=utf-8"
JSON="application/json; charset=utf-8"
HTML="text/html; charset=utf-8"

# Тип для .js, .css и .json задаём сами: yc угадывает их как text/plain, а
# модульный скрипт с таким типом браузер не запускает — белый экран.
# .DS_Store и CNAME (он для GitHub Pages) не выкладываем.
up() { yc storage s3 cp --recursive --only-show-errors --exclude "*.DS_Store" --exclude "CNAME" "$@"; }
one() { yc storage s3 cp --only-show-errors "$@"; }

up --cache-control "$YEAR" --exclude "*" --include "*.js" --content-type "$JS" dist/assets "s3://$BUCKET/assets"
up --cache-control "$YEAR" --exclude "*" --include "*.css" --content-type "$CSS" dist/assets "s3://$BUCKET/assets"
up --cache-control "$YEAR" --exclude "manifest.json" dist/legal "s3://$BUCKET/legal"
up --cache-control "$MONTH" dist/fonts "s3://$BUCKET/fonts"
up --cache-control "$REVALIDATE" \
  --exclude "assets/*" --exclude "legal/*" --exclude "fonts/*" \
  --exclude "*.js" --exclude "*.json" --exclude "*.html" \
  dist "s3://$BUCKET"
one --cache-control "$REVALIDATE" --content-type "$JSON" dist/legal/manifest.json "s3://$BUCKET/legal/manifest.json"
one --cache-control "$REVALIDATE" --content-type "$JS" dist/boot-recovery.js "s3://$BUCKET/boot-recovery.js"
one --cache-control "$REVALIDATE" --content-type "$HTML" dist/index.html "s3://$BUCKET/index.html"

# CDN держит копии у себя. Файлы с no-cache он перепроверяет сам, но сброс
# корня и index.html делает обновление мгновенным, а не «в течение минуты».
RESOURCE_ID=$(yc cdn resource list --folder-id "$FOLDER_ID" --format json \
  | python3 -c "import json,sys; r=[x['id'] for x in json.load(sys.stdin) if x.get('cname')=='champion-footboll.ru']; print(r[0] if r else '')")
if [ -n "$RESOURCE_ID" ]; then
  yc cdn cache purge --resource-id "$RESOURCE_ID" --path "/,/index.html,/legal/manifest.json,/boot-recovery.js" >/dev/null
  echo "Выложено, кэш CDN сброшен."
else
  echo "Выложено в бакет. CDN-ресурс для champion-footboll.ru не найден — кэш не сбрасывал."
fi
