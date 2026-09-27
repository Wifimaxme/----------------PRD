#!/usr/bin/env bash
#
# Переезд champion-footboll.ru с GitHub Pages в Yandex Cloud: CDN перед
# бакетом champion-footboll-site и копия DNS-зоны в Cloud DNS.
#
#   bash scripts/yc-setup.sh
#
# Безопасен при повторном запуске: что уже создано, переиспользует.
# Сайт и почту не трогает: всё это начнёт работать только после смены
# NS-серверов в reg.ru, а её скрипт не делает — он печатает, что нажать.
#
# Шаги:
#   1. Ждёт выпуска сертификата Let's Encrypt (до 30 минут). Для этого в
#      reg.ru уже должны стоять две CNAME-записи _acme-challenge.
#   2. Включает CDN в папке site и создаёт CDN-ресурс сразу с сертификатом,
#      редиректом на HTTPS и заголовками безопасности.
#   3. Создаёт зону champion-footboll.ru в Cloud DNS и переносит в неё все
#      записи reg.ru (почта, lk, staging.lk, SPF, DMARC, DKIM), а корень и www
#      направляет на CDN.
#   4. Проверяет: записи в новой зоне совпадают с reg.ru, сайт через CDN
#      отдаётся по HTTPS с нужными заголовками и типами файлов.

set -euo pipefail

FOLDER_ID=b1gf8r4op180s4743snf          # папка site
BUCKET_HOST=champion-footboll-site.website.yandexcloud.net
DOMAIN=champion-footboll.ru
CERT_NAME=champion-footboll-ru
ZONE_NAME=champion-footboll-ru
ACME_TARGET=fpqlbu33i0a233o08lka.cm.yandexcloud.net.
TTL=600

say() { printf '\n==> %s\n' "$*"; }
die() { printf '\nСТОП: %s\n' "$*" >&2; exit 1; }
json() { python3 -c "import json,sys; d=json.load(sys.stdin); $1"; }

command -v yc >/dev/null || die "нет yc в PATH"
command -v dig >/dev/null || die "нет dig"

# ---------------------------------------------------------------- 1. сертификат
say "1. Сертификат"
CERT_ID=$(yc certificate-manager certificate get --folder-id "$FOLDER_ID" --name "$CERT_NAME" --format json | json 'print(d["id"])')
status=""
for i in $(seq 1 60); do
  status=$(yc certificate-manager certificate get --id "$CERT_ID" --format json | json 'print(d["status"])')
  [ "$status" = "ISSUED" ] && break
  seen=$(dig +short CNAME "_acme-challenge.$DOMAIN" @ns1.reg.ru)
  [ -n "$seen" ] || die "в reg.ru нет записи _acme-challenge CNAME $ACME_TARGET (и такой же для _acme-challenge.www). Добавьте обе и запустите скрипт снова."
  printf '   статус %s, записи в reg.ru видны, жду… (%s/60)\n' "$status" "$i"
  sleep 30
done
[ "$status" = "ISSUED" ] || die "сертификат за 30 минут не выпустился (статус $status). Запустите скрипт позже ещё раз."
echo "   выпущен: $CERT_ID"

