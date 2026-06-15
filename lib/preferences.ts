import { cookies } from "next/headers";

export type StoreLanguage = "en" | "ar";
export type StoreTheme = "dark" | "light";

export function isStoreLanguage(value: string | undefined): value is StoreLanguage {
  return value === "en" || value === "ar";
}

export function isStoreTheme(value: string | undefined): value is StoreTheme {
  return value === "dark" || value === "light";
}

export function getServerLanguage(): StoreLanguage {
  const value = cookies().get("wqitak_lang")?.value;
  return isStoreLanguage(value) ? value : "ar";
}

export function getServerTheme(): StoreTheme {
  const value = cookies().get("wqitak_theme")?.value;
  return isStoreTheme(value) ? value : "dark";
}

export function getTextDirection(language: StoreLanguage) {
  return language === "ar" ? "rtl" : "ltr";
}
