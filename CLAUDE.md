# Voluntir

Volunteer coordination platform built with Vite + React, Firebase (Auth + Firestore), deployed to GitHub Pages.

## Tech Stack
- **Frontend**: Vite + React (JSX), no TypeScript
- **Backend**: Firebase (Auth with Google sign-in, Firestore)
- **Deployment**: GitHub Actions -> GitHub Pages at `marincatholiccs.github.io/voluntir/`
- **Vite base**: `/voluntir/` (use `import.meta.env.BASE_URL` for public asset paths in JSX)

## Project Structure
- `src/main.jsx` - Entry point
- `src/App.jsx` - Root component, all top-level state, auth listener
- `src/constants.js` - `C` color palette
- `src/utils.js` - Utility functions (`btnStyle`, `useIsMobile`, `formatDate`, etc.)
- `src/styles.css` - Global CSS
- `src/firebase/config.js` - Firebase init, exports `auth` and `db`
- `src/firebase/api.js` - All Firestore/Auth operations (`fb*` functions)
- `src/components/` - React components (Icons, Common, Navbar, EventCard, EventDetail)
- `src/components/pages/` - Page components (EventsPage, UpcomingPage, MyListingsPage, LeaderboardPage, CreateListingPage, ProfilePage)
- `public/` - Static assets (voluntir.png, voluntir.ico)

## Conventions
- Font: Asap (Google Fonts), no Fraunces
- Colors via `C` object from `src/constants.js`
- Inline styles (no CSS modules or styled-components)
- All Firebase operations are named exports prefixed with `fb` (e.g., `fbSignIn`, `fbGetListings`)
- SVG icons in `src/components/Icons.jsx` as `I` object

## Branch / Workflow
- Working branch: `main`
- GitHub Actions auto-deploys on push to `main`
- No need to run `npm run build` locally (CI handles it)
