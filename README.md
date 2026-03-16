# MakerSpace

Next.js App Router site for the MakerSpace storefront and member dashboard. The public site handles the marketing and commerce pages, while the protected dashboard uses Clerk for auth and SpacetimeDB for realtime member data.

## What is in this repo

- Public site pages for the storefront, education, repairs, and contact flows.
- Protected dashboard routes for `Overview`, `How-To`, `Community`, and `Admin`.
- Clerk-based auth with App Router catch-all routes for sign-in, sign-up, and redirect callbacks.
- A SpacetimeDB module that stores member profiles, groups, channels, DMs, messages, and tutorials.
- Generated TypeScript bindings in `src/module_bindings` for the frontend client.

## Requirements

- Node.js 20+
- npm
- SpacetimeDB CLI installed and authenticated if you want to publish or regenerate bindings
- A Clerk application with a JWT template named `spacetimedb`

## Environment setup

1. Copy `.env.example` to `.env.local`.
2. Fill in your Clerk keys.
3. Set the SpacetimeDB connection values for your target environment.
4. Set `MAKERSPACE_OWNER_CLERK_ID` to the Clerk user that should unlock the admin dashboard.

Example:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_REPLACE_ME
CLERK_SECRET_KEY=sk_test_REPLACE_ME
CLERK_JWT_TEMPLATE_NAME=spacetimedb
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard/how-to
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard/how-to

NEXT_PUBLIC_SPACETIMEDB_URI=ws://127.0.0.1:3000
NEXT_PUBLIC_SPACETIMEDB_MODULE=makerspace

MAKERSPACE_OWNER_CLERK_ID=user_REPLACE_ME
```

## Local admin identity for the Spacetime module

The module source reads the owner Clerk id from `spacetimedb/src/admin.ts`. That file is intentionally gitignored so a real user id does not get committed.

1. Copy `spacetimedb/src/admin.ts.example` to `spacetimedb/src/admin.ts`.
2. Replace the placeholder with the same Clerk user id you used for `MAKERSPACE_OWNER_CLERK_ID`.

```ts
export const ADMIN_CLERK_ID = "user_REPLACE_ME"
```

## Development

Install dependencies:

```bash
npm install
```

Start the Next.js app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## SpacetimeDB workflow

Generate frontend bindings after schema or reducer signature changes:

```bash
npm run spacetime:generate
```

Publish the current module without wiping existing data:

```bash
npm run spacetime:publish
```

Publish to local SpacetimeDB without wiping data:

```bash
npm run spacetime:publish:local
```

If you explicitly need to clear the database during publish:

```bash
npm run spacetime:publish:reset
# or
npm run spacetime:publish:reset:local
```

## Auth routes

- `/login/[[...rest]]` for sign-in
- `/register/[[...rest]]` for sign-up
- `/sso-callback` for Clerk redirect callbacks
- `/dashboard/*` for authenticated member pages

## Verification

Useful checks before pushing:

```bash
npm run lint
npm run build
```

## Notes

- `.env.local` stays local and should not be committed.
- `spacetimedb/src/admin.ts` stays local and should not be committed.
- `.env.example` is the committed template for onboarding other environments.
