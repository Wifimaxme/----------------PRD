import { Outlet, ScrollRestoration } from "react-router";

/**
 * Root layout — wraps every page. Provides:
 *  - keyboard skip-link to the #main landmark on each page
 *  - global scroll restoration on route changes (replaces ad-hoc scrollTo calls)
 *
 * Each page still renders its own Header/Footer because layouts vary
 * (BlogArticle uses different chrome, NotFound differs etc.).
 */
export function Root() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-lg focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-white focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Перейти к содержимому
      </a>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
