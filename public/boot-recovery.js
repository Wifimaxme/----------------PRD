/*
 * Сторож загрузки. При каждой выкатке файлы получают новые имена с хэшем,
 * а старые удаляются. Если браузер держит закэшированный index.html, он
 * просит несуществующий чанк, получает 404 и приложение не стартует:
 * пользователь видит пустую страницу. Здесь мы это замечаем и один раз
 * перезагружаемся: reload идёт мимо HTTP кэша и подтягивает свежий html.
 * Флаг в sessionStorage не даёт зациклиться, main.tsx снимает его после
 * успешного старта.
 *
 * Живёт отдельным файлом, а не инлайном в index.html: политика CSP разрешает
 * только скрипты с нашего домена, инлайновый пришлось бы вписывать в неё
 * хешем и пересчитывать при каждой правке.
 */
(function () {
  var KEY = 'boot-recovery-attempted';
  var done = false;

  function recover(reason) {
    if (done) return;
    var root = document.getElementById('root');
    if (root && root.childElementCount > 0) return; // приложение живо
    done = true;
    try {
      if (sessionStorage.getItem(KEY)) return; // одна попытка на сессию
      sessionStorage.setItem(KEY, reason || '1');
    } catch (e) {
      return; // приватный режим без sessionStorage: не рискуем циклом
    }
    location.reload();
  }

  // Модульный скрипт не загрузился: реагируем сразу, не ждём таймаут.
  window.addEventListener('error', function (event) {
    var el = event.target;
    if (el && el.tagName === 'SCRIPT' && el.type === 'module') recover('script-error');
  }, true);

  // Подстраховка на случай, когда ошибка не всплыла: через 8 секунд
  // пустой #root означает, что стартовать не удалось.
  setTimeout(function () { recover('timeout'); }, 8000);
})();
