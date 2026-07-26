/* ==========================================================================
   Theme Module — Dark / Light mode with LocalStorage persistence
   ========================================================================== */

const STORAGE_KEY = "portfolio-theme";

function getPreferredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "light" ? "#f8fafc" : "#09090b");
  }
}

export function initTheme() {
  let currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  const toggleBtn = document.querySelector("[data-theme-toggle]");
  if (!toggleBtn) return;

  toggleBtn.setAttribute("aria-pressed", String(currentTheme === "light"));

  toggleBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
    localStorage.setItem(STORAGE_KEY, currentTheme);
    toggleBtn.setAttribute("aria-pressed", String(currentTheme === "light"));
  });
}
