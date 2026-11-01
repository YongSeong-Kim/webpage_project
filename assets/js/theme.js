/**
 * Light / dark page theme.
 * - Light is the default. The header button switches to dark and back.
 * - Choice is kept in localStorage key: astm_theme
 * - Loaded in <head> so the page does not flash white before turning dark.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "astm_theme";

  function readSaved() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function apply(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  apply(readSaved());

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        apply(next);
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {
          // Private mode: the choice just isn't remembered.
        }
      });
    });
  });
})();
