"use client";

import * as React from "react";
import { Languages, Moon, Sun } from "lucide-react";
import type { StoreLanguage, StoreTheme } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export function PreferenceControls({
  language,
  theme,
  compact = false
}: {
  language: StoreLanguage;
  theme: StoreTheme;
  compact?: boolean;
}) {
  const [currentTheme, setCurrentTheme] = React.useState<StoreTheme>(theme);
  const [currentLanguage, setCurrentLanguage] =
    React.useState<StoreLanguage>(language);

  React.useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
  }, [currentTheme]);

  function saveCookie(name: string, value: string) {
    document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  }

  function changeTheme(nextTheme: StoreTheme) {
    setCurrentTheme(nextTheme);
    saveCookie("wqitak_theme", nextTheme);
  }

  function changeLanguage(nextLanguage: StoreLanguage) {
    setCurrentLanguage(nextLanguage);
    saveCookie("wqitak_lang", nextLanguage);
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = nextLanguage === "ar" ? "rtl" : "ltr";
    window.location.reload();
  }

  const buttonClass =
    "focus-ring inline-flex h-9 items-center justify-center rounded-md border border-gold/25 px-2.5 text-xs font-semibold transition-colors duration-300";

  return (
    <div className={cn("flex items-center gap-1.5", compact && "gap-1")}>
      <button
        type="button"
        className={cn(
          buttonClass,
          currentLanguage === "en"
            ? "bg-gold-sheen text-ink"
            : "bg-white/5 text-cream/75 hover:text-champagne"
        )}
        onClick={() => changeLanguage("en")}
        aria-label="Switch to English"
      >
        <Languages className={cn("h-3.5 w-3.5", !compact && "mr-1")} />
        {!compact ? "EN" : null}
      </button>
      <button
        type="button"
        className={cn(
          buttonClass,
          currentLanguage === "ar"
            ? "bg-gold-sheen text-ink"
            : "bg-white/5 text-cream/75 hover:text-champagne"
        )}
        onClick={() => changeLanguage("ar")}
        aria-label="Switch to Arabic"
      >
        AR
      </button>
      <button
        type="button"
        className={cn(
          buttonClass,
          currentTheme === "light"
            ? "bg-gold-sheen text-ink"
            : "bg-white/5 text-cream/75 hover:text-champagne"
        )}
        onClick={() => changeTheme(currentTheme === "dark" ? "light" : "dark")}
        aria-label="Toggle light and dark mode"
      >
        {currentTheme === "dark" ? (
          <Moon className="h-3.5 w-3.5" />
        ) : (
          <Sun className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
