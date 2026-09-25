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
 *   script-src 'self'          весь JS наш, инлайновых скриптов нет
 *                              (сторож загрузки вынесен в public/boot-recovery.js)
 *   style-src 'unsafe-inline'  React и motion пишут style атрибуты, без этого
 *                              не обойтись; чужих доменов для стилей нет
 *   font-src 'self'            шрифты лежат в public/fonts
 *   img-src unsplash           обложки блога пока берутся оттуда
 *   frame-src rutube.ru        видео на главной
 *   connect-src ЛК             форма заявки шлёт запросы только туда
 *
 * frame-ancestors через метатег не работает, защиты от clickjacking на
 * GitHub Pages не будет. Для неё нужен хостинг с заголовками.
 */
function buildCsp(leadsEndpoint: string): string {
  const leadsOrigin = new URL(leadsEndpoint).origin
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: https://images.unsplash.com",
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
      const meta = `<meta http-equiv="Content-Security-Policy" content="${buildCsp(leadsEndpoint)}" />`
      return html.replace('<head>', `<head>\n    ${meta}`)
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
