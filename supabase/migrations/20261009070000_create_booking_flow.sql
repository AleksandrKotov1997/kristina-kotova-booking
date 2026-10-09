create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.booking_settings (
  id boolean primary key default true check (id),
  time_zone text not null,
  slot_interval_minutes integer not null check (slot_interval_minutes between 5 and 60),
  booking_window_days integer not null check (booking_window_days between 1 and 365)
);
insert into public.booking_settings values (true, 'Asia/Almaty', 30, 90);

-- Расписание подтверждено мастером: Астана, ежедневно 10:00–20:00.
insert into public.working_hours (day_of_week, start_time, end_time, is_working_day)
select day, time '10:00', time '20:00', true from generate_series(1, 7) day
on conflict (day_of_week) do update
set start_time = excluded.start_time, end_time = excluded.end_time,
    is_working_day = excluded.is_working_day;

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  service_id uuid not null references public.services(id),
  service_name text not null,
  service_price numeric(10, 2) not null check (service_price >= 0),
  client_name text not null check (length(btrim(client_name)) between 2 and 100 and client_name !~ '[[:cntrl:]]'),
  client_phone text not null check (client_phone ~ '^\+[1-9][0-9]{10,14}$'),
  date date not null,
  start_time time(0) not null,
  end_time time(0) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_valid_interval check (
    start_time < end_time and end_time < time '24:00'
    and extract(second from start_time) = 0 and extract(second from end_time) = 0
  )
);
create index bookings_date_status_idx on public.bookings (date, start_time, status);

create table public.blocked_slots (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time(0) not null,
  end_time time(0) not null,
  reason text check (length(reason) <= 500),
  created_at timestamptz not null default now(),
  constraint blocked_slots_valid_interval check (
    start_time < end_time and end_time < time '24:00'
    and extract(second from start_time) = 0 and extract(second from end_time) = 0
  )
);

-- Общий индекс занятости обеспечивает атомарный запрет пересечений
-- между заявками и ручными блокировками, включая параллельные транзакции.
create table private.booking_occupancy (
  booking_id uuid unique references public.bookings(id) on delete cascade,
  blocked_slot_id uuid unique references public.blocked_slots(id) on delete cascade,
  occupied_interval tsrange not null,
  check (num_nonnulls(booking_id, blocked_slot_id) = 1),
  exclude using gist (occupied_interval with &&)
);
revoke all on private.booking_occupancy from public, anon, authenticated;

create function private.sync_booking_occupancy()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  delete from private.booking_occupancy where booking_id = new.id;
  if new.status <> 'cancelled' then
    insert into private.booking_occupancy (booking_id, occupied_interval)
    values (new.id, tsrange(new.date + new.start_time, new.date + new.end_time, '[)'));
  end if;
  return new;
end;
$$;
create function private.sync_blocked_slot_occupancy()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  delete from private.booking_occupancy where blocked_slot_id = new.id;
  insert into private.booking_occupancy (blocked_slot_id, occupied_interval)
  values (new.id, tsrange(new.date + new.start_time, new.date + new.end_time, '[)'));
  return new;
end;
$$;
create trigger bookings_sync_occupancy after insert or update of date, start_time, end_time, status
on public.bookings for each row execute function private.sync_booking_occupancy();
create trigger blocked_slots_sync_occupancy after insert or update of date, start_time, end_time
on public.blocked_slots for each row execute function private.sync_blocked_slot_occupancy();
create trigger bookings_set_updated_at before update on public.bookings
for each row execute function public.set_service_updated_at();

create function private.available_booking_slots(selected_service_id uuid, selected_date date)
returns table (start_time time, end_time time, is_available boolean)
language sql stable security definer set search_path = '' as $$
  select candidate::time, (candidate + make_interval(mins => service.duration_minutes))::time,
    (candidate at time zone settings.time_zone) > statement_timestamp()
    and not exists (
      select 1 from private.booking_occupancy occupancy
      where occupancy.occupied_interval && tsrange(
        candidate, candidate + make_interval(mins => service.duration_minutes), '[)'
      )
    )
  from public.booking_settings settings
  join public.services service on service.id = selected_service_id and service.is_active
  join public.working_hours hours
    on hours.day_of_week = extract(isodow from selected_date) and hours.is_working_day
  cross join lateral generate_series(
    selected_date + hours.start_time,
    selected_date + hours.end_time - make_interval(mins => service.duration_minutes),
    make_interval(mins => settings.slot_interval_minutes)
  ) candidate
  where selected_date between (statement_timestamp() at time zone settings.time_zone)::date
    and (statement_timestamp() at time zone settings.time_zone)::date + settings.booking_window_days - 1
  order by candidate;
$$;

create function public.get_booking_calendar()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'timeZone', time_zone,
    'today', (statement_timestamp() at time zone time_zone)::date,
    'lastDate', (statement_timestamp() at time zone time_zone)::date + booking_window_days - 1,
    'workingHours', coalesce((select jsonb_agg(jsonb_build_object(
      'id', hours.id, 'dayOfWeek', hours.day_of_week, 'isWorkingDay', hours.is_working_day,
      'startTime', to_char(hours.start_time, 'HH24:MI'), 'endTime', to_char(hours.end_time, 'HH24:MI')
    ) order by hours.day_of_week) from public.working_hours hours), '[]'::jsonb)
  ) from public.booking_settings;
