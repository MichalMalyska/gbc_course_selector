export const THEME_STORAGE_KEY = "gbc-theme"

export const themeOptions = ["system", "light", "dark"] as const

export type ThemePreference = (typeof themeOptions)[number]

export const themeScript = `(() => {
  const storageKey = "${THEME_STORAGE_KEY}";
  const themeOptions = ["system", "light", "dark"];
  const root = document.documentElement;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const getStoredTheme = () => {
    const storedValue = window.localStorage.getItem(storageKey);
    return themeOptions.includes(storedValue) ? storedValue : "system";
  };

  const applyTheme = (themePreference) => {
    const resolvedTheme =
      themePreference === "system"
        ? mediaQuery.matches
          ? "dark"
          : "light"
        : themePreference;

    root.dataset.theme = resolvedTheme;
    root.dataset.themePreference = themePreference;
    root.style.colorScheme = resolvedTheme;
  };

  applyTheme(getStoredTheme());
})();`

export function resolveThemePreference(themePreference: ThemePreference, prefersDark: boolean) {
  if (themePreference === "system") {
    return prefersDark ? "dark" : "light"
  }

  return themePreference
}
