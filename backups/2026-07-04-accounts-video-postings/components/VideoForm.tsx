"use client";

import { Save } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
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
  action: (formData: FormData) => void | Promise<void>;
  projects: Project[];
  video?: Video;
  submitLabel?: string;
};

export function VideoForm({
  action,
  projects,
  video,
  submitLabel = "Salvar video"
}: VideoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileUrl, setFileUrl] = useState(video?.storage_path ?? video?.file_url ?? "");
  const [originalFilename, setOriginalFilename] = useState(
    video?.original_filename ?? ""
  );
  const [fileSize, setFileSize] = useState(video?.file_size?.toString() ?? "");
  const [mimeType, setMimeType] = useState(video?.mime_type ?? "");
  const [uploadedAt, setUploadedAt] = useState(video?.uploaded_at ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  async function uploadVideoFile(file: File) {
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

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storagePath = `${user.id}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from("videos")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) {
      throw new Error(error.message);
    }

    return {
      storagePath,
      originalFilename: file.name,
      fileSize: file.size.toString(),
      mimeType: file.type || "video/unknown",
      uploadedAt: new Date().toISOString()
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = formRef.current;

    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const file = formData.get("video_file") as File | null;
    let nextFileUrl = fileUrl;
    let nextOriginalFilename = originalFilename;
    let nextFileSize = fileSize;
    let nextMimeType = mimeType;
    let nextUploadedAt = uploadedAt;

    setUploadError("");
    setUploadSuccess("");

    if (file && file.size > 0) {
      try {
        setIsUploading(true);
        const uploadedFile = await uploadVideoFile(file);
        nextFileUrl = uploadedFile.storagePath;
        nextOriginalFilename = uploadedFile.originalFilename;
        nextFileSize = uploadedFile.fileSize;
        nextMimeType = uploadedFile.mimeType;
        nextUploadedAt = uploadedFile.uploadedAt;
        setFileUrl(uploadedFile.storagePath);
        setOriginalFilename(uploadedFile.originalFilename);
        setFileSize(uploadedFile.fileSize);
        setMimeType(uploadedFile.mimeType);
        setUploadedAt(uploadedFile.uploadedAt);
        setUploadSuccess("Video enviado com sucesso.");
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Nao foi possivel enviar o video."
        );
        setIsUploading(false);
        return;
      }
    }

    setIsUploading(false);
    formData.set("file_url", nextFileUrl);
    formData.set("original_filename", nextOriginalFilename);
    formData.set("file_size", nextFileSize);
    formData.set("mime_type", nextMimeType);
    formData.set("uploaded_at", nextUploadedAt);
    await action(formData);
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-md border border-line bg-white p-5"
    >
      {video ? <input type="hidden" name="id" value={video.id} /> : null}
      <input type="hidden" name="original_filename" value={originalFilename} />
      <input type="hidden" name="file_size" value={fileSize} />
      <input type="hidden" name="mime_type" value={mimeType} />
      <input type="hidden" name="uploaded_at" value={uploadedAt} />

      {!projects.length ? (
        <div className="rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Crie um nicho antes de cadastrar videos.
        </div>
      ) : null}

      <label className="block text-sm font-medium text-gray-700">
        Titulo
        <input
          name="title"
          required
          defaultValue={video?.title ?? ""}
          placeholder="Ex: 3 erros ao tomar creatina"
          className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-sm font-medium text-gray-700">
          Nicho
          <select
            name="project_id"
            required
            defaultValue={video?.project_id ?? projects[0]?.id ?? ""}
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          >
            {!projects.length ? (
              <option value="">Crie um nicho primeiro</option>
            ) : null}
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Plataforma
          <select
            name="platform"
            defaultValue={video?.platform ?? platforms[0]}
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          >
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
            defaultValue={video?.status ?? statuses[0]}
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700">
          Responsavel
          <select
            name="responsible"
            defaultValue={video?.responsible ?? responsibles[0]}
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          >
            {responsibles.map((responsible) => (
              <option key={responsible} value={responsible}>
                {responsible}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Tipo de video
          <select
            name="video_type"
            defaultValue={video?.video_type ?? videoTypes[0]}
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          >
            {videoTypes.map((videoType) => (
              <option key={videoType} value={videoType}>
                {videoType}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-gray-700">
        Hook
        <input
          name="hook"
          defaultValue={video?.hook ?? ""}
          placeholder="Primeira frase do video"
          className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700">
          Link do produto
          <input
            name="product_link"
            type="url"
            defaultValue={video?.product_link ?? ""}
            placeholder="https://..."
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Arquivo salvo
          <input
            name="file_url"
            value={fileUrl}
            readOnly
            placeholder="Preenchido automaticamente apos upload"
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          />
        </label>
      </div>

      <div className="rounded-md border border-line bg-mist p-4">
        <label className="block text-sm font-medium text-gray-700">
          Upload do video original
          <input
            name="video_file"
            type="file"
            accept="video/mp4,video/quicktime,video/x-m4v,video/webm,.mp4,.mov,.m4v,.webm"
            className="mt-2 block w-full text-sm text-gray-700 file:mr-3 file:h-10 file:rounded-md file:border-0 file:bg-white file:px-3 file:text-sm file:font-medium"
          />
        </label>
        <p className="mt-2 text-xs text-gray-600">
          Formatos aceitos: mp4, mov, m4v e webm. Recomendado: ate 500 MB por
          arquivo, conforme o limite configurado no Supabase.
        </p>
        <p className="mt-1 text-xs text-gray-600">
          O arquivo original sera salvo sem compressao, conversao ou reducao de
          qualidade.
        </p>
        {isUploading ? (
          <p className="mt-2 text-sm font-medium text-ink">Enviando video...</p>
        ) : null}
        {uploadError ? (
          <p className="mt-2 text-sm font-medium text-red-600">{uploadError}</p>
        ) : null}
        {uploadSuccess ? (
          <p className="mt-2 text-sm font-medium text-green-700">
            {uploadSuccess}
          </p>
        ) : null}
        {originalFilename ? (
          <p className="mt-2 text-xs text-gray-600">
            Arquivo: {originalFilename}
            {fileSize ? ` (${(Number(fileSize) / 1024 / 1024).toFixed(1)} MB)` : ""}
          </p>
        ) : null}
        {fileUrl ? (
          <div className="mt-3">
            <DownloadFileButton
              fileUrl={fileUrl}
              originalFilename={originalFilename}
              label="Baixar video"
            />
          </div>
        ) : null}
      </div>

      <label className="block text-sm font-medium text-gray-700">
        Observacoes
        <textarea
          name="notes"
          defaultValue={video?.notes ?? ""}
          rows={4}
          className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-ink"
        />
      </label>

      <Button className="w-fit gap-2" disabled={isUploading || !projects.length}>
        <Save size={16} />
        {isUploading ? "Enviando..." : submitLabel}
      </Button>
    </form>
  );
}
