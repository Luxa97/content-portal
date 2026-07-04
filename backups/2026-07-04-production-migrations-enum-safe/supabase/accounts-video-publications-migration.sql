-- Organiza postagens por contas reais de plataforma.
-- Na interface, video_publications aparece como "Publicado em".
-- Execute depois de `projects-video-workflow-migration.sql`.

create extension if not exists "pgcrypto";

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  platform text not null,
  name text not null,
  username text not null,
  status text not null default 'Ativa',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.accounts
drop constraint if exists accounts_platform_check;

alter table public.accounts
add constraint accounts_platform_check
check (platform in (
  'TikTok',
  'Instagram',
  'Facebook',
  'YouTube',
  'Shopee',
  'Amazon',
  'Outro'
));

alter table public.accounts
drop constraint if exists accounts_status_check;

update public.accounts
set status = case status
  when 'ativa' then 'Ativa'
  when 'inativa' then 'Inativa'
  else status
end;

alter table public.accounts
add constraint accounts_status_check
check (status in ('Ativa', 'Inativa', 'Arquivada'));

alter table public.accounts enable row level security;

drop policy if exists "Users can read own accounts" on public.accounts;
create policy "Users can read own accounts"
on public.accounts for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own accounts" on public.accounts;
create policy "Users can create own accounts"
on public.accounts for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own accounts" on public.accounts;
create policy "Users can update own accounts"
on public.accounts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own accounts" on public.accounts;
create policy "Users can delete own accounts"
on public.accounts for delete
using (auth.uid() = user_id);

create index if not exists accounts_user_id_idx on public.accounts(user_id);
create index if not exists accounts_project_id_idx on public.accounts(project_id);
create index if not exists accounts_platform_idx on public.accounts(platform);
create index if not exists accounts_status_idx on public.accounts(status);

create table if not exists public.video_publications (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'Nao postado',
  published_at timestamptz,
  posted_at timestamptz,
  post_url text,
  views integer,
  likes integer,
  comments_count integer,
  shares integer,
  notes text,
  platform text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.video_publications
add column if not exists account_id uuid references public.accounts(id) on delete cascade,
add column if not exists user_id uuid references auth.users(id) on delete cascade,
add column if not exists status text not null default 'Nao postado',
add column if not exists published_at timestamptz,
add column if not exists posted_at timestamptz,
add column if not exists post_url text,
add column if not exists views integer,
add column if not exists likes integer,
add column if not exists comments_count integer,
add column if not exists shares integer,
add column if not exists notes text,
add column if not exists platform text,
add column if not exists updated_at timestamptz not null default now();

alter table public.video_publications
drop constraint if exists video_publications_platform_check;

alter table public.video_publications
drop constraint if exists video_publications_status_check;

update public.video_publications
set status = case status
  when 'Não postado' then 'Nao postado'
  when 'Médio engajamento' then 'Medio engajamento'
  when 'Em análise' then 'Em analise'
  else status
end;

alter table public.video_publications
add constraint video_publications_status_check
check (status in (
  'Nao postado',
  'Agendado',
  'Publicado',
  'Viralizou',
  'Bom engajamento',
  'Medio engajamento',
  'Baixo desempenho',
  'Bloqueado',
  'Removido',
  'Em analise',
  'Repostar',
  'Arquivado'
));

insert into public.accounts (user_id, platform, name, username, status)
select distinct
  video_publications.user_id,
  coalesce(video_publications.platform, 'Outro'),
  coalesce(video_publications.platform, 'Outro') || ' manual',
  lower(replace(coalesce(video_publications.platform, 'outro'), ' ', '')),
  'Ativa'
from public.video_publications
where video_publications.account_id is null
on conflict do nothing;

update public.video_publications
set account_id = accounts.id,
    posted_at = coalesce(video_publications.posted_at, video_publications.published_at),
    published_at = coalesce(video_publications.published_at, video_publications.posted_at),
    status = coalesce(nullif(video_publications.status, ''), 'Publicado')
from public.accounts
where video_publications.account_id is null
  and accounts.user_id = video_publications.user_id
  and accounts.platform = coalesce(video_publications.platform, 'Outro');

alter table public.video_publications
alter column account_id set not null;

alter table public.video_publications
drop constraint if exists video_publications_video_id_platform_key;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'video_publications_video_id_account_id_key'
  ) then
    alter table public.video_publications
    add constraint video_publications_video_id_account_id_key
    unique (video_id, account_id);
  end if;
end $$;

create index if not exists video_publications_account_id_idx on public.video_publications(account_id);
create index if not exists video_publications_video_id_idx on public.video_publications(video_id);
create index if not exists video_publications_status_idx on public.video_publications(status);

alter table public.video_publications enable row level security;

drop policy if exists "Users can read own video publications" on public.video_publications;
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

drop policy if exists "Users can create own video publications" on public.video_publications;
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

drop policy if exists "Users can update own video publications" on public.video_publications;
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

drop policy if exists "Users can delete own video publications" on public.video_publications;
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
