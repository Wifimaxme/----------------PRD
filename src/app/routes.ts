import { createHashRouter, replace } from "react-router";
import { Root } from "./Root";
import { NotFound } from "./pages/NotFound";

export const router = createHashRouter([
  {
    Component: Root,
    ErrorBoundary: NotFound,
    HydrateFallback: () => null,
    children: [
      {
        path: "/",
        lazy: () => import("./pages/Home").then(m => ({ Component: m.Home })),
      },
      {
        path: "/oferta",
        lazy: () => import("./pages/Oferta").then(m => ({ Component: m.Oferta })),
      },
      {
        path: "/privacy-policy",
        lazy: () => import("./pages/PrivacyPolicy").then(m => ({ Component: m.PrivacyPolicy })),
      },
      {
        path: "/signup",
        lazy: () => import("./pages/Signup").then(m => ({ Component: m.Signup })),
      },
      {
        path: "/blog/:slug",
        lazy: () => import("./pages/BlogArticle").then(m => ({ Component: m.BlogArticle })),
      },

      {
        path: "/education-info",
        loader: () => replace("/education-info/basic"),
      },
      {
        path: "/education-info/basic",
        lazy: () => import("./pages/BasicInfo").then(m => ({ Component: m.BasicInfo })),
      },
      {
        path: "/education-info/structure",
        lazy: () => import("./pages/Structure").then(m => ({ Component: m.Structure })),
      },
      {
        path: "/education-info/documents",
        lazy: () => import("./pages/Documents").then(m => ({ Component: m.Documents })),
      },
      {
        path: "/education-info/education",
        lazy: () => import("./pages/Education").then(m => ({ Component: m.Education })),
      },
      {
        path: "/education-info/standards",
        lazy: () => import("./pages/Standards").then(m => ({ Component: m.Standards })),
      },
      {
        path: "/education-info/staff",
        lazy: () => import("./pages/Staff").then(m => ({ Component: m.Staff })),
      },
      {
        path: "/education-info/materials",
        lazy: () => import("./pages/Materials").then(m => ({ Component: m.Materials })),
      },
      {
        path: "/education-info/paid-services",
        lazy: () => import("./pages/PaidServices").then(m => ({ Component: m.PaidServices })),
      },
      {
        path: "/education-info/finance",
        lazy: () => import("./pages/Finance").then(m => ({ Component: m.Finance })),
      },
      {
        path: "/education-info/vacancies",
        lazy: () => import("./pages/Vacancies").then(m => ({ Component: m.Vacancies })),
      },
      {
        path: "/education-info/scholarships",
        lazy: () => import("./pages/Scholarships").then(m => ({ Component: m.Scholarships })),
      },
      {
        path: "/education-info/catering",
        lazy: () => import("./pages/Catering").then(m => ({ Component: m.Catering })),
      },
      {
        path: "/education-info/international",
        lazy: () => import("./pages/International").then(m => ({ Component: m.International })),
      },
    ],
  },
]);
