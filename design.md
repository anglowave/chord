# pumpclips design spec

**Audience:** coding agents and humans shipping UI in this repo.
**Source of truth:** this file describes the UI *as it exists today*.
Match it. Do not invent a parallel visual language.

If a new screen, component, or style token is needed, extend the recipes
below. Do not introduce a second palette, type stack, radius scale, or
button language.

Read `node_modules/next/dist/docs/` before writing Next.js code. This
app is Next.js 16 with breaking APIs relative to older training data.

---

## 1. How to use this file

1. Identify the surface you are changing (landing section, legal,
   chrome, new page).
2. Copy the closest recipe in §8–§11. Do not restyle from scratch.
3. Use semantic Tailwind tokens (`bg-background`, `text-accent`), not
   raw hex, except where this spec documents a required hardcoded value
   (clip glow, button glow shadows).
4. Keep the page dark. The root `<html>` is forced `dark`. There is no
   light theme in production.
5. After UI work, verify `/`, `/terms`, `/privacy`, and any new route
   that shares Header/Footer or the tokens you touched.

### Non-negotiables

- Dark near-black canvas, zinc copy, **mint accent only**.
- Accent is the only loud color. Do not add purple, blue, gold, or
  rainbow brand colors.
- Headings use Be Vietnam Pro. Body uses Poppins. Tickers/eyebrows/stats
  use Inconsolata.
- Primary CTAs glow mint on hover. Secondary actions stay matte.
- Content width is `max-w-6xl` (marketing) or `max-w-3xl` (legal).
- Horizontal page padding is `px-6`.

---

## 2. Product and voice

**Product:** pumpclips is the site for `$CLIPS`, a Solana memecoin tied
to clip culture and pump.fun bounties. It is **not** a SaaS, dashboard,
or creator platform. Do not design signup funnels, app shells, or
onboarding wizards unless explicitly asked.

**Tagline:** Onboard the normies.

**Voice:** short, confident, crypto-native. Sentences are punchy. Use
`$CLIPS`, `clip meta`, `normies`, `ape`, `degens` as they appear in
existing copy. Avoid corporate phrases (leverage, solution, ecosystem
platform).

**Logo lockup:** `pump` in foreground + `clips` in accent.

```tsx
<span className="font-heading font-bold tracking-tight">
	pump<span className="text-accent">clips</span>
</span>
```

Wordmark is always lowercase. Token ticker is always `$CLIPS`.

---

## 3. Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.2 App Router, `src/app` |
| UI | React 19, TypeScript strict |
| Styling | Tailwind CSS v4 via `@import "tailwindcss"` in `src/app/globals.css` |
| Tokens | CSS variables on `:root`, mapped in `@theme inline` |
| Components | No `src/components/ui` primitives yet. shadcn is configured (`radix-nova`, RSC, lucide) but unused. Prefer existing landing patterns over installing a new kit unless asked. |
| Icons | `lucide-react` for UI icons. Custom SVGs for X / TikTok / Instagram. |
| Fonts | `next/font/google` in `src/app/layout.tsx` |
| Class merging | `cn()` in `src/lib/utils.ts` (`clsx` + `tailwind-merge`) |
| Glow cards | `src/components/BorderGlow.tsx` (client) |

Path alias: `@/*` → `./src/*`.

When adding shadcn components later, put them in `src/components/ui` and
theme them to **this** spec (pills, mint, dark surfaces). Do not ship
default shadcn zinc/neutral look.

---

## 4. Code conventions (UI files)

Match `src/components/landing/*`:

- Tabs for indentation
- Single quotes
- No semicolons unless required
- Named `function` components, not `const Component = ()`
- `'use client'` only for browser APIs, state, or effects
- Event handlers prefixed `handle` when you add them
- Files and folders kebab-case: `clip-scroller.tsx`, `legal-layout.tsx`
- Components PascalCase

`src/lib/utils.ts` currently uses double quotes; do not rewrite it as
part of unrelated UI work. `BorderGlow.tsx` uses semicolons and a
different style; leave it unless you are changing glow behavior.

---

## 5. Color

