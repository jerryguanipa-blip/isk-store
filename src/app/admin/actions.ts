"use server";

import { revalidatePath } from "next/cache";

import { checkPassword, endSession, isAdmin, startSession } from "@/lib/admin-auth";
import { setOrderStatus, setTracking } from "@/lib/orders";
import { updateStore } from "@/lib/store/db";
import type { OrderStatus } from "@/lib/store/types";

export type ActionState = { error?: string; ok?: string };

/** Toda acción del panel vuelve a comprobar la sesión: el POST es público. */
async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Sesión caducada. Vuelve a entrar.");
}

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    // Pequeña espera para que probar contraseñas a ciegas sea lento
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: "Contraseña incorrecta." };
  }
  await startSession();
  revalidatePath("/admin");
  return { ok: "Bienvenido" };
}

export async function logoutAction(): Promise<void> {
  await endSession();
  revalidatePath("/admin");
}

export async function orderStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  const allowed: OrderStatus[] = ["pagado", "enviado", "cancelado", "en_validacion"];
  if (!allowed.includes(status)) return;
  await setOrderStatus(id, status, "Desde el panel");
  revalidatePath("/admin");
}

export async function trackingAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await setTracking(String(formData.get("id") ?? ""), String(formData.get("tracking") ?? ""));
  revalidatePath("/admin");
}

export async function inventoryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await updateStore((data) => {
    for (const [key, raw] of formData.entries()) {
      if (!key.startsWith("stock:")) continue;
      const [, slug, size] = key.split(":");
      const sizes = data.inventory[slug];
      if (!sizes || !(size in sizes)) continue;
      const value = String(raw).trim();
      sizes[size] = value === "" ? null : Math.max(0, Math.trunc(Number(value) || 0));
    }
  });
  revalidatePath("/admin");
}

export async function settingsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await updateStore((data) => {
    const minutes = Number(formData.get("windowMinutes"));
    data.settings.windowMinutes = Math.min(Math.max(Number.isFinite(minutes) ? minutes : 15, 5), 60);
    data.settings.shalom = formData.get("shalom") === "on";
    data.settings.indriver = formData.get("indriver") === "on";
    data.settings.checkoutEnabled = formData.get("checkoutEnabled") === "on";
  });
  revalidatePath("/admin");
}
