"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function isValidPrivateStoragePath(path: string, userId: string) {
  return !path || (!path.startsWith("http") && path.startsWith(`${userId}/`));
}

function optionalNumber(value: FormDataEntryValue | null) {
  const numberValue = Number(value ?? "");
  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : null;
}

type VideoMetadata = {
  id?: string;
  title?: string;
  project_id?: string;
  platform?: string;
  status?: string;
  responsible?: string;
  video_type?: string;
  hook?: string;
  product_url?: string;
  product_link?: string;
  notes?: string;
  storage_path?: string;
  original_filename?: string;
  file_size?: string;
  mime_type?: string;
  uploaded_at?: string;
};

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return { supabase, user };
}

async function getProjectName(projectId: string, userId: string) {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("name")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();

  return project?.name ?? "";
}

export async function createProject(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const { supabase, user } = await getUser();

  if (!user) {
    return { error: "Voce precisa estar logado." };
  }

  if (!name) {
    return { error: "Informe o nome do nicho." };
  }

  const { error } = await supabase.from("projects").insert({
    user_id: user.id,
    name,
    color: color || null,
    icon: icon || null,
    description: description || null
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/videos");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateProject(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const { supabase, user } = await getUser();

  if (!user || !id) {
    return { error: "Nicho nao encontrado." };
  }

  if (!name) {
    return { error: "Informe o nome do nicho." };
  }

  const { error } = await supabase
    .from("projects")
    .update({
      name,
      color: color || null,
      icon: icon || null,
      description: description || null
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  await supabase
    .from("videos")
    .update({ niche: name })
    .eq("project_id", id)
    .eq("user_id", user.id);

  revalidatePath("/videos");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteProject(id: string) {
  const { supabase, user } = await getUser();

  if (!user || !id) {
    return { error: "Nicho nao encontrado." };
  }

  const { count } = await supabase
    .from("videos")
    .select("id", { count: "exact", head: true })
    .eq("project_id", id)
    .eq("user_id", user.id);

  if ((count ?? 0) > 0) {
    return { error: "Nao e possivel excluir um nicho com videos vinculados." };
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/videos");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function createVideo(metadata: VideoMetadata) {
  console.log("[VIDEO_UPLOAD] action createVideo iniciada");

  const typedTitle = String(metadata.title ?? "").trim();
  const projectId = String(metadata.project_id ?? "");
  const platform = String(metadata.platform ?? "");
  const responsible = String(metadata.responsible ?? "");
  const videoType = String(metadata.video_type ?? "");
  const hook = String(metadata.hook ?? "");
  const productUrl = String(metadata.product_url ?? metadata.product_link ?? "");
  const notes = String(metadata.notes ?? "");
  const storagePath = String(metadata.storage_path ?? "");
  const originalFilename = String(metadata.original_filename ?? "");
  const fileSize = Number(metadata.file_size ?? 0);
  const mimeType = String(metadata.mime_type ?? "");
  const uploadedAt = String(metadata.uploaded_at ?? "");
  const { supabase, user } = await getUser();

  if (!user) {
    console.error("[VIDEO_UPLOAD] usuario nao autenticado na action");
    return { error: "Voce precisa estar logado para salvar o video." };
  }

  console.log("[VIDEO_UPLOAD] usuario autenticado", user.id);
  console.log("[VIDEO_UPLOAD] storagePath", storagePath);

  if (!storagePath) {
    return { error: "Escolha um arquivo de video para enviar." };
  }

  if (!isValidPrivateStoragePath(storagePath, user.id)) {
    return { error: "Arquivo privado invalido." };
  }

  const niche = projectId ? await getProjectName(projectId, user.id) : "";

  if (projectId && !niche) {
    return { error: "Selecione um nicho valido." };
  }

  const title = typedTitle || originalFilename || "Video sem titulo";
  console.log("[VIDEO_UPLOAD] preparando videoData");

  const videoData: Record<string, string | number | null> = {
    user_id: user.id,
    title,
    storage_path: storagePath,
    original_filename: originalFilename || title,
    file_size: fileSize > 0 ? fileSize : null,
    mime_type: mimeType || null,
    uploaded_at: uploadedAt || null
  };

  if (projectId) {
    videoData.project_id = projectId;
    videoData.niche = niche;
  }

  if (platform) {
    videoData.platform = platform;
  }

  const selectedStatus = String(metadata.status ?? "");

  if (selectedStatus) {
    videoData.status = selectedStatus;
  }

  if (responsible) {
    videoData.responsible = responsible;
  }

  if (videoType) {
    videoData.video_type = videoType;
  }

  if (hook) {
    videoData.hook = hook;
  }

  if (productUrl) {
    videoData.product_url = productUrl;
  }

  if (notes) {
    videoData.notes = notes;
  }

  console.log("[VIDEO_UPLOAD] dados para insert", videoData);

  try {
    console.log("[VIDEO_UPLOAD] insert iniciado");
    const insertResult = await supabase
      .from("videos")
      .insert(videoData)
      .select();

    console.log("[VIDEO_UPLOAD] insert concluido");
    console.log("[VIDEO_UPLOAD] resultado insert", insertResult);

    if (insertResult.error) {
      console.error("[VIDEO_UPLOAD] insert erro", insertResult.error);
      console.error("[VIDEO_UPLOAD] erro ao salvar video", insertResult.error);
      return {
        error: `Erro ao salvar registro: ${insertResult.error.message}`
      };
    }

    if (!insertResult.data?.length) {
      console.error("[VIDEO_UPLOAD] insert sem erro, mas sem linha retornada");
      return {
        error: "Erro ao salvar registro: o Supabase nao retornou a linha criada."
      };
    }
  } catch (error) {
    console.error("[VIDEO_UPLOAD] erro inesperado", error);
    return {
      error:
        error instanceof Error
          ? `Erro inesperado ao salvar registro: ${error.message}`
          : "Erro inesperado ao salvar registro."
    };
  }

  console.log("[VIDEO_UPLOAD] revalidate iniciado");
  revalidatePath("/videos");
  revalidatePath("/dashboard");
  console.log("[VIDEO_UPLOAD] revalidate concluido");
  console.log("[VIDEO_UPLOAD] retornando sucesso");
  return { success: "Video salvo com sucesso.", error: null };
}

export async function updateVideo(metadata: VideoMetadata) {
  const id = String(metadata.id ?? "");
  const typedTitle = String(metadata.title ?? "").trim();
  const projectId = String(metadata.project_id ?? "");
  const platform = String(metadata.platform ?? "");
  const responsible = String(metadata.responsible ?? "");
  const videoType = String(metadata.video_type ?? "");
  const hook = String(metadata.hook ?? "");
  const productLink = String(metadata.product_url ?? metadata.product_link ?? "");
  const notes = String(metadata.notes ?? "");
  const storagePath = String(metadata.storage_path ?? "");
  const originalFilename = String(metadata.original_filename ?? "");
  const fileSize = Number(metadata.file_size ?? 0);
  const mimeType = String(metadata.mime_type ?? "");
  const uploadedAt = String(metadata.uploaded_at ?? "");
  const { supabase, user } = await getUser();

  if (!user || !id) {
    return { error: "Video nao encontrado." };
  }

  if (!isValidPrivateStoragePath(storagePath, user.id)) {
    return { error: "Arquivo privado invalido." };
  }

  const niche = projectId ? await getProjectName(projectId, user.id) : "";

  if (projectId && !niche) {
    return { error: "Selecione um nicho valido." };
  }

  const title = typedTitle || originalFilename || "Video sem titulo";

  const { error } = await supabase
    .from("videos")
    .update({
      project_id: projectId || null,
      title,
      niche: niche || null,
      platform: platform || null,
      status: String(metadata.status ?? "") || null,
      responsible: responsible || null,
      video_type: videoType || null,
      hook: hook || null,
      product_url: productLink || null,
      notes: notes || null,
      storage_path: storagePath || null,
      original_filename: originalFilename || null,
      file_size: fileSize > 0 ? fileSize : null,
      mime_type: mimeType || null,
      uploaded_at: uploadedAt || null,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/videos");
  revalidatePath("/dashboard");
  return { success: "Detalhes do video atualizados.", error: null };
}

export async function deleteVideo(id: string) {
  const { supabase, user } = await getUser();

  if (!user || !id) {
    return;
  }

  const { error } = await supabase
    .from("videos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/videos");
  return { error: null };
}

export async function addVideoComment(formData: FormData) {
  const videoId = String(formData.get("video_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const { supabase, user } = await getUser();

  if (!user || !videoId || !body) {
    return { error: "Escreva um comentario." };
  }

  const { error } = await supabase.from("video_comments").insert({
    video_id: videoId,
    user_id: user.id,
    user_email: user.email ?? null,
    comment: body,
    body
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/videos/${videoId}`);
  revalidatePath("/videos");
  return { error: null };
}

export async function createAccount(formData: FormData) {
  const projectId = String(formData.get("project_id") ?? "");
  const platform = String(formData.get("platform") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const status = String(formData.get("status") ?? "Ativa");
  const notes = String(formData.get("notes") ?? "").trim();
  const { supabase, user } = await getUser();

  if (!user || !platform || !name || !username) {
    return { error: "Preencha plataforma, nome e usuario da conta." };
  }

  const { error } = await supabase.from("accounts").insert({
    user_id: user.id,
    project_id: projectId || null,
    platform,
    name,
    username,
    status,
    notes: notes || null,
    updated_at: new Date().toISOString()
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/videos");
  return { error: null };
}

export async function updateAccount(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const platform = String(formData.get("platform") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const status = String(formData.get("status") ?? "Ativa");
  const notes = String(formData.get("notes") ?? "").trim();
  const { supabase, user } = await getUser();

  if (!user || !id || !platform || !name || !username) {
    return { error: "Conta invalida." };
  }

  const { error } = await supabase
    .from("accounts")
    .update({
      project_id: projectId || null,
      platform,
      name,
      username,
      status,
      notes: notes || null,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/videos");
  return { error: null };
}

export async function archiveAccount(id: string) {
  const { supabase, user } = await getUser();

  if (!user || !id) {
    return { error: "Conta nao encontrada." };
  }

  const { error } = await supabase
    .from("accounts")
    .update({ status: "Inativa", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/videos");
  return { error: null };
}

export async function createVideoPublication(formData: FormData) {
  const videoId = String(formData.get("video_id") ?? "");
  const accountId = String(formData.get("account_id") ?? "");
  const status = String(formData.get("status") ?? "Nao postado");
  const postedAt = String(formData.get("posted_at") ?? "");
  const postUrl = String(formData.get("post_url") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const { supabase, user } = await getUser();

  if (!user || !videoId || !accountId) {
    return { error: "Selecione uma conta." };
  }

  const { error } = await supabase.from("video_publications").insert({
    video_id: videoId,
    account_id: accountId,
    user_id: user.id,
    status,
    posted_at: postedAt || null,
    post_url: postUrl || null,
    views: optionalNumber(formData.get("views")),
    likes: optionalNumber(formData.get("likes")),
    comments_count: optionalNumber(formData.get("comments_count")),
    shares: optionalNumber(formData.get("shares")),
    notes: notes || null,
    updated_at: new Date().toISOString()
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/videos/${videoId}`);
  revalidatePath("/videos");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateVideoPublication(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const videoId = String(formData.get("video_id") ?? "");
  const accountId = String(formData.get("account_id") ?? "");
  const status = String(formData.get("status") ?? "Nao postado");
  const postedAt = String(formData.get("posted_at") ?? "");
  const postUrl = String(formData.get("post_url") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const { supabase, user } = await getUser();

  if (!user || !id || !videoId || !accountId) {
    return { error: "Registro invalido." };
  }

  const { error } = await supabase
    .from("video_publications")
    .update({
      account_id: accountId,
      status,
      posted_at: postedAt || null,
      post_url: postUrl || null,
      views: optionalNumber(formData.get("views")),
      likes: optionalNumber(formData.get("likes")),
      comments_count: optionalNumber(formData.get("comments_count")),
      shares: optionalNumber(formData.get("shares")),
      notes: notes || null,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("video_id", videoId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/videos/${videoId}`);
  revalidatePath("/videos");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteVideoPublication(id: string, videoId: string) {
  const { supabase, user } = await getUser();

  if (!user || !id || !videoId) {
    return { error: "Registro nao encontrado." };
  }

  const { error } = await supabase
    .from("video_publications")
    .delete()
    .eq("id", id)
    .eq("video_id", videoId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/videos/${videoId}`);
  revalidatePath("/videos");
  revalidatePath("/dashboard");
  return { error: null };
}
