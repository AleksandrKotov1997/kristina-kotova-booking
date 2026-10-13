begin;
do $$
declare receipt jsonb; repeated jsonb; service public.services; booking_day date;
begin
  if exists(select 1 from public.services where is_active and (name_kk is null or description_kk is null)) then raise exception 'Active service translations are missing'; end if;
  if exists(select 1 from public.gallery_images where is_active and title_kk is null) then raise exception 'Active gallery translations are missing'; end if;
  select * into service from public.services where id = 'd883f62e-44a8-4380-b0d0-a2dd4ec45c67';
  booking_day := (now() at time zone 'Asia/Almaty')::date + 70;
  receipt := public.create_booking(service.id, booking_day, '10:00', 'Әлия Құнанбай', '+77000000000', 'f7100000-0000-4000-8000-000000000001');
  if receipt->>'serviceName' <> service.name or receipt->>'serviceNameKk' <> service.name_kk then raise exception 'Receipt translations are incorrect'; end if;
  update public.services set name_kk = 'Жаңартылған атау' where id = service.id;
  repeated := public.resolve_booking_request('f7100000-0000-4000-8000-000000000001');
  if repeated->>'serviceNameKk' <> receipt->>'serviceNameKk' then raise exception 'Historical translated snapshot changed'; end if;
  repeated := public.create_booking(service.id, booking_day, '10:00', 'Әлия Құнанбай', '+77000000000', 'f7100000-0000-4000-8000-000000000001');
  if repeated->>'id' <> receipt->>'id' then raise exception 'Language-independent idempotency failed'; end if;
  if has_function_privilege('anon', 'private.set_booking_kazakh_snapshot()', 'execute') then raise exception 'Snapshot trigger is publicly executable'; end if;
end;
$$;
set local role anon;
select name, name_kk, description_kk from public.services where id = 'd883f62e-44a8-4380-b0d0-a2dd4ec45c67';
select title, title_kk from public.gallery_images limit 1;
rollback;
