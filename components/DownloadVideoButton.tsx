"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/browser";

function getFileName(filePath: string) {
  return filePath.split("/").pop() || "video-original";
}

export function DownloadVideoButton({ fileUrl }: { fileUrl: string }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setIsDownloading(true);
    setError("");

    if (fileUrl.startsWith("http")) {
      window.location.href = fileUrl;
      setIsDownloading(false);
      return;
    }

    const supabase = createClient();
    const { data, error: downloadError } = await supabase.storage
      .from("videos")
      .createSignedUrl(fileUrl, 60, {
        download: getFileName(fileUrl)
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
