# Ava Roubanian Portfolio

A portfolio website for artist Ava Roubanian, showcasing her artwork, photography, and music projects.

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Visual Gallery**: Display artwork and photography with filtering options
- **Audio Player**: Listen to music projects directly on the site
- **Content Management**: Powered by Sanity CMS for easy content updates

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

### Sanity Studio

The content management system is powered by Sanity. To run the Sanity Studio:

```bash
cd sanity
npm run dev
```

Then open [http://localhost:3333](http://localhost:3333) in your browser.

## Deployment

### Frontend (Next.js)

The easiest way to deploy the Next.js frontend is through Vercel:

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository in the Vercel dashboard
3. Vercel will automatically deploy the site

### Sanity Studio

To deploy Sanity Studio:

```bash
cd sanity
npx sanity deploy
```

## Content Management

After deployment, you can manage content by:

1. Logging into the Sanity Studio
2. Adding, editing, or removing content
3. Changes will automatically reflect on the website

## License

This project is private and not licensed for public use.
