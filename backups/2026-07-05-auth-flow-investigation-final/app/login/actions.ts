"use server";

import { redirect } from "next/navigation";
import { isAllowedEmail } from "@/lib/allowed-users";
import { createClient } from "@/lib/supabase/server";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");

  if (!name || !domain) {
    return "email-invalido";
  }

  return `${name.slice(0, 2)}***@${domain}`;
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  console.info("[auth-debug] Login iniciado", { email: maskEmail(email) });

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.warn("[auth-debug] Supabase bloqueou login", {
      email: maskEmail(email),
      message: error.message
    });

    redirect(
      "/login?message=E-mail%20ou%20senha%20incorretos%20ou%20usuario%20inexistente"
    );
  }

  console.info("[auth-debug] Login autorizado pelo Supabase", {
    email: maskEmail(email)
  });

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!isAllowedEmail(email)) {
    console.warn("[auth-debug] Cadastro bloqueado pela allowlist", {
      email: maskEmail(email)
    });
    redirect("/login?message=Acesso%20nao%20autorizado");
  }

  console.info("[auth-debug] Cadastro permitido pela allowlist", {
    email: maskEmail(email)
  });

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.warn("[auth-debug] Supabase bloqueou cadastro", {
      email: maskEmail(email),
      message: error.message
    });
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?success=Conta criada. Agora faca login.");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
