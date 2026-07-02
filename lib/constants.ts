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

export type VideoStatus = (typeof statuses)[number];
