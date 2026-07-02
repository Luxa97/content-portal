import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { VideoForm } from "@/components/VideoForm";
import { updateVideo } from "@/app/(private)/videos/actions";
import { createClient } from "@/lib/supabase/server";

export default async function EditVideoPage({
  params
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: video } = await supabase
    .from("videos")
    .select("*")
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

      <VideoForm action={updateVideo} video={video} submitLabel="Salvar alteracoes" />
    </>
  );
}
