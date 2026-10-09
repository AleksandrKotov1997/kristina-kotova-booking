-- Все фикстуры и изменения откатываются в конце проверки.
begin;
insert into public.services (id, category, name, description, price, duration_minutes)
values ('f9000000-0000-4000-8000-000000000001', 'lashes', 'Тестовая процедура', 'SQL fixture', 2800, 120);

do $$
declare
  service_id uuid := 'f9000000-0000-4000-8000-000000000001';
  day date := (public.get_booking_calendar()->>'today')::date + 1;
  receipt jsonb; repeated jsonb; slots jsonb;
  fixture_request_id uuid := 'f9000000-0000-4000-8000-000000000002';
begin
  if (public.get_booking_calendar()->>'timeZone') <> 'Asia/Almaty' then raise exception 'Неверный часовой пояс'; end if;
  if (public.get_booking_calendar()->>'lastDate')::date <> day + 88 then raise exception 'Неверный диапазон записи'; end if;
  slots := public.get_booking_availability(service_id, day)->'slots';
  if jsonb_array_length(slots) <> 17 or slots->0->>'startTime' <> '10:00'
    or slots->16->>'startTime' <> '18:00' or slots->16->>'endTime' <> '20:00' then
    raise exception 'Слоты должны учитывать шаг 30 минут и длительность 120 минут';
  end if;
  receipt := public.create_booking(service_id, day, '10:00', 'Тест SQL', '+77000000001', fixture_request_id);
  if receipt->>'status' <> 'pending' or receipt->>'endTime' <> '12:00' then raise exception 'Неверная заявка'; end if;
  if receipt ? 'clientName' or receipt ? 'clientPhone' then raise exception 'Публичный ответ содержит контакты'; end if;
  repeated := public.create_booking(service_id, day, '10:00', 'Тест SQL', '+7 (700) 000-00-01', fixture_request_id);
  if repeated <> receipt or (select count(*) from public.bookings where bookings.request_id = fixture_request_id) <> 1 then
    raise exception 'Повтор должен возвращать ту же заявку';
  end if;
  begin
    perform public.create_booking(service_id, day, '10:30', 'Другой тест', '+77000000002', gen_random_uuid());
    raise exception 'Пересечение pending должно отклоняться';
  exception when sqlstate 'PT409' then null; end;
  begin
    perform public.create_booking(service_id, day, '10:00', 'Другой тест', '+77000000002', fixture_request_id);
    raise exception 'fixture_request_id с другими данными должен отклоняться';
  exception when sqlstate 'PT409' then null; end;
  slots := public.get_booking_availability(service_id, day)->'slots';
  if (slots->0->>'isAvailable')::boolean or (slots->3->>'isAvailable')::boolean
    or not (slots->4->>'isAvailable')::boolean then raise exception 'Пересечения и смежные интервалы рассчитаны неверно'; end if;
  perform public.create_booking(service_id, day, '12:00', 'Смежный тест', '+77000000003', gen_random_uuid());
  begin
    insert into public.blocked_slots (date, start_time, end_time, reason) values (day, '11:00', '12:30', 'fixture');
    raise exception 'Блокировка поверх заявки должна отклоняться';
  exception when exclusion_violation then null; end;
  insert into public.blocked_slots (date, start_time, end_time, reason) values (day, '16:00', '17:00', 'fixture');
  begin
    perform public.create_booking(service_id, day, '15:00', 'Блокировка тест', '+77000000004', gen_random_uuid());
    raise exception 'Заявка поверх ручной блокировки должна отклоняться';
  exception when sqlstate 'PT409' then null; end;
  update public.bookings set status = 'cancelled' where id = (receipt->>'id')::uuid;
  if not (public.get_booking_availability(service_id, day)->'slots'->0->>'isAvailable')::boolean then
    raise exception 'Отмена должна освобождать время'; end if;
  begin
    perform public.create_booking(service_id, day, '19:00', 'Поздний тест', '+77000000005', gen_random_uuid());
    raise exception 'Процедура после закрытия должна отклоняться';
  exception when sqlstate 'PT409' then null; end;
  begin
    perform public.create_booking(service_id, day, '14:15', 'Вне сетки', '+77000000005', gen_random_uuid());
    raise exception 'Время вне сетки должно отклоняться';
  exception when sqlstate 'PT409' then null; end;
  begin
    perform public.get_booking_availability(service_id, day + 90);
    raise exception 'Дата за диапазоном должна отклоняться';
  exception when sqlstate 'PT400' then null; end;
  begin
    perform public.get_booking_availability(service_id, day - 2);
    raise exception 'Прошлая дата должна отклоняться';
  exception when sqlstate 'PT400' then null; end;
  begin
    perform public.create_booking(service_id, day, '14:00', 'А', '+77000000005', gen_random_uuid());
    raise exception 'Короткое имя должно отклоняться';
  exception when sqlstate 'PT400' then null; end;
  begin
    perform public.create_booking(service_id, day, '14:00', 'Телефон тест', '123', gen_random_uuid());
    raise exception 'Некорректный телефон должен отклоняться';
  exception when sqlstate 'PT400' then null; end;
  update public.working_hours set is_working_day = false, start_time = null, end_time = null
    where day_of_week = extract(isodow from day);
  if jsonb_array_length(public.get_booking_availability(service_id, day)->'slots') <> 0 then raise exception 'Выходной не должен иметь слотов'; end if;
  update public.working_hours set is_working_day = true, start_time = '10:00', end_time = '20:00'
    where day_of_week = extract(isodow from day);
  update public.services set is_active = false where id = service_id;
  begin
    perform public.get_booking_availability(service_id, day);
    raise exception 'Неактивная услуга должна отклоняться';
  exception when sqlstate 'PT404' then null; end;
  update public.services set is_active = true where id = service_id;
end;
$$;

set local role anon;
do $$
declare day date := (public.get_booking_calendar()->>'today')::date + 2; receipt jsonb;
begin
  if has_table_privilege(current_user, 'public.bookings', 'SELECT, INSERT, UPDATE, DELETE')
    or has_table_privilege(current_user, 'public.blocked_slots', 'SELECT, INSERT, UPDATE, DELETE') then
    raise exception 'Публичный посетитель не должен иметь доступ к таблицам заявок и блокировок'; end if;
  receipt := public.create_booking('f9000000-0000-4000-8000-000000000001', day, '10:00', 'Публичный тест', '+77000000006', gen_random_uuid());
  if receipt->>'status' <> 'pending' then raise exception 'Anon должен создавать заявку через RPC'; end if;
  if not public.get_booking_availability('f9000000-0000-4000-8000-000000000001', day) ? 'slots' then raise exception 'Anon должен видеть доступность'; end if;
end;
$$;
reset role;
set local role authenticated;
do $$
begin
  if has_table_privilege(current_user, 'public.bookings', 'SELECT, INSERT, UPDATE, DELETE') then
    raise exception 'Обычный authenticated не должен читать заявки'; end if;
end;
$$;
reset role;
select 'Расчёт слотов, создание, конфликты, повтор, блокировки и приватность проверены' as result;
rollback;
