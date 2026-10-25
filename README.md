# NIYO IREME UNIT COMPANY LTD - Official Website

> **Official Slogan:** *"Kunoza umurimo ni inshingano zacu!"*
> *(Doing every job well is our responsibility!)*
> **Client:** NIYO IREME UNIT COMPANY LTD
> **Developer:** IshConnect ([https://ishconnct.com/](https://ishconnct.com/))
> **Location:** Kimironko, Kigali, Rwanda
> **Phone:** +250 781 294 928

---

## 1. Project Overview

Production-ready, bilingual (English / Kinyarwanda) web application for **NIYO IREME UNIT COMPANY LTD**, a Rwandan enterprise specialising in:

1. **Painting Services** (`painting`) - interior and exterior painting, decorative wall finishes and paint supply.
2. **Construction and Renovation** (`construction`) - construction, renovation, terraces and structural work.
3. **Tiles and Wallpaper Installation** (`tiling`, `wallpaper`) - floor and wall tiles, tile finishing and wallpaper.
4. **Ceilings and Terrazzo** (`ceilings`, `terrazzo`) - gypsum ceilings, ceiling finishing and terrazzo work.
5. **Glass Installation** (`glass`) - windows, suitable glass panels and partitions.
6. **Cleaning Services** (`cleaning`) - property cleaning and post-renovation clean-up where agreed.
7. **Workforce Services** (`workforce`) - supplying construction workers and matching them with employers.
8. **Construction Project Supervision** (`supervision`) - progress monitoring, quality checks and coordination.
9. **Construction Equipment Use and Rental** (`equipment`) - modern equipment use and rental inquiries.
10. **Building Materials Sales** (`materials`) - available building materials with prices confirmed on request.

All company copy (slogans, service descriptions, "why choose us" reasons) is the client's official wording, reproduced verbatim in `src/i18n/locales/en.json` and `src/i18n/locales/rw.json`.

---

## 2. Technology Stack

- **React 19 + TypeScript (strict)** ” component-driven, typed UI.
- **Vite 8** ” dev server and production build.
- **Tailwind CSS v4** ” `@theme` design tokens, Plus Jakarta Sans + Space Grotesk.
- **React Router 7** ” lazy-loaded routes.
- **i18next / react-i18next** ” bilingual routing via `?lang=rw` / `?lang=en`.
- **React Hook Form + Zod** ” validated contact and quotation forms.
- **EmailJS** ” form delivery (falls back to phone / WhatsApp when not configured).
- **Custom service worker** ” offline app shell, offline page, update prompt.
- **Node test runner (`node:test`)** ” unit tests for the quotation engine.
- **sharp** ” generation of the brand asset set (logos, icons, OG image).

---

## 3. Routes

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | Hero with official slogan, service overview cards, "why choose us" list, official intro/closing statements, 3-step process, CTA to quote. |
| `/about` | **About** | Official company introduction, values, location and service area. |
| `/services` | **Services** | All service categories with scope points and links to detail pages. |
| `/services/:id` | **Service Details** | Deep dive per service with scope, deliverables and quote CTA. |
| `/gallery` | **Gallery** | Category filters, lightbox (keyboard + focus trapped), genuine project photographs and empty-state handling. |
| `/faq` | **FAQ** | Searchable, categorised accordion with official answers. |
| `/quote` | **Request a Quote** | Live RWF estimate, duration and workforce matching, WhatsApp summary, EmailJS submission. |
| `/contact` | **Contact** | Contact details, OpenStreetMap embed + Google Maps links, validated EmailJS form. |
| `/privacy` | **Privacy** | Data-handling notice for the forms and analytics-free operation. |
| `*` | **Not Found** | Localised 404 with navigation back into the site. |

Every page is available in both languages: `?lang=rw` and `?lang=en`.

---

## 4. Commands

```bash
npm install          # install dependencies (no --legacy-peer-deps needed)

npm run dev          # dev server on http://localhost:3000
npm run build        # sitemap â†’ i18n check â†’ typecheck â†’ vite build â†’ post-build SEO/SW stamping â†’ PWA check
npm run preview      # serve the production build on http://localhost:4173

npm run typecheck    # tsc --noEmit
npm test             # unit tests (node:test via scripts/run-tests.ts)
npm run i18n:check   # locale key + placeholder + code-reference audit
npm run verify:pwa   # validate the built manifest, icons, screenshots, sw.js and document head
npm run assets       # regenerate public/assets/brand/* (sharp)
npm run sitemap      # regenerate public/sitemap.xml + public/robots.txt
```

---

## 5. Environment Configuration

Copy `.env.example` to `.env` (or `.env.local`) and set the values below. All variables are inlined into the browser bundle, so never place private secrets here.

| Variable | Purpose | Default |
|---|---|---|
| `VITE_SITE_URL` | Public origin used for canonical URLs, hreflang, sitemap, Open Graph | `http://localhost:3000` |
| `VITE_CONTACT_EMAIL` | Verified company email shown in the footer, contact page and form footers | `info@niyoiremeunitltd.com` |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID for the contact / quote forms | empty (forms fall back to phone + WhatsApp) |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID | empty |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | empty |
| `VITE_ENABLE_SW` | Set to `false` to disable service-worker registration | `true` |

---

## 6. Bilingual Behaviour

- Language resolution order: `?lang=` query parameter â†’ `localStorage` (`niyoireme.lang`) â†’ browser navigator â†’ `<html lang>`.
- The chosen language is persisted and reflected in `<html lang>`, the Open Graph locale, the canonical URL, `hreflang` alternates and the JSON-LD payload.
- Canonical and `hreflang` tags are written at runtime (crawlers that execute JavaScript see them); the static `sitemap.xml` already lists both languages for every route.
- All UI strings live in `src/i18n/locales/{en,rw}.json`; `npm run i18n:check` fails the build if a key, placeholder or array shape drifts between the two files or is missing from the code.

---

## 7. PWA, SEO & Accessibility

- **PWA:** `public/manifest.webmanifest`, branded icons (192/512 + maskable), `apple-touch-icon`, install prompt, update prompt, offline banner, offline fallback page, network-first navigation with runtime caching.
- **SEO:** per-route title/description, canonical + hreflang, Open Graph / Twitter cards with an absolute 1200Ã—630 image, LocalBusiness JSON-LD, bilingual `sitemap.xml`, `robots.txt`.
- **Accessibility (WCAG 2.2 AA):** skip link, visible focus rings, focus-trapped lightbox, keyboard-operable navigation and menus, labelled form fields with inline error summaries, `prefers-reduced-motion` support, 320 px responsive layouts.

---

## 8. Items Pending Client Confirmation

1. **`Slings`** ” the term is kept verbatim in the construction service scope; please confirm the intended meaning/English equivalent.
2. **Premises address** ” currently "Kimironko, Kigali, Rwanda"; send the street address if it should be displayed and mapped.
3. **Verified email** ” the site shows `VITE_CONTACT_EMAIL` (default `info@niyoiremeunitltd.com`); confirm the monitored mailbox.
4. **Production domain** ” set `VITE_SITE_URL` to the final domain so canonical URLs, sitemap and social cards point at it.
5. **Email account** ” provide the service ID, template ID and public key to enable in-browser form delivery (the forms currently fall back to phone/WhatsApp).
6. **Gallery photography** ” current images are the client's own photos in `public/projects/`; confirm they may be published and, where helpful, supply higher-resolution or additional shots.

---

## 9. Email Interface (Contact & Quotation Forms)

The platform has **two** submitting forms, both delivered by EmailJS:

1. **Contact form** ” `src/components/forms/ContactForm.tsx`, rendered on `/contact` (6 EmailJS variables, 5 input fields).
2. **Quotation form** ” `src/components/forms/QuoteForm.tsx`, rendered on `/quote` (17 EmailJS variables, 6 input fields + calculator scope).

Every other input on the site (e.g. the FAQ search box) is client-side only and never submits.

Both forms submit through a single helper, `src/utils/emailjs.ts`, which calls `@emailjs/browser` directly from the browser. Wiring the forms is a three-step job: create the EmailJS service + template, paste the three credentials into `.env`, and make the template fields match the parameter names below.

### 9.1 Required environment variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS **service** ID (e.g. `service_xxxxxxx`) | empty â†’ forms report "not configured" |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS **template** ID (e.g. `template_xxxxxxx`) | empty |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS **public key** (Account â†’ API Keys) | empty |

The helper (`src/utils/emailjs.ts`) reads them at build time and considers email configured only when **all three** are non-empty:

```ts
export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '',
} as const;

export const isEmailConfigured = (): boolean =>
  Boolean(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey);
```

### 9.2 Delivery contract

```ts
sendEmail(templateParams: Record<string, unknown>): Promise<void>
```

- Resolves **only** when EmailJS returns HTTP `200`/`201` ” a success message is never shown for a failed send.
- Throws `EmailNotConfiguredError` when credentials are missing (the form shows its "not configured" state and points the visitor to phone/WhatsApp).
- Throws `EmailDeliveryError` for any other failure.

Both forms call it the same way:

```ts
await sendEmail({
  from_name: values.name,
  reply_to: values.email || values.phone,
  email: values.email,
  phone: values.phone,
  /* ¦form-specific fields¦ */
  source: 'contact-page',      // or 'quotation-page'
});
```

### 9.3 Contact form template fields

Defined in `src/components/forms/ContactForm.tsx`. The Contact form has **five** input fields; the table below maps each on-screen field to its validation rule and the EmailJS variable it is sent as.

| # | On-screen field | `id` / field name | Input type | Required | Validation | EmailJS variable |
|---|---|---|---|---|---|---|
| 1 | Full name | `contact-name` / `name` | `text` | yes | Trimmed, min 2 chars | `from_name` |
| 2 | Phone | `contact-phone` / `phone` | `tel` | yes | Min 7 chars, matches `/^[+()\d\s-]{7,20}$/` | `phone` |
| 3 | Email | `contact-email` / `email` | `email` | no | Blank allowed, otherwise a valid email | `email` |
| 4 | Subject | `contact-subject` / `subject` | `select` | yes | One of `finishing` \| `painting` \| `construction` \| `workforce` \| `other` | `subject` |
| 5 | Message | `contact-message` / `message` | `textarea` (5 rows) | yes | Trimmed, min 10 chars | `message` |

Derived fields (not on-screen inputs):

| Template variable | Type | Value |
|---|---|---|
| `reply_to` | string | `email` when provided, otherwise `phone` ” bind this to the template **Reply-To** |
| `source` | string | Always `contact-page` |

So the complete EmailJS variable list for the **Contact** template is:
`from_name`, `reply_to`, `email`, `phone`, `subject`, `message`, `source`.

### 9.4 Quotation form template fields

Defined in `src/components/forms/QuoteForm.tsx`. The quotation form has **six** on-screen input fields plus a scope/calculator block that feeds the estimate. Fields flagged "workforce only" are sent **only** when the selected service category is `workforce`; the materials/area group is sent only for non-workforce categories.

On-screen fields:

| # | On-screen field | `id` / field name | Input type | Required | Validation | EmailJS variable |
|---|---|---|---|---|---|---|
| 1 | Full name | `quote-name` / `name` | `text` | yes | Trimmed, min 2 chars | `from_name` |
| 2 | Phone | `quote-phone` / `phone` | `tel` | yes | Min 7 chars, matches `/^[+()\d\s-]{7,20}$/` | `phone` |
| 3 | Email | `quote-email` / `email` | `email` | no | Blank allowed, otherwise a valid email | `email` |
| 4 | Location | `quote-location` / `location` | `text` | yes | Trimmed, min 3 chars | `location` |
| 5 | Timeline | `quote-timeline` / `timeline` | `select` | yes | One of `immediate` \| `twoWeeks` \| `nextMonth` \| `planning` | `timeline` |
| 6 | Message | `quote-message` / `message` | `textarea` (5 rows) | yes | Trimmed, min 10 chars | `message` |

Calculator / scope inputs (not free-text; drive the estimate and the summary):

| On-screen field | `id` | EmailJS variable |
|---|---|---|
| Service category | `quote-service` | `service` (localised title) |
| Project type | `quote-project-type` | `project_type` (localised label) |
| Finishing tier | `quote-tier` | `tier` (localised label) |
| Area (m²) ” non-workforce | `quote-area` | `area` |
| Workers ” workforce only | `quote-workers` | `workers` |
| Duration (weeks) ” workforce only | `quote-duration` | `weeks` |
| Include materials (checkbox) ” non-workforce | ” | `materials_included` |

Full EmailJS variable list for the **Quotation** template:

| Template variable | Type | Present when | Source / notes |
|---|---|---|---|
| `from_name` | string | always | Visitor name |
| `reply_to` | string | always | Visitor email, or phone when email is blank |
| `email` | string | always | Visitor email (optional) |
| `phone` | string | always | Visitor phone |
| `location` | string | always | Site location (min 3 chars) |
| `timeline` | string | always | One of `immediate` \| `twoWeeks` \| `nextMonth` \| `planning` |
| `message` | string | always | Min 10 chars |
| `service` | string | always | Service title (localised label), e.g. "House Finishing & Decoration" |
| `project_type` | string | always | Localised label, e.g. `residential` \| `commercial` \| `renovation` \| `exterior` |
| `tier` | string | always | Localised finishing tier label |
| `estimate` | string | always | Formatted RWF range, e.g. `1,200,000 “ 1,800,000 RWF` |
| `duration_weeks` | number | always | Suggested duration in weeks |
| `area` | number | non-workforce | Area in m² (clamped) |
| `workers` | number | workforce only | Worker count (clamped) |
| `weeks` | number | workforce only | Duration in weeks (clamped) |
| `materials_included` | boolean | non-workforce | Whether materials are included in the estimate |
| `source` | string | always | Always `quotation-page` |

> A single EmailJS template can serve both forms if it only references the **common** variables (`from_name`, `reply_to`, `email`, `phone`, `message`, `source`). Use two templates (one per form) if you want the quotation-specific fields (`service`, `project_type`, `tier`, `estimate`, `area`, `workers`, `weeks`, `materials_included`, `timeline`, `location`) rendered separately.

### 9.5 Suggested EmailJS template body

```
New {{source}} enquiry from the website

Name:     {{from_name}}
Phone:    {{phone}}
Email:    {{email}}
Location: {{location}}
Subject:  {{subject}}
Timeline: {{timeline}}

Service:          {{service}}
Project type:     {{project_type}}
Tier:             {{tier}}
Area (m²):        {{area}}
Workers:          {{workers}}
Weeks:            {{weeks}}
Materials:        {{materials_included}}
Estimate:         {{estimate}}
Est. duration:    {{duration_weeks}} week(s)

Message:
{{message}}
```

### 9.6 Setup checklist

1. Create an EmailJS account and add an **Email Service** (e.g. Gmail) â†’ copy the **Service ID**.
2. Create a **Template**, paste the variable names from Â§9.3 / Â§9.4 into it â†’ copy the **Template ID**.
3. Set the template **To Email** to `VITE_CONTACT_EMAIL` and **Reply-To** to `{{reply_to}}`.
4. Copy the **Public Key** from Account â†’ API Keys.
5. Put all three values into `.env`, then restart the dev server (`npm run dev`) ” Vite inlines env vars at startup.
6. Submit both forms and confirm delivery; the UI shows success only on HTTP 200/201.

---

*Engineered with precision by **IshConnect** ([https://ishconnct.com/](https://ishconnct.com/))*

