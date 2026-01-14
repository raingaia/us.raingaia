// assets/js/main.js
(() => {
  "use strict";

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // -----------------------------
  // 1) Navbar scroll state
  // -----------------------------
  const navbar = $("#navbar");
  const setNavState = () => {
    if (!navbar) return;
    const scrolled = window.scrollY > 10;
    navbar.classList.toggle("is-scrolled", scrolled);
  };

  // -----------------------------
  // 2) Smooth scroll for in-page links
  // -----------------------------
  const bindSmoothLinks = () => {
    const links = $$('a[href^="#"], button[data-scrollto]');
    links.forEach((el) => {
      el.addEventListener("click", (e) => {
        const href = el.getAttribute("href");
        const targetId = el.getAttribute("data-scrollto") || (href && href.startsWith("#") ? href : null);
        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        // header yüksekliği kadar offset
        const headerH = navbar ? navbar.getBoundingClientRect().height : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - (headerH + 16);

        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  };

  // -----------------------------
  // 3) Reveal on scroll (IntersectionObserver)
  //    HTML'de .reveal class'ı olan her şey görünür olduğunda açılır
  // -----------------------------
  const initReveal = () => {
    const nodes = $$(".reveal");
    if (!nodes.length) return;

    // default: gizli
    nodes.forEach((n) => n.classList.add("reveal--init"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    nodes.forEach((n) => io.observe(n));
  };

  // -----------------------------
  // 4) Active nav link tracking (ScrollSpy)
  // -----------------------------
  const initScrollSpy = () => {
    const navLinks = $$('#navbar nav a[href^="#"]');
    if (!navLinks.length) return;

    const ids = navLinks
      .map((a) => a.getAttribute("href"))
      .filter(Boolean)
      .filter((h) => h.startsWith("#") && h.length > 1);

    const sections = ids
      .map((id) => document.querySelector(id))
      .filter(Boolean);

    if (!sections.length) return;

    const setActive = () => {
      const pos = window.scrollY + (navbar ? navbar.getBoundingClientRect().height : 0) + 60;

      let current = null;
      for (const sec of sections) {
        if (sec.offsetTop <= pos) current = sec;
      }

      navLinks.forEach((a) => {
        const href = a.getAttribute("href");
        const isActive = current && href === `#${current.id}`;
        a.classList.toggle("active", !!isActive);
      });
    };

    window.addEventListener("scroll", setActive, { passive: true });
    window.addEventListener("resize", setActive);
    setActive();
  };

  // -----------------------------
  // 5) Optional: basic form UX (no backend)
  //    Eğer formun id'si leadForm ise: boş alanları highlight yapar
  // -----------------------------
  const initFormUX = () => {
    const form = $("#leadForm");
    if (!form) return;

    form.addEventListener("submit", () => {
      // mailto script'i zaten ayrıysa burada ekstra bir şey yapmayabilirsin
      // sadece required inputları kısa bir "pulse" ile hissettirelim
      const required = $$("input[required]", form);
      required.forEach((inp) => {
        if (!inp.value.trim()) {
          inp.classList.add("input-error");
          setTimeout(() => inp.classList.remove("input-error"), 800);
        }
      });
    });
  };

  // -----------------------------
  // Init
  // -----------------------------
  const init = () => {
    setNavState();
    bindSmoothLinks();
    initReveal();
    initScrollSpy();
    initFormUX();

    window.addEventListener("scroll", setNavState, { passive: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
