import { PageHeader } from "@/components/PageHeader";

const hooks = [
  {
    niche: "Creatina",
    items: [
      "Voce esta tomando creatina do jeito errado?",
      "O que ninguem te conta sobre creatina no primeiro mes",
      "3 sinais de que sua creatina virou rotina de verdade"
    ]
  },
  {
    niche: "Cinta Modeladora",
    items: [
      "Esse detalhe muda como a cinta veste no corpo",
      "Antes de comprar cinta modeladora, veja isso",
      "Como escolher uma cinta sem passar desconforto"
    ]
  }
];

export default function HooksPage() {
  return (
    <>
      <PageHeader
        title="Hooks"
        description="Ideias iniciais de abertura para seus videos."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {hooks.map((group) => (
          <section key={group.niche} className="rounded-md border border-line bg-white p-5">
            <h2 className="font-semibold text-ink">{group.niche}</h2>
            <ul className="mt-4 grid gap-3">
              {group.items.map((item) => (
                <li key={item} className="rounded-md bg-mist p-3 text-sm text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
