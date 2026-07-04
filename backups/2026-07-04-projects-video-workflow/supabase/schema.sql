-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists "pgcrypto";

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  niche text not null check (niche in ('Creatina', 'Cinta Modeladora')),
  platform text not null check (platform in ('TikTok', 'Instagram', 'Shopee')),
  status text not null default 'Gravado' check (status in ('Gravado', 'Editando', 'Pronto', 'Postado')),
  responsible text not null default 'Lucas' check (responsible in ('Lucas', 'Larissa')),
  video_type text not null default 'Review' check (video_type in ('Review', 'Oferta', 'Comparação', 'Rotina', 'Unboxing', 'Demonstração', 'Referência viral', 'Outro')),
  hook text,
  product_link text,
  notes text,
  file_url text,
  storage_path text,
  original_filename text,
  file_size bigint,
  mime_type text,
  uploaded_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.video_comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  asset_type text not null check (asset_type in ('video', 'image', 'file')),
  storage_bucket text not null default 'videos',
  storage_path text not null,
  original_filename text not null,
  file_size bigint not null,
  mime_type text not null,
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.videos enable row level security;
alter table public.video_comments enable row level security;
alter table public.media_assets enable row level security;

create policy "Users can read own videos"
on public.videos for select
using (auth.uid() = user_id);

create policy "Users can create own videos"
on public.videos for insert
with check (auth.uid() = user_id);

create policy "Users can update own videos"
on public.videos for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own videos"
on public.videos for delete
using (auth.uid() = user_id);

create policy "Users can read comments from own videos"
on public.video_comments for select
using (
  exists (
    select 1
    from public.videos
    where videos.id = video_comments.video_id
      and videos.user_id = auth.uid()
  )
);

create policy "Users can create comments on own videos"
on public.video_comments for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.videos
    where videos.id = video_comments.video_id
      and videos.user_id = auth.uid()
  )
);

create policy "Users can read own media assets"
on public.media_assets for select
using (auth.uid() = user_id);

create policy "Users can create own media assets"
on public.media_assets for insert
with check (auth.uid() = user_id);

create policy "Users can update own media assets"
on public.media_assets for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own media assets"
on public.media_assets for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('videos', 'videos', false)
on conflict (id) do nothing;

create policy "Users can upload own videos"
on storage.objects for insert
with check (
  bucket_id = 'videos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can read own videos from storage"
on storage.objects for select
using (
  bucket_id = 'videos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete own videos from storage"
on storage.objects for delete
using (
  bucket_id = 'videos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
