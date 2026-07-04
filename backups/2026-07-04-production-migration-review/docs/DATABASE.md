# Database

Este documento descreve o banco de dados atual do Content Portal.

## Conceito Principal

Na interface, o usuario ve o termo "Nicho".

Na arquitetura interna, banco de dados, codigo e documentacao tecnica, o nome da
entidade e `Project`.

Exemplos:

- Project: Creatina
- Project: Cinta Modeladora
- Project: Ferramentas
- Project: Casa e Cozinha

## Provedor

O projeto usa Supabase para:

- Postgres.
- Auth.
- Storage.
- Row Level Security.

## Tabelas Atuais

### `public.projects`

Tabela tecnica dos Nichos exibidos na interface.

Campos:

- `id`: identificador unico.
- `user_id`: usuario dono do Project.
- `name`: nome exibido como Nicho.
- `color`: cor opcional.
- `icon`: icone opcional.
- `description`: descricao opcional.
- `created_at`: data de criacao.

### `public.accounts`

Conta real em uma plataforma.

Campos:

- `id`: identificador unico.
- `user_id`: usuario dono da conta.
- `project_id`: Project/Nicho opcional ligado a conta.
- `platform`: TikTok, Instagram, YouTube, Facebook, Shopee, Amazon ou Outro.
- `name`: nome interno da conta.
- `username`: usuario da conta.
- `status`: `ativa` ou `inativa`.
- `notes`: observacoes opcionais.
- `created_at`: data de criacao.
- `updated_at`: data da ultima atualizacao.

### `public.videos`

Tabela principal dos videos planejados ou produzidos.

Campos principais:

- `id`: identificador unico.
- `user_id`: usuario dono do video.
- `project_id`: Project/Nicho ao qual o video pertence.
- `title`: titulo do video.
- `niche`: espelho do nome do Project, mantido por compatibilidade.
- `platform`: plataforma principal.
- `status`: etapa atual do fluxo.
- `responsible`: responsavel.
- `video_type`: tipo de video.
- `hook`: frase inicial.
- `product_link`: link do produto.
- `notes`: observacoes.
- `file_url`: caminho privado legado do arquivo no Storage.
- `storage_path`: caminho privado principal do arquivo no Storage.
- `original_filename`: nome original do arquivo.
- `file_size`: tamanho em bytes.
- `mime_type`: tipo MIME.
- `uploaded_at`: data do upload.
- `created_at`: data de criacao.

Status atuais:

- Em producao
- Editando
- Pronto
- Agendado
- Publicado
- Bloqueado
- Reprovado
- Arquivado

### `public.video_comments`

Historico de comentarios internos por video.

Campos:

- `id`: identificador unico.
- `video_id`: video relacionado.
- `user_id`: usuario que criou o comentario.
- `user_email`: e-mail do usuario, se disponivel.
- `body`: texto do comentario.
- `created_at`: data e hora.

Comentarios antigos nao sao apagados automaticamente.

### `public.video_publications`

Registra onde o video foi publicado. Na interface, aparece como "Publicado em",
"Onde este video foi publicado" ou "Historico de postagens".

Campos:

- `id`: identificador unico.
- `video_id`: video relacionado.
- `user_id`: usuario dono do registro.
- `account_id`: conta onde o video foi publicado.
- `status`: status daquela postagem.
- `posted_at`: data e hora opcional da postagem.
- `post_url`: link opcional do post.
- `views`: visualizacoes opcionais.
- `likes`: curtidas opcionais.
- `comments_count`: comentarios opcionais.
- `shares`: compartilhamentos opcionais.
- `notes`: observacoes opcionais.
- `created_at`: data de criacao do registro.
- `updated_at`: data da ultima atualizacao.

Status de postagem:

- Nao postado
- Agendado
- Publicado
- Viralizou
- Bom engajamento
- Medio engajamento
- Baixo desempenho
- Bloqueado
- Removido
- Em analise
- Repostar
- Arquivado

### `public.video_statuses`

Tabela simples com status e ordem de exibicao. Ela documenta no banco os status
oficiais do fluxo.

### `public.media_assets`

Tabela da Media Library. Armazena videos, fotos e arquivos enviados diretamente
pela pagina `/media`.

## Relacionamentos

- `projects.user_id` referencia `auth.users.id`.
- `accounts.user_id` referencia `auth.users.id`.
- `accounts.project_id` referencia `projects.id`.
- `videos.user_id` referencia `auth.users.id`.
- `videos.project_id` referencia `projects.id`.
- `video_comments.video_id` referencia `videos.id`.
- `video_comments.user_id` referencia `auth.users.id`.
- `video_publications.video_id` referencia `videos.id`.
- `video_publications.user_id` referencia `auth.users.id`.
- `video_publications.account_id` referencia `accounts.id`.
- `media_assets.user_id` referencia `auth.users.id`.

## RLS

RLS esta habilitado em:

- `public.projects`
- `public.accounts`
- `public.videos`
- `public.video_comments`
- `public.video_publications`
- `public.media_assets`

Regras principais:

- Usuario so acessa seus proprios Projects.
- Usuario so acessa suas proprias contas.
- Usuario so acessa seus proprios videos.
- Usuario so acessa comentarios e publicacoes dos seus proprios videos.
- Usuario so acessa seus proprios assets da Media Library.

## Storage

O bucket `videos` permanece privado.

O app salva o arquivo original sem compressao, conversao ou reducao de qualidade.
O valor salvo em `videos.storage_path`, `videos.file_url` ou
`media_assets.storage_path` e o caminho privado dentro do bucket.

Downloads usam URLs assinadas temporarias para usuarios autenticados.

## Migrations

Arquivos atuais:

- `supabase/schema.sql`: schema base.
- `supabase/videos-crud-migration.sql`: CRUD inicial de videos.
- `supabase/video-classification-migration.sql`: responsavel e tipo de video.
- `supabase/video-storage-migration.sql`: bucket privado `videos`.
- `supabase/video-metadata-migration.sql`: metadados do arquivo original.
- `supabase/media-assets-migration.sql`: tabela `media_assets`.
- `supabase/projects-video-workflow-migration.sql`: Projects, vinculo video -> Project, novos status, comentarios e publicacoes.
- `supabase/accounts-video-publications-migration.sql`: contas reais e historico manual de postagens por conta.

## Modelo De Postagens

Video = arquivo/conteudo mestre.

Account = conta real em uma plataforma.

VideoPublication = registro tecnico de onde aquele video foi postado. Na
interface, este conceito aparece como "Publicado em".

Exemplo:

- TikTok @conta1: Viralizou.
- TikTok @conta2: Bloqueado.
- Instagram @conta3: Bom engajamento.

## Boas Praticas

- Toda mudanca de estrutura deve ter migration.
- Toda migration deve ser documentada aqui.
- Manter RLS ativo em tabelas com dados de usuarios.
- Nao expor chaves privadas.
- Nao tornar Storage publico sem decisao documentada.
