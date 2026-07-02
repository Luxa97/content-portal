-- Execute este arquivo se voce ja criou a tabela videos antes deste CRUD.

alter table public.videos
add column if not exists hook text,
add column if not exists product_link text,
add column if not exists notes text,
add column if not exists file_url text;

alter table public.videos
alter column status drop default;

alter table public.videos
alter column status type text using status::text;

update public.videos
set status = case lower(status)
  when 'gravado' then 'Gravado'
  when 'editando' then 'Editando'
  when 'pronto' then 'Pronto'
  when 'postado' then 'Postado'
  else status
end;

update public.videos
set platform = 'TikTok'
where platform = 'TikTok Shop';

alter table public.videos
drop constraint if exists videos_niche_check;

alter table public.videos
drop constraint if exists videos_platform_check;

alter table public.videos
drop constraint if exists videos_status_check;

alter table public.videos
add constraint videos_niche_check
check (niche in ('Creatina', 'Cinta Modeladora'));

alter table public.videos
add constraint videos_platform_check
check (platform in ('TikTok', 'Instagram', 'Shopee'));

alter table public.videos
add constraint videos_status_check
check (status in ('Gravado', 'Editando', 'Pronto', 'Postado'));

alter table public.videos
alter column status set default 'Gravado';