$$;

create function public.get_booking_availability(selected_service_id uuid, selected_date date)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare settings public.booking_settings; local_today date;
begin
  select * into strict settings from public.booking_settings;
  local_today := (statement_timestamp() at time zone settings.time_zone)::date;
  if selected_date is null or selected_date < local_today
    or selected_date >= local_today + settings.booking_window_days then
    raise sqlstate 'PT400' using message = 'INVALID_DATE';
  end if;
  if not exists (select 1 from public.services where id = selected_service_id and is_active) then
    raise sqlstate 'PT404' using message = 'SERVICE_UNAVAILABLE';
  end if;
  return jsonb_build_object(
    'date', selected_date, 'timeZone', settings.time_zone,
    'slots', coalesce((select jsonb_agg(jsonb_build_object(
      'startTime', to_char(start_time, 'HH24:MI'), 'endTime', to_char(end_time, 'HH24:MI'),
      'isAvailable', is_available
    )) from private.available_booking_slots(selected_service_id, selected_date)), '[]'::jsonb)
  );
end;
$$;

create function private.booking_receipt(booking public.bookings)
returns jsonb language sql immutable set search_path = '' as $$
  select jsonb_build_object(
    'id', booking.id, 'status', booking.status, 'date', booking.date,
    'startTime', to_char(booking.start_time, 'HH24:MI'), 'endTime', to_char(booking.end_time, 'HH24:MI'),
    'serviceName', booking.service_name, 'servicePrice', booking.service_price,
    'durationMinutes', extract(epoch from (booking.end_time - booking.start_time))::integer / 60
  );
$$;

create function public.create_booking(
  selected_service_id uuid, selected_date date, selected_start_time time,
  client_name text, client_phone text, request_id uuid
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  selected_service public.services;
  existing_booking public.bookings;
  created_booking public.bookings;
  selected_slot record;
  normalized_name text := btrim(client_name);
  normalized_phone text := regexp_replace(client_phone, '[[:space:]()-]', '', 'g');
begin
  if request_id is null or selected_service_id is null or selected_date is null or selected_start_time is null
    or extract(second from selected_start_time) <> 0
    or normalized_name is null or length(normalized_name) not between 2 and 100
    or normalized_name ~ '[[:cntrl:]]'
    or normalized_phone is null or normalized_phone !~ '^\+[1-9][0-9]{10,14}$' then
    raise sqlstate 'PT400' using message = 'INVALID_BOOKING';
  end if;
  -- Повтор отправки после обрыва сети возвращает ту же заявку.
  perform pg_advisory_xact_lock(hashtextextended(request_id::text, 0));
  select * into existing_booking from public.bookings booking where booking.request_id = create_booking.request_id;
  if found then
    if existing_booking.service_id <> selected_service_id or existing_booking.date <> selected_date
      or existing_booking.start_time <> selected_start_time or existing_booking.client_name <> normalized_name
      or existing_booking.client_phone <> normalized_phone then
      raise sqlstate 'PT409' using message = 'REQUEST_REUSED';
    end if;
    return private.booking_receipt(existing_booking);
  end if;
  select * into selected_service from public.services where id = selected_service_id and is_active;
  if not found then raise sqlstate 'PT404' using message = 'SERVICE_UNAVAILABLE'; end if;
  select * into selected_slot from private.available_booking_slots(selected_service_id, selected_date)
    where start_time = selected_start_time and is_available;
  if not found then raise sqlstate 'PT409' using message = 'SLOT_UNAVAILABLE'; end if;
  insert into public.bookings (request_id, service_id, service_name, service_price,
    client_name, client_phone, date, start_time, end_time)
  values (request_id, selected_service.id, selected_service.name, selected_service.price,
    normalized_name, normalized_phone, selected_date, selected_slot.start_time, selected_slot.end_time)
  returning * into created_booking;
  return private.booking_receipt(created_booking);
exception when exclusion_violation then
  raise sqlstate 'PT409' using message = 'SLOT_UNAVAILABLE';
end;
$$;

alter table public.booking_settings enable row level security;
alter table public.bookings enable row level security;
alter table public.blocked_slots enable row level security;
revoke all on public.booking_settings, public.bookings, public.blocked_slots from public, anon, authenticated;
revoke all on function private.sync_booking_occupancy(), private.sync_blocked_slot_occupancy(),
  private.available_booking_slots(uuid, date), private.booking_receipt(public.bookings)
  from public, anon, authenticated;
revoke all on function public.get_booking_calendar(), public.get_booking_availability(uuid, date),
  public.create_booking(uuid, date, time, text, text, uuid) from public, anon, authenticated;
grant execute on function public.get_booking_calendar(), public.get_booking_availability(uuid, date),
  public.create_booking(uuid, date, time, text, text, uuid) to anon, authenticated;
