-- Execute este arquivo no SQL Editor do Supabase.
-- Objetivo: garantir que o upload minimo consiga criar uma linha em public.videos.
-- Nao apaga dados existentes.

alter table public.videos
add column if not exists title text,
add column if not exists original_filename text,
add column if not exists storage_path text,
add column if not exists file_size bigint,
add column if not exists mime_type text,
add column if not exists uploaded_at timestamptz,
add column if not exists project_id uuid,
add column if not exists platform text,
add column if not exists status text,
add column if not exists hook text,
add column if not exists product_url text,
add column if not exists notes text,
add column if not exists updated_at timestamptz not null default now();

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
alter column project_id drop not null,
alter column platform drop not null,
alter column status drop not null,
alter column hook drop not null,
alter column product_url drop not null,
alter column notes drop not null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'videos'
      and column_name = 'niche'
  ) then
    alter table public.videos alter column niche drop not null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'videos'
      and column_name = 'responsible'
  ) then
    alter table public.videos alter column responsible drop not null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'videos'
      and column_name = 'video_type'
  ) then
    alter table public.videos alter column video_type drop not null;
  end if;
end $$;

alter table public.videos enable row level security;

do $$
begin
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
      and policyname = 'Users can read own videos'
  ) then
    create policy "Users can read own videos"
    on public.videos for select
    using (auth.uid() = user_id);
  end if;
end $$;
