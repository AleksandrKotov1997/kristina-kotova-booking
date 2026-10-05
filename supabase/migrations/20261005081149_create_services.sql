create table public.services (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('lashes', 'brows')),
  name text not null check (length(btrim(name)) between 1 and 160),
  description text not null check (length(btrim(description)) between 1 and 2000),
  price numeric(10, 2) not null check (price >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index services_active_category_order_idx
  on public.services (category, sort_order, name, id)
  where is_active = true;

create function public.set_service_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_service_updated_at() from public, anon, authenticated;

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_service_updated_at();

alter table public.services enable row level security;

revoke all on public.services from public, anon, authenticated;
grant select on public.services to anon, authenticated;

create policy "Active services are publicly readable"
  on public.services
  for select
  to anon, authenticated
  using (is_active = true);
