"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function isValidPrivateStoragePath(path: string, userId: string) {
  return !path || (!path.startsWith("http") && path.startsWith(`${userId}/`));
}

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

export async function createVideo(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const platform = String(formData.get("platform") ?? "");
  const status = String(formData.get("status") ?? "Em produção");
  const responsible = String(formData.get("responsible") ?? "");
  const videoType = String(formData.get("video_type") ?? "");
  const hook = String(formData.get("hook") ?? "");
  const productLink = String(formData.get("product_link") ?? "");
  const notes = String(formData.get("notes") ?? "");
  const fileUrl = String(formData.get("file_url") ?? "");
  const originalFilename = String(formData.get("original_filename") ?? "");
  const fileSize = Number(formData.get("file_size") ?? 0);
  const mimeType = String(formData.get("mime_type") ?? "");
  const uploadedAt = String(formData.get("uploaded_at") ?? "");
  const { supabase, user } = await getUser();

  if (!user || !title || !projectId || !platform) {
    return;
  }

  const niche = await getProjectName(projectId, user.id);

  if (!niche) {
    redirect(`/videos?message=${encodeURIComponent("Selecione um nicho valido.")}`);
  }

  if (!isValidPrivateStoragePath(fileUrl, user.id)) {
    redirect(
      `/videos?message=${encodeURIComponent("Arquivo privado invalido.")}`
    );
  }

  const { error } = await supabase.from("videos").insert({
    user_id: user.id,
    project_id: projectId,
    title,
    niche,
    platform,
    status,
    responsible,
    video_type: videoType,
    hook,
    product_link: productLink,
    notes,
    file_url: fileUrl,
    storage_path: fileUrl || null,
    original_filename: originalFilename || null,
    file_size: fileSize > 0 ? fileSize : null,
    mime_type: mimeType || null,
    uploaded_at: uploadedAt || null
  });

  if (error) {
    redirect(`/videos?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/videos");
  redirect(`/videos?success=${encodeURIComponent("Video criado com sucesso.")}`);
}

export async function updateVideo(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const platform = String(formData.get("platform") ?? "");
  const status = String(formData.get("status") ?? "Em produção");
  const responsible = String(formData.get("responsible") ?? "");
  const videoType = String(formData.get("video_type") ?? "");
  const hook = String(formData.get("hook") ?? "");
  const productLink = String(formData.get("product_link") ?? "");
  const notes = String(formData.get("notes") ?? "");
  const fileUrl = String(formData.get("file_url") ?? "");
  const originalFilename = String(formData.get("original_filename") ?? "");
  const fileSize = Number(formData.get("file_size") ?? 0);
  const mimeType = String(formData.get("mime_type") ?? "");
  const uploadedAt = String(formData.get("uploaded_at") ?? "");
  const { supabase, user } = await getUser();

  if (!user || !id || !title || !projectId || !platform) {
    return;
  }

  const niche = await getProjectName(projectId, user.id);

  if (!niche) {
    redirect(`/videos?message=${encodeURIComponent("Selecione um nicho valido.")}`);
  }

  if (!isValidPrivateStoragePath(fileUrl, user.id)) {
    redirect(
      `/videos?message=${encodeURIComponent("Arquivo privado invalido.")}`
    );
  }

  const { error } = await supabase
    .from("videos")
    .update({
      project_id: projectId,
      title,
      niche,
      platform,
      status,
      responsible,
      video_type: videoType,
      hook,
      product_link: productLink,
      notes,
      file_url: fileUrl,
      storage_path: fileUrl || null,
      original_filename: originalFilename || null,
      file_size: fileSize > 0 ? fileSize : null,
      mime_type: mimeType || null,
      uploaded_at: uploadedAt || null
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/videos?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/videos");
  redirect(`/videos?success=${encodeURIComponent("Video atualizado com sucesso.")}`);
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
    body
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/videos/${videoId}`);
  revalidatePath("/videos");
  return { error: null };
}

export async function setVideoPublication(formData: FormData) {
  const videoId = String(formData.get("video_id") ?? "");
  const platform = String(formData.get("platform") ?? "");
  const checked = String(formData.get("checked") ?? "") === "true";
  const { supabase, user } = await getUser();

  if (!user || !videoId || !platform) {
    return { error: "Publicacao invalida." };
  }

  if (checked) {
    const { error } = await supabase.from("video_publications").upsert(
      {
        video_id: videoId,
        user_id: user.id,
        platform,
        published_at: new Date().toISOString()
      },
      { onConflict: "video_id,platform" }
    );

    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase
      .from("video_publications")
      .delete()
      .eq("video_id", videoId)
      .eq("platform", platform);

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath(`/videos/${videoId}`);
  revalidatePath("/videos");
  return { error: null };
}
