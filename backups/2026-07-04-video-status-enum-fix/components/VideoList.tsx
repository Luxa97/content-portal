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
      <div className="hidden grid-cols-[1fr_120px_110px_150px_180px_110px_150px] gap-3 border-b border-line bg-mist px-5 py-3 text-xs font-semibold uppercase text-gray-500 xl:grid">
        <span>Video</span>
        <span>Nicho</span>
        <span>Status</span>
        <span>Publicado em</span>
        <span>Comentarios</span>
        <span>Criado em</span>
        <span>Acoes</span>
      </div>

      <div className="divide-y divide-line">
        {videos.map((video) => {
          const filePath = video.storage_path ?? video.file_url;
          const fileSize = formatFileSize(video.file_size);
          const projectName = video.projects?.name ?? video.niche;
          const publications = video.video_publications ?? [];
          const comments = [...(video.video_comments ?? [])]
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, 2);

          return (
            <article
              key={video.id}
              className="grid gap-3 px-5 py-4 xl:grid-cols-[1fr_120px_110px_150px_180px_110px_150px] xl:items-center"
            >
              <div className="flex gap-3">
                <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-md bg-mist text-xs text-gray-500">
                  Sem thumbnail
                </div>
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
              </div>

              <p className="text-sm text-gray-700">{projectName}</p>
              <span className="w-fit rounded-md bg-mist px-2 py-1 text-xs font-medium text-gray-700">
                {video.status}
              </span>
              <p className="text-sm text-gray-700">
                {publications.length
                  ? publications
                      .map(
                        (publication) =>
                          `${publication.accounts?.platform ?? "Conta"} @${
                            publication.accounts?.username ?? "-"
                          }`
                      )
                      .join(", ")
                  : "-"}
              </p>
              <div className="grid gap-1">
                {comments.length ? (
                  comments.map((comment) => (
                    <p key={comment.id} className="line-clamp-1 text-xs text-gray-600">
                      {comment.body}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">-</p>
                )}
              </div>
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
