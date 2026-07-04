"use client";

import { MoreVertical, Plus } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import {
  createProject,
  deleteProject,
  updateProject
} from "@/app/(private)/videos/actions";
import type { Project } from "@/lib/types";

type ProjectManagerProps = {
  projects: Project[];
  videoCounts: Record<string, number>;
};

export function ProjectManager({ projects, videoCounts }: ProjectManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [message, setMessage] = useState("");

  function openCreateModal() {
    setEditingProject(null);
    setMessage("");
    setIsOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingProject(project);
    setMessage("");
    setIsOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (editingProject) {
      formData.set("id", editingProject.id);
    }

    const result = editingProject
      ? await updateProject(formData)
      : await createProject(formData);

    if (result?.error) {
      setMessage(result.error);
      return;
    }

    setIsOpen(false);
    router.refresh();
  }

  function handleDelete(project: Project) {
    const confirmed = window.confirm(`Excluir o nicho "${project.name}"?`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProject(project.id);

      if (result?.error) {
        setMessage(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <section className="rounded-md border border-line bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-ink">Nichos</h2>
          <p className="text-sm text-gray-500">
            Internamente, cada nicho e um Project.
          </p>
        </div>
        <Button type="button" className="w-fit gap-2" onClick={openCreateModal}>
          <Plus size={16} />
          Novo Nicho
        </Button>
      </div>

      {message ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {message}
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {projects.length ? (
          projects.map((project) => (
            <article
              key={project.id}
              className="rounded-md border border-line p-4"
              style={{ borderLeftColor: project.color ?? undefined, borderLeftWidth: 4 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-ink">
                    {project.icon ? `${project.icon} ` : ""}
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {videoCounts[project.id] ?? 0} videos
                  </p>
                  {project.description ? (
                    <p className="mt-2 text-sm text-gray-600">
                      {project.description}
                    </p>
                  ) : null}
                </div>

                <details className="relative">
                  <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md border border-line text-gray-700 hover:bg-mist">
                    <MoreVertical size={16} />
                  </summary>
                  <div className="absolute right-0 z-10 mt-2 grid w-40 gap-1 rounded-md border border-line bg-white p-2 shadow-sm">
                    <button
                      type="button"
                      onClick={() => openEditModal(project)}
                      className="rounded-md px-2 py-2 text-left text-sm hover:bg-mist"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(project)}
                      className="rounded-md px-2 py-2 text-left text-sm hover:bg-mist"
                    >
                      Renomear
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(project)}
                      className="rounded-md px-2 py-2 text-left text-sm hover:bg-mist"
                    >
                      Alterar cor
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(project)}
                      className="rounded-md px-2 py-2 text-left text-sm hover:bg-mist"
                    >
                      Alterar icone
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(project)}
                      className="rounded-md px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </div>
                </details>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-gray-600">Nenhum nicho criado ainda.</p>
        )}
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <form
            onSubmit={handleSubmit}
            className="grid w-full max-w-md gap-4 rounded-md bg-white p-5 shadow-lg"
          >
            <div>
              <h2 className="font-semibold text-ink">
                {editingProject ? "Editar Nicho" : "Novo Nicho"}
              </h2>
              <p className="text-sm text-gray-500">
                Use um nome simples, como Creatina ou Casa e Cozinha.
              </p>
            </div>

            <label className="block text-sm font-medium text-gray-700">
              Nome
              <input
                name="name"
                required
                defaultValue={editingProject?.name ?? ""}
                className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700">
                Cor
                <input
                  name="color"
                  defaultValue={editingProject?.color ?? ""}
                  placeholder="#22c55e"
                  className="mt-1 h-10 w-full rounded-md border border-line bg-white px-3 outline-none focus:border-ink"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Icone
                <input
                  name="icon"
                  maxLength={4}
                  defaultValue={editingProject?.icon ?? ""}
                  placeholder="Ex: C"
                  className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-gray-700">
              Descricao
              <textarea
                name="description"
                rows={3}
                defaultValue={editingProject?.description ?? ""}
                className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-ink"
              />
            </label>

            {message ? <p className="text-sm text-red-600">{message}</p> : null}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button>{editingProject ? "Salvar" : "Criar"}</Button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
