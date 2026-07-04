-- Organiza postagens por contas reais de plataforma.
-- Na interface, video_publications aparece como "Publicado em".

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  platform text not null check (platform in (
    'TikTok',
    'Instagram',
    'Facebook',
    'YouTube',
    'Shopee',
    'Amazon',
    'Outro'
  )),
  name text not null,
  username text not null,
  status text not null default 'ativa' check (status in ('ativa', 'inativa')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.accounts enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'accounts'
      and policyname = 'Users can read own accounts'
  ) then
    create policy "Users can read own accounts"
    on public.accounts for select
    using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'accounts'
      and policyname = 'Users can create own accounts'
  ) then
    create policy "Users can create own accounts"
    on public.accounts for insert
    with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'accounts'
      and policyname = 'Users can update own accounts'
  ) then
    create policy "Users can update own accounts"
    on public.accounts for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
  end if;
end $$;

create index if not exists accounts_user_id_idx on public.accounts(user_id);
create index if not exists accounts_project_id_idx on public.accounts(project_id);
create index if not exists accounts_platform_idx on public.accounts(platform);
create index if not exists accounts_status_idx on public.accounts(status);

create table if not exists public.video_publications (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.video_publications enable row level security;

alter table public.video_publications
add column if not exists account_id uuid references public.accounts(id) on delete cascade,
add column if not exists status text not null default 'Publicado',
add column if not exists posted_at timestamptz,
add column if not exists post_url text,
add column if not exists views integer,
add column if not exists likes integer,
add column if not exists comments_count integer,
add column if not exists shares integer,
add column if not exists notes text,
add column if not exists updated_at timestamptz not null default now();

alter table public.video_publications
drop constraint if exists video_publications_platform_check;

alter table public.video_publications
drop constraint if exists video_publications_status_check;

alter table public.video_publications
add constraint video_publications_status_check
check (status in (
  'Não postado',
  'Agendado',
  'Publicado',
  'Viralizou',
  'Bom engajamento',
  'Médio engajamento',
  'Baixo desempenho',
  'Bloqueado',
  'Removido',
  'Em análise',
  'Repostar',
  'Arquivado'
));

-- Converte registros antigos que tinham apenas plataforma em contas manuais.
insert into public.accounts (user_id, platform, name, username, status)
select distinct
  video_publications.user_id,
  video_publications.platform,
  video_publications.platform || ' manual',
  lower(replace(video_publications.platform, ' ', '')),
  'ativa'
from public.video_publications
where video_publications.account_id is null
  and video_publications.platform is not null
on conflict do nothing;

update public.video_publications
set account_id = accounts.id,
    posted_at = coalesce(video_publications.posted_at, video_publications.published_at),
    status = coalesce(nullif(video_publications.status, ''), 'Publicado')
from public.accounts
where video_publications.account_id is null
  and accounts.user_id = video_publications.user_id
  and accounts.platform = video_publications.platform;

alter table public.video_publications
alter column account_id set not null;

alter table public.video_publications
drop constraint if exists video_publications_video_id_platform_key;

do $$
begin
  if not exists (
    select 1 from pg_constraint
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

drop policy if exists "Users can update own video publications" on public.video_publications;

create policy "Users can update own video publications"
on public.video_publications for update
using (
  exists (
    select 1 from public.videos
    where videos.id = video_publications.video_id
      and videos.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.videos
    where videos.id = video_publications.video_id
      and videos.user_id = auth.uid()
  )
);
