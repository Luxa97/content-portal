import Link from "next/link";
import { DownloadVideoButton } from "@/components/DownloadVideoButton";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";

function getFileName(fileUrl: string) {
  return fileUrl.split("/").pop() ?? fileUrl;
}

function formatFileSize(size: number | null) {
  if (!size) {
    return "-";
  }

  const megabytes = size / 1024 / 1024;
  return `${megabytes.toFixed(1)} MB`;
}

export default async function MediaPage() {
  const supabase = await createClient();

  const { data: videos } = await supabase
    .from("videos")
    .select("id,title,niche,platform,file_url,original_filename,file_size,mime_type,uploaded_at,created_at")
    .not("file_url", "is", null)
    .neq("file_url", "")
    .order("created_at", { ascending: false });

  const mediaItems = videos ?? [];

  return (
    <>
      <PageHeader
        title="Media Library"
        description="Arquivos originais vinculados aos videos cadastrados."
      />

      {mediaItems.length ? (
        <div className="overflow-hidden rounded-md border border-line bg-white">
          <div className="hidden grid-cols-[1fr_130px_100px_1fr_100px_130px_150px] gap-3 border-b border-line bg-mist px-5 py-3 text-xs font-semibold uppercase text-gray-500 xl:grid">
            <span>Video</span>
            <span>Nicho</span>
            <span>Plataforma</span>
            <span>Arquivo</span>
            <span>Tamanho</span>
            <span>Upload</span>
            <span>Download</span>
          </div>

          <div className="divide-y divide-line">
            {mediaItems.map((video) => (
              <article
                key={video.id}
                className="grid gap-3 px-5 py-4 xl:grid-cols-[1fr_130px_100px_1fr_100px_130px_150px] xl:items-center"
              >
                <Link
                  href={`/videos/${video.id}`}
                  className="font-medium text-ink underline-offset-2 hover:underline"
                >
                  {video.title}
                </Link>
                <p className="text-sm text-gray-700">{video.niche}</p>
                <p className="text-sm text-gray-700">{video.platform}</p>
                <p className="break-all text-sm text-gray-600">
                  {video.original_filename || getFileName(video.file_url)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatFileSize(video.file_size)}
                </p>
                <p className="text-sm text-gray-600">
                  {video.uploaded_at
                    ? new Date(video.uploaded_at).toLocaleDateString("pt-BR")
                    : "-"}
                </p>
                <DownloadVideoButton
                  fileUrl={video.file_url}
                  originalFilename={video.original_filename}
                />
              </article>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState text="Nenhum arquivo de video enviado ainda." />
      )}
    </>
  );
}