Canonical values live in `src/app/globals.css` `:root`. Tailwind maps
them in `@theme inline` so utilities like `bg-background` work.

### 5.1 Surfaces

| Token | Value | Tailwind | Use |
| --- | --- | --- | --- |
| `--background` | `#0a0a0a` | `bg-background` | Page canvas |
| `--card` | `#111111` | `bg-card` | Cards, clip glow fill, popovers |
| `--secondary` / `--muted` | `#161616` | `bg-secondary` `bg-muted` | Raised chips, header button-adjacent surfaces |
| `--popover` | `#111111` | `bg-popover` | Floating surfaces (unused on landing) |
| `--sidebar` | `#111111` | `bg-sidebar` | Reserved; no sidebar in current IA |

Common translucent surfaces:

- Header bar: `bg-background/80 backdrop-blur-xl`
- Section tint: `bg-card/10`
- Feature row card: `bg-card/30` → hover `bg-card/50`
- Thesis card: `bg-card/40` → hover `bg-card/60`
- Secondary CTA: `bg-card/50` → hover `bg-card`

### 5.2 Text

| Token | Value | Tailwind | Use |
| --- | --- | --- | --- |
| `--foreground` | `#d4d4d8` | `text-foreground` | Body on dark, legal headings |
| `--muted-foreground` | `#71717a` | `text-muted-foreground` | Supporting copy, nav, captions |
| `--accent` | `#86efac` | `text-accent` | Wordmark `clips`, eyebrows, stats, hover on external links |
| `--accent-foreground` | `#0a0a0a` | `text-accent-foreground` | Text on mint buttons |
| `--primary` | `#86efac` | `text-primary` | Same as accent; prefer `accent` in this product |
| `--card-foreground` | `#d4d4d8` | `text-card-foreground` | Same as foreground |

Clip overlay (inside video, not tokenized): title `text-white`, meta
`text-zinc-400`. Do not use zinc utilities on the rest of the site;
use `muted-foreground`.

### 5.3 Accent scale (charts + glow mesh)

| Token | Value | Role |
| --- | --- | --- |
| `--accent` / `--primary` / `--chart-1` / `--ring` | `#86efac` | Brand mint |
| `--chart-2` | `#4ade80` | Glow mesh mid |
| `--chart-3` | `#22c55e` | Chart only |
| `--chart-4` | `#16a34a` | Chart only |
| `--chart-5` | `#15803d` | Chart only |

Clip-card mesh colors (hardcoded in `clip-scroller.tsx`):

```ts
const GLOW_COLORS = ['#86EFAC', '#4ade80', '#bbf7d0']
const CARD_BG = '#111111' // must match --card
```

BorderGlow `glowColor` is **HSL channels without `hsl()`**:
`'142 77 73'` (mint).

### 5.4 Lines and focus

| Token | Value | Tailwind | Use |
| --- | --- | --- | --- |
| `--border` | `rgba(255, 255, 255, 0.06)` | `border-border` | Cards, dividers |
| `--input` | `rgba(255, 255, 255, 0.06)` | `border-input` | Form chrome if added |
| `--ring` | `#86efac` | `ring-ring` `outline-ring` | Focus. Base layer applies `outline-ring/50` globally. |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `text-destructive` | Errors only. Not used on the landing. |

Hairline usage:

- Chrome edges: `border-border/60` on header, footer, and section tops
- Card rest: `border-border`
- Card hover (thesis): `hover:border-accent/20`
- Card hover (pillars): `hover:border-accent/15`
- Secondary CTA hover: `hover:border-accent/30`
- Vertical stat ticks: `h-4 w-px bg-border`

### 5.5 Icon wells

Mint wells sit on cards:

- Compact: `bg-accent/10` + icon `text-accent` at `size-4` in a
  `size-10 rounded-lg` box
- Featured: same fill plus `ring-1 ring-accent/20`, `size-12 rounded-xl`,
  icon `size-5`. Hover fill `group-hover:bg-accent/15`

### 5.6 Atmosphere

Hero has a single mint bloom behind the headline. Do not stack extra
blobs.

```
pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px]
-translate-x-1/2 rounded-full bg-accent/[0.03] blur-[120px]
```

