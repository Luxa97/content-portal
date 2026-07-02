# Portal de Conteudo

MVP privado para organizar producao de videos para TikTok Shop, Instagram e Shopee.

## O que vem neste MVP

- Login com Supabase Auth.
- Dashboard privado.
- Nichos iniciais: Creatina e Cinta Modeladora.
- Upload de videos para Supabase Storage.
- Lista de videos com titulo, nicho, plataforma, status e data.
- Comentarios por video.
- Pagina de hooks.
- Pagina de referencias virais.

## Instalar

1. Entre na pasta do projeto:

```bash
cd content-portal
```

2. Instale as dependencias:

```bash
npm install
```

3. Crie o arquivo `.env.local` usando o exemplo:

```bash
cp .env.example .env.local
```

4. No Supabase, crie um projeto e copie:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. No editor SQL do Supabase, rode o arquivo:

```text
supabase/schema.sql
```

6. No Supabase Auth, habilite login por email e senha.

7. Rode o projeto:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Configuracao do Storage

O SQL cria um bucket chamado `videos`. Os arquivos ficam privados por padrao e sao enviados para uma pasta com o ID do usuario.

## Estrutura

```text
app/
  login/
  dashboard/
  videos/
  hooks/
  referencias/
components/
lib/
supabase/schema.sql
```

## Status dos videos

- gravado
- editando
- pronto
- postado
