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

## External APIs
- **Address Autocomplete**: OpenStreetMap Nominatim API (free, no API key) used in `CreateListingPage.jsx` for location input. Debounced 300ms, returns structured address data. Selected addresses are formatted as "street, city, state" (short form).
- **AI Auto-fill**: Cloudflare Worker proxy at `https://voluntir-ai.stanleyho862.workers.dev` for extracting event details from URLs.

## Key Components
- **SkillsInput** (`src/components/Common.jsx`): Tag-style input for skills. Type a skill and press Enter or comma to add as a chip. Chips are removable. Stores as a `string[]` on the listing (`listing.skills`). Displayed as green pill badges on EventCard (shows first 2 with expandable overflow).
- **AddressAutocomplete** (`src/components/pages/CreateListingPage.jsx`): Wraps the location input with Nominatim-powered autocomplete dropdown. Formats selected addresses as "street, city, state".

## Branch / Workflow
- Working branch: `main`
- GitHub Actions auto-deploys on push to `main`
- No need to run `npm run build` locally (CI handles it)
