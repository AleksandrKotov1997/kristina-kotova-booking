-- Changes stay inside this transaction; use an isolated database for tests.
begin;
insert into public.services (id, category, name, description, price, duration_minutes)
values ('f9100000-0000-4000-8000-000000000001', 'lashes', 'Проверка восстановления', 'SQL fixture', 10000, 30);
do $$
declare
  service_id uuid := 'f9100000-0000-4000-8000-000000000001';
  day date := (public.get_booking_calendar()->>'today')::date + 84;
  saved_request uuid := gen_random_uuid();
  closed_request uuid := gen_random_uuid();
  receipt jsonb;
  error_message text;
begin
  receipt := public.create_booking(service_id, day, '10:00', 'Тест Восстановление', '+77000000001', saved_request);
  if public.resolve_booking_request(saved_request) <> receipt then raise exception 'Saved receipt was not recovered'; end if;
  if public.resolve_booking_request(saved_request) ? 'clientName' or public.resolve_booking_request(saved_request) ? 'clientPhone' then raise exception 'Recovery exposes contacts'; end if;
  if public.create_booking(service_id, day, '10:00', 'Тест Восстановление', '+77000000001', saved_request) <> receipt then raise exception 'Retry must remain idempotent'; end if;
  if public.resolve_booking_request(closed_request) is not null then raise exception 'Missing request must resolve to null'; end if;
  if public.resolve_booking_request(closed_request) is not null then raise exception 'Repeated resolution must stay null'; end if;
  begin
    perform public.create_booking(service_id, day, '12:00', 'Тест Задержка', '+77000000002', closed_request);
    raise exception 'Closed request committed after recovery';
  exception when sqlstate 'PT409' then
    get stacked diagnostics error_message = message_text;
    if error_message <> 'REQUEST_CLOSED' then raise exception 'Wrong conflict: %', error_message; end if;
  end;
  if exists (select 1 from public.bookings where request_id = closed_request) then raise exception 'Closed request created a booking'; end if;
  if not (public.get_booking_availability(service_id, day)->'slots'->4->>'isAvailable')::boolean then raise exception 'Failed late request occupied time'; end if;
  update public.bookings set status = 'cancelled' where request_id = saved_request;
  if public.resolve_booking_request(saved_request)->>'status' <> 'cancelled' then raise exception 'Recovery must show the current status'; end if;
end;
$$;
set local role anon;
select public.resolve_booking_request(gen_random_uuid());
reset role;
do $$
begin
  if has_table_privilege('anon', 'private.closed_booking_requests', 'SELECT,INSERT,UPDATE,DELETE') then raise exception 'Anonymous table access must be denied'; end if;
end;
$$;
rollback;
