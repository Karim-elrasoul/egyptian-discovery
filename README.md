# Egyptian Discovery

An editorial travel-booking foundation for Egyptian Discovery, built with Next.js App Router and designed for Supabase-backed reservations, payment-proof review, and shop operations.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The current UI runs in clearly labeled demo mode. It does not create real reservations or process payments.

## Environment

Copy `.env.example` to `.env.local`. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only and never expose it in browser code. Set `NEXT_PUBLIC_APP_MODE=production` only after Supabase Auth, migrations, private storage, and server actions are configured.

## Supabase setup

1. Create a Supabase project.
2. Apply `supabase/migrations/001_initial_schema.sql`.
3. Add a private `payment-proofs` storage bucket and restrict access to staff roles.
4. Configure Auth providers and create the first administrator manually in Supabase, then set that profile's `role` to `admin`.
5. Add the public URL and keys to `.env.local`.

The migration keeps payment proofs and traveler data private, exposes only published content publicly, and records the role and audit boundaries needed for the live flows. Reservation holds, payment review, and admin actions should be implemented as server-side transactions before enabling production mode.

## Deployment

Deploy to Vercel or another Next.js-compatible host. Configure all variables from `.env.example`, run the Supabase migration, verify private storage policies, and test Auth redirects on the production URL. No default administrator credentials are included.

## Remaining production work

The visual foundation, Supabase server client, transactional seat-hold RPC, reservation API boundary, private payment-proof upload endpoint, staff payment-review endpoint, and supporting reservation/shop schema are ready for integration testing. A customer-facing payment form, checkout mutations, and broader admin CRUD screens still need to be connected before production booking is enabled.
