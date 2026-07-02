# Changelog

Historico relevante do Content Portal, organizado por data e versao.

## 2026-07-02 - v0.4.0 - Documentacao profissional

- Reescrita completa da documentacao do projeto.
- Criado `docs/DATABASE.md`.
- Criado `docs/DECISIONS.md`.
- Definida a pasta `docs/` como memoria oficial do projeto.
- Registrado fluxo obrigatorio para tarefas futuras.
- Registradas regras de arquitetura, seguranca, migrations e backups.

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
