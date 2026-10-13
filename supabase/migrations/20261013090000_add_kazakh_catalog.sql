-- Translations share the existing service/image IDs; prices and availability stay common.
alter table public.services add column name_kk text check (length(btrim(name_kk)) between 1 and 160), add column description_kk text check (length(btrim(description_kk)) between 1 and 2000);
alter table public.gallery_images add column title_kk text check (length(btrim(title_kk)) between 1 and 160);
update public.services service set name_kk = translation.name_kk, description_kk = translation.description_kk
from (values
  ('d883f62e-44a8-4380-b0d0-a2dd4ec45c67', 'Классикалық кірпік ұзарту', 'Әр табиғи кірпікке бір жасанды кірпік бекітіледі. Күнделікті көрініске сай табиғи әсер.'),
  ('54a82720-0915-4705-85fa-c83052db3b5a', '2D / 3D көлем', 'Бір кірпікке екі-үш талдан тұратын шоқ бекітіледі. Артық салмақсыз көлемді, мәнерлі жанар.'),
  ('4aec2b43-f615-4864-b8e1-e899471415e1', 'Голливудтық көлем', 'Ең жоғары көлем мен қалыңдық. Сәнді әрі нәзік кешкі көрініс.'),
  ('9c9b6691-59db-465b-a694-b79518b3c1c1', 'Кірпікті ламинациялау', 'Ұзартусыз кірпіктерге пішін, иілім және күтімді көрініс береді. Әсері 6 аптаға дейін сақталады.'),
  ('07f8e7e4-41bd-465b-bd5b-f11a9b0f7c65', 'Кірпікті түзету (3–4 аптадан кейін)', 'Түсіп қалған кірпіктерді толықтыру, пішін мен көлемді қалпына келтіру. Әр 3–4 апта сайын қажет.'),
  ('72f38d85-d7b0-47a6-b9a7-ea55e68ef697', 'Ұзартылған кірпікті шешу', 'Арнайы құраммен ұзартылған кірпіктерді қауіпсіз әрі ауыртпай шешу. Табиғи кірпіктерге зиян келтірмейді.'),
  ('e58c75ed-8fc5-4d06-9a5b-73a7ee8c8eaf', 'Қас архитектурасы', 'Бет анатомиясы мен клиенттің қалауын ескеріп, қасқа мінсіз пішін беру. Балауызбен және жіппен түзету.'),
  ('d349a74d-edfe-434a-9dca-185a9f3768b7', 'Қынамен бояу', 'Табиғи қынамен ұзақ сақталатын бояу. Қанық түс беріп, сирек жерлерді көзге қалың етіп көрсетеді.'),
  ('b24d3811-31f8-482f-9d85-cd010aedf502', 'Қасты ламинациялау', 'Қасты қалыпқа келтіру және ламинациялау. Таңертең артық күш жұмсамай, 4–6 апта бойы қалың әрі күтімді көрініс.'),
  ('b7980ecf-7bba-4bde-ad7c-44c19c7e1215', 'Қасты түзету', 'Қас пішінін сақтауға арналған түзету. Бұрын қалыпқа келтірілген пішінді сақтағысы келетіндерге сай.')) translation(id, name_kk, description_kk)
where service.id = translation.id::uuid and service.name_kk is null and service.description_kk is null;
update public.gallery_images image set title_kk = translation.title_kk
from (values
  ('142e3502-882d-474c-93c4-24fd0714bbbb', 'Кірпікті ұзарту'),
  ('0b23e7d7-fd6c-42e3-bec6-1857fbfb4a04', 'Мәнерлі жанар'),
  ('f8ca9185-05dc-4544-a6aa-785477423bf3', 'Әр кірпікпен жұмыс'),
  ('66ebf708-0d9e-4cea-b280-fb9e75f5e975', 'Табиғи иілім'),
  ('7262d108-ae02-4064-97ed-32ccac3cba4f', 'Қасты сәндеу'),
  ('455c7b6e-08fb-46af-a8e1-4cc14c03a92c', 'Қасты қалыпқа келтіру'),
  ('5751e00c-fca8-4b54-9982-7a6430e368d6', 'Кірпіктер мен қастар жақыннан'),
  ('a98a0a28-d96c-43b3-80c2-4a9076b0d70b', 'Қас пішінін түзету')) translation(id, title_kk)
where image.id = translation.id::uuid and image.title_kk is null;

-- Store the translated name at booking time so catalog edits do not rewrite receipts.
alter table public.bookings add column service_name_kk text check (length(btrim(service_name_kk)) between 1 and 160);
update public.bookings booking set service_name_kk = service.name_kk
from public.services service where booking.service_id = service.id and booking.service_name = service.name and booking.service_name_kk is null;
create function private.set_booking_kazakh_snapshot()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  select service.name_kk into new.service_name_kk from public.services service where service.id = new.service_id;
  return new;
end;
$$;
revoke all on function private.set_booking_kazakh_snapshot() from public, anon, authenticated;
create trigger bookings_set_kazakh_snapshot before insert on public.bookings for each row execute function private.set_booking_kazakh_snapshot();
create or replace function private.booking_receipt(booking public.bookings)
returns jsonb language sql immutable set search_path = '' as $$
  select jsonb_build_object(
    'id', booking.id, 'status', booking.status, 'date', booking.date,
    'startTime', to_char(booking.start_time, 'HH24:MI'), 'endTime', to_char(booking.end_time, 'HH24:MI'),
    'serviceName', booking.service_name, 'serviceNameKk', booking.service_name_kk, 'servicePrice', booking.service_price,
    'durationMinutes', extract(epoch from (booking.end_time - booking.start_time))::integer / 60
  );
$$;
revoke all on function private.booking_receipt(public.bookings) from public, anon, authenticated;
