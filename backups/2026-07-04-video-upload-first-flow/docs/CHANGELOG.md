# Changelog

Historico relevante do Content Portal, organizado por data e versao.

## 2026-07-04 - v0.6.0 - Contas e historico de postagens

- Criada entidade `accounts` para contas reais por plataforma.
- Evoluida `video_publications` para representar onde cada video foi postado.
- Revisadas migrations para execucao mais segura no Supabase SQL Editor.
- `video_comments` agora e criado com seguranca quando ainda nao existir.
- Corrigido conflito entre `Em producao` e `Em produção` para compatibilidade com enum `video_status`.
- A migration de Projects agora cria `projects` antes de qualquer dependencia e evita usar valor recem-adicionado ao enum na mesma execucao.
- A interface usa termos simples como "Publicado em" e "Historico de postagens".
- Adicionados status, link, metricas e observacoes por postagem manual.
- Adicionados filtros por nicho, plataforma, conta, status, bloqueados, viralizados e nao publicados.
- Dashboard passou a mostrar contas, postagens, viralizados, bloqueados e pendentes.
- Criada migration `supabase/accounts-video-publications-migration.sql`.

## 2026-07-04 - v0.5.0 - Projects, comentarios e publicacoes

- Substituidos nichos fixos por Projects criados pelo usuario.
- Mantido o termo "Nicho" na interface para simplicidade.
- Criada migration `supabase/projects-video-workflow-migration.sql`.
- Adicionado gerenciamento de Nichos/Projects na pagina `/videos`.
- Videos agora podem ser vinculados e movidos para outro Project.
- Adicionados comentarios internos com historico por video.
- Adicionada secao "Publicado em" com data e hora por plataforma.
- Atualizados status de video para o novo fluxo operacional.

## 2026-07-04 - v0.4.1 - Upload/download de video mais confiavel

- Reforcada a validacao de caminhos privados antes de salvar arquivos no banco.
- A lista de videos passou a mostrar nome e tamanho do arquivo enviado quando disponiveis.
- O download agora informa quando esta gerando o link assinado e quando o download foi iniciado.
- A pagina `/media` passou a exibir mensagens de sucesso e erro do upload.
- Confirmado que o app continua usando bucket privado e URLs assinadas temporarias.

## 2026-07-02 - v0.4.0 - Documentacao profissional

- Reescrita completa da documentacao do projeto.
- Criado `docs/DATABASE.md`.
- Criado `docs/DECISIONS.md`.
- Definida a pasta `docs/` como memoria oficial do projeto.
- Registrado fluxo obrigatorio para tarefas futuras.
- Registradas regras de arquitetura, seguranca, migrations e backups.

## 2026-07-02 - v0.3.2 - Media Library inicial

- Criada pagina `/media` para listar arquivos originais vinculados aos videos.
- Adicionada Media Library ao menu privado.
- Protegida rota `/media` no middleware.
- Documentada arquitetura futura de Media Tools.
- Registrado que processamento pesado de video deve acontecer fora da Vercel.
- Melhorada validacao e documentacao de responsabilidades entre `/videos` e `/media`.
- Adicionados metadados de upload do arquivo original.
- Criada tabela `media_assets` para videos, fotos e arquivos enviados pela Media Library.
- Renomeado o componente de download para `DownloadFileButton`.

## 2026-07-02 - v0.3.1 - Upload e download de videos

- Adicionado upload de arquivo original de video no formulario de criacao e edicao.
- Adicionado download do video original por URL assinada temporaria.
- Criada migration `supabase/video-storage-migration.sql`.
- Documentada decisao de manter o bucket `videos` privado.
- Mantido `file_url` como caminho privado do arquivo no Supabase Storage.

## 2026-07-02 - v0.3.0 - Portal privado

- Adicionada lista de e-mails autorizados em `lib/allowed-users.ts`.
- Login passou a validar se o e-mail esta autorizado.
- Cadastro passou a validar se o e-mail esta autorizado.
- Bloqueado cadastro publico fora da allowlist.

## 2026-07-02 - v0.2.0 - Classificacao de videos

- Adicionado campo `responsible` para indicar Lucas ou Larissa.
- Adicionado campo `video_type` para classificar o tipo do video.
- Atualizado formulario de criacao e edicao de videos.
- Atualizada lista de videos para mostrar responsavel e tipo.
- Atualizado dashboard com contagem de videos por responsavel.
- Criada migration `supabase/video-classification-migration.sql`.
- Criado backup da funcionalidade em `backups/2026-07-02-video-classification`.

## 2026-07-02 - v0.1.0 - MVP funcional

- Criado projeto com Next.js, TypeScript, Tailwind CSS e Supabase.
- Configurado Supabase Auth.
- Criado dashboard privado.
- Criados nichos iniciais: Creatina e Cinta Modeladora.
- Criadas plataformas iniciais: TikTok, Instagram e Shopee.
- Criados status iniciais: Gravado, Editando, Pronto e Postado.
- Implementado CRUD de videos.
- Criadas paginas de hooks e referencias virais.
- Criado schema SQL inicial do Supabase.
- Criada migration do CRUD de videos.

## Historico De Preparacao

- Instalacao do Node.js no ambiente local.
- Configuracao do VS Code como ambiente principal.
- Configuracao do Git.
- Configuracao do GitHub como fonte oficial do codigo.
- Configuracao do Supabase como banco, auth e storage.
- Configuracao da Vercel como deploy oficial.
- Definicao do ChatGPT como apoio de arquitetura e produto.
- Definicao do Codex como implementador no repositorio.
