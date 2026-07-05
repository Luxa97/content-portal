# Portal de Conteudo

Portal privado para organizar arquivos e producao de conteudo de Lucas e
Larissa.

## Funcionalidades Atuais

- Login com Supabase Auth.
- Cadastro restrito por allowlist de e-mails.
- Dashboard privado.
- Upload de videos originais em `/videos`.
- Download do arquivo original por URL assinada temporaria.
- Media Library em `/media` para videos, fotos e arquivos/documentos.
- Nichos na interface, usando `projects` na arquitetura.
- Contas por plataforma.
- Historico manual de postagens em "Publicado em".
- Comentarios internos por video.
- Paginas simples de hooks e referencias.

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

4. Configure as variaveis:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. No SQL Editor do Supabase, rode o schema/migrations necessarias em
`supabase/`.

6. No Supabase Auth, habilite login por email e senha.

7. Rode o projeto:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Storage

O bucket `videos` deve ser privado. O app salva o arquivo original sem
compressao, conversao ou reducao de qualidade. Downloads usam URLs assinadas
temporarias.

## Observacao Atual

O fluxo de upload de video esta instrumentado com logs temporarios
`[VIDEO_UPLOAD]` para diagnosticar o insert em `public.videos`.
