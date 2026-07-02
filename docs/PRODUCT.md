# Product

## Objetivo

O Content Portal e um portal privado para organizar a producao de conteudo de
Lucas e Larissa para canais de social commerce.

O sistema centraliza ideias, videos, classificacoes, hooks, links e status para
reduzir perda de informacao e facilitar a rotina de publicacao.

## Visao Do Produto

O produto deve evoluir de um MVP simples para um SaaS interno de gestao de
conteudo, com foco em velocidade operacional, clareza e aprendizado continuo.

O portal deve ajudar a responder rapidamente:

- O que ja foi gravado?
- O que esta em edicao?
- O que esta pronto para postar?
- Quem e responsavel por cada video?
- Qual tipo de conteudo esta sendo produzido?
- Quais hooks e referencias podem ser reutilizados?

## Problema Que Resolve

Sem um sistema central, a producao de conteudo tende a ficar espalhada entre
conversas, notas, arquivos e links. Isso dificulta acompanhar status, priorizar
videos e aprender com referencias virais.

O Content Portal resolve isso criando uma fonte unica de organizacao.

## Usuarios

Usuarios atuais:

- Lucas
- Larissa

O acesso e privado e limitado por e-mails autorizados.

## Nichos Iniciais

- Creatina
- Cinta Modeladora

## Plataformas

- TikTok
- Instagram
- Shopee

## Funcionalidades Atuais

- Login com Supabase Auth.
- Cadastro restrito por e-mails autorizados.
- Dashboard privado.
- CRUD de videos.
- Classificacao por nicho.
- Classificacao por plataforma.
- Classificacao por status.
- Classificacao por responsavel.
- Classificacao por tipo de video.
- Campos editoriais para hook, link do produto, observacoes e link do arquivo.
- Upload do arquivo original de video sem compressao.
- Download do arquivo original por usuario autenticado.
- Pagina de hooks iniciais.
- Pagina de referencias virais iniciais.

## Status Dos Videos

- Gravado
- Editando
- Pronto
- Postado

## Tipos De Video

- Review
- Oferta
- Comparação
- Rotina
- Unboxing
- Demonstração
- Referência viral
- Outro

## Responsaveis

- Lucas
- Larissa

## Funcionalidades Planejadas

- Filtros na lista de videos.
- Busca por titulo, hook ou nicho.
- Biblioteca editavel de hooks.
- Biblioteca editavel de referencias virais.
- Calendario de publicacao.
- Analytics por plataforma, nicho e tipo de conteudo.
- Automacoes de lembrete.
- IA para sugestao de hooks e roteiros, em etapa futura.

## Tecnologias Utilizadas

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage planejado
- Vercel para deploy
- GitHub como fonte oficial do codigo

## Fluxo De Uso

1. Usuario autorizado acessa o portal.
2. Faz login com Supabase Auth.
3. Entra no dashboard privado.
4. Cadastra um novo video em `/videos`.
5. Define nicho, plataforma, status, responsavel e tipo.
6. Adiciona hook, link do produto, observacoes e link do arquivo.
7. Atualiza o status conforme a producao avanca.
8. Consulta dashboard e lista para acompanhar o pipeline.

## Modulos Futuros

- Modulo de calendario.
- Modulo de biblioteca de referencias.
- Modulo de biblioteca de produtos.
- Modulo de analytics.
- Modulo de IA para apoio criativo.
- Modulo de automacoes e lembretes.
