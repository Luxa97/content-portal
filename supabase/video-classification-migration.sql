-- Execute este arquivo para adicionar classificacao de responsavel e tipo de video.

alter table public.videos
add column if not exists responsible text default 'Lucas',
add column if not exists video_type text default 'Review';

alter table public.videos
alter column responsible set default 'Lucas',
alter column video_type set default 'Review';

update public.videos
set responsible = 'Lucas'
where responsible is null or responsible = '';

update public.videos
set video_type = 'Review'
where video_type is null or video_type = '';

alter table public.videos
alter column responsible set not null,
alter column video_type set not null;

alter table public.videos
drop constraint if exists videos_responsible_check;

alter table public.videos
drop constraint if exists videos_video_type_check;

alter table public.videos
add constraint videos_responsible_check
check (responsible in ('Lucas', 'Larissa'));

alter table public.videos
add constraint videos_video_type_check
check (video_type in ('Review', 'Oferta', 'Comparação', 'Rotina', 'Unboxing', 'Demonstração', 'Referência viral', 'Outro'));
