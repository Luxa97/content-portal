-- Cria a tabela inicial da Media Library para videos, fotos e arquivos.

create table if not exists public.media_assets (
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

alter table public.media_assets enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'media_assets'
      and policyname = 'Users can read own media assets'
  ) then
    create policy "Users can read own media assets"
    on public.media_assets for select
    using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'media_assets'
      and policyname = 'Users can create own media assets'
  ) then
    create policy "Users can create own media assets"
    on public.media_assets for insert
    with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'media_assets'
      and policyname = 'Users can update own media assets'
  ) then
    create policy "Users can update own media assets"
    on public.media_assets for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'media_assets'
      and policyname = 'Users can delete own media assets'
  ) then
    create policy "Users can delete own media assets"
    on public.media_assets for delete
    using (auth.uid() = user_id);
  end if;
end $$;
