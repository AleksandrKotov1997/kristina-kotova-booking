-- Доступ через проверяемые RPC, без прямого чтения контактов из таблицы.
create function private.require_studio_owner()
returns void language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_studio_owner() then raise sqlstate 'PT403' using message = 'ACCESS_DENIED'; end if;
end;
$$;
create function private.admin_booking(booking public.bookings)
returns jsonb language sql immutable set search_path = '' as $$
  select jsonb_build_object(
    'id', booking.id, 'serviceId', booking.service_id, 'serviceName', booking.service_name, 'servicePrice', booking.service_price,
    'clientName', booking.client_name, 'clientPhone', booking.client_phone, 'date', booking.date,
    'startTime', to_char(booking.start_time, 'HH24:MI'), 'endTime', to_char(booking.end_time, 'HH24:MI'),
    'status', booking.status, 'createdAt', booking.created_at, 'updatedAt', booking.updated_at
  );
$$;
create function private.guard_booking_status()
returns trigger language plpgsql set search_path = '' as $$
begin
  if old.status = new.status then return new; end if;
  if (old.status = 'pending' and new.status in ('confirmed', 'cancelled'))
    or (old.status = 'confirmed' and new.status in ('completed', 'cancelled')) then return new; end if;
  raise sqlstate 'PT400' using message = 'INVALID_TRANSITION';
end;
$$;
create trigger bookings_guard_status before update of status on public.bookings
for each row execute function private.guard_booking_status();
create index bookings_pending_created_idx on public.bookings (created_at desc, id) where status = 'pending';

create function public.get_admin_bookings(
  selected_page integer default 1, selected_status text default null, selected_date date default null, search_text text default ''
)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  perform private.require_studio_owner();
  if selected_page is null or selected_page not between 1 and 1000000
    or (selected_status is not null and selected_status not in ('pending', 'confirmed', 'cancelled', 'completed'))
    or search_text is null or length(search_text) > 100 then raise sqlstate 'PT400' using message = 'INVALID_FILTERS'; end if;
  with filtered as materialized (
    select booking.* from public.bookings booking
    where (selected_status is null or booking.status = selected_status)
      and (selected_date is null or booking.date = selected_date)
      and (btrim(search_text) = '' or strpos(lower(booking.client_name), lower(btrim(search_text))) > 0
        or strpos(lower(booking.service_name), lower(btrim(search_text))) > 0
        or strpos(booking.client_phone, btrim(search_text)) > 0
        or (length(regexp_replace(search_text, '[^0-9]', '', 'g')) > 0
          and strpos(booking.client_phone, regexp_replace(search_text, '[^0-9]', '', 'g')) > 0))
  ), page as (
    select * from filtered order by date desc, start_time desc, id limit 20 offset (selected_page - 1) * 20
  )
  select jsonb_build_object(
    'items', coalesce((select jsonb_agg(private.admin_booking(page) order by date desc, start_time desc, id) from page), '[]'::jsonb),
    'total', (select count(*) from filtered), 'page', selected_page, 'pageSize', 20,
    'timeZone', (select time_zone from public.booking_settings)
  ) into result;
  return result;
end;
$$;
create function public.get_admin_dashboard()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare local_now timestamp; studio_time_zone text;
begin
  perform private.require_studio_owner();
  select time_zone into strict studio_time_zone from public.booking_settings;
  local_now := statement_timestamp() at time zone studio_time_zone;
  return jsonb_build_object(
    'timeZone', studio_time_zone, 'today', local_now::date,
    'counts', (select jsonb_build_object(
      'pending', count(*) filter (where status = 'pending'), 'confirmed', count(*) filter (where status = 'confirmed'),
      'completed', count(*) filter (where status = 'completed'), 'total', count(*)
    ) from public.bookings),
    'newBookings', coalesce((select jsonb_agg(private.admin_booking(booking) order by created_at desc, id)
      from (select * from public.bookings where status = 'pending' order by created_at desc, id limit 5) booking), '[]'::jsonb),
    'upcomingBookings', coalesce((select jsonb_agg(private.admin_booking(booking) order by date, start_time, id)
      from (select * from public.bookings where status in ('pending', 'confirmed') and date + end_time > local_now
        order by date, start_time, id limit 5) booking), '[]'::jsonb)
  );
end;
$$;
create function public.change_booking_status(selected_booking_id uuid, expected_status text, next_status text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare booking public.bookings;
begin
  perform private.require_studio_owner();
  if expected_status is null or next_status is null
    or not ((expected_status = 'pending' and next_status in ('confirmed', 'cancelled'))
      or (expected_status = 'confirmed' and next_status in ('completed', 'cancelled'))) then
    raise sqlstate 'PT400' using message = 'INVALID_TRANSITION';
  end if;
  -- Проверка и изменение под одним замком: две вкладки не перезаписывают решение мастера.
  select * into booking from public.bookings where id = selected_booking_id for update;
  if not found then raise sqlstate 'PT404' using message = 'BOOKING_NOT_FOUND'; end if;
  if booking.status <> expected_status then raise sqlstate 'PT409' using message = 'STATUS_CONFLICT'; end if;
  update public.bookings set status = next_status where id = selected_booking_id returning * into booking;
  return private.admin_booking(booking);
end;
$$;
revoke all on function private.require_studio_owner(), private.admin_booking(public.bookings), private.guard_booking_status()
from public, anon, authenticated;
revoke all on function public.get_admin_bookings(integer, text, date, text), public.get_admin_dashboard(),
  public.change_booking_status(uuid, text, text) from public, anon, authenticated;
grant execute on function public.get_admin_bookings(integer, text, date, text), public.get_admin_dashboard(),
  public.change_booking_status(uuid, text, text) to authenticated;
