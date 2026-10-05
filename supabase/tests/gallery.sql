-- Проверка ограничений и публичного доступа; тестовые записи откатываются.
begin;

insert into public.gallery_images
  (id, title, image_url, category, is_active, updated_at)
values
  ('35dde44f-0e1d-4ee5-bba0-0ecf6bc4de02', 'Проверка активного фото', 'https://example.com/active.jpg', 'lashes', true, '2000-01-01'),
  ('7d187887-43fc-4f3a-911c-1b8493797424', 'Проверка скрытого фото', 'https://example.com/hidden.jpg', 'brows', false, '2000-01-01');

update public.gallery_images set title = 'Обновлённое фото'
where id = '35dde44f-0e1d-4ee5-bba0-0ecf6bc4de02';

do $$
begin
  if not exists (
    select 1 from public.gallery_images
    where id = '35dde44f-0e1d-4ee5-bba0-0ecf6bc4de02' and updated_at > '2000-01-01'
  ) then
    raise exception 'updated_at не обновляется';
  end if;

  begin
    update public.gallery_images set image_url = 'javascript:alert(1)'
    where id = '35dde44f-0e1d-4ee5-bba0-0ecf6bc4de02';
    raise exception 'Небезопасный URL должен быть запрещён';
  exception when check_violation then null;
  end;

  begin
    update public.gallery_images set category = 'other'
    where id = '35dde44f-0e1d-4ee5-bba0-0ecf6bc4de02';
    raise exception 'Неизвестная категория должна быть запрещена';
  exception when check_violation then null;
  end;

  begin
    update public.gallery_images set sort_order = -1
    where id = '35dde44f-0e1d-4ee5-bba0-0ecf6bc4de02';
    raise exception 'Отрицательный порядок должен быть запрещён';
  exception when check_violation then null;
  end;

  begin
    update public.gallery_images set title = ' '
    where id = '35dde44f-0e1d-4ee5-bba0-0ecf6bc4de02';
    raise exception 'Пустой заголовок должен быть запрещён';
  exception when check_violation then null;
  end;
end;
$$;

set local role anon;
do $$
begin
  if not exists (select 1 from public.gallery_images where id = '35dde44f-0e1d-4ee5-bba0-0ecf6bc4de02')
     or exists (select 1 from public.gallery_images where is_active = false) then
    raise exception 'RLS для посетителя работает неправильно';
  end if;
  if has_table_privilege(current_user, 'public.gallery_images', 'INSERT, UPDATE, DELETE')
     or has_function_privilege(current_user, 'public.set_gallery_image_updated_at()', 'EXECUTE') then
    raise exception 'Посетитель имеет права изменения галереи';
  end if;
end;
$$;

reset role;
set local role authenticated;
do $$
begin
  if not exists (select 1 from public.gallery_images where id = '35dde44f-0e1d-4ee5-bba0-0ecf6bc4de02')
     or exists (select 1 from public.gallery_images where is_active = false) then
    raise exception 'RLS для authenticated работает неправильно';
  end if;
  if has_table_privilege(current_user, 'public.gallery_images', 'INSERT, UPDATE, DELETE')
     or has_function_privilege(current_user, 'public.set_gallery_image_updated_at()', 'EXECUTE') then
    raise exception 'Пользователь authenticated имеет права изменения галереи';
  end if;
end;
$$;

reset role;
select 'Проверки галереи: ограничения, updated_at и RLS пройдены' as result;
rollback;