---

## 6. Typography

Loaded in `src/app/layout.tsx` with `next/font/google`. CSS variables
are applied on `<html>`. Tailwind `font-sans` / `font-heading` /
`font-mono` map to those variables in `@theme inline`.

```tsx
import { Be_Vietnam_Pro, Poppins, Inconsolata } from 'next/font/google'

const beVietnamPro = Be_Vietnam_Pro({
	variable: '--font-heading',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '800'],
})

const poppins = Poppins({
	variable: '--font-sans',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600'],
})

const inconsolata = Inconsolata({
	variable: '--font-mono',
	subsets: ['latin'],
})
```

Root classes:

```
html: `${beVietnamPro.variable} ${poppins.variable} ${inconsolata.variable} dark h-full antialiased`
body: min-h-full flex flex-col font-sans
```

Base CSS:

- `html` → `font-sans scroll-smooth` (in-page `#thesis` / `#why-clips`)
- `h1–h6` → `font-family: var(--font-heading), sans-serif`
- Still add `font-heading` on headings in JSX so size/weight recipes
  stay explicit.

Do not switch to Geist, Inter, Syne, or other families. Do not load
extra weights unless a recipe needs them. Poppins stops at 600; do not
use `font-bold` on body text (that is 700).

### 6.1 Type roles

| Role | Font | Typical classes |
| --- | --- | --- |
| Display / page title | Be Vietnam Pro | `font-heading ... tracking-tight` |
| UI / body | Poppins | default `font-sans` |
| Eyebrow, ticker, step index, legal date | Inconsolata | `font-mono` |

### 6.2 Scale (copy these class strings)

**Display h1** (hero only):

```
font-heading text-4xl font-extrabold leading-[1.1] tracking-tight
sm:text-5xl md:text-6xl lg:text-7xl
```

Accent line inside the display title: wrap in
`<span className="text-accent">`.

**Section h2** (thesis, why $CLIPS, legal h1):

```
font-heading text-3xl font-bold tracking-tight sm:text-4xl
```

**Card h3** (thesis steps):

```
font-heading text-xl font-semibold
```

**Row h3** (why-$CLIPS pillars):

```
font-heading font-semibold
```

**Legal h2**:

```
font-heading text-lg font-semibold text-foreground
```

**Wordmark**:

- Header: `font-heading text-lg font-bold tracking-tight`
- Footer: `font-heading text-sm font-bold`

**Lead** (hero supporting):

```
text-lg leading-relaxed text-muted-foreground md:text-xl
```

Max width `max-w-xl`, centered in the hero.

**Body** (section supporting):

```
text-muted-foreground
```

Optional `max-w-md` when paired beside a column of cards.

**Small** (card descriptions):

```
text-sm leading-relaxed text-muted-foreground
```

**Eyebrow** (section kicker):

```
font-mono text-xs uppercase tracking-widest text-accent
```

Always above the h2, with `mt-3` on the heading.

**Stat value + label** (hero strip):

```
value: font-mono text-lg font-semibold text-accent
label: text-sm text-muted-foreground  (wrapper)
```

**Caption / legal timestamp**:

```
font-mono text-xs text-muted-foreground
```

**Footer tagline**:

```
text-center text-xs text-muted-foreground
```

**Nav / footer links**:

```
text-sm text-muted-foreground   /* header nav */
text-xs text-muted-foreground   /* footer cluster */
```

---

## 7. Layout

### 7.1 Page shell

Every full page uses:

```tsx
<div className="flex flex-1 flex-col">
	<Header />
	<main className="flex-1">{/* sections */}</main>
	<Footer />
</div>
```

Body is already `min-h-full flex flex-col`, so `flex-1` on this wrapper
and on `main` pins the footer down.

### 7.2 Containers

| Surface | Width | Padding |
| --- | --- | --- |
| Header, footer, landing sections | `mx-auto max-w-6xl px-6` | 24px |
| Hero copy column | inner `max-w-3xl text-center` | — |
| Thesis intro | inner `max-w-2xl text-center` | — |
| Why-$CLIPS supporting paragraph | `max-w-md` | — |
| Legal article | `mx-auto max-w-3xl px-6 py-16 md:py-24` | |

