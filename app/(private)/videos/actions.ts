"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createVideo(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const niche = String(formData.get("niche") ?? "");
  const platform = String(formData.get("platform") ?? "");
  const status = String(formData.get("status") ?? "Gravado");
  const hook = String(formData.get("hook") ?? "");
  const productLink = String(formData.get("product_link") ?? "");
  const notes = String(formData.get("notes") ?? "");
  const fileUrl = String(formData.get("file_url") ?? "");
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !title || !niche || !platform) {
    return;
  }

  const { error } = await supabase.from("videos").insert({
    user_id: user.id,
    title,
    niche,
    platform,
    status,
    hook,
    product_link: productLink,
    notes,
    file_url: fileUrl
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
  const hook = String(formData.get("hook") ?? "");
  const productLink = String(formData.get("product_link") ?? "");
  const notes = String(formData.get("notes") ?? "");
  const fileUrl = String(formData.get("file_url") ?? "");
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !id || !title || !niche || !platform) {
    return;
  }

  const { error } = await supabase
    .from("videos")
    .update({
      title,
      niche,
      platform,
      status,
      hook,
      product_link: productLink,
      notes,
      file_url: fileUrl
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
