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
- `DeleteVideoButton.tsx`: exclusao com confirmacao no navegador.
- `DownloadVideoButton.tsx`: gera link temporario para baixar o video original.

### `lib/`

Contem configuracoes, constantes, tipos e auxiliares.

Arquivos principais:

- `lib/constants.ts`: nichos, plataformas, status, responsaveis e tipos de video.
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

## Fluxo De Videos

- Criacao: `/videos` usa `VideoForm` com `createVideo`.
- Listagem: `/videos` usa `VideoList`.
- Edicao: `/videos/[id]` usa `VideoForm` com `updateVideo`.
- Exclusao: `DeleteVideoButton` chama `deleteVideo`.
- Upload: `VideoForm` envia o arquivo original ao Supabase Storage e salva o caminho em `file_url`.
- Download: `DownloadVideoButton` cria uma URL assinada temporaria para baixar o arquivo original.
- Media Library: `/media` lista videos que possuem `file_url` e reaproveita o download seguro.
- Dados persistem na tabela `videos`.

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
