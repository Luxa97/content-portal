import { login, signup } from "./actions";
import { Button } from "@/components/Button";

export default function LoginPage({
  searchParams
}: {
  searchParams: { message?: string; success?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-4">
      <section className="w-full max-w-sm rounded-md border border-line bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-ink">Portal de Conteudo</h1>
          <p className="mt-1 text-sm text-gray-600">
            Entre para organizar seus videos e ideias.
          </p>
        </div>

        {searchParams.message ? (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {searchParams.message}
          </div>
        ) : null}

        {searchParams.success ? (
          <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            {searchParams.success}
          </div>
        ) : null}

        <form className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Senha
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 h-10 w-full rounded-md border border-line px-3 outline-none focus:border-ink"
            />
          </label>

          <div className="grid gap-2">
            <Button formAction={login}>Entrar</Button>
            <Button formAction={signup} variant="secondary">
              Criar conta
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
