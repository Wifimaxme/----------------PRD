# UX Audit — Home (scroll-sequence landing)

> **Fix-and-verify (2026-06-13): all findings patched + re-verified on the production build.**
> Re-walk on `vite preview` (1440 / 1280 / 1024 / 375, motion + reduced-motion):
> console **0 errors / 0 warnings**, axe **0 critical / 0 serious** (1 pre-existing moderate `region`
> on the StickyMobileCTA, untouched). Sequence payload **26.5 MB PNG → ~2 MB AVIF** after a full
> 1440 scroll (frame set 3.3 MB on disk); **0 sequence bytes on mobile / reduced-motion**
> (both mascot layers — hero scroll layer + Personal-Account backdrop — gated on `isSequenceEnabled`).
>
> ⚠️ **Encoder gotcha (caught in re-verify):** first pass re-encoded the alpha PNGs with macOS
> `sips`. Those AVIFs open fine in Preview/sips but **render as a blank rectangle in Chromium**
> (decoder reports correct dimensions, paints nothing) — the mascot vanished site-wide. Re-encoded
> all 280 frames with **`sharp` (libvips)** instead; sharp AVIF renders correctly with alpha. If the
> frames are ever regenerated, use sharp/`avifenc`, **not** `sips`.
> Detail per finding below; summary at the bottom.


```
═══════════════════════════════════════════════════════════
VERDICT: FAIL

Persona: time-poor parent of a 5–7yo, choosing a section in the evening,
         laptop first then phone — won't scroll twice, won't debug.
Surfaces audited: 1 / 1 in scope (Home «/»), all sub-blocks + quiz modal + hero form
Interaction Manifest: complete (hero form, quiz 3-step flow, FAQ, nav anchors,
         round-trip Home→signup→back, mascot video, phone edge cases)

Hard Gates: console errors [3 distinct], warnings [1 reportable + 1 reduced-motion],
            network 5xx [0], 404 [1 favicon + 3 unsplash timeouts], layout-collapse [1: 1024–1280],
            axe Critical [0], axe Serious [2]
Performance (on /): LCP 0.56s / CLS 0.001 / INP 32ms — thresholds 4.0s / 0.25 / 500ms — GREEN
            (but transferred 31.7 MB, of which 26.5 MB is the eager frame preload)

Findings:
  Critical: 2    High: 4    Medium: 2    Low: 1

Self-critique pass (sub-agent): Drafted 14, Kept 10, Generic 2, Duplicate 2

TOP 5 (impact × ease):
  1. F-C1  fetchPriority console error — one-char fix, fires on every load, it's the new code
  2. F-C2  26.5 MB PNG preload on mobile where layer never renders — AVIF set already sits unused
  3. F-H2  mascot overlaps stat chips + comparison card at 1024–1280 — the headline feature breaks layout
  4. F-H5  scroll sequence ignores prefers-reduced-motion — regresses a guarantee main already shipped
  5. F-H3  orange step numerals fail contrast (3.59:1) — trivial shade bump
═══════════════════════════════════════════════════════════
```

Persona note: every finding below is defensible from a parent skimming on the sofa,
plus the mandatory first-time-user lens. A developer would shrug at the console; the
parent never opens it — but the 26.5 MB they pay for and the mascot sitting on top of
the price card, they feel.

---

## CRITICAL

