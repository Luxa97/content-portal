# Decisions

Registro de decisoes importantes do Content Portal.

## ADR-001 - Portal privado

Data: 2026-07-02

Decisao: o Content Portal sera privado.

Motivo: o sistema contem informacoes operacionais, links, ideias e dados de
producao de conteudo de Lucas e Larissa.

## ADR-002 - E-mails autorizados

Data: 2026-07-02

Decisao: apenas e-mails autorizados podem acessar o portal.

E-mails atuais:

- `lucasassantos97@gmail.com`
- `larissaborgesbaselii@gmail.com`

Motivo: impedir cadastro publico e manter o MVP restrito.

## ADR-003 - Ambiente compartilhado por Lucas e Larissa

Data: 2026-07-02

Decisao: Lucas e Larissa usam o mesmo ambiente do portal.

Motivo: o MVP deve ser simples, com uma operacao centralizada.

## ADR-004 - GitHub como fonte oficial do codigo

Data: 2026-07-02

Decisao: GitHub e a fonte oficial do codigo.

Motivo: manter historico, permitir deploy e organizar evolucao do produto.

## ADR-005 - Vercel como deploy oficial

Data: 2026-07-02

Decisao: Vercel e o deploy oficial.

Motivo: integracao direta com Next.js e GitHub.

## ADR-006 - Supabase como backend principal

Data: 2026-07-02

Decisao: Supabase sera usado para banco, autenticacao e storage.

Motivo: entrega rapida do MVP com Postgres, Auth, Storage e RLS integrados.

## ADR-007 - ChatGPT como apoio de arquitetura

Data: 2026-07-02

Decisao: ChatGPT atua como arquiteto/CTO no desenho do produto e das decisoes.

Motivo: acelerar planejamento, documentacao e definicao de prioridades.

## ADR-008 - Codex como implementador

Data: 2026-07-02

Decisao: Codex atua como implementador no repositorio.

Motivo: transformar tarefas planejadas em alteracoes concretas no codigo.

## ADR-009 - VS Code como ambiente principal

Data: 2026-07-02

Decisao: VS Code e o ambiente principal de desenvolvimento.

Motivo: simplicidade, integracao com Git e fluxo conhecido pelo usuario.

## ADR-010 - `docs/` como memoria oficial

Data: 2026-07-02

Decisao: a pasta `docs/` e a memoria oficial do projeto.

Motivo: nenhuma decisao importante deve depender apenas de conversas. Toda
mudanca estrutural, funcional ou arquitetural deve ser registrada.

## ADR-011 - Arquivos originais em Storage privado

Data: 2026-07-02

Decisao: arquivos originais de videos, fotos e documentos serao armazenados no bucket privado
`videos` do Supabase Storage.

Motivo: preservar a qualidade original dos arquivos e manter acesso restrito a
usuarios autenticados.

Consequencias:

- O app nao comprime, converte ou modifica o arquivo enviado.
- `videos.file_url` e `media_assets.storage_path` armazenam caminhos privados no bucket.
- Metadados do arquivo original sao salvos no registro relacionado.
- Downloads usam URLs assinadas temporarias.
- O bucket nao deve ser publico sem nova decisao documentada.

## ADR-012 - Vercel nao processa videos pesados

Data: 2026-07-02

Decisao: a Vercel sera usada apenas para interface, rotas e operacoes leves.
Processamento pesado de video ficara para um servico separado no futuro.

Motivo: funcoes como compressao, conversao, extracao de audio, thumbnail,
corte e juncao de videos podem exigir FFmpeg, tempo de execucao maior e mais
recursos do que o ideal para a Vercel.

Consequencias:

- Upload e download original sao permitidos no app.
- O arquivo original nao e alterado.
- Media Tools ficam documentados como arquitetura futura.
- Nenhuma compressao ou conversao sera implementada nesta etapa.

## ADR-013 - Nicho na interface, Project na arquitetura

Data: 2026-07-04

Decisao: a interface pode usar o termo "Nicho", mas a arquitetura interna deve
usar `Project`.

Motivo: Lucas e Larissa pensam operacionalmente em nichos, mas o sistema precisa
ser flexivel para organizar qualquer frente de conteudo, como Creatina,
Cinta Modeladora, Ferramentas ou Casa e Cozinha.

Consequencias:

- Projects sao criados pelo usuario.
- Nichos fixos deixam de ser a fonte principal do sistema.
- Videos pertencem a um Project.
- O campo antigo `videos.niche` fica apenas como compatibilidade e espelho do
  nome atual do Project.
