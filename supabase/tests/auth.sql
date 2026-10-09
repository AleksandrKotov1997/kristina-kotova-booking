-- Проверка ролей и ограничений; тестовые пользователи и права откатываются.
begin;
delete from private.studio_owner;
insert into auth.users (id, email)
values ('550e8400-e29b-41d4-a716-446655440000', 'owner@auth-test.invalid'),
       ('550e8400-e29b-41d4-a716-446655440001', 'other@auth-test.invalid');
insert into private.studio_owner (user_id)
values ('550e8400-e29b-41d4-a716-446655440000');

do $$
begin
  begin
    insert into private.studio_owner (user_id) values ('550e8400-e29b-41d4-a716-446655440001');
    raise exception 'Владелец должен быть единственным';
  exception when unique_violation then null;
  end;
  begin
    insert into private.studio_owner (singleton, user_id) values (false, '550e8400-e29b-41d4-a716-446655440001');
    raise exception 'Обойти ограничение единственного владельца нельзя';
  exception when check_violation then null;
  end;
end;
$$;

select set_config('request.jwt.claim.sub', '550e8400-e29b-41d4-a716-446655440000', true);
set local role authenticated;
do $$
begin
  if not public.is_studio_owner() then raise exception 'Владелец должен иметь доступ'; end if;
  begin
    perform 1 from private.studio_owner;
    raise exception 'Роли нельзя читать напрямую';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
select set_config('request.jwt.claim.sub', '550e8400-e29b-41d4-a716-446655440001', true);
set local role authenticated;
do $$
begin
  if public.is_studio_owner() then raise exception 'Чужая учётная запись не должна иметь доступ'; end if;
end;
$$;
reset role;
set local role anon;
do $$
begin
  if has_function_privilege(current_user, 'public.is_studio_owner()', 'EXECUTE') then
    raise exception 'Гость не должен выполнять проверку роли';
  end if;
  begin
    perform 1 from private.studio_owner;
    raise exception 'Гость не должен читать роли';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
do $$
begin
  if has_table_privilege('anon', 'private.studio_owner', 'INSERT, UPDATE, DELETE') or has_table_privilege('authenticated', 'private.studio_owner', 'INSERT, UPDATE, DELETE') then
    raise exception 'API не должно позволять назначать роли';
  end if;
end;
$$;

delete from auth.users where id = '550e8400-e29b-41d4-a716-446655440000';
do $$
begin
  if exists (select from private.studio_owner) then raise exception 'Удаление аккаунта должно отзывать роль'; end if;
end;
$$;
select 'Доступ мастера и ограничения ролей проверены' as result;
rollback;
