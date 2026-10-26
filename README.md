# NIYO IREME UNIT LTD Website

Responsive English-language business website for home renovation, construction finishing and interior design. The frontend is a React/Vite application in `client/`; the Express/MongoDB API is in `server/`.

## Development

Install dependencies in both applications:

```bash
npm --prefix client install
npm --prefix server install
```

Create `server/.env` from `server/.env.example`. Set a MongoDB URI, a random `JWT_SECRET` of at least 32 characters, and the intended CORS origin. The client uses same-origin `/api` requests by default; Vite proxies these to the local backend. Run the API and frontend in separate terminals:

```bash
npm run dev:server
npm run dev:client
```

The root package also provides `npm run build`, `npm run lint`, `npm test`, and `npm run seed`. The equivalent frontend and backend commands are available in their respective package files.

## Administration and content

The existing `/admin` entry uses cookie-based authentication. Seed an initial administrator and the initial content with `npm run seed` after configuring the server environment. The seed operation adds missing service and article slugs and leaves existing edited records intact.

The admin workspace uses labelled fields for service, blog, website content and WhatsApp contact records. Image fields can be uploaded, reordered, edited or removed; service galleries require at least three images before publishing. The editor includes a draft preview and an advanced structured-data view. The website content area covers homepage hero and process copy, About copy, benefits, gallery entries, FAQs, footer copy, contact details, social profiles, page hero copy and route metadata. Public page components read active website content records, and saved changes refresh those records without a full reload.

Existing records can be opened and edited or deleted from their admin list. New website content starts unpublished; use the publication control and save to publish or unpublish it. Services use both a draft/published state and an active toggle, while articles use draft/published status. Long records are split into labeled editor sections so publishing and SEO fields remain easy to find. The public services menu groups active services into nested categories on desktop and mobile. Social profile records are editable in website content and only approved, configured profile URLs are shown.

Services and articles have public read routes and protected management routes. Public reads return only active published services and published articles. Article body content is plain text with line breaks; optional YouTube input is validated and converted to a video ID. Blog image galleries allow zero to five images, including the optional featured image. Blog posts support draft and published states, categories, tags, authors, featured images and SEO fields.

WhatsApp contacts are limited to five approved international numbers. Visitors can choose one or more contacts or use “Contact all”; each opens its own WhatsApp conversation with the selected service in the prepared message. WhatsApp does not send one group message through this workflow. The WhatsApp icon remains visible in the site’s social icon row. Other social profile icons appear only when a company-approved URL is configured in the admin content or frontend environment.

Backend routes:

- `GET /api/services`, `GET /api/services/:slug`; admin CRUD at `/api/services` and `/api/services/:id`.
- `GET /api/blog`, `GET /api/blog/:slug`; admin CRUD at `/api/blog` and `/api/blog/:id`.
- `GET /api/settings/public`; protected `PUT /api/settings/whatsapp-contacts`.
- Protected `POST /api/upload` accepts JPEG, PNG and WebP images up to 5 MB.
- Existing auth, jobs and content routes remain under `/api/auth`, `/api/jobs` and `/api/content`. Website content uses section/key records (for example `home` + `hero`, `faq` + `faq-quote`, or `seo` + `/about`).

Upload storage uses local files in development. Production uploads require persistent Cloudinary storage; configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in the server environment. Do not put these secrets in client environment variables. Configure `CORS_ORIGIN` as a comma-separated list of approved frontend origins.

## Branding

The complete approved logo source lives in `client/public/assets/Logo/Niyo_Ireme_Unit_ltd_Logo-removed_bg.png`. Run `npm --prefix client run assets` to regenerate its full-artwork header, icon and social-preview variants. PWA icons are generated with a solid `#0e224e` background so the full logo stays visible on home screens. Keep generated variants in sync with that source.

## Quality checks

```bash
npm run lint
npm test
npm run build
```

Frontend tests cover quotation and structured-data behavior plus WhatsApp URL construction. Backend tests cover service and blog schema validation, optional blog media, the service gallery minimum, YouTube parsing, public health/security headers and anonymous admin rejection. A full authenticated CRUD, publishing, contact and local media HTTP workflow is included in `server/test/cms.database.integration.test.js` and runs when `MONGODB_TEST_URI` points to a disposable database with `test` in its name. The test suite does not read `.env` files and never targets `MONGODB_URI`. Production Cloudinary persistence requires separate configured credentials and is not exercised by the local test.

The integration test can be run with:

```bash
# Set MONGODB_TEST_URI in the shell to a disposable test database first.
npm --prefix server test
```

Responsive layouts support 320 px through wide desktop breakpoints in the existing CSS. The automated build verifies compilation, SEO, sitemap, manifest, icons and service worker. Visual browser checks still require an available browser session.

## Deployment notes

Deploy the frontend and API with their configured same-origin rewrites or a documented CORS origin. Set `NODE_ENV=production`, `JWT_SECRET`, `MONGODB_URI`, `CORS_ORIGIN`, and Cloudinary credentials in the backend environment. Keep admin registration disabled except during an approved setup window; seed the first administrator before launch. The production upload endpoint refuses uploads if persistent storage is not configured.
