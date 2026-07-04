# Roadmap

Status usados:

- Concluido
- Em andamento
- Planejado

## Infraestrutura

- Concluido: Criar projeto Next.js com TypeScript.
- Concluido: Configurar Tailwind CSS.
- Concluido: Configurar Supabase.
- Concluido: Configurar variaveis de ambiente.
- Concluido: Configurar Git e GitHub como fonte oficial do codigo.
- Concluido: Configurar Vercel como deploy oficial.
- Concluido: Criar documentacao profissional em `docs/`.

## MVP

- Concluido: Login com Supabase Auth.
- Concluido: Portal privado com rotas protegidas.
- Concluido: Cadastro restrito por e-mails autorizados.
- Concluido: Dashboard inicial.
- Concluido: Upload e organizacao de videos originais.
- Concluido: Classificacao por nicho.
- Concluido: Nichos dinamicos usando Projects.
- Concluido: Classificacao por plataforma.
- Concluido: Classificacao por status.
- Concluido: Classificacao por responsavel.
- Concluido: Classificacao por tipo de video.
- Concluido: Upload e download de video original sem compressao.
- Concluido: Media Library inicial em `/media`.
- Concluido: Upload e download de fotos e arquivos originais.
- Concluido: Comentarios internos por video.
- Concluido: Marcacao de plataformas publicadas por video.
- Concluido: Contas reais por plataforma.
- Concluido: Historico manual de postagens por conta.
- Concluido: Pagina de hooks.
- Concluido: Pagina de referencias virais.

## Organizacao De Conteudo

- Concluido: Campos editoriais opcionais para hook, link do produto e observacoes.
- Concluido: Upload real de video no Supabase Storage.
- Concluido: Listagem inicial de arquivos enviados.
- Em andamento: Melhorar documentacao e memoria do projeto.
- Concluido: Criar filtros na pagina de videos.
- Planejado: Criar busca por titulo, hook e nicho.
- Planejado: Criar biblioteca editavel de hooks.
- Planejado: Criar biblioteca editavel de referencias virais.
- Planejado: Criar calendario simples de publicacao.

## Media Tools

- Planejado: Compressao de video em servico separado.
- Planejado: Conversao de formato em servico separado.
- Planejado: Extracao de audio.
- Planejado: Geracao de thumbnail.
- Planejado: Corte de video.
- Planejado: Juntar videos.

Processamento pesado com FFmpeg nao deve rodar na Vercel nesta fase.

## IA

- Planejado: Gerar sugestoes de hooks.
- Planejado: Gerar ideias de roteiros.
- Planejado: Classificar referencias por padrao criativo.
- Planejado: Sugerir proximos videos com base no historico.

IA nao deve ser adicionada antes da base operacional estar estavel.

## Analytics

- Planejado: Medir quantidade de videos por status.
- Planejado: Medir quantidade de videos por responsavel.
- Planejado: Medir quantidade de videos por tipo.
- Planejado: Registrar data de postagem.
- Concluido: Registrar metricas manuais por postagem.
- Planejado: Criar dashboard de performance.

## Automacoes

- Planejado: Lembretes de videos parados em edicao.
- Planejado: Lembretes de conteudos prontos para postagem.
- Planejado: Fluxo de revisao antes de postar.
- Planejado: Integracoes externas futuras.

## Escalabilidade

- Planejado: Melhorar permissoes por perfil.
- Planejado: Criar organizacoes ou workspaces se houver mais usuarios.
- Planejado: Separar dados por equipe.
- Planejado: Criar auditoria de alteracoes importantes.
- Planejado: Preparar padrao de testes automatizados.
