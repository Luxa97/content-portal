import Link from "next/link";
import { Edit } from "lucide-react";
import { DeleteVideoButton } from "@/components/DeleteVideoButton";
import { EmptyState } from "@/components/EmptyState";
import type { Video } from "@/lib/types";

export function VideoList({ videos }: { videos: Video[] }) {
  if (!videos.length) {
    return <EmptyState text="Cadastre seu primeiro video para comecar." />;
  }

  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <div className="hidden grid-cols-[1fr_140px_110px_110px_120px_160px] gap-3 border-b border-line bg-mist px-5 py-3 text-xs font-semibold uppercase text-gray-500 md:grid">
        <span>Titulo</span>
        <span>Nicho</span>
        <span>Plataforma</span>
        <span>Status</span>
        <span>Criado em</span>
        <span>Acoes</span>
      </div>

      <div className="divide-y divide-line">
        {videos.map((video) => (
          <article
            key={video.id}
            className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_140px_110px_110px_120px_160px] md:items-center"
          >
            <div>
              <h2 className="font-medium text-ink">{video.title}</h2>
              {video.hook ? (
                <p className="mt-1 line-clamp-1 text-sm text-gray-500">{video.hook}</p>
              ) : null}
            </div>

            <p className="text-sm text-gray-700">{video.niche}</p>
            <p className="text-sm text-gray-700">{video.platform}</p>
            <span className="w-fit rounded-md bg-mist px-2 py-1 text-xs font-medium text-gray-700">
              {video.status}
            </span>
            <p className="text-sm text-gray-600">
              {new Date(video.created_at).toLocaleDateString("pt-BR")}
            </p>

            <div className="flex flex-wrap gap-2">
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
        ))}
      </div>
    </div>
  );
}