Do not use `max-w-7xl` or full-bleed text. Clip marquee is full width
inside the 6xl container but visually bleeds via negative space on the
cards (`p-9` on each slide) and edge fades.

### 7.3 Section spacing

| Section | Classes |
| --- | --- |
| Hero | `relative overflow-hidden pt-16 pb-8 md:pt-24 md:pb-12` |
| Thesis / Why $CLIPS | `py-24 md:py-32` plus `border-t border-border/60` |
| Why $CLIPS extra | `bg-card/10` |
| Footer | `border-t border-border/60 py-12` |

Anchor ids: `#thesis` on HowItWorks, `#why-clips` on Features.

### 7.4 Breakpoints in use

- `sm`: 640px — hero CTAs go in a row; stat ticks appear; clip card
  width 392px
- `md`: 768px — header nav appears; thesis becomes 3 columns; type
  steps up; section padding steps up
- `lg`: 1024px — why-$CLIPS becomes 2 columns; display type 7xl
- Header nav is `hidden md:flex`. Do not hide the Buy CTA or logo on
  mobile.

### 7.5 Header

```
sticky top-0 z-50
border-b border-border/60
bg-background/80 backdrop-blur-xl
height: h-16
```

Left: logo 36×36 (`size-9`) + wordmark, `gap-2.5`. Hover scales the
mark `group-hover:scale-105`.

Center nav (md+): `gap-8 text-sm text-muted-foreground`, hover
`text-foreground`. Links are in-page hashes, not Next `Link`.

Right: social icons `size-4` with `gap-3`, then compact Buy button.

### 7.6 Footer

Single row on `sm+`, stacked and centered on mobile (`flex-col ...
sm:flex-row`, `gap-6`).

Left: logo 28×28 (`size-7`) + small wordmark (not a link today; keep
that unless you are asked to link it).

Center: tagline.

Right: `SocialLinks` (default `size-3.5`, `gap-4`) then Terms, Privacy,
pump.fun at `text-xs`, cluster `gap-6`.

- Internal: `hover:text-foreground`
- pump.fun (external): `hover:text-accent`,
  `target="_blank" rel="noopener noreferrer"`

---

## 8. Component recipes

There are no shared Button/Card primitives. **Reuse these class
strings.** If you add a primitive, these are the variants it must
implement.

### 8.1 Buttons

All CTAs are `<a>` today (Buy href is `#` until a real link exists).
Use `inline-flex items-center justify-center` (or `items-center` on
the compact header button).

**Primary compact** (header):

```
inline-flex h-9 items-center rounded-lg bg-accent px-4
text-sm font-medium text-accent-foreground
transition-all hover:bg-accent/90
hover:shadow-[0_0_24px_rgba(134,239,172,0.25)]
```

Radius is **`rounded-lg`**, not pill.

**Primary section** (why $CLIPS):

```
inline-flex h-11 items-center rounded-full bg-accent px-6
text-sm font-semibold text-accent-foreground
transition-all hover:bg-accent/90
hover:shadow-[0_0_24px_rgba(134,239,172,0.25)]
```

**Primary hero**:

```
group inline-flex h-12 w-full items-center justify-center gap-2
rounded-full bg-accent px-8 text-base font-semibold
text-accent-foreground transition-all hover:bg-accent/90
hover:shadow-[0_0_32px_rgba(134,239,172,0.3)] sm:w-auto
```

Trailing icon: `lucide-react` `ArrowRight` at `size-4` with
`transition-transform group-hover:translate-x-0.5`.

**Secondary hero**:

```
inline-flex h-12 w-full items-center justify-center
rounded-full border border-border bg-card/50 px-8
text-base font-medium text-foreground backdrop-blur-sm
transition-colors hover:border-accent/30 hover:bg-card sm:w-auto
```

No glow on secondary.

Rules:

- Hero pair: `flex flex-col ... gap-4 sm:flex-row`, both `w-full sm:w-auto`
- Never use default browser buttons. Never use gray filled buttons.
- Destructive / outline-as-default shadcn styles are out of spec.

