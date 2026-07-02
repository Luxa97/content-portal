import { PageHeader } from "@/components/PageHeader";

const references = [
  {
    title: "Comparativo rapido",
    platform: "TikTok",
    note: "Mostrar problema, comparacao e resultado em poucos segundos."
  },
  {
    title: "Prova social",
    platform: "Instagram",
    note: "Usar comentarios, duvidas comuns e demonstracao simples."
  },
  {
    title: "Oferta com demonstracao",
    platform: "Shopee",
    note: "Mostrar produto, beneficio principal e chamada para compra."
  }
];

export default function ReferenciasPage() {
  return (
    <>
      <PageHeader
        title="Referencias Virais"
        description="Modelos simples para observar e adaptar."
      />

      <div className="grid gap-4">
        {references.map((reference) => (
          <article key={reference.title} className="rounded-md border border-line bg-white p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-semibold text-ink">{reference.title}</h2>
              <span className="w-fit rounded-md bg-mist px-2 py-1 text-xs font-medium text-gray-700">
                {reference.platform}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-600">{reference.note}</p>
          </article>
        ))}
      </div>
    </>
  );
}
