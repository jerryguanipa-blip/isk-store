import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * Dónde se guarda el JSON de la tienda.
 *
 * - `blob`    → Vercel Blob (recomendado en producción; se activa solo cuando
 *               existe BLOB_READ_WRITE_TOKEN).
 * - `archivo` → archivo local, para desarrollo en la PC.
 * - `temporal`→ carpeta temporal del servidor: funciona, pero se borra cuando
 *               Vercel reinicia la función. Sirve para probar, no para vender.
 */
export type DriverKind = "blob" | "archivo" | "temporal";

const BLOB_PATH = "tienda/store.json";

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function driverKind(): DriverKind {
  if (hasBlob()) return "blob";
  if (process.env.VERCEL) return "temporal";
  return "archivo";
}

/** true cuando los datos se pueden perder en un reinicio. */
export function isEphemeral() {
  return driverKind() === "temporal";
}

function filePath() {
  return driverKind() === "temporal"
    ? join("/tmp", "isk-store", "store.json")
    : join(process.cwd(), ".data", "store.json");
}

async function readFromFile(): Promise<string | null> {
  try {
    return await readFile(filePath(), "utf8");
  } catch {
    return null;
  }
}

async function writeToFile(raw: string): Promise<void> {
  const path = filePath();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, raw, "utf8");
}

async function readFromBlob(): Promise<string | null> {
  const { head } = await import("@vercel/blob");
  try {
    const info = await head(BLOB_PATH);
    const res = await fetch(info.url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function writeToBlob(raw: string): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_PATH, raw, {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 0,
  });
}

export async function readRaw(): Promise<string | null> {
  return driverKind() === "blob" ? readFromBlob() : readFromFile();
}

export async function writeRaw(raw: string): Promise<void> {
  if (driverKind() === "blob") {
    await writeToBlob(raw);
    return;
  }
  await writeToFile(raw);
}
