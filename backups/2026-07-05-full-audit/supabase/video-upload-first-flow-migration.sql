-- Execute este arquivo no SQL Editor do Supabase.
-- Objetivo: permitir que videos sejam cadastrados primeiro como arquivo
-- original no Storage, deixando metadados editoriais opcionais.

create extension if not exists "pgcrypto";

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  storage_path text,
  original_filename text,
  file_size bigint,
  mime_type text,
  uploaded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.videos
add column if not exists project_id uuid,
add column if not exists title text,
add column if not exists niche text,
add column if not exists platform text,
add column if not exists status text,
add column if not exists responsible text,
add column if not exists video_type text,
add column if not exists hook text,
add column if not exists product_url text,
add column if not exists product_link text,
add column if not exists notes text,
add column if not exists storage_path text,
add column if not exists original_filename text,
add column if not exists file_size bigint,
add column if not exists mime_type text,
add column if not exists uploaded_at timestamptz,
add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'videos'
      and column_name = 'file_url'
  ) then
    update public.videos
    set storage_path = file_url
    where storage_path is null
      and file_url is not null
      and file_url <> ''
      and file_url not like 'http%';
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'videos'
      and column_name = 'product_link'
  ) then
    update public.videos
    set product_url = product_link
    where product_url is null
      and product_link is not null
      and product_link <> '';
  end if;
end $$;

alter table public.videos
alter column title drop not null,
alter column niche drop not null,
alter column platform drop not null,
alter column status drop not null,
alter column responsible drop not null,
alter column video_type drop not null,
alter column hook drop not null,
alter column product_url drop not null,
alter column notes drop not null;

alter table public.videos enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'videos'
      and policyname = 'Users can read own videos'
  ) then
    create policy "Users can read own videos"
    on public.videos for select
    using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'videos'
      and policyname = 'Users can create own videos'
  ) then
    create policy "Users can create own videos"
    on public.videos for insert
    with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'videos'
      and policyname = 'Users can update own videos'
  ) then
    create policy "Users can update own videos"
    on public.videos for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'videos'
      and policyname = 'Users can delete own videos'
  ) then
    create policy "Users can delete own videos"
    on public.videos for delete
    using (auth.uid() = user_id);
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('videos', 'videos', false)
on conflict (id) do update set public = false;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can upload own videos'
  ) then
    create policy "Users can upload own videos"
    on storage.objects for insert
    with check (
      bucket_id = 'videos'
      and auth.uid()::text = (storage.foldername(name))[1]
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can read own videos from storage'
  ) then
    create policy "Users can read own videos from storage"
    on storage.objects for select
    using (
      bucket_id = 'videos'
      and auth.uid()::text = (storage.foldername(name))[1]
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can delete own videos from storage'
  ) then
    create policy "Users can delete own videos from storage"
    on storage.objects for delete
    using (
      bucket_id = 'videos'
      and auth.uid()::text = (storage.foldername(name))[1]
    );
  end if;
end $$;
