# Estrutura

Este documento explica a organizacao do Content Portal e onde cada tipo de
alteracao deve ser feita.

## Visao Geral

O projeto usa Next.js App Router. As paginas ficam em `app/`, os componentes em
`components/`, regras auxiliares em `lib/`, scripts SQL em `supabase/` e a
documentacao oficial em `docs/`.

## Pastas Principais

### `app/`

Contem rotas, layouts e Server Components.

Arquivos principais:

- `app/layout.tsx`: layout raiz do projeto.
- `app/page.tsx`: redireciona para o dashboard.
- `app/globals.css`: estilos globais e Tailwind.
- `app/login/page.tsx`: tela de login e cadastro.
- `app/login/actions.ts`: Server Actions de login, cadastro e logout.
- `app/(private)/layout.tsx`: layout das paginas privadas.
- `app/(private)/dashboard/page.tsx`: dashboard privado.
- `app/(private)/videos/page.tsx`: pagina para criar e listar videos.
- `app/(private)/videos/[id]/page.tsx`: pagina para editar video.
- `app/(private)/videos/actions.ts`: Server Actions de videos.
- `app/(private)/media/page.tsx`: Media Library inicial com arquivos enviados.
- `app/(private)/hooks/page.tsx`: pagina de hooks.
- `app/(private)/referencias/page.tsx`: pagina de referencias virais.

### `components/`

Contem componentes reutilizaveis.

Arquivos principais:

- `AppShell.tsx`: estrutura visual das paginas privadas.
- `Button.tsx`: botao base.
- `PageHeader.tsx`: cabecalho padrao de pagina.
- `EmptyState.tsx`: estado vazio reutilizavel.
- `VideoForm.tsx`: formulario de criacao e edicao de videos.
- `VideoList.tsx`: lista de videos.
- `ProjectManager.tsx`: cria, edita e exclui Nichos/Projects.
- `AccountManager.tsx`: cria, edita, lista e inativa contas por plataforma.
- `VideoComments.tsx`: comentarios internos por video.
- `VideoPublications.tsx`: historico manual de onde o video foi publicado.
- `DeleteVideoButton.tsx`: exclusao com confirmacao no navegador.
- `DownloadFileButton.tsx`: gera link temporario para baixar o arquivo original.
- `MediaUploadForm.tsx`: formulario de upload da Media Library.

### `lib/`

Contem configuracoes, constantes, tipos e auxiliares.

Arquivos principais:

- `lib/constants.ts`: plataformas, status, responsaveis e tipos de video.
- `lib/types.ts`: tipos TypeScript compartilhados.
- `lib/allowed-users.ts`: lista de e-mails autorizados.
- `lib/supabase/server.ts`: cliente Supabase para servidor.
- `lib/supabase/browser.ts`: cliente Supabase para navegador.

### `supabase/`

Contem schema e migrations SQL.

Arquivos principais:

- `schema.sql`: schema base para novos ambientes.
- `videos-crud-migration.sql`: migration do CRUD de videos.
- `video-classification-migration.sql`: migration de responsavel e tipo de video.
- `video-storage-migration.sql`: migration do bucket privado de videos.
- `media-assets-migration.sql`: migration da tabela `media_assets`.
- `projects-video-workflow-migration.sql`: migration de Projects, comentarios, publicacoes e novos status.

Novas migrations devem ser criadas nesta pasta e documentadas em
`docs/DATABASE.md`.

### `docs/`

Fonte oficial de conhecimento do projeto.

Arquivos principais:

- `PROJECT_RULES.md`: regras de desenvolvimento.
- `PRODUCT.md`: visao de produto.
- `ROADMAP.md`: fases e proximos passos.
- `ESTRUTURA.md`: arquitetura de pastas e fluxo tecnico.
- `DATABASE.md`: banco, tabelas, RLS e migrations.
- `DECISIONS.md`: decisoes arquiteturais.
- `CHANGELOG.md`: historico de alteracoes.

### `backups/`

Guarda backups manuais criados antes de alteracoes relevantes.

Padrao recomendado:

`backups/YYYY-MM-DD-descricao-curta/`

## Fluxo Tecnico

1. Usuario acessa o portal.
2. Middleware verifica se a rota e privada.
3. Supabase Auth valida a sessao.
4. Paginas privadas carregam dados via cliente Supabase no servidor.
5. Formularios chamam Server Actions.
6. Server Actions validam dados e chamam Supabase.
7. A pagina e revalidada ou o usuario e redirecionado.

## Fluxo De Autenticacao

