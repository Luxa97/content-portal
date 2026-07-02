"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteVideo } from "@/app/(private)/videos/actions";
import { Button } from "@/components/Button";

export function DeleteVideoButton({ videoId }: { videoId: string }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm("Tem certeza que deseja excluir este video?");

    if (!confirmed) {
      return;
    }

    const result = await deleteVideo(videoId);

    if (result?.error) {
      window.alert(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <Button type="button" variant="danger" onClick={handleDelete} className="gap-2 px-3">
      <Trash2 size={15} />
      Excluir
    </Button>
  );
}