### 8.2 Cards

**Thesis step** (`how-it-works.tsx`):

```
group relative rounded-2xl border border-border bg-card/40 p-8
transition-colors hover:border-accent/20 hover:bg-card/60
```

Header row `mb-6 flex items-center justify-between`:

- Icon well `size-12 rounded-xl bg-accent/10 ring-1 ring-accent/20`
  `group-hover:bg-accent/15`, icon `size-5 text-accent`
- Step index `font-mono text-3xl font-bold text-border`
  `group-hover:text-accent/30`

Then h3 + `mt-3` small copy.

Grid: `mt-16 grid gap-8 md:grid-cols-3`.

**Pillar row** (`features.tsx`):

```
flex gap-4 rounded-xl border border-border bg-card/30 p-5
transition-colors hover:border-accent/15 hover:bg-card/50
```

Icon well `size-10 rounded-lg bg-accent/10`, icon `size-4 text-accent`.
Stack with `space-y-4`.

Do not add drop shadows to these cards. Depth is border + fill opacity
+ hover. Glow belongs on clip cards and primary buttons only.

### 8.3 Eyebrow + heading + body block

Centered (thesis):

```
eyebrow
h2.mt-3
p.mt-4 text-muted-foreground
```

Left-aligned (why $CLIPS): wrap in a column; CTA `mt-8`.

### 8.4 Logo

Asset: `/logo.png` (also favicon via metadata `icons.icon` and
`apple`).

| Place | Image | Type |
| --- | --- | --- |
| Header | `width={36} height={36}` `size-9 object-contain` `priority` | `text-lg` |
| Footer | `width={28} height={28}` `size-7 object-contain` | `text-sm` |

Alt text: `pumpclips logo`.

### 8.5 Social links

Use `SocialLinks` from `src/components/landing/social-links.tsx`.
Do not inline the three `<a>` tags again.

```
default icon: size-3.5
header icon:  size-4  and className="gap-3"
color: text-muted-foreground hover:text-accent
external: target="_blank" rel="noopener noreferrer"
aria-label: "Follow pumpclips on X|TikTok|Instagram"
```

URLs (do not invent new handles):

- X: `https://x.com/pumpclipsx`
- TikTok: `https://www.tiktok.com/@pumpclipstt`
- Instagram: `https://www.instagram.com/pumpclipsig`

Icons are 24×24 viewBox, `fill="currentColor"`, `aria-hidden`.

### 8.6 Text links

| Context | Rest | Hover |
| --- | --- | --- |
| Header nav, footer legal | `text-muted-foreground` | `hover:text-foreground` |
| Legal back link, social icons | `text-muted-foreground` | `hover:text-accent` |
| Footer pump.fun | `text-muted-foreground` | `hover:text-accent` |

Always `transition-colors`. Internal app routes use `next/link`.
Hashes may be plain `<a href="#...">`.

### 8.7 Clip marquee

`ClipScroller` is client-side because of `BorderGlow` and hover-pause.

- Track: `flex animate-marquee items-center gap-2`
- Pause: `hover:[animation-play-state:paused]`
- Duplicate the clips array so the 40s loop is seamless
- Edge fades: `w-24 sm:w-32` gradients `from-background to-transparent`
- Slide outer: `w-[352px] sm:w-[392px] shrink-0 p-9` (padding is the
  glow bleed)
- Media: `aspect-[9/16]`, `rounded-[15px]` (1px inside 16px glow
  radius), `bg-black`, video `object-cover` `autoPlay loop muted
  playsInline preload="auto"`
- Caption: bottom gradient `from-black/90 via-black/50 to-transparent
  p-4 pt-12`
- Stagger glow sweep: `animationDelay={(i % CLIPS.length) * 600}`

BorderGlow props to keep:

```
backgroundColor="#111111"
borderRadius={16}
glowColor="142 77 73"
glowRadius={36}
glowIntensity={1.25}
edgeSensitivity={18}
colors={['#86EFAC', '#4ade80', '#bbf7d0']}
fillOpacity={0.45}
animated
```

Do not reuse BorderGlow with the file’s purple/pink/sky defaults.

