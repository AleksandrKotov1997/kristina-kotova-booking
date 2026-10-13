-- A recovery resolves the original request under the same lock as creation.
-- Closed requests cannot commit later, even if their HTTP request was delayed.
create table private.closed_booking_requests (
  request_id uuid primary key,
  closed_at timestamptz not null default now()
);
alter table private.closed_booking_requests enable row level security;
revoke all on private.closed_booking_requests from public, anon, authenticated;

create function private.check_booking_request_open()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.request_id::text, 0));
  if exists (select 1 from private.closed_booking_requests where request_id = new.request_id) then
    raise sqlstate 'PT409' using message = 'REQUEST_CLOSED';
  end if;
  return new;
end;
$$;
revoke all on function private.check_booking_request_open() from public, anon, authenticated;
create trigger bookings_check_request_open before insert on public.bookings
for each row execute function private.check_booking_request_open();

create function public.resolve_booking_request(request_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare existing_booking public.bookings;
begin
  if request_id is null then raise sqlstate 'PT400' using message = 'INVALID_BOOKING'; end if;
  perform pg_advisory_xact_lock(hashtextextended(request_id::text, 0));
  select * into existing_booking from public.bookings booking
    where booking.request_id = resolve_booking_request.request_id;
  if found then return private.booking_receipt(existing_booking); end if;
  insert into private.closed_booking_requests (request_id) values (resolve_booking_request.request_id)
    on conflict on constraint closed_booking_requests_pkey do nothing;
  return null;
end;
$$;
revoke all on function public.resolve_booking_request(uuid) from public, anon, authenticated;
grant execute on function public.resolve_booking_request(uuid) to anon, authenticated;
