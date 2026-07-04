import Link from "next/link";
import { Edit } from "lucide-react";
import { DeleteVideoButton } from "@/components/DeleteVideoButton";
import { DownloadFileButton } from "@/components/DownloadFileButton";
import { EmptyState } from "@/components/EmptyState";
import type { Video } from "@/lib/types";

function formatFileSize(size: number | null) {
  if (!size) {
    return "";
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function VideoList({ videos }: { videos: Video[] }) {
  if (!videos.length) {
    return <EmptyState text="Cadastre seu primeiro video para comecar." />;
  }

  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <div className="hidden grid-cols-[1fr_120px_90px_100px_110px_120px_120px_150px] gap-3 border-b border-line bg-mist px-5 py-3 text-xs font-semibold uppercase text-gray-500 xl:grid">
        <span>Titulo</span>
        <span>Nicho</span>
        <span>Plataforma</span>
        <span>Status</span>
        <span>Responsavel</span>
        <span>Tipo</span>
        <span>Criado em</span>
        <span>Acoes</span>
      </div>

      <div className="divide-y divide-line">
        {videos.map((video) => {
          const filePath = video.storage_path ?? video.file_url;
          const fileSize = formatFileSize(video.file_size);

          return (
            <article
              key={video.id}
              className="grid gap-3 px-5 py-4 xl:grid-cols-[1fr_120px_90px_100px_110px_120px_120px_150px] xl:items-center"
            >
              <div>
                <h2 className="font-medium text-ink">{video.title}</h2>
                {video.hook ? (
                  <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                    {video.hook}
                  </p>
                ) : null}
                {filePath ? (
                  <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                    Arquivo: {video.original_filename ?? filePath}
                    {fileSize ? ` (${fileSize})` : ""}
                  </p>
                ) : null}
              </div>

              <p className="text-sm text-gray-700">{video.niche}</p>
              <p className="text-sm text-gray-700">{video.platform}</p>
              <span className="w-fit rounded-md bg-mist px-2 py-1 text-xs font-medium text-gray-700">
                {video.status}
              </span>
              <p className="text-sm text-gray-700">{video.responsible ?? "-"}</p>
              <p className="text-sm text-gray-700">{video.video_type ?? "-"}</p>
              <p className="text-sm text-gray-600">
                {new Date(video.created_at).toLocaleDateString("pt-BR")}
              </p>

              <div className="flex flex-wrap gap-2">
                {filePath ? (
                  <DownloadFileButton
                    fileUrl={filePath}
                    originalFilename={video.original_filename}
                    label="Baixar video"
                  />
                ) : null}
                <Link
                  href={`/videos/${video.id}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink transition hover:bg-mist"
                >
                  <Edit size={15} />
                  Editar
                </Link>
                <DeleteVideoButton videoId={video.id} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