- Login e cadastro ficam em `app/login/actions.ts`.
- A lista de usuarios autorizados fica em `lib/allowed-users.ts`.
- O middleware protege `/dashboard`, `/videos`, `/hooks` e `/referencias`.
- Supabase Auth gerencia a sessao.

## Fluxo De Videos E Media

- Videos: `/videos` e responsavel pelos registros de conteudo.
- Nichos na interface sao Projects no banco e no codigo.
- Media Library: `/media` e responsavel por videos, fotos e arquivos originais.
- Projects: `/videos` mostra `ProjectManager` para criar, editar e excluir Nichos.
- Contas: `/videos` mostra `AccountManager` para gerenciar contas reais.
- Criacao de registro: `/videos` usa `VideoForm` com `createVideo`.
- Listagem de registros: `/videos` usa `VideoList`.
- Edicao: `/videos/[id]` usa `VideoForm` com `updateVideo`.
- Comentarios: `/videos/[id]` usa `VideoComments`.
- Publicado em: `/videos/[id]` usa `VideoPublications` para registrar conta, status, link, metricas e observacoes.
- Exclusao: `DeleteVideoButton` chama `deleteVideo`.
- Upload: `VideoForm` envia o arquivo original ao Supabase Storage e salva o caminho privado em `storage_path` e `file_url`.
- Download: `DownloadFileButton` cria uma URL assinada temporaria para baixar o arquivo original.
- Media Library: `/media` salva arquivos em `media_assets` e reaproveita o download seguro.
- Dados persistem na tabela `videos`.

## Fluxo De Projects

1. Usuario acessa `/videos`.
2. Clica em "Novo Nicho".
3. O modal cria um registro em `projects`.
4. A tela e atualizada com `router.refresh`, sem recarregar a pagina inteira.
5. Ao criar ou editar video, o usuario seleciona um Nicho.
6. Internamente, o video salva `project_id` e mantem `niche` como espelho de compatibilidade.
7. Um Project so pode ser excluido quando nao houver videos vinculados.

## Fluxo De Comentarios E Publicacoes

1. Usuario abre `/videos/[id]`.
2. Pode adicionar comentarios internos ao video.
3. Cada comentario guarda texto, data, hora e usuario quando disponivel.
4. Comentarios antigos continuam no historico.
5. Em "Publicado em", o usuario adiciona uma postagem manual.
6. Cada postagem seleciona uma conta real cadastrada.
7. Cada postagem pode ter status, data, link, metricas e observacoes.

## Fluxo De Upload E Download

Upload:

1. Usuario autenticado seleciona um arquivo em `VideoForm` ou `MediaUploadForm`.
2. O app valida extensao e tipo permitido.
3. O arquivo original e enviado ao bucket privado `videos`.
4. O caminho privado e salvo em `videos.file_url` e `videos.storage_path`.
5. Metadados sao salvos no registro: nome original, tamanho, MIME e data.
6. A interface mostra feedback de envio, erro ou sucesso.

Download:

1. Usuario autenticado clica em `Baixar video`.
2. `DownloadFileButton` pede uma URL assinada temporaria ao Supabase.
3. O navegador baixa o arquivo original usando a URL assinada.
4. O arquivo nao e comprimido, convertido ou modificado.
5. A interface informa quando o link esta sendo gerado e quando o download inicia.

Estado atual:

- `/videos`: upload e download de video original.
- `/media`: upload e download de videos, fotos e arquivos/documentos.
- Nenhum upload faz compressao, conversao ou thumbnail automatica.

## Media Tools Futuro

Ferramentas de midia planejadas devem ficar fora da Vercel quando envolverem
processamento pesado, como FFmpeg.

Funcoes planejadas:

- Compressao.
- Conversao.
- Extracao de audio.
- Thumbnail.
- Corte de video.
- Juncao de videos.

A Vercel deve cuidar da interface e orquestracao leve. O processamento pesado
deve ser feito em servico separado no futuro.

## Onde Criar Novos Modulos

- Nova pagina privada: `app/(private)/nome-do-modulo/page.tsx`
- Nova action do modulo: `app/(private)/nome-do-modulo/actions.ts`
- Novo componente reutilizavel: `components/NomeDoComponente.tsx`
- Nova constante compartilhada: `lib/constants.ts` ou novo arquivo em `lib/`
- Nova migration: `supabase/nome-da-migration.sql`
- Nova documentacao: `docs/NOME.md`

## Deploy

O deploy oficial e Vercel. O repositorio oficial e GitHub. Variaveis de ambiente
devem ser configuradas no ambiente local e na Vercel.
