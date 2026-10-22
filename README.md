# Ava Roubanian Portfolio

A portfolio website for artist Ava Roubanian, showcasing her artwork, photography, and music projects.

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Visual Gallery**: Display artwork and photography with filtering options
- **Audio Player**: Listen to music projects directly on the site
- **Content Management**: Edit content at `/admin` on the live site (Sanity Studio embedded in Next.js)

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **CMS**: Sanity.io
- **Hosting**: Vercel

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser
5. Edit content at [http://localhost:3000/admin](http://localhost:3000/admin) (Sanity login required)

### Optional: standalone Sanity dev server

Schema types live in `sanity/schemaTypes/`. The shared config is `sanity.config.ts` at the repo root. To run the Studio UI on port 3333:

```bash
cd sanity
npm install
npm run dev
```

## Deployment

### Frontend (Next.js)

Deploy through Vercel (connect the Git repository). Set environment variables:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_*` | Already in `vercel.json` for project/dataset/API version |
| `SANITY_REVALIDATE_SECRET` | Secret for Sanity → `POST /api/revalidate` webhook (generate a long random string) |
| `NEXT_PUBLIC_SITE_URL` | Optional canonical site URL for metadata |

### Sanity

1. Deploy schema changes when types change (Sanity CLI or dashboard).
2. In [Sanity project settings → API → CORS origins](https://www.sanity.io/manage), allow:
   - `http://localhost:3000` (development)
   - Your production site URL (e.g. `https://yourdomain.com`)
3. In [Sanity project settings → API → Webhooks](https://www.sanity.io/manage), create a webhook:
   - **URL**: `https://yourdomain.com/api/revalidate`
   - **Dataset**: production
   - **Trigger on**: Create, Update, Delete
   - **Secret**: same value as `SANITY_REVALIDATE_SECRET`
   - **HTTP method**: POST
   - **Projection**: `{ _type }` (optional)

## Content Management

After deployment, Ava can manage content at **`/admin`** on the website:

1. Log in with her Sanity account
2. Use **Site settings** for contact email, Instagram, and home page intro
3. Use **Photography**, **Artwork**, and **Audio** for portfolio collections

Changes appear on the site within seconds via the revalidation webhook (no redeploy needed).

## License

This project is private and not licensed for public use.
