-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists "pgcrypto";

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  icon text,
  description text,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete restrict,
  title text not null,
  niche text not null,
  platform text not null check (platform in ('TikTok', 'Instagram', 'Facebook', 'YouTube', 'Shopee', 'Amazon', 'Outro')),
  status text not null default 'Em producao' check (status in ('Em producao', 'Editando', 'Pronto', 'Agendado', 'Publicado', 'Bloqueado', 'Reprovado', 'Arquivado')),
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

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  platform text not null check (platform in ('TikTok', 'Instagram', 'Facebook', 'YouTube', 'Shopee', 'Amazon', 'Outro')),
  name text not null,
  username text not null,
  status text not null default 'Ativa' check (status in ('Ativa', 'Inativa', 'Arquivada')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.video_comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  comment text not null default '',
  body text not null,
  created_at timestamptz not null default now()
);

create table public.video_publications (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  status text not null default 'Nao postado' check (status in ('Nao postado', 'Agendado', 'Publicado', 'Viralizou', 'Bom engajamento', 'Medio engajamento', 'Baixo desempenho', 'Bloqueado', 'Removido', 'Em analise', 'Repostar', 'Arquivado')),
  posted_at timestamptz,
  post_url text,
  views integer,
  likes integer,
  comments_count integer,
  shares integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (video_id, account_id)
);

create table public.video_statuses (
  name text primary key,
  sort_order integer not null
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

alter table public.projects enable row level security;
alter table public.accounts enable row level security;
alter table public.videos enable row level security;
alter table public.video_comments enable row level security;
alter table public.video_publications enable row level security;
alter table public.media_assets enable row level security;

create policy "Users can read own projects"
on public.projects for select
using (auth.uid() = user_id);

create policy "Users can create own projects"
on public.projects for insert
with check (auth.uid() = user_id);

create policy "Users can update own projects"
on public.projects for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own projects"
on public.projects for delete
using (auth.uid() = user_id);

create policy "Users can read own accounts"
on public.accounts for select
using (auth.uid() = user_id);

create policy "Users can create own accounts"
on public.accounts for insert
with check (auth.uid() = user_id);

create policy "Users can update own accounts"
on public.accounts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own accounts"
on public.accounts for delete
using (auth.uid() = user_id);

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

create policy "Users can update comments on own videos"
on public.video_comments for update
using (
  exists (
    select 1
    from public.videos
    where videos.id = video_comments.video_id
      and videos.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.videos
    where videos.id = video_comments.video_id
      and videos.user_id = auth.uid()
  )
);

create policy "Users can delete comments on own videos"
on public.video_comments for delete
using (
  exists (
    select 1
    from public.videos
    where videos.id = video_comments.video_id
      and videos.user_id = auth.uid()
  )
);

create policy "Users can read own video publications"
on public.video_publications for select
using (
  exists (
    select 1
    from public.videos
    where videos.id = video_publications.video_id
      and videos.user_id = auth.uid()
  )
);

create policy "Users can create own video publications"
on public.video_publications for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.videos
    where videos.id = video_publications.video_id
      and videos.user_id = auth.uid()
  )
);

create policy "Users can update own video publications"
on public.video_publications for update
using (
  exists (
    select 1
    from public.videos
    where videos.id = video_publications.video_id
      and videos.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.videos
    where videos.id = video_publications.video_id
      and videos.user_id = auth.uid()
  )
);

create policy "Users can delete own video publications"
on public.video_publications for delete
using (
  exists (
    select 1
    from public.videos
    where videos.id = video_publications.video_id
      and videos.user_id = auth.uid()
  )
);

insert into public.video_statuses (name, sort_order)
values
  ('Em producao', 1),
  ('Editando', 2),
  ('Pronto', 3),
  ('Agendado', 4),
  ('Publicado', 5),
  ('Bloqueado', 6),
  ('Reprovado', 7),
  ('Arquivado', 8);

create index accounts_user_id_idx on public.accounts(user_id);
create index accounts_project_id_idx on public.accounts(project_id);
create index accounts_platform_idx on public.accounts(platform);
create index accounts_status_idx on public.accounts(status);
create index video_publications_account_id_idx on public.video_publications(account_id);
create index video_publications_video_id_idx on public.video_publications(video_id);
create index video_publications_status_idx on public.video_publications(status);

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
