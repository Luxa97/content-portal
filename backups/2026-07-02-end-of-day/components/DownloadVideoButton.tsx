"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/browser";

function getFileName(filePath: string, originalFilename?: string | null) {
  return originalFilename || filePath.split("/").pop() || "video-original";
}

export function DownloadVideoButton({
  fileUrl,
  originalFilename
}: {
  fileUrl: string;
  originalFilename?: string | null;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setIsDownloading(true);
    setError("");

    if (!fileUrl || fileUrl.startsWith("http")) {
      setError("Arquivo privado invalido para download.");
      setIsDownloading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Voce precisa estar logado para baixar o video.");
      setIsDownloading(false);
      return;
    }

    const { data, error: downloadError } = await supabase.storage
      .from("videos")
      .createSignedUrl(fileUrl, 60, {
        download: getFileName(fileUrl, originalFilename)
      });

    if (downloadError || !data?.signedUrl) {
      setError("Nao foi possivel baixar o video.");
      setIsDownloading(false);
      return;
    }

    window.location.href = data.signedUrl;
    setIsDownloading(false);
  }

  return (
    <div className="grid gap-1">
      <Button
        type="button"
        variant="secondary"
        onClick={handleDownload}
        disabled={isDownloading}
        className="gap-2 px-3"
      >
        <Download size={15} />
        {isDownloading ? "Preparando..." : "Baixar video"}
      </Button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