# ---------------------------------------------------------------- 2. CDN
say "2. CDN"
activated=$(yc cdn provider list-activated --folder-id "$FOLDER_ID" --format json | json '
p = d if isinstance(d, list) else (d.get("providers") or [])
print(len(p))')
if [ "$activated" = "0" ]; then
  echo "   включаю CDN в папке"
  yc cdn provider activate --folder-id "$FOLDER_ID" --type ourcdn >/dev/null 2>&1 \
    || yc cdn provider activate --folder-id "$FOLDER_ID" --type gcore >/dev/null
fi

find_resource() {
  yc cdn resource list --folder-id "$FOLDER_ID" --format json \
    | json "r=[x for x in d if x.get('cname')=='$DOMAIN']; print(r[0]['id'] if r else '')"
}
RESOURCE_ID=$(find_resource)
if [ -z "$RESOURCE_ID" ]; then
  echo "   создаю CDN-ресурс"
  # CSP целиком приходит метатегом из vite.config.ts. Здесь добавляем только
  # то, что метатег не умеет: запрет встраивать сайт в чужие страницы.
  yc cdn resource create --folder-id "$FOLDER_ID" \
    --cname "$DOMAIN" --secondary-hostnames "www.$DOMAIN" \
    --origin-custom-source "$BUCKET_HOST" --origin-protocol https \
    --host-header "$BUCKET_HOST" \
    --cert-manager-ssl-cert-id "$CERT_ID" \
    --redirect-http-to-https \
    --active=true \
    --cache-expiration-time-default 3600 --ignore-query-string --gzip-on \
    --static-headers "Strict-Transport-Security=max-age=31536000,X-Content-Type-Options=nosniff,X-Frame-Options=DENY,Referrer-Policy=strict-origin-when-cross-origin,Content-Security-Policy=frame-ancestors 'none'" \
    >/dev/null
  RESOURCE_ID=$(find_resource)
fi
[ -n "$RESOURCE_ID" ] || die "CDN-ресурс не создался"

# Адрес CDN, на который смотрят корень и www. Поле называется по-разному в
# разных версиях API, поэтому ищем ключ с provider_cname на любой глубине.
CDN_HOST=$(yc cdn resource get --id "$RESOURCE_ID" --format json | json '
def walk(v):
    if isinstance(v, dict):
        for k, x in v.items():
            if "provider_cname" in k or "providerCname" in k:
                yield x
            yield from walk(x)
    elif isinstance(v, list):
        for x in v:
            yield from walk(x)
c = [x for x in walk(d) if isinstance(x, str) and x]
print(c[0] if c else "")')
[ -n "$CDN_HOST" ] || die "не нашёл адрес CDN в описании ресурса. Посмотрите: yc cdn resource get --id $RESOURCE_ID"
CDN_HOST="${CDN_HOST%.}."
echo "   ресурс $RESOURCE_ID, адрес $CDN_HOST"

# ---------------------------------------------------------------- 3. DNS-зона
say "3. Зона в Cloud DNS"
if ! yc dns zone get --folder-id "$FOLDER_ID" --name "$ZONE_NAME" >/dev/null 2>&1; then
  yc dns zone create --folder-id "$FOLDER_ID" --name "$ZONE_NAME" --zone "$DOMAIN." --public-visibility >/dev/null
fi

# DKIM берём из действующего DNS, а не переписываем руками: ключ длинный.
DKIM=$(dig +short TXT "dkim._domainkey.$DOMAIN" @ns1.reg.ru | tr -d '"\n')
[ -n "$DKIM" ] || die "не удалось прочитать DKIM из reg.ru"

set_rr() { yc dns zone replace-records --folder-id "$FOLDER_ID" --name "$ZONE_NAME" "$@" >/dev/null; }
set_rr --record "@ $TTL ANAME $CDN_HOST"
set_rr --record "www $TTL CNAME $CDN_HOST"
set_rr --record "lk $TTL A 34.179.235.93"
set_rr --record "staging.lk $TTL A 34.179.235.93"
set_rr --record "@ $TTL MX 5 mxs1.reg.ru." --record "@ $TTL MX 10 mxs2.reg.ru."
set_rr --record "@ $TTL TXT \"v=spf1 ip4:31.31.197.72 a mx include:_spf.hosting.reg.ru ~all\""
set_rr --record "_dmarc $TTL TXT \"v=DMARC1; p=none; aspf=r; sp=none\""
set_rr --record "dkim._domainkey $TTL TXT \"$DKIM\""
set_rr --record "_acme-challenge $TTL CNAME $ACME_TARGET"
set_rr --record "_acme-challenge.www $TTL CNAME $ACME_TARGET"

# ---------------------------------------------------------------- 4. проверки
say "4. Проверка: новая зона отдаёт то же, что reg.ru"
fail=0
norm() { tr -d '"' | tr 'A-Z' 'a-z' | tr -s ' ' | sort; }
for q in "lk A" "staging.lk A" "@ MX" "@ TXT" "_dmarc TXT" "dkim._domainkey TXT" "_acme-challenge CNAME" "_acme-challenge.www CNAME"; do
  set -- $q
  host=$([ "$1" = "@" ] && echo "$DOMAIN" || echo "$1.$DOMAIN")
  old=$(dig +short "$2" "$host" @ns1.reg.ru | norm)
  new=$(dig +short "$2" "$host" @ns1.yandexcloud.net | norm)
  if [ -n "$old" ] && [ "$old" = "$new" ]; then
    printf '   OK    %-36s %s\n' "$host" "$2"
  else
    printf '   РАЗНО %-36s %s\n      reg.ru: %s\n      yandex: %s\n' "$host" "$2" "$old" "$new"
    fail=1
  fi
done
[ "$fail" = "0" ] || die "записи различаются. NS не меняйте, пришлите вывод."

say "4. Проверка: сайт через CDN (настройки расходятся по CDN до 15 минут)"
ok=0; ip=""; code=""
for i in $(seq 1 30); do
  ip=$(dig +short A "${CDN_HOST%.}" | grep -E '^[0-9.]+$' | head -1 || true)
  if [ -n "$ip" ]; then
    code=$(curl -s -o /dev/null -w '%{http_code}' --resolve "$DOMAIN:443:$ip" "https://$DOMAIN/" || true)
    if [ "$code" = "200" ]; then ok=1; break; fi
  fi
  printf '   пока не отвечает (ip=%s, код=%s), жду… (%s/30)\n' "${ip:-нет}" "${code:-нет}" "$i"
  sleep 30
done
[ "$ok" = "1" ] || die "CDN за 15 минут не начал отдавать сайт. Запустите скрипт позже ещё раз, он продолжит с проверок."

R="--resolve $DOMAIN:443:$ip --resolve $DOMAIN:80:$ip"
hdr() { curl -sI $R "$1" | tr -d '\r'; }
index=$(curl -s $R "https://$DOMAIN/")
js=$(printf '%s' "$index" | grep -oE '/assets/index-[A-Za-z0-9_-]+\.js' | head -1 || true)
check() {
  if eval "$2"; then printf '   OK    %s\n' "$1"; else printf '   НЕТ   %s\n' "$1"; fail=1; fi
}
check "главная отдаёт приложение"  '[ -n "$js" ]'
check "JS с типом text/javascript" 'hdr "https://$DOMAIN$js" | grep -qi "^content-type: text/javascript"'
check "index.html с no-cache"      'hdr "https://$DOMAIN/" | grep -qi "^cache-control: no-cache"'
check "HSTS"                       'hdr "https://$DOMAIN/" | grep -qi "^strict-transport-security"'
check "запрет встраивания"         'hdr "https://$DOMAIN/" | grep -qi "^x-frame-options: deny"'
check "реестр редакций на месте"   '[ "$(curl -s -o /dev/null -w "%{http_code}" $R "https://$DOMAIN/legal/manifest.json")" = 200 ]'
check "http → https"               'curl -sI $R "http://$DOMAIN/" | grep -qiE "^location: https://"'
[ "$fail" = "0" ] || die "не все проверки прошли. NS не меняйте, пришлите вывод."

cat <<EOF

==> Всё готово. Последний шаг — в reg.ru: сменить NS-серверы на

       ns1.yandexcloud.net
       ns2.yandexcloud.net

   Переключение расходится по сети от нескольких минут до суток. Всё это
   время сайт открывается: у одних ещё с GitHub Pages, у других уже с CDN,
   содержимое одинаковое. Почта и lk работают в обоих вариантах.
EOF
