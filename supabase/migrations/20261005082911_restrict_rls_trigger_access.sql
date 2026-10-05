-- Облачный Supabase создаёт эту функцию при включении automatic RLS.
-- Она нужна event trigger, но не должна вызываться через публичный Data API.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke all on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$$;
