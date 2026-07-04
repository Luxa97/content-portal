import { DownloadFileButton } from "@/components/DownloadFileButton";
import { EmptyState } from "@/components/EmptyState";
import { MediaUploadForm } from "@/components/MediaUploadForm";
import { PageHeader } from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import type { MediaAsset } from "@/lib/types";

function getFileName(fileUrl: string) {
  return fileUrl.split("/").pop() ?? fileUrl;
}

function formatFileSize(size: number | null) {
  if (!size) {
    return "-";
  }

  const megabytes = size / 1024 / 1024;
  return `${megabytes.toFixed(1)} MB`;
}

export default async function MediaPage() {
  const supabase = await createClient();

  const { data: assets } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  const mediaItems = (assets ?? []) as MediaAsset[];

  return (
    <>
      <PageHeader
        title="Media Library"
        description="Videos, fotos e arquivos originais preservados sem perda de qualidade."
      />

      <div className="grid gap-6">
        <section>
          <h2 className="mb-3 font-semibold text-ink">Novo arquivo</h2>
          <MediaUploadForm />
        </section>

        {mediaItems.length ? (
          <div className="overflow-hidden rounded-md border border-line bg-white">
            <div className="hidden grid-cols-[1fr_100px_1fr_100px_130px_150px] gap-3 border-b border-line bg-mist px-5 py-3 text-xs font-semibold uppercase text-gray-500 xl:grid">
              <span>Nome</span>
              <span>Tipo</span>
              <span>Arquivo</span>
              <span>Tamanho</span>
              <span>Upload</span>
              <span>Download</span>
            </div>

            <div className="divide-y divide-line">
              {mediaItems.map((asset) => (
                <article
                  key={asset.id}
                  className="grid gap-3 px-5 py-4 xl:grid-cols-[1fr_100px_1fr_100px_130px_150px] xl:items-center"
                >
                  <p className="font-medium text-ink">{asset.title}</p>
                  <p className="text-sm capitalize text-gray-700">
                    {asset.asset_type}
                  </p>
                  <p className="break-all text-sm text-gray-600">
                    {asset.original_filename || getFileName(asset.storage_path)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(asset.file_size)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {asset.uploaded_at
                      ? new Date(asset.uploaded_at).toLocaleDateString("pt-BR")
                      : "-"}
                  </p>
                  <DownloadFileButton
                    fileUrl={asset.storage_path}
                    originalFilename={asset.original_filename}
                  />
                </article>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState text="Nenhum arquivo enviado ainda." />
        )}
      </div>
    </>
  );
}
