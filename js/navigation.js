/* ==========================================================================
   Navigation Module — Header state, mobile menu, active-link tracking
   ========================================================================== */

function throttle(fn, wait) {
  let isWaiting = false;
  return (...args) => {
    if (isWaiting) return;
    isWaiting = true;
    fn(...args);
    window.setTimeout(() => {
      isWaiting = false;
    }, wait);
  };
}

function initHeaderScrollState(header) {
  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  update();
  window.addEventListener("scroll", throttle(update, 100), { passive: true });
}

function initMobileMenu(toggle, links) {
  const closeMenu = () => {
    toggle.classList.remove("is-open");
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

function initActiveLinkTracking(sections, navLinks) {
  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const linkMap = new Map();
  navLinks.forEach((link) => {
    const id = link.getAttribute("href")?.replace("#", "");
    if (id) linkMap.set(id, link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkMap.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initScrollProgressBar(bar) {
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = `scaleX(${progress})`;
  };
  update();
  window.addEventListener("scroll", throttle(update, 16), { passive: true });
  window.addEventListener("resize", throttle(update, 200));
}

function initBackToTop(button) {
  const update = () => {
    button.classList.toggle("is-visible", window.scrollY > 480);
  };
  update();
  window.addEventListener("scroll", throttle(update, 150), { passive: true });
  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

export function initNavigation() {
  const header = document.querySelector("[data-site-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinksEl = document.querySelector("[data-nav-links]");
  const scrollBar = document.querySelector("[data-scroll-progress]");
  const backToTop = document.querySelector("[data-back-to-top]");
  const sections = document.querySelectorAll("main section[id]");
  const navAnchorLinks = document.querySelectorAll("[data-nav-links] a");

  if (header) initHeaderScrollState(header);
  if (navToggle && navLinksEl) initMobileMenu(navToggle, navLinksEl);
  if (sections.length && navAnchorLinks.length) {
    initActiveLinkTracking(sections, navAnchorLinks);
  }
  if (scrollBar) initScrollProgressBar(scrollBar);
  if (backToTop) initBackToTop(backToTop);
}
