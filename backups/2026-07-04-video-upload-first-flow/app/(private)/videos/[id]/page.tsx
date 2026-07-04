import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { VideoForm } from "@/components/VideoForm";
import { VideoComments } from "@/components/VideoComments";
import { VideoPublications } from "@/components/VideoPublications";
import { updateVideo } from "@/app/(private)/videos/actions";
import { createClient } from "@/lib/supabase/server";
import type { Account, Project, VideoComment, VideoPublication } from "@/lib/types";

export default async function EditVideoPage({
  params
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*, projects(*)")
    .order("platform", { ascending: true })
    .order("name", { ascending: true });

  const { data: video } = await supabase
    .from("videos")
    .select("*, video_comments(*), video_publications(*, accounts(*))")
    .eq("id", params.id)
    .single();

  if (!video) {
    notFound();
  }

  return (
    <>
      <Link
        href="/videos"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-ink"
      >
        <ArrowLeft size={16} />
        Voltar para videos
      </Link>

      <PageHeader
        title="Editar video"
        description="Atualize as informacoes principais deste conteudo."
      />

      <div className="grid gap-6">
        <VideoForm
          action={updateVideo}
          projects={(projects ?? []) as Project[]}
          video={video}
          submitLabel="Salvar alteracoes"
        />

        <VideoPublications
          videoId={video.id}
          accounts={(accounts ?? []) as Account[]}
          publications={
            ((video.video_publications ?? []) as VideoPublication[])
          }
        />

        <VideoComments
          videoId={video.id}
          comments={((video.video_comments ?? []) as VideoComment[]).sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )}
        />
      </div>
    </>
  );
}
