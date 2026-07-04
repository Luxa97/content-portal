-- Evolui Nichos fixos para Projects criados pelo usuario.
-- A interface pode continuar usando o termo "Nicho", mas a entidade tecnica e `projects`.
-- Esta migration e idempotente e segura para executar no Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  icon text,
  description text,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  niche text not null default 'Sem nicho',
  platform text not null default 'TikTok',
  status text not null default 'Em produção',
  responsible text,
  video_type text,
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

alter table public.projects enable row level security;
alter table public.videos enable row level security;

drop policy if exists "Users can read own projects" on public.projects;
create policy "Users can read own projects"
on public.projects for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own projects" on public.projects;
create policy "Users can create own projects"
on public.projects for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own projects" on public.projects;
create policy "Users can update own projects"
on public.projects for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own projects" on public.projects;
create policy "Users can delete own projects"
on public.projects for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read own videos" on public.videos;
create policy "Users can read own videos"
on public.videos for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own videos" on public.videos;
create policy "Users can create own videos"
on public.videos for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own videos" on public.videos;
create policy "Users can update own videos"
on public.videos for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own videos" on public.videos;
create policy "Users can delete own videos"
on public.videos for delete
using (auth.uid() = user_id);

alter table public.videos
add column if not exists project_id uuid references public.projects(id) on delete restrict,
add column if not exists storage_path text,
add column if not exists original_filename text,
add column if not exists file_size bigint,
add column if not exists mime_type text,
add column if not exists uploaded_at timestamptz;

alter table public.videos
drop constraint if exists videos_niche_check;

alter table public.videos
drop constraint if exists videos_platform_check;

alter table public.videos
drop constraint if exists videos_status_check;

do $$
begin
  if exists (
    select 1
    from pg_type
    where typname = 'video_status'
  ) then
    alter type public.video_status add value if not exists 'Em produção';
    alter type public.video_status add value if not exists 'Agendado';
    alter type public.video_status add value if not exists 'Publicado';
    alter type public.video_status add value if not exists 'Bloqueado';
    alter type public.video_status add value if not exists 'Reprovado';
    alter type public.video_status add value if not exists 'Arquivado';
  end if;
end $$;

alter table public.videos
alter column status set default 'Em produção';

update public.videos
set status = 'Em produção'
where status::text in ('Gravado', 'Em producao');

update public.videos
set status = 'Publicado'
where status::text = 'Postado';

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'videos'
      and column_name = 'status'
      and udt_name = 'video_status'
  ) then
    alter table public.videos
    add constraint videos_status_check
    check (status in (
      'Em produção',
      'Editando',
      'Pronto',
      'Agendado',
      'Publicado',
      'Bloqueado',
      'Reprovado',
      'Arquivado'
    ));
  end if;
end $$;

alter table public.videos
add constraint videos_platform_check
check (platform in (
  'TikTok',
  'Instagram',
  'Facebook',
  'YouTube',
  'Shopee',
  'Amazon',
  'Outro'
));

insert into public.projects (user_id, name)
select distinct user_id, niche
from public.videos
where project_id is null
  and niche is not null
  and niche <> ''
on conflict (user_id, name) do nothing;

update public.videos
set project_id = projects.id
from public.projects
where videos.project_id is null
  and projects.user_id = videos.user_id
  and projects.name = videos.niche;

create table if not exists public.video_statuses (
  name text primary key,
  sort_order integer not null
);

insert into public.video_statuses (name, sort_order)
values
  ('Em produção', 1),
  ('Editando', 2),
  ('Pronto', 3),
  ('Agendado', 4),
  ('Publicado', 5),
  ('Bloqueado', 6),
  ('Reprovado', 7),
  ('Arquivado', 8)
on conflict (name) do update
set sort_order = excluded.sort_order;

create table if not exists public.video_comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  comment text not null default '',
  body text not null default '',
  created_at timestamptz not null default now()
);

alter table public.video_comments
add column if not exists user_email text,
add column if not exists comment text not null default '',
add column if not exists body text not null default '';

update public.video_comments
set comment = body
where comment = ''
  and body <> '';

update public.video_comments
set body = comment
where body = ''
  and comment <> '';

alter table public.video_comments enable row level security;

drop policy if exists "Users can read comments from own videos" on public.video_comments;
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

drop policy if exists "Users can create comments on own videos" on public.video_comments;
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

drop policy if exists "Users can update comments on own videos" on public.video_comments;
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

drop policy if exists "Users can delete comments on own videos" on public.video_comments;
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
