create table public.working_hours (
  id uuid primary key default gen_random_uuid(),
  day_of_week smallint not null unique check (day_of_week between 1 and 7),
  start_time time(0),
  end_time time(0),
  is_working_day boolean not null default true,
  constraint working_hours_valid_interval check (
    (not is_working_day and start_time is null and end_time is null)
    or (
      is_working_day and start_time is not null and end_time is not null
      and start_time < end_time and end_time < time '24:00'
      and extract(second from start_time) = 0
      and extract(second from end_time) = 0
    )
  )
);

comment on column public.working_hours.day_of_week is
  'ISO weekday: 1 = Monday, 7 = Sunday';

alter table public.working_hours enable row level security;
revoke all on public.working_hours from public, anon, authenticated;
grant select on public.working_hours to anon, authenticated;

create policy "Working hours are publicly readable"
  on public.working_hours for select to anon, authenticated
  using (true);
