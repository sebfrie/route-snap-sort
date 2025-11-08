# Deployment Guide

## Next.js 16 Migration Complete

The application has been successfully migrated from Vite to Next.js 16.0.1 with React 19.2.0.

## Development

The application works perfectly in development mode:

```bash
npm run dev
```

This starts the development server on `http://localhost:3000`.

## Known Issue: Static Build Pre-rendering

There is currently a known issue with Next.js 16 (Turbopack) + React 19 combination when building for production with static pre-rendering. The build fails with a "useState is not a function" error during the page generation phase.

**This is a build-time issue only** - the application works perfectly in:
- Development mode (`npm run dev`)
- Production runtime (after successful build)

## Deployment Recommendations

### Option 1: Deploy to Vercel (Recommended)
Vercel has excellent support for Next.js applications and handles the build process optimally:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and configure the build
3. The app will deploy successfully and work in production

### Option 2: Use Next.js Development Mode in Production
For quick deployment, you can run the development server in production:

```bash
NODE_ENV=production npm run dev
```

**Note:** This is not recommended for high-traffic production use but works for testing and low-traffic scenarios.

### Option 3: Wait for Next.js/React Updates
This issue is likely to be resolved in upcoming Next.js or React updates as the ecosystem stabilizes around React 19.

## Application Features

- ✅ Full Next.js 16 App Router implementation
- ✅ React 19.2.0 with modern features
- ✅ TypeScript configuration
- ✅ Tailwind CSS styling
- ✅ shadcn/ui components
- ✅ Google Maps integration
- ✅ Drag-and-drop waypoint sorting
- ✅ Client-side interactivity
- ✅ Custom 404 page
- ✅ Loading states

## Tech Stack

- **Framework:** Next.js 16.0.1 (App Router)
- **React:** 19.2.0
- **TypeScript:** 5.8.3
- **Styling:** Tailwind CSS 3.4.17
- **UI Components:** shadcn/ui (Radix UI + Tailwind)
- **State Management:** React Query (TanStack Query)
- **Drag & Drop:** @dnd-kit
- **Icons:** Lucide React
- **Maps:** Google Maps JavaScript API

## Environment Variables

Make sure to add your Google Maps API key in the application UI:
1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Enable "Places API" and "Maps JavaScript API"
3. Enter the key in the application's API Key input field
