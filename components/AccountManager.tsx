"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/Button";
import {
  archiveAccount,
  createAccount,
  updateAccount
} from "@/app/(private)/videos/actions";
import { accountStatuses, platforms } from "@/lib/constants";
import type { Account, Project } from "@/lib/types";

type AccountManagerProps = {
  accounts: Account[];
  projects: Project[];
};

export function AccountManager({ accounts, projects }: AccountManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [projectFilter, setProjectFilter] = useState("");
  const [message, setMessage] = useState("");

  const filteredAccounts = projectFilter
    ? accounts.filter((account) => account.project_id === projectFilter)
    : accounts;

  function openCreateModal() {
    setEditingAccount(null);
    setMessage("");
    setIsOpen(true);
  }

  function openEditModal(account: Account) {
    setEditingAccount(account);
    setMessage("");
    setIsOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (editingAccount) {
      formData.set("id", editingAccount.id);
    }

    const result = editingAccount
      ? await updateAccount(formData)
      : await createAccount(formData);

    if (result?.error) {
      setMessage(result.error);
      return;
    }

    setIsOpen(false);
    router.refresh();
  }

  function handleArchive(account: Account) {
    startTransition(async () => {
      const result = await archiveAccount(account.id);

      if (result?.error) {
        setMessage(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <section className="rounded-md border border-line bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-ink">Contas</h2>
          <p className="text-sm text-gray-500">
            Cadastre as contas reais onde os videos podem ser publicados.
          </p>
        </div>
        <Button type="button" className="w-fit gap-2" onClick={openCreateModal}>
          <Plus size={16} />
          Nova conta
        </Button>
      </div>

      <label className="mt-4 block max-w-sm text-sm font-medium text-gray-700">
        Filtrar por nicho
        <select
          value={projectFilter}
          onChange={(event) => setProjectFilter(event.target.value)}
          className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
        >
          <option value="">Todos</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>

      {message ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {message}
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {filteredAccounts.length ? (
          filteredAccounts.map((account) => (
            <article key={account.id} className="rounded-md border border-line p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    {account.platform}
                  </p>
                  <h3 className="mt-1 font-medium text-ink">{account.name}</h3>
                  <p className="text-sm text-gray-600">@{account.username}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {account.projects?.name ?? "Sem nicho"} - {account.status}
                  </p>
                </div>

                <details className="relative">
                  <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md border border-line text-gray-700 hover:bg-mist">
                    <MoreVertical size={16} />
                  </summary>
                  <div className="absolute right-0 z-10 mt-2 grid w-40 gap-1 rounded-md border border-line bg-white p-2 shadow-sm">
                    <button
                      type="button"
                      onClick={() => openEditModal(account)}
                      className="rounded-md px-2 py-2 text-left text-sm hover:bg-mist"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleArchive(account)}
                      className="rounded-md px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Inativar
                    </button>
                  </div>
                </details>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-gray-600">Nenhuma conta cadastrada.</p>
        )}
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <form
            onSubmit={handleSubmit}
            className="grid w-full max-w-md gap-4 rounded-md bg-white p-5 shadow-lg"
          >
            <h2 className="font-semibold text-ink">
              {editingAccount ? "Editar conta" : "Nova conta"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700">
                Plataforma
                <select
                  name="platform"
                  defaultValue={editingAccount?.platform ?? platforms[0]}
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
                Nicho
                <select
                  name="project_id"
                  defaultValue={editingAccount?.project_id ?? ""}
                  className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
                >
                  <option value="">Sem nicho</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium text-gray-700">
              Nome
              <input
                name="name"
                required
                defaultValue={editingAccount?.name ?? ""}
                className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Usuario
              <input
                name="username"
                required
                defaultValue={editingAccount?.username ?? ""}
                placeholder="conta1"
                className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Status
              <select
                name="status"
                defaultValue={editingAccount?.status ?? "ativa"}
                className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
              >
                {accountStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Observacoes
              <textarea
                name="notes"
                rows={3}
                defaultValue={editingAccount?.notes ?? ""}
                className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-ink"
              />
            </label>

            {message ? <p className="text-sm text-red-600">{message}</p> : null}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button>{editingAccount ? "Salvar" : "Criar"}</Button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
