create extension if not exists "pgcrypto";

create type public.app_role as enum ('customer', 'staff', 'admin');
create type public.reservation_status as enum ('held', 'payment_review', 'confirmed', 'waitlisted', 'cancelled', 'expired');
create type public.payment_status as enum ('submitted', 'approved', 'rejected', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.app_role not null default 'customer',
  loyalty_points integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  name_ar text not null,
  region text,
  description text,
  description_ar text,
  photos text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid references public.destinations(id),
  slug text unique not null,
  title text not null,
  title_ar text not null,
  description text,
  description_ar text,
  starts_on date not null,
  ends_on date not null,
  price numeric(12,2) not null check (price >= 0),
  deposit_percent numeric(5,2) not null default 30 check (deposit_percent between 0 and 100),
  minimum_group_size integer not null default 2 check (minimum_group_size > 0),
  capacity integer not null check (capacity > 0),
  booking_deadline timestamptz,
  photos text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  customer_id uuid not null references public.profiles(id),
  trip_id uuid not null references public.trips(id),
  seats integer not null check (seats > 0),
  status public.reservation_status not null default 'held',
  hold_expires_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid references public.reservations(id),
  order_id uuid,
  amount numeric(12,2) not null check (amount > 0),
  method text not null check (method in ('instapay', 'bank_transfer')),
  proof_path text,
  status public.payment_status not null default 'submitted',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  trip_id uuid not null references public.trips(id),
  preferred_seats integer not null default 1 check (preferred_seats > 0),
  created_at timestamptz not null default now(),
  unique(customer_id, trip_id)
);

create table public.traveler_details (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  full_name text not null,
  national_id_last4 text,
  phone text,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  name_ar text not null,
  description text,
  price numeric(12,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  photos text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  customer_id uuid not null references public.profiles(id),
  status text not null default 'payment_review' check (status in ('payment_review', 'paid', 'packing', 'shipped', 'delivered', 'cancelled')),
  delivery_address jsonb not null,
  delivery_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null check (total >= 0),
  created_at timestamptz not null default now()
);

alter table public.waitlist_entries enable row level security;
alter table public.traveler_details enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.trips enable row level security;
alter table public.reservations enable row level security;
alter table public.payments enable row level security;
alter table public.audit_events enable row level security;

create policy "Published destinations are public" on public.destinations for select using (published = true);
create policy "Published trips are public" on public.trips for select using (published = true);
create policy "Customers see their profile" on public.profiles for select using (auth.uid() = id);
create policy "Customers see their reservations" on public.reservations for select using (auth.uid() = customer_id);
create policy "Customers create their reservations" on public.reservations for insert with check (auth.uid() = customer_id);
create policy "Customers see their payments" on public.payments for select using (
  exists (select 1 from public.reservations r where r.id = reservation_id and r.customer_id = auth.uid())
);
create policy "Customers submit their payments" on public.payments for insert with check (
  exists (select 1 from public.reservations r where r.id = reservation_id and r.customer_id = auth.uid())
);
create policy "Published products are public" on public.products for select using (published = true);
create policy "Customers see their orders" on public.orders for select using (auth.uid() = customer_id);
create policy "Customers manage their waitlist entries" on public.waitlist_entries for all using (auth.uid() = customer_id) with check (auth.uid() = customer_id);
create policy "Customers see their traveler details" on public.traveler_details for select using (
  exists (select 1 from public.reservations r where r.id = reservation_id and r.customer_id = auth.uid())
);

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('staff', 'admin')); $$;

create policy "Staff manage operations" on public.reservations for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff manage payments" on public.payments for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff manage destinations" on public.destinations for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff manage trips" on public.trips for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff read audit events" on public.audit_events for select using (public.is_staff());
create policy "Staff manage products" on public.products for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff manage orders" on public.orders for all using (public.is_staff()) with check (public.is_staff());
create policy "Staff manage traveler details" on public.traveler_details for all using (public.is_staff()) with check (public.is_staff());

create or replace function public.create_reservation_hold(requested_trip_slug text, requested_seats integer)
returns public.reservations
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  trip_row public.trips;
  held_seats integer;
  created_reservation public.reservations;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if requested_seats < 1 or requested_seats > 12 then raise exception 'Invalid seat count'; end if;
  select * into trip_row from public.trips where slug = requested_trip_slug and published = true for update;
  if not found then raise exception 'Trip not found'; end if;
  if trip_row.booking_deadline is not null and trip_row.booking_deadline <= now() then raise exception 'Booking deadline has passed'; end if;
  update public.reservations set status = 'expired'
    where trip_id = trip_row.id and status = 'held' and hold_expires_at <= now();
  select coalesce(sum(seats), 0) into held_seats from public.reservations
    where trip_id = trip_row.id and status in ('held', 'payment_review', 'confirmed');
  if held_seats + requested_seats > trip_row.capacity then raise exception 'Not enough seats available'; end if;
  insert into public.reservations(reference, customer_id, trip_id, seats, status, hold_expires_at)
    values ('ED-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)), current_user_id, trip_row.id, requested_seats, 'held', now() + interval '12 hours')
    returning * into created_reservation;
  insert into public.audit_events(actor_id, action, entity_type, entity_id, metadata)
    values (current_user_id, 'reservation_hold_created', 'reservation', created_reservation.id, jsonb_build_object('seats', requested_seats));
  return created_reservation;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles(id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', '')) on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

create policy "Customers upload their payment proofs" on storage.objects
for insert to authenticated
with check (bucket_id = 'payment-proofs' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Staff access payment proofs" on storage.objects
for select to authenticated
using (bucket_id = 'payment-proofs' and public.is_staff());
