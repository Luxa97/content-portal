# Project Rules

Este documento define as regras oficiais de desenvolvimento do Content Portal.
A pasta `docs/` e a memoria principal do projeto. Nenhuma decisao importante
deve existir apenas em conversas.

## Filosofia Do Projeto

O Content Portal deve permanecer simples, privado e facil de manter. O foco do
MVP e ajudar Lucas e Larissa a organizar a producao de conteudo sem criar
complexidade desnecessaria.

Prioridades:

- Clareza antes de sofisticacao.
- Funcionalidade real antes de automacao.
- Codigo compreensivel para iniciantes.
- Documentacao sempre atualizada.
- Seguranca basica bem feita desde o inicio.

## Como Trabalhar Neste Repositorio

Antes de qualquer alteracao, leia este arquivo. Em seguida, leia os documentos
relacionados ao tema da tarefa.

Exemplos:

- Produto ou comportamento: `docs/PRODUCT.md`
- Banco de dados: `docs/DATABASE.md`
- Arquitetura e pastas: `docs/ESTRUTURA.md`
- Decisoes importantes: `docs/DECISIONS.md`
- Planejamento: `docs/ROADMAP.md`
- Historico: `docs/CHANGELOG.md`

## Fluxo Obrigatorio Para Toda Tarefa

Toda tarefa futura deve seguir este checklist:

1. Ler `docs/PROJECT_RULES.md`.
2. Ler documentos relacionados.
3. Planejar a alteracao.
4. Implementar.
5. Criar migration se necessario.
6. Atualizar documentacao.
7. Rodar `npm run build`.
8. Corrigir erros.
9. Criar backup quando a tarefa alterar funcionalidade relevante.
10. Fazer commit.
11. Informar arquivos criados e alterados.

## Git Workflow

O GitHub e a fonte oficial do codigo. O historico deve ser claro e util.

Regras:

- Fazer commits pequenos e objetivos.
- Usar mensagens no formato convencional quando possivel.
- Nao misturar documentacao, refatoracao e funcionalidade no mesmo commit sem
  necessidade.
- Nunca apagar trabalho existente sem confirmacao.
- Antes de finalizar, revisar arquivos alterados.

Mensagens recomendadas:

- `docs: update project documentation`
- `feat: add video classification`
- `fix: restrict unauthorized signup`
- `chore: update project structure`

## Atualizacao Obrigatoria Da Documentacao

Sempre que uma funcionalidade, regra ou decisao mudar, atualize a documentacao
correspondente.

Mapa de atualizacao:

- Nova funcionalidade: `docs/PRODUCT.md`
- Nova etapa planejada: `docs/ROADMAP.md`
- Mudanca estrutural: `docs/ESTRUTURA.md`
- Mudanca no banco: `docs/DATABASE.md`
- Alteracao relevante: `docs/CHANGELOG.md`
- Nova regra de desenvolvimento: `docs/PROJECT_RULES.md`
- Nova decisao arquitetural: `docs/DECISIONS.md`

## Convencoes De Codigo

- Usar Next.js App Router.
- Usar TypeScript.
- Usar Tailwind CSS para estilo.
- Manter componentes pequenos e legiveis.
- Evitar abstracoes prematuras.
- Preferir nomes simples e descritivos.
- Manter textos do sistema em portugues simples.
- Evitar funcionalidades avancadas sem necessidade clara.

## Estrutura De Pastas

- `app/`: rotas, layouts e paginas.
- `components/`: componentes reutilizaveis.
- `lib/`: configuracoes, constantes, tipos e clientes auxiliares.
- `supabase/`: schema e migrations.
- `docs/`: documentacao oficial do projeto.
- `backups/`: copias de seguranca manuais quando necessario.

## Componentes

Componentes devem ser reutilizaveis, pequenos e faceis de ler.

Regras:

- Componentes visuais ficam em `components/`.
- Componentes especificos de formulario devem receber dados via props.
- Evitar estado local quando Server Actions resolvem o fluxo de forma simples.
- Nao adicionar bibliotecas visuais sem necessidade.

## Server Actions

Server Actions devem ser usadas para operacoes simples de servidor, como:

- Criar video.
- Atualizar video.
- Excluir video.
- Login.
- Cadastro.
- Logout.

Regras:

- Validar dados essenciais antes de chamar o Supabase.
- Redirecionar com mensagens simples quando houver erro.
- Usar `revalidatePath` quando a lista exibida precisa ser atualizada.
- Manter cada action curta e compreensivel.

## Supabase

Supabase e usado para:

- Banco de dados Postgres.
- Autenticacao.
- Storage futuro de videos.

Regras:

- Nunca expor chaves privadas no frontend.
- Usar RLS para proteger dados por usuario.
- Manter migrations em `supabase/`.
- Documentar alteracoes de banco em `docs/DATABASE.md`.

## Migrations

Toda mudanca estrutural no banco deve ter migration.

Regras:

- Criar arquivos SQL em `supabase/`.
- Usar nomes claros, por exemplo `video-classification-migration.sql`.
- Migrations devem ser simples e reversiveis por entendimento humano.
- Atualizar `docs/DATABASE.md` quando uma migration for criada.

## Autenticacao

O portal e privado. Apenas e-mails autorizados podem acessar.

Regras:

- A lista de e-mails permitidos fica em `lib/allowed-users.ts`.
- Login e cadastro devem validar a allowlist antes de chamar o Supabase.
- Nao permitir cadastro publico.
- Nao alterar autenticacao sem atualizar `docs/DECISIONS.md` e
  `docs/PRODUCT.md`.

## Seguranca

Regras minimas:

- Usar Supabase Auth para sessao.
- Usar middleware para proteger rotas privadas.
- Usar RLS nas tabelas.
- Validar e-mails autorizados no servidor.
- Nao salvar segredos no repositorio.
- Nao tornar Storage publico sem decisao documentada.

## Backups

Criar backup manual quando a tarefa alterar funcionalidade relevante, banco ou
fluxo critico.

Padrao recomendado:

`backups/YYYY-MM-DD-descricao-curta/`

O backup deve conter os arquivos principais antes da alteracao.

## Checklist Antes De Finalizar

- `docs/PROJECT_RULES.md` foi lido.
- Documentos relacionados foram lidos.
- Alteracao foi implementada no escopo pedido.
- Documentacao foi atualizada.
- Migration foi criada se necessario.
- `npm run build` foi executado.
- Erros foram corrigidos.
- Backup foi criado quando necessario.
- Commit local foi criado quando solicitado.
- Arquivos criados e alterados foram informados.

## O Que Nunca Deve Ser Feito

- Nao alterar autenticacao sem pedido explicito.
- Nao alterar banco sem migration.
- Nao adicionar IA sem etapa planejada.
- Nao adicionar upload de video sem tarefa especifica.
- Nao expor dados privados publicamente.
- Nao apagar arquivos ou historico sem confirmacao.
- Nao criar complexidade sem ganho claro.
- Nao deixar decisao importante fora de `docs/`.
