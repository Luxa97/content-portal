-- Configura o bucket privado para videos originais.
-- Os arquivos sao preservados no formato original pelo Supabase Storage.

insert into storage.buckets (id, name, public)
values ('videos', 'videos', false)
on conflict (id) do update
set public = false;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can upload own video files'
  ) then
    create policy "Authenticated users can upload own video files"
    on storage.objects for insert
    to authenticated
    with check (
      bucket_id = 'videos'
      and auth.uid()::text = (storage.foldername(name))[1]
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can read own video files'
  ) then
    create policy "Authenticated users can read own video files"
    on storage.objects for select
    to authenticated
    using (
      bucket_id = 'videos'
      and auth.uid()::text = (storage.foldername(name))[1]
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can delete own video files'
  ) then
    create policy "Authenticated users can delete own video files"
    on storage.objects for delete
    to authenticated
    using (
      bucket_id = 'videos'
      and auth.uid()::text = (storage.foldername(name))[1]
    );
  end if;
end $$;
