import { defineConfig, loadEnv, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/**
 * Content-Security-Policy для прод сборки.
 *
 * GitHub Pages не умеет отдавать HTTP заголовки, поэтому политика едет
 * метатегом в index.html. В dev режиме не вставляем: Vite держит HMR через
 * websocket и подсовывает стили инлайном, политика бы это заблокировала.
 *
 * Что разрешено и почему:
 *   script-src 'self'      весь JS наш, инлайновых скриптов нет
 *                          (сторож загрузки вынесен в public/boot-recovery.js)
 *   style-src 'self'       без 'unsafe-inline': React и motion пишут стили
 *                          через CSSOM (element.style), а его CSP не трогает.
 *                          Инлайновых <style> и style="" в сборке нет, это
 *                          проверено прогоном всех страниц в браузере. Если
 *                          появится AnimatePresence с popLayout или сторонний
 *                          виджет, который вставляет <style>, сюда придётся
 *                          добавить 'unsafe-inline'
 *   font-src 'self'        шрифты лежат в public/fonts
 *   img-src unsplash       обложки блога пока берутся оттуда; data: не нужен,
 *                          Vite ничего не инлайнит (в assets только js и css)
 *   frame-src rutube.ru    видео на главной
 *   connect-src ЛК         форма заявки шлёт запросы только туда
 *
 * frame-ancestors через метатег не работает, защиты от clickjacking на
 * GitHub Pages не будет. Для неё нужен хостинг с заголовками.
 */
function buildCsp(leadsEndpoint: string): string {
  let leadsOrigin: string
  try {
    leadsOrigin = new URL(leadsEndpoint).origin
  } catch {
    throw new Error(
      `VITE_LEADS_ENDPOINT должен быть абсолютным URL (https://host/path), получено: ${JSON.stringify(leadsEndpoint)}`,
    )
  }
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "font-src 'self'",
    "img-src 'self' https://images.unsplash.com",
    'frame-src https://rutube.ru',
    `connect-src 'self' ${leadsOrigin}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ')
}

function cspMetaTag(leadsEndpoint: string): Plugin {
  return {
    name: 'csp-meta-tag',
    apply: 'build',
    transformIndexHtml(html) {
      // Вставляем строкой, а не через tags: Vite экранирует кавычки в
      // атрибутах, и 'self' превращается в &#39;self&#39;. Браузер это
      // понимает, но читать dist/index.html глазами становится неприятно.
      // Метатег должен стоять первым в <head>, до любых загрузок.
      const meta = `<meta http-equiv="Content-Security-Policy" content="${buildCsp(leadsEndpoint)}" />`
      const head = /<head[^>]*>/
      if (!head.test(html)) {
        // Сайт без политики выкатывать нельзя, лучше уронить сборку.
        throw new Error('csp-meta-tag: в index.html не найден тег <head>, CSP вставить некуда')
      }
      return html.replace(head, (tag) => `${tag}\n    ${meta}`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Тот же адрес по умолчанию, что зашит в src/app/pages/Signup.tsx.
  const leadsEndpoint = env.VITE_LEADS_ENDPOINT || 'https://lk.champion-footboll.ru/api/leads'

  return {
    base: '/',
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
      cspMetaTag(leadsEndpoint),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