### 8.8 Forms (not on production pages)

If you add inputs, start from existing tokens:

- Height near `h-10` / `h-11`, `rounded-lg`
- `border-input bg-card/50 text-sm`
- Placeholder `text-muted-foreground`
- Focus `focus-visible:border-ring` and a mint ring
- Labels `text-sm font-medium text-foreground`

Do not introduce Material or default browser inputs.

---

## 9. Motion

Defined in `src/app/globals.css`. Prefer these classes over new
keyframes.

| Class | Behavior |
| --- | --- |
| `animate-fade-up` | 0.8s ease-out, 24px up, `both` fill |
| `animate-fade-up-delay-1` | same, 0.1s delay |
| `animate-fade-up-delay-2` | 0.2s delay |
| `animate-fade-up-delay-3` | 0.35s delay (defined, unused on home) |
| `animate-marquee` | 40s linear infinite, translateX 0 → -50% |

Hero choreography:

1. h1 `animate-fade-up`
2. lead `animate-fade-up-delay-1`
3. CTAs + stats `animate-fade-up-delay-2`

`pulse-glow` keyframes exist but are unused. Do not attach them to
buttons; buttons already have hover box-shadow.

Transitions:

- Colors: `transition-colors`
- Buttons (primary): `transition-all` (color + glow)
- Logo mark: `transition-transform`
- Arrow: `transition-transform`

Keep motion small. No page-wide parallax, no bounce, no layout jump.

`html` has `scroll-smooth` for in-page anchors.

---

## 10. Radius scale

`--radius: 0.625rem` (10px). Tailwind:

| Utility | Formula | Used for |
| --- | --- | --- |
| `rounded-sm` | 0.6 × radius | unused on landing |
| `rounded-md` | 0.8 × radius | unused on landing |
| `rounded-lg` | 10px | Header Buy, compact icon well |
| `rounded-xl` | 1.4 × radius | Pillar cards, featured icon well |
| `rounded-2xl` | 1.8 × radius | Thesis cards |
| `rounded-full` | pill | Hero CTAs, section Buy, hero bloom |

Clip glow: **16px** JS radius, inner media **15px**.

---

## 11. Pages

### 11.1 Home `/` — `src/app/page.tsx`

Order: Header → Hero (scroller inside) → HowItWorks → Features → Footer.

Do not insert a second hero, logo wall, or newsletter block without an
explicit request.

### 11.2 Legal `/terms` and `/privacy`

Use `LegalLayout` + `LegalSection`. Do not fork a third layout.

- Back link: `text-sm text-muted-foreground hover:text-accent`,
  copy `← Back to home`
- Title: section h2 scale (`text-3xl sm:text-4xl`), `mt-6`
- Date: `mt-2 font-mono text-xs text-muted-foreground`,
  prefix `Last updated: `
- Body wrap: `mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground`
  (class `prose-legal` is a marker only; there is no plugin)
- Sections: h2 `text-lg font-semibold text-foreground`, body
  `mt-3 space-y-3`
- Lists: `list-disc space-y-2 pl-5`
- Inline strong: `className="text-foreground"` so labels pop on muted
  body text
- Metadata title: `{Page} | pumpclips`

### 11.3 Metadata (root)

```
title: pumpclips | $CLIPS | Onboard the normies
description: $CLIPS is the memecoin for the clip meta. Viral edits bring
normies to pump.fun, one scroll at a time.
```

---

## 12. Assets

| Path | Use |
| --- | --- |
| `/public/logo.png` | Favicon, header, footer |
| `/public/clips/*.mp4` | Hero marquee only |

Clips are illustrative. The site does not accept uploads. Keep videos
muted autoplay.

---

## 13. Accessibility

- Header Buy and hero Buy must remain real links (or buttons) with
  visible labels. Do not icon-only the primary CTA.
- Social icons require `aria-label` as in `SocialLinks`.
- Decorative SVGs `aria-hidden="true"`.
- Logo image has alt `pumpclips logo`.
- Contrast: muted `#71717a` on `#0a0a0a` is for supporting text only.
  Do not use it for primary actions or long legal headings (legal h2
  is `text-foreground`).
