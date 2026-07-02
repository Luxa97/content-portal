export type Video = {
  id: string;
  user_id: string;
  title: string;
  niche: string;
  platform: string;
  status: string;
  responsible: string | null;
  video_type: string | null;
  hook: string | null;
  product_link: string | null;
  notes: string | null;
  file_url: string | null;
  storage_path: string | null;
  original_filename: string | null;
  file_size: number | null;
  mime_type: string | null;
  uploaded_at: string | null;
  created_at: string;
};

export type VideoComment = {
  id: string;
  video_id: string;
  user_id: string;
  body: string;
  created_at: string;
};