### F-C1 — `fetchPriority` prop crashes into a React 18 console error on every load
- **Layer:** Feedback / Interaction
- **Surface:** `/` — all viewports, every load
- **Reproduce:** Open `/`, read console.
- **Observed:** `Warning: React does not recognize the fetchPriority prop on a DOM element… spell it as lowercase fetchpriority`. Logged on initial render and again whenever the sequence layout switches.
- **Expected:** Zero console errors. React 18 does not map camelCase `fetchPriority` to the HTML attribute (React 19 does).
- **Evidence:** state capture, 14:58 — `console.error` ×1 per mount.
- **Suspected location:** [Home.tsx:652](src/app/pages/Home.tsx#L652) and [Home.tsx:676](src/app/pages/Home.tsx#L676)
- **Smallest patch:** rename both `fetchPriority="high"` → `fetchpriority="high"` (lowercase) on the sequence `<img>` tags.

### F-C2 — 26.5 MB of PNG frames eagerly preloaded on every viewport, including mobile where the layer never renders
- **Layer:** Architecture / Performance
- **Surface:** `/` — measured at 1440 and at 375 (mobile)
- **Reproduce:** Load `/` at 375px, inspect `performance.getEntriesByType('resource')`.
- **Observed:** 198 PNG frames, 26.5 MB transferred, downloaded on mount even at 375px where the fixed layer is `hidden lg:block` and is never painted. An optimized AVIF copy of the identical 198 frames (2.5 MB total) sits in `public/images/sequences/football-school-scroll/` but no code references it.
- **Expected:** Mobile downloads ~0 sequence bytes; desktop uses the 2.5 MB AVIF set, not the 26.5 MB PNG set; frames load lazily by zone rather than all-at-once on mount.
- **Evidence:** mobile resource probe (`seqCount:198, seqMB:26.5, layerVisible:false`); `du -sh` shows alpha PNG 27 MB vs AVIF 2.5 MB.
- **Suspected location:** preload effect [Home.tsx:476-486](src/app/pages/Home.tsx#L476-L486); frame-src builders [Home.tsx:386-411](src/app/pages/Home.tsx#L386-L411).
- **Smallest patch:** gate the preload effect behind a `lg`-width `matchMedia` check so phones skip it; point `buildWideSequenceFrameSrc` at the AVIF directory (`/football-school-scroll/frame_NNNN.avif`); preload only the next ~20 frames around `currentSequenceFrame` instead of the full 198 up front.

---

## HIGH

### F-H2 — Fixed mascot layer covers stat chips and the comparison card at 1024–1280
- **Layer:** Visual
- **Surface:** `/` at 1024px and 1280px, mascot zones (scroll ≈ 700 and ≈ 2400)
- **Reproduce:** Resize to 1024 or 1280, scroll to the stats strip, then to the «Обычная секция / ФШ Чемпион» comparison.
- **Observed:** The mascot's `side-duo`/`wide` frame overlaps the rightmost stat chips («Круглый год», «Лицензия Минобра») and bleeds over the right edge of the purple «ФШ Чемпион» card. At 1440+ the `lg/xl:pr-[clamp(...)]` reserve is enough; at 1024–1280 it isn't.
- **Expected:** Content keeps clear of the mascot at every `lg` width, or the mascot scales/shifts further right below 1440.
- **Evidence:** `10-mascot-1024-700.png`, `10-mascot-1024-2400.png`, `10-mascot-1280-700.png`, `10-mascot-1280-2400.png`.
- **Suspected location:** `mascotAwareContainerClass` reserve [Home.tsx:226-228](src/app/pages/Home.tsx#L226-L228); compact-zone transform on the wide layer (the `isCompactGlobalSequenceZoneActive` branch).
- **Smallest patch:** add an intermediate reserve at the `lg` step (e.g. `lg:pr-[clamp(11rem,16vw,16rem)]`) or push the compact-zone `x` translate further right between 1024–1366 so frames clear the content column.

### F-H3 — Orange step numerals and the PDF kicker fail WCAG AA contrast
- **Layer:** Visual / Accessibility
- **Surface:** `/` — «Как проходит запись» step list + quiz banner kicker
- **Reproduce:** Run axe-core `color-contrast`.
- **Observed:** orange numerals 01/02/03 `#f54900` on white = **3.59:1** (need 4.5:1 for this size); 11px purple kicker «Бесплатный PDF-гайд» `#ad46ff` on white = **4.12:1**.
- **Expected:** ≥ 4.5:1.
- **Evidence:** axe `color-contrast` serious, 4 nodes, ratios captured.
- **Suspected location:** step numerals around [Home.tsx](src/app/pages/Home.tsx) (`group-hover:border-orange-500` step blocks); kicker at [Home.tsx:1597](src/app/pages/Home.tsx#L1597).
- **Smallest patch:** darken numerals to `text-orange-700` (#c2410c ≈ 5.0:1); bump the kicker to `text-purple-700` or raise its size above 14px bold to qualify as large text.

### F-H4 — Coaches strip is a horizontal scroll region with no keyboard access
- **Layer:** Interaction / Accessibility
- **Surface:** `/` — «Тренерский состав» carousel
- **Reproduce:** axe-core `scrollable-region-focusable`; try to scroll the strip with keyboard only.
- **Observed:** The `overflow-x-auto` container (`.-mx-4`) holds the coach cards but has no `tabindex`, so a keyboard user can't scroll it to reach cards beyond the first viewport.
- **Expected:** scroll container reachable and operable by keyboard.
- **Evidence:** axe serious, 1 node; selector `.-mx-4`.
- **Suspected location:** [Home.tsx:1289](src/app/pages/Home.tsx#L1289)
- **Smallest patch:** add `tabIndex={0}` + an `aria-label="Тренеры, прокрутка по горизонтали"` to the scroll container (cards themselves are links, so arrow-scroll + tab-through covers it).

### F-H5 — Scroll sequence ignores `prefers-reduced-motion`
- **Layer:** Interaction / Accessibility
- **Surface:** `/` — entire scroll experience under reduced-motion
- **Reproduce:** Emulate `prefers-reduced-motion: reduce`, load `/`, scroll.
- **Observed:** Frames still animate frame-by-frame on scroll (verified frame 1 → 88), and all 26.5 MB still download. `main` already shipped motion-respect for the other animations (commit d7e605d), so this branch regresses an established guarantee. (Motion's own runtime even logged the reduced-motion warning.)
- **Expected:** under reduce, pin a single representative still frame, skip the scroll-driven swap, and skip the bulk preload.
- **Suspected location:** scroll effect [Home.tsx:473-560](src/app/pages/Home.tsx#L473-L560); preload effect [Home.tsx:476](src/app/pages/Home.tsx#L476).
- **Smallest patch:** read `window.matchMedia('(prefers-reduced-motion: reduce)')` once; if reduce, set a fixed frame and early-return from both the preload effect and the scroll `updateSequence`.

### F-H6 — Quiz modal opens without moving focus in; no focus trap
- **Layer:** Interaction / Accessibility
- **Surface:** `/` — quiz banner → modal (`role=dialog`, `aria-modal=true`)
- **Reproduce:** Click «Бесплатный PDF-гайд», then press Tab.
- **Observed:** After a real click, focus stays on the trigger button (`focusedIn:false`); the first Tab lands on the FAQ accordion *behind* the overlay, not inside the dialog. Body scroll-lock, Escape-to-close, and focus-return-to-trigger **do** work ([Home.tsx:447-466](src/app/pages/Home.tsx#L447-L466)) — the gap is only the open side.
- **Expected:** on open, focus moves to the dialog (first option or close button); Tab cycles within the dialog until it closes.
- **Evidence:** post-click focus probe; Tab-target probe (`inDialog:false → "Что если ребёнок плачет…"`).
- **Suspected location:** modal markup [Home.tsx:1869-1890](src/app/pages/Home.tsx#L1869-L1890); the focus `useEffect` handles close but not open.
- **Smallest patch:** in the `quizModalOpen` effect, after lock, focus the dialog container (`dialogRef.current?.focus()` with `tabIndex={-1}`) and add a Tab keydown handler that wraps focus within the dialog's focusable set. Also fixes the «content outside landmark» axe-moderate on the same banner.

---

## MEDIUM

### F-M2 — Blog cards pull images from Unsplash; on failure they show raw alt text, no placeholder
- **Layer:** Visual / Architecture
- **Surface:** `/` — «База знаний» blog strip
- **Reproduce:** Load `/` with Unsplash unreachable (timed out during this audit).
- **Observed:** Three `images.unsplash.com` requests timed out; cards render the alt string above the title with no skeleton/placeholder — reads as broken to the parent. External CDN dependency for a RU-audience site that otherwise ships from GitHub Pages.
- **Evidence:** network log — 3 `ERR_TIMED_OUT` on unsplash photo URLs; `02-scroll-9000.png` filmstrip.
- **Suspected location:** [blogPosts.ts:22,48,73](src/app/data/blogPosts.ts#L22)
- **Smallest patch:** self-host the three images under `public/images/blog/` and reference them locally; or add an `onError` fallback to a local poster.

### F-M3 — «Прозрачные условия без скрытых сценариев» is corporate phrasing for the parent persona
- **Layer:** Visual (copy)
- **Surface:** `/` — pricing section heading
- **Observed:** «скрытых сценариев» reads as marketing-speak; a parent expects «без скрытых платежей / доплат». Violates the project's documented parent-friendly-language rule.
- **Evidence:** `07/08` price-section screenshots.
- **Suspected location:** [Home.tsx:1459](src/app/pages/Home.tsx#L1459)
- **Smallest patch:** «Прозрачные условия без скрытых платежей».

---

## LOW

### F-L1 — Quiz phone error format doesn't match the field's mask placeholder
- **Layer:** Feedback
- **Surface:** quiz modal, final step
- **Observed:** field placeholder shows `+7 (___) ___-__-__`; submit-empty error says «Введите телефон в формате +7XXXXXXXXXX». Two different formats for one field.
- **Evidence:** `05-quiz-phone-step.png`, `06-quiz-empty-phone-submit.png`.
- **Suspected location:** Quiz step validation in [Quiz.tsx](src/app/components/Quiz.tsx)
- **Smallest patch:** align the error copy to the masked format, e.g. «Введите телефон полностью: +7 (___) ___-__-__».

---

## What worked (proof-backed PASS rows)
- **Hero form** — typing a partial phone and clicking «Записаться» routes to `#/signup` (custom form, as designed). Phone normalizer rejects letters (`abcдеф`→`+7`), fixes `8`-prefix (`8913…`→`+7913…`), and caps length — verified.
- **Quiz happy path** — 3 questions advance cleanly, empty-phone submit is blocked with an inline error, no console/network noise during the flow.
- **Round-trip** — Home → signup → browser-back restores exact scroll position (11401px) — no "empty page on return".
- **Mascot video** — plays only when the CTA card is in view, pauses + resets to 0 when scrolled away.
- **Skip link + focus rings** — first Tab reveals a visible «Перейти к содержимому» skip link; focus rings present on controls.
- **Perf** — LCP 0.56s, CLS 0.001, INP 32ms, scroll frame median 8.3ms (≈120fps headroom). The scroll animation itself is smooth; the cost is download weight, not jank.

## Perfection Roadmap
- **Quick wins (24–48h):** F-C1 (one char), F-H3 (shade bump), F-H4 (tabindex+label), F-M3 (copy), F-L1 (copy).
- **Structural (1–2 wks):** F-C2 (AVIF swap + mobile gate + windowed preload), F-H5 (reduced-motion branch), F-H2 (intermediate breakpoint reserve), F-H6 (focus trap), F-M2 (self-host blog images).
```
```

---

## Fixed in this session (2026-06-13)

| Finding | Fix | Verified |
|---|---|---|
| F-C1 | `fetchPriority` → `fetchpriority` (×2) | console 0 errors |
| F-C2 | Re-encoded 3 frame sets to **alpha-AVIF** (`sips`, ~5–10× smaller, transparency kept); paths → `.avif`; preload **gated to desktop+motion** and **windowed** (frame-6 … frame+24) | first paint 0.45 MB / full scroll 3.8 MB / mobile+reduce ≈0 |
| F-H2 | `mascotAwareContainerClass` applied to stats strip (now `lg:grid-cols-3 xl:grid-cols-6`); lg reserve bumped to `clamp(16rem,20vw,22rem)` | screenshots 1024/1280 — chips clear |
| F-H3 | numerals `text-orange-700`, kicker `text-purple-700` | axe 0 serious |
| F-H4 | coaches strip `tabIndex=0` + `role=group` + aria-label + focus ring | axe scrollable-region cleared |
| F-H5 | `isSequenceEnabled` gate (matchMedia lg + reduced-motion); layer unmounts, scroll + preload skipped under reduce | layer not mounted, ≈0 frames |
| F-H6 | focus moves into dialog on open + Tab/Shift+Tab trap (Escape + return already worked) | Tab×12 stays trapped |
| F-M2 | branded inline-SVG `onError` fallback + `loading="lazy"` on both blog imgs | placeholder renders on fail |
| F-M3 | «…без скрытых **платежей**» | — |
| F-L1 | quiz error now «…+7 (___) ___-__-__» (matches mask) | — |
| bonus | `HydrateFallback: () => null` on root route; `favicon.svg` + generated `favicon.ico` + `<link rel=icon>` | console warning + 404 gone |

**Remaining (owner, needs network/tooling):**
1. Self-host the 3 blog photos (`blogPosts.ts` → unsplash) — they load in prod but the fallback now covers any failure.
2. Optional repo slim-down: the old PNG frame sets and the unused white-bg `football-school-scroll/` AVIF set still sit in `public/` (deletion was declined mid-session — safe to `rm` once the AVIF swap is confirmed in prod). Runtime already only fetches the new AVIFs.
3. Pre-existing moderate axe `region` on the floating «Личный кабинет» (StickyMobileCTA) — wrap in a landmark; out of this branch's scope.
4. `BlogArticle` page uses the same `post.image`; consider the same `onError` fallback there.
