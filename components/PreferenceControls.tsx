"use client";

import * as React from "react";
import { ChevronDown, Languages, Moon, Sun } from "lucide-react";
import type { StoreLanguage, StoreTheme } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const languageOptions: Array<{
  value: StoreLanguage;
  label: string;
  flagSrc: string;
  flagAlt: string;
  dir: "rtl" | "ltr";
}> = [
  {
    value: "ar",
    label: "العربية",
    flagSrc: "/flags/morocco.svg",
    flagAlt: "Moroccan flag",
    dir: "rtl"
  },
  {
    value: "en",
    label: "English",
    flagSrc: "/flags/united-kingdom.svg",
    flagAlt: "United Kingdom flag",
    dir: "ltr"
  }
];

const flagClassName =
  "h-4 w-6 shrink-0 rounded-[2px] border border-white/15 object-cover";
const arabicTextStyle: React.CSSProperties = {
  fontFamily: "Tajawal, ui-sans-serif, system-ui, sans-serif"
};

export function PreferenceControls({
  language,
  theme,
  compact = false,
  languageControl = "buttons",
  showThemeToggle = true
}: {
  language: StoreLanguage;
  theme: StoreTheme;
  compact?: boolean;
  languageControl?: "buttons" | "dropdown";
  showThemeToggle?: boolean;
}) {
  const [currentTheme, setCurrentTheme] = React.useState<StoreTheme>(theme);
  const [currentLanguage, setCurrentLanguage] =
    React.useState<StoreLanguage>(language);
  const [languageOpen, setLanguageOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (showThemeToggle) {
      document.documentElement.dataset.theme = currentTheme;
    }
  }, [currentTheme, showThemeToggle]);

  function saveCookie(name: string, value: string) {
    document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  }

  function changeTheme(nextTheme: StoreTheme) {
    setCurrentTheme(nextTheme);
    saveCookie("wqitak_theme", nextTheme);
  }

  function changeLanguage(nextLanguage: StoreLanguage) {
    if (nextLanguage === currentLanguage) {
      setLanguageOpen(false);
      return;
    }

    setCurrentLanguage(nextLanguage);
    saveCookie("wqitak_lang", nextLanguage);
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = nextLanguage === "ar" ? "rtl" : "ltr";
    window.location.reload();
  }

  React.useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setLanguageOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLanguageOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const buttonClass =
    "focus-ring inline-flex h-9 items-center justify-center rounded-md border border-gold/25 px-2.5 text-xs font-semibold transition-colors duration-300";
  const selectedLanguage =
    languageOptions.find((option) => option.value === currentLanguage) ??
    languageOptions[0];

  if (languageControl === "dropdown") {
    return (
      <div
        className={cn("flex items-center gap-1.5", compact && "gap-1")}
        ref={dropdownRef}
      >
        <div className="relative">
          <button
            type="button"
            className={cn(
              buttonClass,
              "min-w-[118px] justify-between gap-2 bg-white/5 px-3 text-cream/85 hover:border-champagne/70 hover:text-champagne"
            )}
            onClick={() => setLanguageOpen((value) => !value)}
            aria-haspopup="menu"
            aria-expanded={languageOpen}
            aria-label="Select language"
          >
            <span className="flex min-w-0 items-center gap-2">
              <img
                src={selectedLanguage.flagSrc}
                alt={selectedLanguage.flagAlt}
                className={flagClassName}
              />
              <span
                className="truncate"
                dir={selectedLanguage.dir}
                style={
                  selectedLanguage.value === "ar" ? arabicTextStyle : undefined
                }
              >
                {selectedLanguage.label}
              </span>
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                languageOpen && "rotate-180"
              )}
              aria-hidden
            />
          </button>

          {languageOpen ? (
            <div
              className="absolute right-0 top-[calc(100%+0.45rem)] z-50 w-44 overflow-hidden rounded-md border border-gold/25 bg-[#080808] p-1.5 text-cream shadow-[0_18px_48px_rgba(0,0,0,0.42)]"
              role="menu"
            >
              {languageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors duration-200",
                    currentLanguage === option.value
                      ? "bg-gold-sheen text-ink"
                      : "text-cream/78 hover:bg-white/[0.08] hover:text-champagne"
                  )}
                  onClick={() => changeLanguage(option.value)}
                  dir={option.dir}
                  role="menuitem"
                >
                  <img
                    src={option.flagSrc}
                    alt={option.flagAlt}
                    className={flagClassName}
                  />
                  <span
                    className="min-w-0 truncate"
                    style={option.value === "ar" ? arabicTextStyle : undefined}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

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
      {showThemeToggle ? (
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
      ) : null}
    </div>
  );
}