- Marquee pauses on hover; do not remove that.
- Focus: global `outline-ring/50`. Do not set `outline-none` without a
  visible replacement.
- `scroll-smooth` is on; keep in-page ids stable (`thesis`, `why-clips`).

---

## 14. File map

```
src/app/globals.css              tokens, base, motion
src/app/layout.tsx               fonts, dark, metadata
src/app/page.tsx                 home composition
src/app/terms/page.tsx
src/app/privacy/page.tsx
src/components/BorderGlow.tsx    clip-card glow (client)
src/components/landing/header.tsx
src/components/landing/footer.tsx
src/components/landing/hero.tsx
src/components/landing/clip-scroller.tsx
src/components/landing/how-it-works.tsx
src/components/landing/features.tsx
src/components/landing/legal-layout.tsx
src/components/landing/social-links.tsx
src/components/landing/x-icon.tsx
src/components/landing/tiktok-icon.tsx
src/components/landing/instagram-icon.tsx
src/lib/utils.ts                 cn()
components.json                  shadcn config (radix-nova)
```

New marketing sections go in `src/components/landing/`. New primitives,
if added, go in `src/components/ui/`.

---

## 15. Agent checklist for new UI

Before merging visual work:

- [ ] Uses `background` / `card` / `accent` / `muted-foreground` tokens
- [ ] Headings: `font-heading` + tracking-tight + the scale in §6.2
- [ ] Eyebrows: mono xs uppercase tracking-widest accent
- [ ] Primary CTA: mint fill, dark text, mint glow on hover
- [ ] Secondary CTA: border + `bg-card/50`, no glow
- [ ] Container `max-w-6xl px-6` (or `max-w-3xl` on legal)
- [ ] Section padding `py-24 md:py-32` with `border-t border-border/60`
- [ ] No new fonts, no light-mode page, no extra brand hues
- [ ] Header/Footer unchanged unless the task is chrome
- [ ] `cn()` for conditional classes
- [ ] Tabs + single quotes + function components in landing files
- [ ] `/`, legal routes, and the new route still look like one product

### Do not

- Swap Be Vietnam Pro / Poppins / Inconsolata
- Use `font-bold` on Poppins body (weight 700 is not loaded)
- Hardcode `#86efac` in Tailwind class strings; use `accent` / `primary`
  (hardcode only in BorderGlow mesh and button `box-shadow` RGBA)
- Add a light theme toggle
- Add shadows other than the documented mint glows
- Build a dashboard chrome (sidebar, command palette) for this site
- Change social URLs or the pumpclips wordmark casing
- Remove `dark` from `<html>`

---

## 16. Token dump (keep in sync with globals.css)

Copy-paste reference. If `globals.css` and this table disagree,
**`globals.css` wins** — then update this file in the same PR.

```
--background: #0a0a0a
--foreground: #d4d4d8
--card: #111111
--card-foreground: #d4d4d8
--popover: #111111
--popover-foreground: #d4d4d8
--primary: #86efac
--primary-foreground: #0a0a0a
--secondary: #161616
--secondary-foreground: #d4d4d8
--muted: #161616
--muted-foreground: #71717a
--accent: #86efac
--accent-foreground: #0a0a0a
--destructive: oklch(0.577 0.245 27.325)
--border: rgba(255, 255, 255, 0.06)
--input: rgba(255, 255, 255, 0.06)
--ring: #86efac
--chart-1: #86efac
--chart-2: #4ade80
--chart-3: #22c55e
--chart-4: #16a34a
--chart-5: #15803d
--radius: 0.625rem
--sidebar: #111111
--sidebar-foreground: #d4d4d8
--sidebar-primary: #86efac
--sidebar-primary-foreground: #0a0a0a
--sidebar-accent: #161616
--sidebar-accent-foreground: #d4d4d8
--sidebar-border: rgba(255, 255, 255, 0.06)
--sidebar-ring: #86efac
```

Button glow RGBA: `134, 239, 172` (same as `#86efac`).

Compact/section glow: `0 0 24px rgba(134,239,172,0.25)`
Hero glow: `0 0 32px rgba(134,239,172,0.3)`
