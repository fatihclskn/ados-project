export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'ados.theme';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredTheme(): ThemeMode {
  if (!canUseStorage()) {
    return getSystemTheme();
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return getSystemTheme();
}

export function applyTheme(theme: ThemeMode) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function setStoredTheme(theme: ThemeMode) {
  if (canUseStorage()) {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  applyTheme(theme);
}

export function initializeTheme() {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
}
