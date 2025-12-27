/* =========================
   أنس أجلاب ♾️ — Vanilla JS
   Theme toggle | Accordion (single-open) | Comments (localStorage) | Active Nav | Print PDF
   ========================= */

(function () {
  const THEME_KEY = "ansajlab_theme";
  const COMMENT_KEY_PREFIX = "ansajlab_comments_"; // + uniqueId

  // -------- Theme
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;

    // fallback: system preference
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      const isDark = theme === "dark";
      btn.setAttribute("aria-pressed", String(isDark));
      btn.querySelector(".emoji").textContent = isDark ? "☀️" : "🌙";
      const label = btn.querySelector(".label");
      if (label) label.textContent = isDark ? "وضع النهار" : "وضع الليل";
    }
  }

  function initTheme() {
    applyTheme(getPreferredTheme());
    const btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  // -------- Active nav
  function initActiveNav() {
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav-links a").forEach(a => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === path) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  // -------- Accordion: one open at a time
  function closeChapter(chapter) {
    chapter.setAttribute("aria-expanded", "false");
    const body = chapter.querySelector(".chapter-body");
    if (body) body.style.maxHeight = "0px";
    const hint = chapter.querySelector(".chapter-header .hint");
    if (hint) hint.textContent = "عرض الفصل";
  }

  function openChapter(chapter) {
    chapter.setAttribute("aria-expanded", "true");
    const body = chapter.querySelector(".chapter-body");
    if (body) {
      // set to scrollHeight for smooth expand
      body.style.maxHeight = body.scrollHeight + "px";
    }
    const hint = chapter.querySelector(".chapter-header .hint");
    if (hint) hint.textContent = "إخفاء الفصل";
  }

  function initAccordion() {
    const chapters = Array.from(document.querySelectorAll(".chapter"));
    if (!chapters.length) return;

    // start closed
    chapters.forEach(closeChapter);

    chapters.forEach(chapter => {
      const header = chapter.querySelector(".chapter-header");
      if (!header) return;

      header.addEventListener("click", () => {
        const isOpen = chapter.getAttribute("aria-expanded") === "true";

        // close others
        chapters.forEach(ch => {
          if (ch !== chapter) closeChapter(ch);
        });

        // toggle current
        if (isOpen) closeChapter(chapter);
        else openChapter(chapter);
      });
    });

    // keep heights correct on resize
    window.addEventListener("resize", () => {
      const openOne = chapters.find(c => c.getAttribute("aria-expanded") === "true");
      if (openOne) {
        const body = openOne.querySelector(".chapter-body");
        if (body) body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  }

  // -------- Comments per chapter (localStorage)
  function nowStamp() {
    const d = new Date();
    // arabic-friendly, but simple:
    return d.toLocaleString("ar-MA", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  function getCommentsKey(uniqueId) {
    return COMMENT_KEY_PREFIX + uniqueId;
  }

  function loadComments(uniqueId) {
    try {
      const raw = localStorage.getItem(getCommentsKey(uniqueId));
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function saveComments(uniqueId, comments) {
    localStorage.setItem(getCommentsKey(uniqueId), JSON.stringify(comments));
  }

  function renderComments(container, comments) {
    container.innerHTML = "";
    if (!comments.length) {
      const empty = document.createElement("div");
      empty.className = "comment";
      empty.innerHTML = `<p class="meta">لا توجد تعليقات بعد.</p><p class="text">كن أول من يترك أثرًا لطيفًا تحت هذا الفصل.</p>`;
      container.appendChild(empty);
      return;
    }

    comments.slice().reverse().forEach(c => {
      const el = document.createElement("div");
      el.className = "comment";
      el.innerHTML = `<p class="meta">${c.date}</p><p class="text"></p>`;
      el.querySelector(".text").textContent = c.text;
      container.appendChild(el);
    });
  }

  function initComments() {
    const blocks = document.querySelectorAll("[data-comments]");
    if (!blocks.length) return;

    blocks.forEach(block => {
      const uniqueId = block.getAttribute("data-comments");
      const textarea = block.querySelector("textarea");
      const submit = block.querySelector("[data-submit-comment]");
      const list = block.querySelector("[data-comment-list]");

      if (!uniqueId || !textarea || !submit || !list) return;

      // initial render
      renderComments(list, loadComments(uniqueId));

      submit.addEventListener("click", () => {
        const text = (textarea.value || "").trim();
        if (!text) {
          textarea.focus();
          return;
        }

        const comments = loadComments(uniqueId);
        comments.push({ text, date: nowStamp() });
        saveComments(uniqueId, comments);

        textarea.value = "";
        renderComments(list, comments);
      });
    });
  }

  // -------- Print PDF (CSS @media print handles formatting)
  function initPrintButtons() {
    document.querySelectorAll("[data-print]").forEach(btn => {
      btn.addEventListener("click", () => {
        // open all chapters for print, then print
        document.querySelectorAll(".chapter").forEach(ch => openChapter(ch));
        setTimeout(() => window.print(), 50);
      });
    });
  }

  // -------- Init
  document.addEventListener("DOMContentLoaded", () => {
  initAccordion();
  initChapterLoader();
});

/* =========================
   Accordion (فتح فصل واحد)
========================= */
function initAccordion() {
  const chapters = document.querySelectorAll(".chapter");

  chapters.forEach(chapter => {
    const header = chapter.querySelector(".chapter-header");
    const body = chapter.querySelector(".chapter-body");
    const hint = chapter.querySelector(".hint");

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
        hint.textContent = "إخفاء الفصل";
      }
    });
  });
}

/* =========================
   تحميل الفصول من ملفات HTML
========================= */
function initChapterLoader() {
  const chapters = document.querySelectorAll(".chapter[data-src]");

  chapters.forEach(chapter => {
    const src = chapter.getAttribute("data-src");
    const container = chapter.querySelector(".chapter-text");

    if (!src || !container) return;

    fetch(src)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then(html => {
        container.innerHTML = html;
      })
      .catch(() => {
        container.innerHTML = "<p>تعذّر تحميل هذا الفصل.</p>";
      });
  });
}

})();
