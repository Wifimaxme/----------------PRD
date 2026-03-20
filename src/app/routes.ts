import { createHashRouter, replace } from "react-router";
import { Home } from "./pages/Home";
import { BasicInfo } from "./pages/BasicInfo";
import { Structure } from "./pages/Structure";
import { Documents } from "./pages/Documents";
import { Education } from "./pages/Education";
import { Standards } from "./pages/Standards";
import { Staff } from "./pages/Staff";
import { Materials } from "./pages/Materials";
import { PaidServices } from "./pages/PaidServices";
import { Finance } from "./pages/Finance";
import { Vacancies } from "./pages/Vacancies";
import { Scholarships } from "./pages/Scholarships";
import { Catering } from "./pages/Catering";
import { International } from "./pages/International";
import { Oferta } from "./pages/Oferta";

import { PrivacyPolicy } from "./pages/PrivacyPolicy";

export const router = createHashRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/oferta",
    Component: Oferta,
  },
  {
    path: "/privacy-policy",
    Component: PrivacyPolicy,
  },

  {
    path: "/education-info",
    loader: () => replace("/education-info/basic"),
  },
  {
    path: "/education-info/basic",
    Component: BasicInfo,
  },
  {
    path: "/education-info/structure",
    Component: Structure,
  },
  {
    path: "/education-info/documents",
    Component: Documents,
  },
  {
    path: "/education-info/education",
    Component: Education,
  },
  {
    path: "/education-info/standards",
    Component: Standards,
  },
  {
    path: "/education-info/staff",
    Component: Staff,
  },
  {
    path: "/education-info/materials",
    Component: Materials,
  },
  {
    path: "/education-info/paid-services",
    Component: PaidServices,
  },
  {
    path: "/education-info/finance",
    Component: Finance,
  },
  {
    path: "/education-info/vacancies",
    Component: Vacancies,
  },
  {
    path: "/education-info/scholarships",
    Component: Scholarships,
  },
  {
    path: "/education-info/catering",
    Component: Catering,
  },
  {
    path: "/education-info/international",
    Component: International,
  },
]);
