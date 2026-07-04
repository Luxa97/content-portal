export const platforms = [
  "TikTok",
  "Instagram",
  "Facebook",
  "YouTube",
  "Shopee",
  "Amazon",
  "Outro"
] as const;

export const accountStatuses = [
  "ativa",
  "inativa"
] as const;

export const publicationStatuses = [
  "Não postado",
  "Agendado",
  "Publicado",
  "Viralizou",
  "Bom engajamento",
  "Médio engajamento",
  "Baixo desempenho",
  "Bloqueado",
  "Removido",
  "Em análise",
  "Repostar",
  "Arquivado"
] as const;

export const statuses = [
  "Em produção",
  "Editando",
  "Pronto",
  "Agendado",
  "Publicado",
  "Bloqueado",
  "Reprovado",
  "Arquivado"
] as const;

export const responsibles = [
  "Lucas",
  "Larissa"
] as const;

export const videoTypes = [
  "Review",
  "Oferta",
  "Comparação",
  "Rotina",
  "Unboxing",
  "Demonstração",
  "Referência viral",
  "Outro"
] as const;

export type VideoStatus = (typeof statuses)[number];
export type VideoResponsible = (typeof responsibles)[number];
export type VideoType = (typeof videoTypes)[number];
export type PublicationPlatform = (typeof platforms)[number];
export type AccountStatus = (typeof accountStatuses)[number];
export type PublicationStatus = (typeof publicationStatuses)[number];
