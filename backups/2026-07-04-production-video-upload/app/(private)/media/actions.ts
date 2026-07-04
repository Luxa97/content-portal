"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createMediaAsset(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const assetType = String(formData.get("asset_type") ?? "file");
  const storagePath = String(formData.get("storage_path") ?? "");
  const originalFilename = String(formData.get("original_filename") ?? "");
  const fileSize = Number(formData.get("file_size") ?? 0);
  const mimeType = String(formData.get("mime_type") ?? "");
  const uploadedAt = String(formData.get("uploaded_at") ?? "");
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !storagePath || !originalFilename || fileSize <= 0) {
    redirect("/media?message=Arquivo%20nao%20enviado");
  }

  const { error } = await supabase.from("media_assets").insert({
    user_id: user.id,
    title: title || originalFilename,
    asset_type: assetType,
    storage_bucket: "videos",
    storage_path: storagePath,
    original_filename: originalFilename,
    file_size: fileSize,
    mime_type: mimeType,
    uploaded_at: uploadedAt || new Date().toISOString()
  });

  if (error) {
    redirect(`/media?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/media");
  redirect("/media?success=Arquivo%20enviado%20com%20sucesso");
}
