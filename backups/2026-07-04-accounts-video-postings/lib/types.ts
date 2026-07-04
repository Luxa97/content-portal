export type Project = {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
  icon: string | null;
  description: string | null;
  created_at: string;
};

export type Video = {
  id: string;
  user_id: string;
  project_id: string | null;
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
  projects?: Project | null;
  video_comments?: VideoComment[];
  video_publications?: VideoPublication[];
};

export type VideoComment = {
  id: string;
  video_id: string;
  user_id: string;
  body: string;
  created_at: string;
  user_email?: string | null;
};

export type VideoPublication = {
  id: string;
  video_id: string;
  user_id: string;
  platform: string;
  published_at: string;
  created_at: string;
};

export type MediaAsset = {
  id: string;
  user_id: string;
  title: string;
  asset_type: "video" | "image" | "file";
  storage_bucket: string;
  storage_path: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  created_at: string;
};
