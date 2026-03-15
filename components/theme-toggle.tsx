"use client"

import { useEffect, useState } from "react"
import { THEME_STORAGE_KEY, ThemePreference, resolveThemePreference, themeOptions } from "@/lib/theme"

const themeLabels: Record<ThemePreference, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
}

function getInitialThemePreference(): ThemePreference {
  if (typeof document === "undefined") {
    return "system"
  }

  const value = document.documentElement.dataset.themePreference

  if (value && themeOptions.includes(value as ThemePreference)) {
    return value as ThemePreference
  }

  return "system"
}

function applyTheme(themePreference: ThemePreference) {
  const resolvedTheme = resolveThemePreference(
    themePreference,
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )

  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.dataset.themePreference = themePreference
  document.documentElement.style.colorScheme = resolvedTheme
}

export function ThemeToggle() {
  const [themePreference, setThemePreference] = useState<ThemePreference>("system")

  useEffect(() => {
    const initialThemePreference = getInitialThemePreference()
    setThemePreference(initialThemePreference)
    applyTheme(initialThemePreference)

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleMediaChange = () => {
      const nextPreference = getInitialThemePreference()
      if (nextPreference === "system") {
        applyTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleMediaChange)

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange)
    }
  }, [])

  return (
    <label className="flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-panel-strong)] px-3 py-2 text-sm text-[color:var(--text-secondary)] shadow-[var(--shadow-soft)]">
      <span className="font-medium text-[color:var(--text-primary)]">Theme</span>
      <select
        aria-label="Select theme"
        className="rounded-full border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-[color:var(--text-secondary)] outline-none focus:border-[color:var(--accent)]"
        value={themePreference}
        onChange={(event) => {
          const nextTheme = event.target.value as ThemePreference
          setThemePreference(nextTheme)
          window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
          applyTheme(nextTheme)
        }}
      >
        {themeOptions.map((option) => (
          <option key={option} value={option}>
            {themeLabels[option]}
          </option>
        ))}
      </select>
    </label>
  )
}
