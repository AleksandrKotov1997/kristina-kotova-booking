-- Изолированная проверка: все изменения расписания откатываются.
begin;

delete from public.working_hours;
insert into public.working_hours (day_of_week, start_time, end_time, is_working_day)
values (1, '18:00', '21:00', true), (2, null, null, false);

do $$
begin
  begin
    insert into public.working_hours (day_of_week, start_time, end_time)
    values (1, '10:00', '20:00');
    raise exception 'Один день недели не должен дублироваться';
  exception when unique_violation then null;
  end;

  begin
    update public.working_hours set day_of_week = 0 where day_of_week = 1;
    raise exception 'Номер дня вне 1..7 должен отклоняться';
  exception when check_violation then null;
  end;

  begin
    update public.working_hours set day_of_week = 8 where day_of_week = 1;
    raise exception 'Номер дня вне 1..7 должен отклоняться';
  exception when check_violation then null;
  end;

  begin
    update public.working_hours set end_time = '17:00' where day_of_week = 1;
    raise exception 'Обратный интервал должен отклоняться';
  exception when check_violation then null;
  end;

  begin
    update public.working_hours set end_time = '18:00' where day_of_week = 1;
    raise exception 'Нулевой интервал должен отклоняться';
  exception when check_violation then null;
  end;

  begin
    update public.working_hours set end_time = '24:00' where day_of_week = 1;
    raise exception 'Переход на следующий день не поддерживается';
  exception when check_violation then null;
  end;

  begin
    update public.working_hours set start_time = '18:00:01' where day_of_week = 1;
    raise exception 'Расписание должно иметь точность до минуты';
  exception when check_violation then null;
  end;

  begin
    update public.working_hours set start_time = null where day_of_week = 1;
    raise exception 'Рабочий день должен иметь полный интервал';
  exception when check_violation then null;
  end;

  begin
    update public.working_hours set start_time = '10:00', end_time = '20:00'
    where day_of_week = 2;
    raise exception 'Выходной не должен иметь рабочие часы';
  exception when check_violation then null;
  end;
end;
$$;

set local role anon;
do $$
begin
  if (select count(*) from public.working_hours) <> 2 then
    raise exception 'Посетитель должен читать рабочие дни и выходные';
  end if;
  if has_table_privilege(current_user, 'public.working_hours', 'INSERT, UPDATE, DELETE') then
    raise exception 'Посетитель не должен менять расписание';
  end if;
end;
$$;

reset role;
set local role authenticated;
do $$
begin
  if (select count(*) from public.working_hours) <> 2 then
    raise exception 'Authenticated должен иметь доступ на чтение расписания';
  end if;
  if has_table_privilege(current_user, 'public.working_hours', 'INSERT, UPDATE, DELETE') then
    raise exception 'Authenticated не должен менять расписание';
  end if;
end;
$$;

reset role;
select 'Ограничения и RLS расписания проверены' as result;
rollback;
