"use client";

import { Upload } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { createMediaAsset } from "@/app/(private)/media/actions";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/browser";

const allowedExtensions = [
  ".mp4",
  ".mov",
  ".m4v",
  ".webm",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".heic",
  ".heif",
  ".pdf",
  ".txt",
  ".csv",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".zip"
];

const allowedMimePrefixes = ["video/", "image/"];

const allowedMimeTypes = [
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/zip",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];

function getAssetType(file: File) {
  if (file.type.startsWith("video/")) {
    return "video";
  }

  if (file.type.startsWith("image/")) {
    return "image";
  }

  return "file";
}

function validateFile(file: File) {
  const lowerName = file.name.toLowerCase();
  const hasAllowedExtension = allowedExtensions.some((extension) =>
    lowerName.endsWith(extension)
  );
  const hasAllowedMime =
    !file.type ||
    allowedMimePrefixes.some((prefix) => file.type.startsWith(prefix)) ||
    allowedMimeTypes.includes(file.type);

  if (!hasAllowedExtension || !hasAllowedMime) {
    throw new Error("Use video, foto ou arquivo permitido.");
  }
}

export function MediaUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = formRef.current;

    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const file = formData.get("media_file") as File | null;

    setError("");

    if (!file || file.size === 0) {
      setError("Selecione um arquivo para enviar.");
      return;
    }

    try {
      validateFile(file);
      setIsUploading(true);

      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Voce precisa estar logado para enviar arquivos.");
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const storagePath = `${user.id}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      formData.set("asset_type", getAssetType(file));
      formData.set("storage_path", storagePath);
      formData.set("original_filename", file.name);
      formData.set("file_size", file.size.toString());
      formData.set("mime_type", file.type || "application/octet-stream");
      formData.set("uploaded_at", new Date().toISOString());

      await createMediaAsset(formData);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Nao foi possivel enviar o arquivo."
      );
      setIsUploading(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-md border border-line bg-white p-5"
    >
      <label className="block text-sm font-medium text-gray-700">
        Nome na biblioteca
        <input
          name="title"
          placeholder="Opcional"
          className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
        />
      </label>

      <label className="block text-sm font-medium text-gray-700">
        Arquivo original
        <input
          name="media_file"
          type="file"
          accept="video/mp4,video/quicktime,video/x-m4v,video/webm,image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.mp4,.mov,.m4v,.webm,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
          className="mt-2 block w-full text-sm text-gray-700 file:mr-3 file:h-10 file:rounded-md file:border-0 file:bg-mist file:px-3 file:text-sm file:font-medium"
        />
      </label>

      <div className="rounded-md bg-mist p-3 text-xs text-gray-600">
        Envie videos, fotos e arquivos. O arquivo original sera preservado sem
        compressao, conversao ou reducao de qualidade.
      </div>

      {isUploading ? (
        <p className="text-sm font-medium text-ink">Enviando arquivo...</p>
      ) : null}

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <Button className="w-fit gap-2" disabled={isUploading}>
        <Upload size={16} />
        {isUploading ? "Enviando..." : "Enviar arquivo"}
      </Button>
    </form>
  );
}
