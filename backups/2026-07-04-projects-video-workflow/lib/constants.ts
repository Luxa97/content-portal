export const niches = [
  "Creatina",
  "Cinta Modeladora"
] as const;

export const platforms = [
  "TikTok",
  "Instagram",
  "Shopee"
] as const;

export const statuses = [
  "Gravado",
  "Editando",
  "Pronto",
  "Postado"
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
