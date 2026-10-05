create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) between 1 and 160),
  image_url text not null check (
    length(image_url) <= 2048 and image_url ~ '^https://[^[:space:]]+$'
  ),
  category text not null check (category in ('lashes', 'brows')),
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gallery_images_active_order_idx
  on public.gallery_images (sort_order, id) where is_active = true;

create function public.set_gallery_image_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_gallery_image_updated_at() from public, anon, authenticated;

create trigger gallery_images_set_updated_at
  before update on public.gallery_images
  for each row execute function public.set_gallery_image_updated_at();

alter table public.gallery_images enable row level security;
revoke all on public.gallery_images from public, anon, authenticated;
grant select on public.gallery_images to anon, authenticated;

create policy "Active gallery images are publicly readable"
  on public.gallery_images for select to anon, authenticated
  using (is_active = true);
