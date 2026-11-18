# Egyptian Discovery

> **Database note:** The live Supabase project contains the production Egyptian Discovery schema. Do not apply the removed starter migration; it did not match the deployed database and could not provision live booking safely.

An editorial travel-booking foundation for Egyptian Discovery, built with Next.js App Router and designed for Supabase-backed reservations, payment-proof review, and shop operations.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production mode uses the existing Supabase project and live server-side booking functions.

## Environment

Copy `.env.example` to `.env.local`. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only and never expose it in browser code. Set `NEXT_PUBLIC_APP_MODE=production` after configuring Supabase Auth and private storage.

## Supabase setup

1. Create a Supabase project.
2. Apply `supabase/migrations/001_initial_schema.sql`.
3. Add a private `payment-proofs` storage bucket and restrict access to staff roles.
4. Configure Auth providers and create the first administrator manually in Supabase, then set that profile's `role` to `admin`.
5. Add the public URL and keys to `.env.local`.

The database keeps payment proofs and traveler data private, exposes only published content publicly, and records role and audit boundaries. Reservation holds, payment review, and admin actions use server-side Supabase RPC functions.

## Deployment

Deploy to Vercel or another Next.js-compatible host. Configure all variables from `.env.example`, run the Supabase migration, verify private storage policies, and test Auth redirects on the production URL. No default administrator credentials are included.

## Remaining production work

The live Supabase client, destination/trip/shop reads, account state, transactional seat-hold RPC, reservation API, private payment-proof upload, order checkout, and role-protected admin review are implemented. Final live end-to-end tests require real user credentials.
