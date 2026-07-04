"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import {
  createVideoPublication,
  deleteVideoPublication,
  updateVideoPublication
} from "@/app/(private)/videos/actions";
import { publicationStatuses } from "@/lib/constants";
import type { Account, VideoPublication } from "@/lib/types";

function dateValue(date: string | null) {
  return date ? date.slice(0, 16) : "";
}

function metricValue(value: number | null) {
  return value?.toString() ?? "";
}

export function VideoPublications({
  videoId,
  accounts,
  publications
}: {
  videoId: string;
  accounts: Account[];
  publications: VideoPublication[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const activeAccounts = accounts.filter((account) => account.status === "ativa");
  const editingPublication =
    publications.find((publication) => publication.id === editingId) ?? null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("video_id", videoId);

    const result = editingPublication
      ? await updateVideoPublication(formData)
      : await createVideoPublication(formData);

    setIsSaving(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    form.reset();
    setEditingId(null);
    router.refresh();
  }

  function handleDelete(publication: VideoPublication) {
    const confirmed = window.confirm("Remover este registro?");

    if (!confirmed) {
      return;
    }

    setIsSaving(true);
    deleteVideoPublication(publication.id, videoId).then((result) => {
      setIsSaving(false);

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <section className="rounded-md border border-line bg-white p-5">
      <h2 className="font-semibold text-ink">Publicado em</h2>
      <p className="mt-1 text-sm text-gray-500">
        Onde este video foi publicado e como cada postagem performou.
      </p>

      <div className="mt-4 grid gap-3">
        {publications.length ? (
          publications.map((publication) => (
            <article key={publication.id} className="rounded-md border border-line p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {publication.accounts?.platform ?? "Conta"} | @
                    {publication.accounts?.username ?? "-"}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    Status: {publication.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    Views: {publication.views ?? "-"} | Likes:{" "}
                    {publication.likes ?? "-"} | Comentarios:{" "}
                    {publication.comments_count ?? "-"} | Shares:{" "}
                    {publication.shares ?? "-"}
                  </p>
                  {publication.notes ? (
                    <p className="mt-2 text-sm text-gray-600">
                      Observacoes: {publication.notes}
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditingId(publication.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleDelete(publication)}
                    disabled={isSaving}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-gray-600">Nenhuma postagem registrada ainda.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 rounded-md bg-mist p-4">
        <h3 className="font-medium text-ink">
          {editingPublication ? "Editar postagem" : "Adicionar nova postagem"}
        </h3>
        {editingPublication ? (
          <input type="hidden" name="id" value={editingPublication.id} />
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-gray-700">
            Conta
            <select
              name="account_id"
              required
              defaultValue={editingPublication?.account_id ?? ""}
              className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
            >
              <option value="">Selecione</option>
              {activeAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.platform} | @{account.username}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Status
            <select
              name="status"
              defaultValue={editingPublication?.status ?? publicationStatuses[0]}
              className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
            >
              {publicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-gray-700">
            Data da postagem
            <input
              name="posted_at"
              type="datetime-local"
              defaultValue={dateValue(editingPublication?.posted_at ?? null)}
              className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Link do post
            <input
              name="post_url"
              type="url"
              defaultValue={editingPublication?.post_url ?? ""}
              className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <input name="views" type="number" min="0" placeholder="Views" defaultValue={metricValue(editingPublication?.views ?? null)} className="h-10 rounded-md border border-line px-3 outline-none focus:border-ink" />
          <input name="likes" type="number" min="0" placeholder="Likes" defaultValue={metricValue(editingPublication?.likes ?? null)} className="h-10 rounded-md border border-line px-3 outline-none focus:border-ink" />
          <input name="comments_count" type="number" min="0" placeholder="Comentarios" defaultValue={metricValue(editingPublication?.comments_count ?? null)} className="h-10 rounded-md border border-line px-3 outline-none focus:border-ink" />
          <input name="shares" type="number" min="0" placeholder="Shares" defaultValue={metricValue(editingPublication?.shares ?? null)} className="h-10 rounded-md border border-line px-3 outline-none focus:border-ink" />
        </div>

        <label className="block text-sm font-medium text-gray-700">
          Observacoes
          <textarea
            name="notes"
            rows={3}
            defaultValue={editingPublication?.notes ?? ""}
            className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-ink"
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex gap-2">
          <Button disabled={isSaving}>
            {isSaving ? "Salvando..." : editingPublication ? "Salvar" : "Adicionar"}
          </Button>
          {editingPublication ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditingId(null)}
            >
              Cancelar edicao
            </Button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
