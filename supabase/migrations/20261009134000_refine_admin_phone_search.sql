create or replace function public.get_admin_bookings(
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
        or (search_text ~ '^[+0-9[:space:]()-]+$'
          and length(regexp_replace(search_text, '[^0-9]', '', 'g')) > 0
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
