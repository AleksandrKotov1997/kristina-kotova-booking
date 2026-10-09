create table private.studio_owner (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table private.studio_owner enable row level security;
revoke all on table private.studio_owner from public, anon, authenticated;

create function public.is_studio_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.studio_owner
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_studio_owner() from public, anon;
grant execute on function public.is_studio_owner() to authenticated;

comment on table private.studio_owner is
  'Single studio account allowed into the master cabinet. Provisioned by the project owner, never by public signup.';
