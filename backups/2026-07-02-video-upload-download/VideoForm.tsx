import { Save } from "lucide-react";
import { Button } from "@/components/Button";
import {
  niches,
  platforms,
  responsibles,
  statuses,
  videoTypes
} from "@/lib/constants";
import type { Video } from "@/lib/types";

type VideoFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  video?: Video;
  submitLabel?: string;
};

export function VideoForm({
  action,
  video,
  submitLabel = "Salvar video"
}: VideoFormProps) {
  return (
    <form action={action} className="grid gap-4 rounded-md border border-line bg-white p-5">
      {video ? <input type="hidden" name="id" value={video.id} /> : null}

      <label className="block text-sm font-medium text-gray-700">
        Titulo
        <input
          name="title"
          required
          defaultValue={video?.title ?? ""}
          placeholder="Ex: 3 erros ao tomar creatina"
          className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-sm font-medium text-gray-700">
          Nicho
          <select
            name="niche"
            defaultValue={video?.niche ?? niches[0]}
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          >
            {niches.map((niche) => (
              <option key={niche} value={niche}>
                {niche}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Plataforma
          <select
            name="platform"
            defaultValue={video?.platform ?? platforms[0]}
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          >
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Status
          <select
            name="status"
            defaultValue={video?.status ?? statuses[0]}
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700">
          Responsavel
          <select
            name="responsible"
            defaultValue={video?.responsible ?? responsibles[0]}
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          >
            {responsibles.map((responsible) => (
              <option key={responsible} value={responsible}>
                {responsible}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Tipo de video
          <select
            name="video_type"
            defaultValue={video?.video_type ?? videoTypes[0]}
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          >
            {videoTypes.map((videoType) => (
              <option key={videoType} value={videoType}>
                {videoType}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-gray-700">
        Hook
        <input
          name="hook"
          defaultValue={video?.hook ?? ""}
          placeholder="Primeira frase do video"
          className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700">
          Link do produto
          <input
            name="product_link"
            type="url"
            defaultValue={video?.product_link ?? ""}
            placeholder="https://..."
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Link do arquivo
          <input
            name="file_url"
            type="url"
            defaultValue={video?.file_url ?? ""}
            placeholder="Opcional por enquanto"
            className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-gray-700">
        Observacoes
        <textarea
          name="notes"
          defaultValue={video?.notes ?? ""}
          rows={4}
          className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-ink"
        />
      </label>

      <Button className="w-fit gap-2">
        <Save size={16} />
        {submitLabel}
      </Button>
    </form>
  );
}
