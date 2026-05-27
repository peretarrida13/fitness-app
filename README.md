# FitTracker — Web

Personal fitness tracking app built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Running locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Fill in `.env.local` with your Supabase keys first (see `SETUP.md`).

## Other commands

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
npm run lint       # run ESLint
```

## Environment variables

Copy `.env.local` and fill in the values — see `SETUP.md` for where to get each one:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_CLIENT_ID=
VITE_APP_PASSWORD=
```

## Deployment

Deployed automatically to Netlify on every push to `master`. See `TODO.md` for the full setup checklist.

## Related

- Android app → `~/Desktop/fitness-app-android`
