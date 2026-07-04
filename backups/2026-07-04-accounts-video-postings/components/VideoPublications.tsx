"use client";

import { ChangeEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setVideoPublication } from "@/app/(private)/videos/actions";
import { platforms } from "@/lib/constants";
import type { VideoPublication } from "@/lib/types";

export function VideoPublications({
  videoId,
  publications
}: {
  videoId: string;
  publications: VideoPublication[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const publicationByPlatform = new Map(
    publications.map((publication) => [publication.platform, publication])
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const formData = new FormData();
    formData.set("video_id", videoId);
    formData.set("platform", event.target.value);
    formData.set("checked", String(event.target.checked));

    setError("");
    startTransition(async () => {
      const result = await setVideoPublication(formData);

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
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {platforms.map((platform) => {
          const publication = publicationByPlatform.get(platform);

          return (
            <label
              key={platform}
              className="flex items-start gap-3 rounded-md border border-line p-3 text-sm"
            >
              <input
                type="checkbox"
                value={platform}
                defaultChecked={Boolean(publication)}
                disabled={isPending}
                onChange={handleChange}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-ink">{platform}</span>
                {publication ? (
                  <span className="text-xs text-gray-500">
                    {new Date(publication.published_at).toLocaleString("pt-BR")}
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">Nao marcado</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </section>
  );
}
