import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "isk_admin";
const MAX_AGE = 60 * 60 * 8; // 8 horas

function password(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

/** El panel no se puede abrir mientras no exista ADMIN_PASSWORD. */
export function adminConfigured(): boolean {
  return password().length >= 6;
}

function secret(): string {
  return process.env.ADMIN_SECRET || password();
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkPassword(input: string): boolean {
  if (!adminConfigured()) return false;
  return safeEqual(input, password());
}

export async function startSession(): Promise<void> {
  const issuedAt = String(Date.now());
  const token = `${issuedAt}.${sign(issuedAt)}`;
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(COOKIE)?.value ?? "";
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;
  if (!safeEqual(signature, sign(issuedAt))) return false;
  return Date.now() - Number(issuedAt) < MAX_AGE * 1000;
}
