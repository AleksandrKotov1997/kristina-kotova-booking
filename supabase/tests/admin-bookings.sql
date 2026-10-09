-- Все пользователи, заявки и изменения роли откатываются.
begin;
delete from private.studio_owner;
insert into auth.users (id, email) values
  ('fa000000-0000-4000-8000-000000000001', 'master@admin-test.invalid'),
  ('fa000000-0000-4000-8000-000000000002', 'other@admin-test.invalid');
insert into private.studio_owner (user_id) values ('fa000000-0000-4000-8000-000000000001');
insert into public.services (id, category, name, description, price, duration_minutes)
values ('fa000000-0000-4000-8000-000000000003', 'lashes', 'SQLFixture услуга', 'Admin test', 2800, 60);
insert into public.bookings (id, request_id, service_id, service_name, service_price, client_name, client_phone, date, start_time, end_time)
select ('fa000000-0000-4000-8000-' || lpad((day + 10)::text, 12, '0'))::uuid, gen_random_uuid(),
  'fa000000-0000-4000-8000-000000000003', 'SQLFixture услуга', 2800, 'SQLFixture клиент', '+77002999999',
  date '2099-01-01' + day, time '10:00', time '11:00' from generate_series(0, 24) day;

update public.bookings set service_name = 'SQLFixture 2D / 3D' where id = 'fa000000-0000-4000-8000-000000000010';
select set_config('request.jwt.claim.sub', 'fa000000-0000-4000-8000-000000000001', true);
set local role authenticated;
do $$
declare response jsonb; page_two jsonb; dashboard jsonb;
begin
  response := public.get_admin_bookings(1, null, null, 'sqlfixture');
  page_two := public.get_admin_bookings(2, null, null, 'SQLFixture');
  if (response->>'total')::int <> 25 or jsonb_array_length(response->'items') <> 20
    or jsonb_array_length(page_two->'items') <> 5 then raise exception 'Пагинация неверна'; end if;
  if response->'items'->0->>'date' <> '2099-01-25' or page_two->'items'->4->>'date' <> '2099-01-01' then raise exception 'Порядок нестабилен'; end if;
  if jsonb_array_length(public.get_admin_bookings(3, null, null, 'SQLFixture')->'items') <> 0 then raise exception 'Пустая страница неверна'; end if;
  if (public.get_admin_bookings(1, 'pending', date '2099-01-01', '')->>'total')::int <> 1 then raise exception 'Фильтры неверны'; end if;
  if (public.get_admin_bookings(1, null, null, '+7 (700) 299-99-99')->>'total')::int < 25 then raise exception 'Поиск телефона неверен'; end if;
  if (public.get_admin_bookings(1, null, null, '2D')->>'total')::int <> 1 then raise exception 'Числа в названии услуги не должны искать телефоны'; end if;
  if (public.get_admin_bookings(1, null, null, '%_')->>'total')::int <> 0 then raise exception 'Поиск должен быть буквальным'; end if;
  if not (response->'items'->0 ? 'clientPhone') or response->'items'->0 ? 'requestId' then raise exception 'Приватный DTO неверен'; end if;
  dashboard := public.get_admin_dashboard();
  if dashboard->>'timeZone' <> 'Asia/Almaty' or dashboard->>'today' <> public.get_booking_calendar()->>'today'
    or (dashboard->'counts'->>'pending')::int < 25 then raise exception 'Обзор неверен'; end if;
  if jsonb_array_length(dashboard->'newBookings') <> 5 or jsonb_array_length(dashboard->'upcomingBookings') > 5 then raise exception 'Превью неверно'; end if;
  if exists (select from jsonb_array_elements(dashboard->'upcomingBookings') entry where entry->>'status' not in ('pending', 'confirmed')) then raise exception 'В превью попала обработанная запись'; end if;
  if has_table_privilege(current_user, 'public.bookings', 'SELECT, INSERT, UPDATE, DELETE') then raise exception 'Прямой доступ к заявкам запрещён'; end if;
  begin perform public.get_admin_bookings(0); raise exception 'Нулевая страница запрещена'; exception when sqlstate 'PT400' then null; end;
  begin perform public.get_admin_bookings(1, 'done'); raise exception 'Неизвестный статус запрещён'; exception when sqlstate 'PT400' then null; end;
  begin perform public.get_admin_bookings(1, null, null, repeat('x', 101)); raise exception 'Длинный поиск запрещён'; exception when sqlstate 'PT400' then null; end;
  response := public.change_booking_status('fa000000-0000-4000-8000-000000000010', 'pending', 'confirmed');
  if response->>'status' <> 'confirmed' then raise exception 'Подтверждение неверно'; end if;
  begin perform public.change_booking_status('fa000000-0000-4000-8000-000000000010', 'pending', 'cancelled'); raise exception 'Устаревшее действие запрещено'; exception when sqlstate 'PT409' then null; end;
  response := public.change_booking_status('fa000000-0000-4000-8000-000000000010', 'confirmed', 'completed');
  if response->>'status' <> 'completed' then raise exception 'Завершение неверно'; end if;
  begin perform public.change_booking_status('fa000000-0000-4000-8000-000000000010', 'completed', 'confirmed'); raise exception 'Обратный переход запрещён'; exception when sqlstate 'PT400' then null; end;
  begin perform public.change_booking_status('fa000000-0000-4000-8000-000000000011', 'pending', 'completed'); raise exception 'Пропустить подтверждение нельзя'; exception when sqlstate 'PT400' then null; end;
  perform public.change_booking_status('fa000000-0000-4000-8000-000000000011', 'pending', 'cancelled');
  perform public.change_booking_status('fa000000-0000-4000-8000-000000000012', 'pending', 'confirmed');
  perform public.change_booking_status('fa000000-0000-4000-8000-000000000012', 'confirmed', 'cancelled');
  begin perform public.change_booking_status('fa000000-0000-4000-8000-000000000099', 'pending', 'confirmed'); raise exception 'Нет записи'; exception when sqlstate 'PT404' then null; end;
