/* =========================
   أنس أجلاب ♾️ — Vanilla JS (FINAL)
   Theme Toggle | Accordion | External Chapters
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initAccordion();
  initChapterLoader();
});

/* =========================
   🌙 Theme Toggle (Dark / Light)
   ========================= */

const THEME_KEY = "ansajlab_theme";

function initTheme() {
  const toggleBtn = document.querySelector("[data-theme-toggle]");
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");

  applyTheme(theme);

  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const toggleBtn = document.querySelector("[data-theme-toggle]");
  if (!toggleBtn) return;

  const emoji = toggleBtn.querySelector(".emoji");
  const label = toggleBtn.querySelector(".label");

  if (emoji) emoji.textContent = theme === "dark" ? "☀️" : "🌙";
  if (label) label.textContent = theme === "dark" ? "وضع النهار" : "وضع الليل";
}

/* =========================
   📚 Accordion (فتح فصل واحد فقط)
   ========================= */

function initAccordion() {
  const chapters = document.querySelectorAll(".chapter");

  chapters.forEach(chapter => {
    const header = chapter.querySelector(".chapter-header");
    const body = chapter.querySelector(".chapter-body");
    const hint = chapter.querySelector(".hint");

    if (!header || !body) return;

    body.style.maxHeight = "0px";

    header.addEventListener("click", () => {
      const isOpen = chapter.getAttribute("aria-expanded") === "true";

      chapters.forEach(c => {
        c.setAttribute("aria-expanded", "false");
        const b = c.querySelector(".chapter-body");
        if (b) b.style.maxHeight = "0px";
        const h = c.querySelector(".hint");
        if (h) h.textContent = "عرض الفصل";
      });

      if (!isOpen) {
        chapter.setAttribute("aria-expanded", "true");
        body.style.maxHeight = body.scrollHeight + "px";
        if (hint) hint.textContent = "إخفاء الفصل";
      }
    });
  });
}

/* =========================
   📄 Load Chapters from HTML files
   ========================= */

function initChapterLoader() {
  const chapters = document.querySelectorAll(".chapter[data-src]");

  chapters.forEach(chapter => {
    const src = chapter.getAttribute("data-src");
    const container = chapter.querySelector(".chapter-text");

    if (!src || !container) return;

    fetch(src)
      .then(response => {
        if (!response.ok) throw new Error("Load failed");
        return response.text();
      })
      .then(html => {
        container.innerHTML = html;
      })
      .catch(() => {
        container.innerHTML = "<p>تعذّر تحميل هذا الفصل.</p>";
      });
  });
}

