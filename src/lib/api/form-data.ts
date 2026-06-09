import { NextResponse } from "next/server";

export function formText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export function optionalFormText(formData: FormData, key: string) {
  const value = formText(formData, key);

  return value || null;
}

export function formTextArray(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function requireFields(formData: FormData, fields: string[]) {
  const missing = fields.filter((field) => !formText(formData, field));

  if (missing.length > 0) {
    return `Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`;
  }

  return null;
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}
