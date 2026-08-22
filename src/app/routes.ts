import type { ComponentType } from "react";
import { createHashRouter, replace } from "react-router";
import { Root } from "./Root";
import { NotFound } from "./pages/NotFound";

type RouteModule = { Component: ComponentType };

/**
 * Страницы грузятся отдельными чанками, а при выкатке старые чанки удаляются.
 * Если вкладка открыта со вчерашней сборкой, переход на другую страницу
 * упирается в 404 и роутер показывает «страница не найдена» — хотя страница
 * есть, устарела сборка. Ловим это и один раз перезагружаемся за свежим
 * index.html. Флаг снимает main.tsx после успешного старта.
 */
function retryOnStaleChunk(load: () => Promise<RouteModule>) {
  return () =>
    load().catch((error) => {
      const KEY = "chunk-recovery-attempted";
      try {
        if (!sessionStorage.getItem(KEY)) {
          sessionStorage.setItem(KEY, "1");
          window.location.reload();
          // Не резолвим: страница уже перезагружается, рисовать нечего.
          return new Promise<RouteModule>(() => {});
        }
      } catch {
        // sessionStorage недоступен — падаем в обычную обработку ошибки.
      }
      throw error;
    });
}

export const router = createHashRouter([
  {
    Component: Root,
    ErrorBoundary: NotFound,
    children: [
      {
        path: "/",
        lazy: retryOnStaleChunk(() => import("./pages/Home").then(m => ({ Component: m.Home }))),
      },
      {
        path: "/oferta",
        lazy: retryOnStaleChunk(() => import("./pages/Oferta").then(m => ({ Component: m.Oferta }))),
      },
      {
        path: "/privacy-policy",
        lazy: retryOnStaleChunk(() => import("./pages/PrivacyPolicy").then(m => ({ Component: m.PrivacyPolicy }))),
      },
      {
        path: "/signup",
        lazy: retryOnStaleChunk(() => import("./pages/Signup").then(m => ({ Component: m.Signup }))),
      },
      {
        path: "/photo-consent",
        lazy: retryOnStaleChunk(() => import("./pages/PhotoConsent").then(m => ({ Component: m.PhotoConsent }))),
      },
      {
        path: "/blog/:slug",
        lazy: retryOnStaleChunk(() => import("./pages/BlogArticle").then(m => ({ Component: m.BlogArticle }))),
      },

      {
        path: "/education-info",
        loader: () => replace("/education-info/basic"),
      },
      {
        path: "/education-info/basic",
        lazy: retryOnStaleChunk(() => import("./pages/BasicInfo").then(m => ({ Component: m.BasicInfo }))),
      },
      {
        path: "/education-info/structure",
        lazy: retryOnStaleChunk(() => import("./pages/Structure").then(m => ({ Component: m.Structure }))),
      },
      {
        path: "/education-info/documents",
        lazy: retryOnStaleChunk(() => import("./pages/Documents").then(m => ({ Component: m.Documents }))),
      },
      {
        path: "/education-info/education",
        lazy: retryOnStaleChunk(() => import("./pages/Education").then(m => ({ Component: m.Education }))),
      },
      {
        path: "/education-info/standards",
        lazy: retryOnStaleChunk(() => import("./pages/Standards").then(m => ({ Component: m.Standards }))),
      },
      {
        path: "/education-info/staff",
        lazy: retryOnStaleChunk(() => import("./pages/Staff").then(m => ({ Component: m.Staff }))),
      },
      {
        path: "/education-info/materials",
        lazy: retryOnStaleChunk(() => import("./pages/Materials").then(m => ({ Component: m.Materials }))),
      },
      {
        path: "/education-info/paid-services",
        lazy: retryOnStaleChunk(() => import("./pages/PaidServices").then(m => ({ Component: m.PaidServices }))),
      },
      {
        path: "/education-info/finance",
        lazy: retryOnStaleChunk(() => import("./pages/Finance").then(m => ({ Component: m.Finance }))),
      },
      {
        path: "/education-info/vacancies",
        lazy: retryOnStaleChunk(() => import("./pages/Vacancies").then(m => ({ Component: m.Vacancies }))),
      },
      {
        path: "/education-info/scholarships",
        lazy: retryOnStaleChunk(() => import("./pages/Scholarships").then(m => ({ Component: m.Scholarships }))),
      },
      {
        path: "/education-info/catering",
        lazy: retryOnStaleChunk(() => import("./pages/Catering").then(m => ({ Component: m.Catering }))),
      },
      {
        path: "/education-info/international",
        lazy: retryOnStaleChunk(() => import("./pages/International").then(m => ({ Component: m.International }))),
      },
    ],
  },
]);