end;
$$;
reset role;
do $$
begin
  if exists (select from private.booking_occupancy where booking_id in ('fa000000-0000-4000-8000-000000000011', 'fa000000-0000-4000-8000-000000000012')) then raise exception 'Отмена должна освобождать интервал'; end if;
  if not exists (select from private.booking_occupancy where booking_id = 'fa000000-0000-4000-8000-000000000010') then raise exception 'Завершение сохраняет историю занятости'; end if;
  begin update public.bookings set status = 'pending' where id = 'fa000000-0000-4000-8000-000000000011'; raise exception 'Триггер должен защищать конечный статус'; exception when sqlstate 'PT400' then null; end;
end;
$$;
select set_config('request.jwt.claim.sub', 'fa000000-0000-4000-8000-000000000002', true);
set local role authenticated;
do $$
begin
  begin perform public.get_admin_dashboard(); raise exception 'Чужой доступ запрещён'; exception when sqlstate 'PT403' then null; end;
  begin perform public.get_admin_bookings(); raise exception 'Чужие контакты закрыты'; exception when sqlstate 'PT403' then null; end;
  begin perform public.change_booking_status('fa000000-0000-4000-8000-000000000013', 'pending', 'confirmed'); raise exception 'Чужое изменение запрещено'; exception when sqlstate 'PT403' then null; end;
end;
$$;
reset role;
set local role anon;
do $$
begin
  if has_function_privilege(current_user, 'public.get_admin_dashboard()', 'EXECUTE')
    or has_function_privilege(current_user, 'public.get_admin_bookings(integer,text,date,text)', 'EXECUTE')
    or has_function_privilege(current_user, 'public.change_booking_status(uuid,text,text)', 'EXECUTE') then raise exception 'Публичные RPC закрыты'; end if;
end;
$$;
reset role;
select 'Обзор, фильтры, пагинация, статусы, конфликты, занятость и права проверены' as result;
rollback;
