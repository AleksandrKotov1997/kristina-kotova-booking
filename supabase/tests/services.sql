-- Проверяем ограничения и доступ на облачной базе без сохранения тестовых записей.
begin;

insert into public.services
  (id, category, name, description, price, duration_minutes, is_active, updated_at)
values
  ('7ee19872-c9cb-4468-9eea-d8a1c3881481', 'lashes', 'Проверка активной услуги', 'Тест политики чтения', 100, 30, true, '2000-01-01'),
  ('a23e6874-e307-4a4f-af23-9f7979aa4c71', 'brows', 'Проверка скрытой услуги', 'Тест политики чтения', 100, 30, false, '2000-01-01');

update public.services set price = 150
where id = '7ee19872-c9cb-4468-9eea-d8a1c3881481';

do $$
begin
  if not exists (
    select 1 from public.services
    where id = '7ee19872-c9cb-4468-9eea-d8a1c3881481'
      and updated_at > '2000-01-01'::timestamptz
  ) then
    raise exception 'updated_at не обновляется при изменении услуги';
  end if;

  begin
    update public.services set price = -1
    where id = '7ee19872-c9cb-4468-9eea-d8a1c3881481';
    raise exception 'Отрицательная цена должна быть запрещена';
  exception when check_violation then
    null;
  end;

  begin
    update public.services set duration_minutes = 0
    where id = '7ee19872-c9cb-4468-9eea-d8a1c3881481';
    raise exception 'Нулевая длительность должна быть запрещена';
  exception when check_violation then
    null;
  end;
end;
$$;

set local role anon;

do $$
begin
  if not exists (
    select 1 from public.services
    where id = '7ee19872-c9cb-4468-9eea-d8a1c3881481'
  ) then
    raise exception 'Посетитель не видит активную услугу';
  end if;

  if exists (select 1 from public.services where is_active = false) then
    raise exception 'Посетителю видны неактивные услуги';
  end if;

  if has_table_privilege(current_user, 'public.services', 'INSERT, UPDATE, DELETE') then
    raise exception 'Посетитель может менять каталог';
  end if;
end;
$$;

reset role;
set local role authenticated;

do $$
begin
  if not exists (
    select 1 from public.services
    where id = '7ee19872-c9cb-4468-9eea-d8a1c3881481'
  ) or exists (select 1 from public.services where is_active = false) then
    raise exception 'Политика чтения authenticated работает неправильно';
  end if;

  if has_table_privilege(current_user, 'public.services', 'INSERT, UPDATE, DELETE') then
    raise exception 'Пользователь authenticated может менять каталог';
  end if;
end;
$$;

reset role;
select 'Проверки ограничений, updated_at и RLS пройдены' as result;
rollback;
