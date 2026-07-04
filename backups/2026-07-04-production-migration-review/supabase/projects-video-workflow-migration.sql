-- Evolui Nichos fixos para Projects criados pelo usuario.
-- A interface pode continuar usando o termo "Nicho", mas a entidade tecnica e `projects`.

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

alter table public.projects enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'Users can read own projects'
  ) then
    create policy "Users can read own projects"
    on public.projects for select
    using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'Users can create own projects'
  ) then
    create policy "Users can create own projects"
    on public.projects for insert
    with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'Users can update own projects'
  ) then
    create policy "Users can update own projects"
    on public.projects for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'Users can delete own projects'
  ) then
    create policy "Users can delete own projects"
    on public.projects for delete
    using (auth.uid() = user_id);
  end if;
end $$;

alter table public.videos
add column if not exists project_id uuid references public.projects(id) on delete restrict;

alter table public.videos
drop constraint if exists videos_niche_check;

alter table public.videos
drop constraint if exists videos_platform_check;

alter table public.videos
drop constraint if exists videos_status_check;

alter table public.videos
alter column status set default 'Em produção';

update public.videos
set status = case status
  when 'Gravado' then 'Em produção'
  when 'Postado' then 'Publicado'
  else status
end
where status in ('Gravado', 'Postado');

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

alter table public.video_comments
add column if not exists user_email text;

create table if not exists public.video_publications (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in (
    'TikTok',
    'Instagram',
    'Facebook',
    'YouTube',
    'Shopee',
    'Amazon',
    'Outro'
  )),
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (video_id, platform)
);

alter table public.video_publications enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'video_publications'
      and policyname = 'Users can read own video publications'
  ) then
    create policy "Users can read own video publications"
    on public.video_publications for select
    using (
      exists (
        select 1 from public.videos
        where videos.id = video_publications.video_id
          and videos.user_id = auth.uid()
      )
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'video_publications'
      and policyname = 'Users can create own video publications'
  ) then
    create policy "Users can create own video publications"
    on public.video_publications for insert
    with check (
      auth.uid() = user_id
      and exists (
        select 1 from public.videos
        where videos.id = video_publications.video_id
          and videos.user_id = auth.uid()
      )
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'video_publications'
      and policyname = 'Users can delete own video publications'
  ) then
    create policy "Users can delete own video publications"
    on public.video_publications for delete
    using (
      exists (
        select 1 from public.videos
        where videos.id = video_publications.video_id
          and videos.user_id = auth.uid()
      )
    );
  end if;
end $$;
