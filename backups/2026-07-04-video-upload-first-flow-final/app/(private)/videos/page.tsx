import Link from "next/link";
import { Plus } from "lucide-react";
import { AccountManager } from "@/components/AccountManager";
import { PageHeader } from "@/components/PageHeader";
import { ProjectManager } from "@/components/ProjectManager";
import { VideoForm } from "@/components/VideoForm";
import { VideoList } from "@/components/VideoList";
import { createVideo } from "@/app/(private)/videos/actions";
import { createClient } from "@/lib/supabase/server";
import { publicationStatuses, platforms } from "@/lib/constants";
import type { Account, Project, Video } from "@/lib/types";

export default async function VideosPage({
  searchParams
}: {
  searchParams: {
    success?: string;
    message?: string;
    project?: string;
    platform?: string;
    account?: string;
    publication_status?: string;
    quick?: string;
  };
}) {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: videos } = await supabase
    .from("videos")
    .select("*, projects(*), video_comments(*), video_publications(*, accounts(*))")
    .order("created_at", { ascending: false });

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*, projects(*)")
    .order("platform", { ascending: true })
    .order("name", { ascending: true });

  const projectList = (projects ?? []) as Project[];
  const accountList = (accounts ?? []) as Account[];
  const videoList = ((videos ?? []) as Video[]).filter((video) => {
    const publications = video.video_publications ?? [];

    if (searchParams.project && video.project_id !== searchParams.project) {
      return false;
    }

    if (
      searchParams.platform &&
      !publications.some(
        (publication) => publication.accounts?.platform === searchParams.platform
      )
    ) {
      return false;
    }

    if (
      searchParams.account &&
      !publications.some(
        (publication) => publication.account_id === searchParams.account
      )
    ) {
      return false;
    }

    if (
      searchParams.publication_status &&
      !publications.some(
        (publication) => publication.status === searchParams.publication_status
      )
    ) {
      return false;
    }

    if (
      searchParams.quick === "blocked" &&
      !publications.some((publication) => publication.status === "Bloqueado")
    ) {
      return false;
    }

    if (
      searchParams.quick === "viral" &&
      !publications.some((publication) => publication.status === "Viralizou")
    ) {
      return false;
    }

    if (searchParams.quick === "unpublished" && publications.length > 0) {
      return false;
    }

    return true;
  });
  const videoCounts = videoList.reduce<Record<string, number>>((counts, video) => {
    if (video.project_id) {
      counts[video.project_id] = (counts[video.project_id] ?? 0) + 1;
    }

    return counts;
  }, {});

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Videos"
          description="Envie arquivos originais e organize detalhes depois, se quiser."
        />

        <Link
          href="#enviar-video"
          className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={16} />
          Enviar video
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
        <section id="enviar-video">
          <h2 className="mb-3 font-semibold text-ink">Enviar video</h2>
          <VideoForm
            action={createVideo}
            projects={projectList}
            submitLabel="Enviar video"
          />
        </section>

        <ProjectManager projects={projectList} videoCounts={videoCounts} />
        <AccountManager accounts={accountList} projects={projectList} />

        <section className="rounded-md border border-line bg-white p-5">
          <h2 className="font-semibold text-ink">Filtros</h2>
          <form className="mt-4 grid gap-3 md:grid-cols-5">
            <select
              name="project"
              defaultValue={searchParams.project ?? ""}
              className="h-10 rounded-md border border-line px-3 text-sm"
            >
              <option value="">Todos os nichos</option>
              {projectList.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <select
              name="platform"
              defaultValue={searchParams.platform ?? ""}
              className="h-10 rounded-md border border-line px-3 text-sm"
            >
              <option value="">Todas plataformas</option>
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            <select
              name="account"
              defaultValue={searchParams.account ?? ""}
              className="h-10 rounded-md border border-line px-3 text-sm"
            >
              <option value="">Todas contas</option>
              {accountList.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.platform} | @{account.username}
                </option>
              ))}
            </select>
            <select
              name="publication_status"
              defaultValue={searchParams.publication_status ?? ""}
              className="h-10 rounded-md border border-line px-3 text-sm"
            >
              <option value="">Todos status</option>
              {publicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              name="quick"
              defaultValue={searchParams.quick ?? ""}
              className="h-10 rounded-md border border-line px-3 text-sm"
            >
              <option value="">Sem filtro rapido</option>
              <option value="blocked">Videos bloqueados</option>
              <option value="viral">Videos viralizados</option>
              <option value="unpublished">Ainda nao publicados</option>
            </select>
            <div className="md:col-span-5 flex gap-2">
              <button className="h-10 rounded-md bg-ink px-4 text-sm font-medium text-white">
                Aplicar filtros
              </button>
              <Link
                href="/videos"
                className="inline-flex h-10 items-center rounded-md border border-line px-4 text-sm font-medium text-ink"
              >
                Limpar
              </Link>
            </div>
          </form>
        </section>

        <VideoList videos={videoList} />
      </div>
    </>
  );
}
