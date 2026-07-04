-- Adiciona metadados do arquivo original enviado ao Storage.

alter table public.videos
add column if not exists original_filename text,
add column if not exists file_size bigint,
add column if not exists mime_type text,
add column if not exists uploaded_at timestamptz;

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
