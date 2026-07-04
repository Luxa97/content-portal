"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function isValidPrivateStoragePath(path: string, userId: string) {
  return !path || (!path.startsWith("http") && path.startsWith(`${userId}/`));
}

export async function createVideo(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const niche = String(formData.get("niche") ?? "");
  const platform = String(formData.get("platform") ?? "");
  const status = String(formData.get("status") ?? "Gravado");
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
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !title || !niche || !platform) {
    return;
  }

  if (!isValidPrivateStoragePath(fileUrl, user.id)) {
    redirect(
      `/videos?message=${encodeURIComponent("Arquivo privado invalido.")}`
    );
  }

  const { error } = await supabase.from("videos").insert({
    user_id: user.id,
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
  const niche = String(formData.get("niche") ?? "");
  const platform = String(formData.get("platform") ?? "");
  const status = String(formData.get("status") ?? "Gravado");
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
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !id || !title || !niche || !platform) {
    return;
  }

  if (!isValidPrivateStoragePath(fileUrl, user.id)) {
    redirect(
      `/videos?message=${encodeURIComponent("Arquivo privado invalido.")}`
    );
  }

  const { error } = await supabase
    .from("videos")
    .update({
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
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

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
