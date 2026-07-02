import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { VideoForm } from "@/components/VideoForm";
import { VideoList } from "@/components/VideoList";
import { createVideo } from "@/app/(private)/videos/actions";
import { createClient } from "@/lib/supabase/server";

export default async function VideosPage({
  searchParams
}: {
  searchParams: { success?: string; message?: string };
}) {
  const supabase = await createClient();

  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Videos"
          description="Crie, edite e acompanhe a producao de conteudo."
        />

        <Link
          href="#novo-video"
          className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={16} />
          Novo video
        </Link>
      </div>

      {searchParams.success ? (
        <div className="mb-6 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          {searchParams.success}
        </div>
      ) : null}

      {searchParams.message ? (
        <div className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {searchParams.message}
        </div>
      ) : null}

      <div className="grid gap-6">
        <section id="novo-video">
          <h2 className="mb-3 font-semibold text-ink">Novo video</h2>
          <VideoForm action={createVideo} submitLabel="Criar video" />
        </section>

        <VideoList videos={videos ?? []} />
      </div>
    </>
  );
}
