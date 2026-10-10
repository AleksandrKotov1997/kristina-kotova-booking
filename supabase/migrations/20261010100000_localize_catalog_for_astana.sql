-- Единая валюта студии — KZT. Разовый пересчёт согласованного прайса
-- по курсу НБРК на 10.10.2026: 1 исходная единица = 5.35 KZT.
-- Источник: https://nationalbank.kz/ru/exchangerates/ezhednevnye-oficialnye-rynochnye-kursy-valyut
-- Миграция применяется один раз через supabase_migrations.

update public.services set price = round(price * 5.35, 2);

-- Сохраняем эквивалент стоимости ранее созданных записей в той же валюте.
update public.bookings set service_price = round(service_price * 5.35, 2);

-- Обновляем только прежние стоковые URL, не затрагивая заменённые мастером фото.
update public.gallery_images as image
set title = replacement.title, image_url = replacement.image_url
from (values
  ('142e3502-882d-474c-93c4-24fd0714bbbb'::uuid, 'Наращивание ресниц', 'https://images.pexels.com/photos/5128234/pexels-photo-5128234.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/16554435/pexels-photo-16554435.jpeg?auto=compress&cs=tinysrgb&w=1200'),
  ('0b23e7d7-fd6c-42e3-bec6-1857fbfb4a04'::uuid, 'Выразительный взгляд', 'https://images.pexels.com/photos/20765765/pexels-photo-20765765.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/10698006/pexels-photo-10698006.jpeg?auto=compress&cs=tinysrgb&w=1200'),
  ('f8ca9185-05dc-4544-a6aa-785477423bf3'::uuid, 'Работа с каждой ресницей', 'https://images.pexels.com/photos/33723106/pexels-photo-33723106.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/33723106/pexels-photo-33723106.jpeg?auto=compress&cs=tinysrgb&w=1200'),
  ('66ebf708-0d9e-4cea-b280-fb9e75f5e975'::uuid, 'Натуральный изгиб', 'https://images.pexels.com/photos/7479982/pexels-photo-7479982.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/7479982/pexels-photo-7479982.jpeg?auto=compress&cs=tinysrgb&w=1200'),
  ('7262d108-ae02-4064-97ed-32ccac3cba4f'::uuid, 'Оформление бровей', 'https://images.pexels.com/photos/6135650/pexels-photo-6135650.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/6135650/pexels-photo-6135650.jpeg?auto=compress&cs=tinysrgb&w=1200'),
  ('455c7b6e-08fb-46af-a8e1-4cc14c03a92c'::uuid, 'Укладка бровей', 'https://images.pexels.com/photos/8558248/pexels-photo-8558248.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/8129900/pexels-photo-8129900.jpeg?auto=compress&cs=tinysrgb&w=1200'),
  ('5751e00c-fca8-4b54-9982-7a6430e368d6'::uuid, 'Ресницы и брови крупным планом', 'https://images.pexels.com/photos/32039798/pexels-photo-32039798.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/15353405/pexels-photo-15353405.jpeg?auto=compress&cs=tinysrgb&w=1200'),
  ('a98a0a28-d96c-43b3-80c2-4a9076b0d70b'::uuid, 'Коррекция формы бровей', 'https://images.pexels.com/photos/5128275/pexels-photo-5128275.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/5475901/pexels-photo-5475901.jpeg?auto=compress&cs=tinysrgb&w=1200')
) as replacement(id, title, image_url, previous_url)
where image.id = replacement.id and image.image_url = replacement.previous_url;
