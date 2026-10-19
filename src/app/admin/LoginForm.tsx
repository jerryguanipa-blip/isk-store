"use client";

import { useActionState } from "react";

import { loginAction, type ActionState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, {});

  return (
    <form action={action} className="w-full max-w-sm border border-line p-6">
      <h1 className="display text-xl">PANEL ISK</h1>
      <p className="mt-2 text-sm text-muted">Solo para la tienda.</p>

      <label className="mt-6 block">
        <span className="text-xs text-muted">Contraseña</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
        />
      </label>

      {state.error ? (
        <p role="alert" className="mt-4 text-sm">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full disabled:opacity-60">
        {pending ? "ENTRANDO…" : "ENTRAR"}
      </button>
    </form>
  );
}
