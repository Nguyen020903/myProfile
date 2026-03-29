/**
 * Portfolio site — modular vanilla JS
 *
 * Reusable “components” are plain DOM regions identified by `data-component`:
 * - site-header: sticky bar + scroll shadow
 * - project-list: container for project cards (styling / future filters)
 * - contact-form: client-side validation + demo submit handler
 *
 * Sections: theme, navigation, smooth scroll, scroll reveal, proficiency bars, contact form.
 */

const STORAGE_KEY = "portfolio-theme";

/* -------------------------------------------------------------------------- */
/* Theme                                                                      */
/* -------------------------------------------------------------------------- */

function getPreferredTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function getStoredTheme() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* ignore */
  }
  return null;
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }
}

function persistTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

function initTheme() {
  const stored = getStoredTheme();
  const theme = stored ?? getPreferredTheme();
  applyTheme(theme);

  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    persistTheme(next);
  });

  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    if (getStoredTheme()) return;
    applyTheme(e.matches ? "light" : "dark");
  });
}

/* -------------------------------------------------------------------------- */
/* Header offset (smooth scroll landing)                                      */
/* -------------------------------------------------------------------------- */

function getScrollMarginTop() {
  const header = document.querySelector(".site-header");
  if (!header) return 0;
  return header.offsetHeight + 8;
}

/* -------------------------------------------------------------------------- */
/* Smooth scrolling for in-page links                                         */
/* -------------------------------------------------------------------------- */

function initSmoothScroll() {
  document.querySelectorAll("[data-scroll-link]").forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - getScrollMarginTop();
      window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* -------------------------------------------------------------------------- */
/* Mobile navigation                                                          */
/* -------------------------------------------------------------------------- */

function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-mobile-nav]");
  if (!toggle || !panel) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  panel.querySelectorAll("[data-mobile-link]").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) setOpen(false);
  });
}

/* -------------------------------------------------------------------------- */
/* Scroll reveal (Intersection Observer)                                      */
/* -------------------------------------------------------------------------- */

function initScrollReveal() {
  if (prefersReducedMotion()) {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  elements.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------------- */
/* Proficiency bars — animate width when visible                              */
/* -------------------------------------------------------------------------- */

function initProficiencyBars() {
  const lists = document.querySelectorAll("[data-proficiency-list]");
  if (!lists.length) return;

  const animateRow = (row) => {
    const bar = row.querySelector(".stack-bar");
    const fill = row.querySelector(".stack-bar__fill");
    if (!bar || !fill) return;
    const level = Number(bar.getAttribute("data-level"));
    if (Number.isFinite(level)) {
      fill.style.width = `${Math.min(100, Math.max(0, level))}%`;
    }
  };

  if (prefersReducedMotion()) {
    lists.forEach((list) => {
      list.querySelectorAll("li").forEach(animateRow);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const list = entry.target;
        list.querySelectorAll("li").forEach((li, i) => {
          window.setTimeout(() => animateRow(li), i * 60);
        });
        obs.unobserve(list);
      });
    },
    { threshold: 0.2 }
  );

  lists.forEach((list) => observer.observe(list));
}

/* -------------------------------------------------------------------------- */
/* Contact form (demo — no network)                                           */
/* -------------------------------------------------------------------------- */

function initContactForm() {
  const form = document.querySelector("[data-component='contact-form']");
  const status = form?.querySelector("[data-form-status]");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    if (!name || !email) {
      status.textContent = "Please fill in name and email.";
      return;
    }
    status.textContent = `Thanks, ${name}. Connect this form to your backend or Formspree to deliver messages.`;
    form.reset();
  });
}

/* -------------------------------------------------------------------------- */
/* Footer year & back to top                                                  */
/* -------------------------------------------------------------------------- */

function initFooter() {
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());

  const btn = document.querySelector("[data-to-top]");
  if (btn) {
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Active nav highlight (optional polish)                                     */
/* -------------------------------------------------------------------------- */

function initActiveSectionNav() {
  const sections = ["hero", "about", "stack", "projects", "experience", "contact"];
  const links = document.querySelectorAll('.site-nav a[href^="#"], .mobile-nav a[href^="#"]');
  if (!links.length) return;

  const map = new Map();
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) map.set(id, el);
  });

  function setActive(id) {
    links.forEach((a) => {
      const href = a.getAttribute("href");
      const match = href === `#${id}`;
      if (match) {
        a.setAttribute("aria-current", "page");
        a.classList.add("is-active");
      } else {
        a.removeAttribute("aria-current");
        a.classList.remove("is-active");
      }
    });
  }

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        if (id) setActive(id);
      });
    },
    { rootMargin: `-45% 0px -45% 0px`, threshold: 0 }
  );

  map.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------------- */
/* Bootstrap                                                                  */
/* -------------------------------------------------------------------------- */

function initSiteHeader() {
  const header = document.querySelector('[data-component="site-header"]');
  if (!header) return;

  function onScroll() {
    const scrolled = window.scrollY > 12;
    header.classList.toggle("is-scrolled", scrolled);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function boot() {
  initTheme();
  initSiteHeader();
  initSmoothScroll();
  initMobileNav();
  initScrollReveal();
  initProficiencyBars();
  initContactForm();
  initFooter();
  initActiveSectionNav();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
