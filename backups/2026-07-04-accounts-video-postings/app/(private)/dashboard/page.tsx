import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { responsibles, statuses } from "@/lib/constants";

function getProjectName(video: { projects?: { name: string }[] | { name: string } | null; niche: string }) {
  if (Array.isArray(video.projects)) {
    return video.projects[0]?.name ?? video.niche;
  }

  return video.projects?.name ?? video.niche;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: videos } = await supabase
    .from("videos")
    .select("id,title,niche,platform,status,responsible,created_at,project_id,projects(name)")
    .order("created_at", { ascending: false });

  const videoList = videos ?? [];
  const projectList = projects ?? [];
  const recentVideos = videoList.slice(0, 5);

  const countByProject = (projectId: string) => {
    return videoList.filter((video) => video.project_id === projectId).length;
  };

  const countByStatus = (status: string) => {
    return videoList.filter((video) => video.status === status).length;
  };

  const countByResponsible = (responsible: string) => {
    return videoList.filter((video) => video.responsible === responsible).length;
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Dashboard"
          description="Producao de conteudo de Lucas e Larissa."
        />

        <Link
          href="/videos"
          className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-medium text-white hover:bg-black"
        >
          <Plus size={16} />
          Novo video
        </Link>
      </div>

      <section className="rounded-md border border-line bg-white p-5">
        <p className="text-sm text-gray-500">Total de videos cadastrados</p>
        <strong className="mt-2 block text-4xl text-ink">{videoList.length}</strong>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-semibold text-ink">Videos por nicho</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {projectList.map((project) => (
            <div key={project.id} className="rounded-md border border-line bg-white p-5">
              <p className="text-sm text-gray-500">{project.name}</p>
              <strong className="mt-2 block text-3xl text-ink">
                {countByProject(project.id)}
              </strong>
            </div>
          ))}
          {!projectList.length ? (
            <div className="rounded-md border border-line bg-white p-5 text-sm text-gray-600">
              Nenhum nicho criado ainda.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-semibold text-ink">Videos por status</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statuses.map((status) => (
            <div key={status} className="rounded-md border border-line bg-white p-5">
              <p className="text-sm capitalize text-gray-500">{status}</p>
              <strong className="mt-2 block text-3xl text-ink">
                {countByStatus(status)}
              </strong>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-semibold text-ink">Videos por responsavel</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {responsibles.map((responsible) => (
            <div
              key={responsible}
              className="rounded-md border border-line bg-white p-5"
            >
              <p className="text-sm text-gray-500">{responsible}</p>
              <strong className="mt-2 block text-3xl text-ink">
                {countByResponsible(responsible)}
              </strong>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-md border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-semibold text-ink">Ultimos videos enviados</h2>
          <Link href="/videos" className="text-sm font-medium text-ink underline">
            Ver todos
          </Link>
        </div>

        <div className="divide-y divide-line">
          {recentVideos.length ? (
            recentVideos.map((video) => (
              <div
                key={video.id}
                className="grid gap-2 px-5 py-4 md:grid-cols-[1fr_150px_120px_110px]"
              >
                <div>
                  <p className="font-medium text-ink">{video.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(video.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {getProjectName(video)}
                </p>
                <p className="text-sm text-gray-600">{video.platform}</p>
                <span className="w-fit rounded-md bg-mist px-2 py-1 text-xs font-medium capitalize text-gray-700">
                  {video.status}
                </span>
              </div>
            ))
          ) : (
            <p className="px-5 py-8 text-sm text-gray-600">
              Nenhum video cadastrado ainda.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
