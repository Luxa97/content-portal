"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { addVideoComment } from "@/app/(private)/videos/actions";
import type { VideoComment } from "@/lib/types";

export function VideoComments({
  videoId,
  comments
}: {
  videoId: string;
  comments: VideoComment[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("video_id", videoId);

    const result = await addVideoComment(formData);
    setIsSaving(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    form.reset();
    router.refresh();
  }

  return (
    <section className="rounded-md border border-line bg-white p-5">
      <h2 className="font-semibold text-ink">Comentarios internos</h2>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
        <textarea
          name="body"
          required
          rows={3}
          placeholder="Ex: Postado no Instagram, falta legenda, video aprovado..."
          className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-ink"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button className="w-fit" disabled={isSaving}>
          {isSaving ? "Salvando..." : "Adicionar comentario"}
        </Button>
      </form>

      <div className="mt-5 grid gap-3">
        {comments.length ? (
          comments.map((comment) => (
            <article key={comment.id} className="rounded-md bg-mist p-3">
              <p className="text-sm text-ink">{comment.body}</p>
              <p className="mt-2 text-xs text-gray-500">
                {comment.user_email ?? "Usuario"} -{" "}
                {new Date(comment.created_at).toLocaleString("pt-BR")}
              </p>
            </article>
          ))
        ) : (
          <p className="text-sm text-gray-600">Nenhum comentario ainda.</p>
        )}
      </div>
    </section>
  );
}
