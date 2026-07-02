# Database

Este documento descreve o banco de dados atual do Content Portal.

## Provedor

O projeto usa Supabase, que fornece:

- Postgres.
- Auth.
- Storage.
- Row Level Security.

## Tabelas Atuais

### `public.videos`

Tabela principal do MVP. Armazena os videos planejados ou produzidos.

Campos:

- `id`: identificador unico do video.
- `user_id`: usuario dono do registro, ligado a `auth.users`.
- `title`: titulo do video.
- `niche`: nicho do conteudo.
- `platform`: plataforma principal.
- `status`: etapa atual da producao.
- `responsible`: responsavel pelo video.
- `video_type`: tipo de video.
- `hook`: frase inicial ou promessa do conteudo.
- `product_link`: link do produto.
- `notes`: observacoes livres.
- `file_url`: link opcional do arquivo.
- `storage_path`: caminho futuro do arquivo no Supabase Storage.
- `created_at`: data de criacao.

Valores atuais de `niche`:

- Creatina
- Cinta Modeladora

Valores atuais de `platform`:

- TikTok
- Instagram
- Shopee

Valores atuais de `status`:

- Gravado
- Editando
- Pronto
- Postado

Valores atuais de `responsible`:

- Lucas
- Larissa

Valores atuais de `video_type`:

- Review
- Oferta
- Comparação
- Rotina
- Unboxing
- Demonstração
- Referência viral
- Outro

### `public.video_comments`

Tabela criada no schema inicial para comentarios por video.

Campos:

- `id`: identificador unico do comentario.
- `video_id`: video relacionado.
- `user_id`: usuario que criou o comentario.
- `body`: texto do comentario.
- `created_at`: data de criacao.

Observacao: a interface atual de CRUD de videos nao usa comentarios como foco
principal, mas a tabela existe no schema.

## Relacionamentos

- `videos.user_id` referencia `auth.users.id`.
- `video_comments.video_id` referencia `videos.id`.
- `video_comments.user_id` referencia `auth.users.id`.

## RLS

RLS esta habilitado em:

- `public.videos`
- `public.video_comments`

Politicas atuais de `videos`:

- Usuario pode ler seus proprios videos.
- Usuario pode criar videos para si mesmo.
- Usuario pode atualizar seus proprios videos.
- Usuario pode excluir seus proprios videos.

Politicas atuais de `video_comments`:

- Usuario pode ler comentarios de seus proprios videos.
- Usuario pode criar comentarios em seus proprios videos.

## Storage

O schema cria um bucket privado chamado `videos`.

Politicas atuais:

- Usuario pode enviar arquivos para sua propria pasta.
- Usuario pode ler arquivos da sua propria pasta.
- Usuario pode excluir arquivos da sua propria pasta.

Upload real de videos ainda nao faz parte da etapa atual do produto.

## Migrations

Arquivos atuais:

- `supabase/schema.sql`: schema base.
- `supabase/videos-crud-migration.sql`: adiciona campos editoriais e ajusta valores do CRUD.
- `supabase/video-classification-migration.sql`: adiciona `responsible` e `video_type`.

## Boas Praticas

- Toda mudanca de estrutura deve ter migration.
- Toda migration deve ser documentada aqui.
- Nao alterar dados sensiveis diretamente sem backup.
- Manter RLS ativo em tabelas com dados de usuarios.
- Preferir campos simples enquanto o MVP estiver pequeno.

## Campos Planejados

Possiveis campos futuros em `videos`:

- `published_at`
- `scheduled_for`
- `performance_views`
- `performance_clicks`
- `performance_sales`
- `external_post_url`
- `storage_uploaded_at`

Esses campos ainda nao devem ser criados sem tarefa especifica.

## Regras De Seguranca Do Banco

- Dados devem ser isolados por usuario.
- Chaves privadas nao devem aparecer no frontend.
- Buckets devem permanecer privados ate decisao documentada.
- Toda abertura de permissao deve ser registrada em `docs/DECISIONS.md`.
