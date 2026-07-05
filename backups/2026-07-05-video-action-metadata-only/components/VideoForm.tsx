"use client";

import { Save } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { DownloadFileButton } from "@/components/DownloadFileButton";
import {
  platforms,
  responsibles,
  statuses,
  videoTypes
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/browser";
import type { Project, Video } from "@/lib/types";

type VideoFormProps = {
  action: (
    metadata: VideoMetadata
  ) =>
    | void
    | { error?: string | null; success?: string | null }
    | Promise<void | { error?: string | null; success?: string | null }>;
  projects: Project[];
  video?: Video;
  submitLabel?: string;
};

type VideoMetadata = {
  id?: string;
  title: string;
  project_id: string;
  platform: string;
  status: string;
  responsible: string;
  video_type: string;
  hook: string;
  product_url: string;
  notes: string;
  storage_path: string;
  original_filename: string;
  file_size: string;
  mime_type: string;
  uploaded_at: string;
};

export function VideoForm({
  action,
  projects,
  video,
  submitLabel = "Salvar video"
}: VideoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [storagePath, setStoragePath] = useState(
    video?.storage_path ?? video?.file_url ?? ""
  );
  const [originalFilename, setOriginalFilename] = useState(
    video?.original_filename ?? ""
  );
  const [fileSize, setFileSize] = useState(video?.file_size?.toString() ?? "");
  const [mimeType, setMimeType] = useState(video?.mime_type ?? "");
  const [uploadedAt, setUploadedAt] = useState(video?.uploaded_at ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  async function uploadVideoFile(file: File) {
    console.log("[VIDEO_UPLOAD] arquivo recebido", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-m4v",
      "video/webm"
    ];
    const allowedExtensions = [".mp4", ".mov", ".m4v", ".webm"];
    const lowerName = file.name.toLowerCase();
    const hasAllowedExtension = allowedExtensions.some((extension) =>
      lowerName.endsWith(extension)
    );

    if (!hasAllowedExtension || (file.type && !allowedTypes.includes(file.type))) {
      throw new Error("Use um arquivo mp4, mov, m4v ou webm.");
    }

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Voce precisa estar logado para enviar videos.");
    }

    console.log("[VIDEO_UPLOAD] usuario autenticado", user.id);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const nextStoragePath = `${user.id}/${Date.now()}-${safeName}`;

    console.log("[VIDEO_UPLOAD] storagePath", nextStoragePath);
    console.log("[VIDEO_UPLOAD] upload storage iniciado");

    let uploadResult;

    try {
      uploadResult = await supabase.storage
        .from("videos")
        .upload(nextStoragePath, file, {
          cacheControl: "3600",
          upsert: false
        });
    } catch (error) {
      console.error("[VIDEO_UPLOAD] upload storage erro inesperado", error);
      throw error;
    }

    console.log("[VIDEO_UPLOAD] upload storage concluido", uploadResult.data);

    if (uploadResult.error) {
      console.error("[VIDEO_UPLOAD] erro no upload storage", uploadResult.error);
      throw new Error(uploadResult.error.message);
    }

    return {
      storagePath: nextStoragePath,
      originalFilename: file.name,
      fileSize: file.size.toString(),
      mimeType: file.type || "video/unknown",
      uploadedAt: new Date().toISOString()
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("[VIDEO_UPLOAD] iniciado");

    const form = formRef.current;

    if (!form) {
      return;
    }

    const sourceFormData = new FormData(form);
    const file = sourceFormData.get("video_file") as File | null;
    const isNewVideo = !video;
    let nextStoragePath = storagePath;
    let nextOriginalFilename = originalFilename;
    let nextFileSize = fileSize;
    let nextMimeType = mimeType;
    let nextUploadedAt = uploadedAt;

    setUploadError("");
    setStatusMessage("");

    if (isNewVideo && (!file || file.size === 0)) {
      setUploadError("Escolha um arquivo de video para enviar.");
      return;
    }

    if (file && file.size > 0) {
      try {
        setIsUploading(true);
        console.log("[VIDEO_UPLOAD] chamando uploadVideoFile()");
        const uploadedFile = await uploadVideoFile(file);
        console.log("[VIDEO_UPLOAD] uploadVideoFile() concluido", uploadedFile);
        nextStoragePath = uploadedFile.storagePath;
        nextOriginalFilename = uploadedFile.originalFilename;
        nextFileSize = uploadedFile.fileSize;
        nextMimeType = uploadedFile.mimeType;
        nextUploadedAt = uploadedFile.uploadedAt;
        setStoragePath(uploadedFile.storagePath);
        setOriginalFilename(uploadedFile.originalFilename);
        setFileSize(uploadedFile.fileSize);
        setMimeType(uploadedFile.mimeType);
        setUploadedAt(uploadedFile.uploadedAt);
        setStatusMessage("Upload concluido.");
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Nao foi possivel enviar o video."
        );
        setIsUploading(false);
        return;
      }
    }

    setIsUploading(false);
    const metadata: VideoMetadata = {
      id: video?.id ?? "",
      title: String(sourceFormData.get("title") ?? ""),
      project_id: String(sourceFormData.get("project_id") ?? ""),
      platform: String(sourceFormData.get("platform") ?? ""),
      status: String(sourceFormData.get("status") ?? ""),
      responsible: String(sourceFormData.get("responsible") ?? ""),
      video_type: String(sourceFormData.get("video_type") ?? ""),
      hook: String(sourceFormData.get("hook") ?? ""),
      product_url: String(sourceFormData.get("product_url") ?? ""),
      notes: String(sourceFormData.get("notes") ?? ""),
      storage_path: nextStoragePath,
      original_filename: nextOriginalFilename,
      file_size: nextFileSize,
      mime_type: nextMimeType,
      uploaded_at: nextUploadedAt
    };

    setIsSaving(true);
    setStatusMessage("Salvando registro...");
    console.log("[VIDEO_UPLOAD] chamando createVideo()", {
      metadata,
      hasFileInServerActionPayload: false
    });

    let result;

    try {
      result = await action(metadata);
      console.log("[VIDEO_UPLOAD] createVideo() concluido", result);
    } catch (error) {
      console.error("[VIDEO_UPLOAD] createVideo() erro inesperado", error);
      setUploadError(
        error instanceof Error
          ? `Erro inesperado ao salvar registro: ${error.message}`
          : "Erro inesperado ao salvar registro."
      );
      setStatusMessage("");
      setIsSaving(false);
      return;
    }

    if (result && "error" in result && result.error) {
      setUploadError(result.error);
      setStatusMessage("");
      setIsSaving(false);
      return;
    }

    const successMessage =
      result && "success" in result && result.success
        ? result.success
        : "Video salvo com sucesso.";
    setStatusMessage(successMessage);
    router.push(`/videos?success=${encodeURIComponent(successMessage)}`);
    router.refresh();
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-md border border-line bg-white p-5"
    >
      {video ? <input type="hidden" name="id" value={video.id} /> : null}
      <input type="hidden" name="storage_path" value={storagePath} />
      <input type="hidden" name="original_filename" value={originalFilename} />
      <input type="hidden" name="file_size" value={fileSize} />
      <input type="hidden" name="mime_type" value={mimeType} />
      <input type="hidden" name="uploaded_at" value={uploadedAt} />

      <div className="rounded-md border border-line bg-mist p-4">
        <label className="block text-sm font-medium text-gray-700">
          Arquivo de video {video ? "(opcional para trocar)" : ""}
          <input
            name="video_file"
            type="file"
            required={!video}
            accept="video/mp4,video/quicktime,video/x-m4v,video/webm,.mp4,.mov,.m4v,.webm"
            className="mt-2 block w-full text-sm text-gray-700 file:mr-3 file:h-10 file:rounded-md file:border-0 file:bg-white file:px-3 file:text-sm file:font-medium"
          />
        </label>
        <p className="mt-2 text-xs text-gray-600">
          Formatos aceitos: mp4, mov, m4v e webm. O arquivo original sera salvo
          sem compressao, conversao ou reducao de qualidade.
        </p>
        <p className="mt-1 text-xs text-gray-600">
          Tamanho recomendado: ate 500 MB por arquivo, conforme o limite
          configurado no Supabase.
        </p>
        {isUploading ? (
          <p className="mt-2 text-sm font-medium text-ink">Enviando video...</p>
        ) : null}
        {uploadError ? (
          <p className="mt-2 text-sm font-medium text-red-600">{uploadError}</p>
        ) : null}
        {statusMessage ? (
          <p className="mt-2 text-sm font-medium text-green-700">
            {statusMessage}
          </p>
        ) : null}
        {originalFilename ? (
          <p className="mt-2 text-xs text-gray-600">
            Arquivo: {originalFilename}
            {fileSize ? ` (${(Number(fileSize) / 1024 / 1024).toFixed(1)} MB)` : ""}
          </p>
        ) : null}
        {storagePath ? (
          <div className="mt-3">
            <DownloadFileButton
              fileUrl={storagePath}
              originalFilename={originalFilename}
              label="Baixar original"
            />
          </div>
        ) : null}
      </div>

      <label className="block text-sm font-medium text-gray-700">
        Titulo opcional
        <input
          name="title"
          defaultValue={video?.title ?? ""}
          placeholder="Se ficar vazio, usaremos o nome do arquivo"
          className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
        />
      </label>

      <label className="block text-sm font-medium text-gray-700">
        Nicho opcional
        <select
          name="project_id"
          defaultValue={video?.project_id ?? ""}
          className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
        >
          <option value="">Sem nicho por enquanto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>

      <details className="rounded-md border border-line p-4">
        <summary className="cursor-pointer text-sm font-medium text-ink">
          Detalhes opcionais
        </summary>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-sm font-medium text-gray-700">
              Plataforma
              <select
                name="platform"
                defaultValue={video?.platform ?? ""}
                className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
              >
                <option value="">Sem plataforma</option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Status
              <select
                name="status"
                defaultValue={video?.status ?? ""}
                className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
              >
                <option value="">Sem status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Responsavel
              <select
                name="responsible"
                defaultValue={video?.responsible ?? ""}
                className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
              >
                <option value="">Sem responsavel</option>
                {responsibles.map((responsible) => (
                  <option key={responsible} value={responsible}>
                    {responsible}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Tipo de video
            <select
              name="video_type"
              defaultValue={video?.video_type ?? ""}
              className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
            >
              <option value="">Sem tipo</option>
              {videoTypes.map((videoType) => (
                <option key={videoType} value={videoType}>
                  {videoType}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Hook
            <input
              name="hook"
              defaultValue={video?.hook ?? ""}
              placeholder="Primeira frase do video"
              className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Link do produto
            <input
              name="product_url"
              type="url"
              defaultValue={video?.product_url ?? video?.product_link ?? ""}
              placeholder="https://..."
              className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
            />
          </label>
        </div>
      </details>

      <label className="block text-sm font-medium text-gray-700">
        Observacoes opcionais
        <textarea
          name="notes"
          defaultValue={video?.notes ?? ""}
          rows={4}
          className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-ink"
        />
      </label>

      <Button className="w-fit gap-2" disabled={isUploading || isSaving}>
        <Save size={16} />
        {isUploading ? "Enviando..." : isSaving ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}
