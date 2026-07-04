import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import { Button } from "@/components/Button";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/videos", label: "Videos" },
  { href: "/media", label: "Media Library" },
  { href: "/hooks", label: "Hooks" },
  { href: "/referencias", label: "Referencias" }
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <Link href="/dashboard" className="text-lg font-semibold text-ink">
              Portal de Conteudo
            </Link>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <form action={logout}>
            <Button variant="secondary" className="gap-2">
              <LogOut size={16} />
              Sair
            </Button>
          </form>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[180px_1fr]">
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
}
