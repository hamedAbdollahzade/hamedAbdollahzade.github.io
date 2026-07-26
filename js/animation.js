/* ==========================================================================
   Animation Module — Reveal, Counters, Typing Effect, Cursor, Tilt, Magnetic
   ========================================================================== */

function debounce(fn, wait) {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), wait);
  };
}

/* -------------------- Reveal on scroll -------------------- */
export function initRevealOnScroll() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = entry.target.dataset.revealDelay || 0;
        window.setTimeout(() => {
          entry.target.classList.add("is-revealed");
        }, Number(delay));
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* -------------------- Animated counters -------------------- */
function animateCounter(el) {
  const target = Number(el.dataset.countTo || 0);
  const duration = 1600;
  const startTime = performance.now();
  const suffix = el.dataset.countSuffix || "";

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${value}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

export function initCounters() {
  const counters = document.querySelectorAll("[data-count-to]");
  if (!counters.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* -------------------- Typing effect (custom implementation) -------------------- */
export function initTypingEffect() {
  const el = document.querySelector("[data-typed]");
  if (!el) return;

  let phrases = [];
  try {
    phrases = JSON.parse(el.dataset.typed || "[]");
  } catch (e) {
    phrases = [];
  }
  if (!phrases.length) return;

  const textSpan = document.createElement("span");
  textSpan.className = "typed-text";
  const cursorSpan = document.createElement("span");
  cursorSpan.className = "typed-cursor";
  cursorSpan.setAttribute("aria-hidden", "true");
  el.append(textSpan, cursorSpan);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    textSpan.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function step() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    textSpan.textContent = currentPhrase.slice(0, charIndex);

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 300;
    }

    window.setTimeout(step, delay);
  }

  window.setTimeout(step, 500);
}

/* -------------------- Mouse glow (hero) -------------------- */
export function initMouseGlow() {
  const hero = document.querySelector("[data-hero]");
  const glow = document.querySelector("[data-hero-glow]");
  if (!hero || !glow) return;
  if (window.matchMedia("(hover: none)").matches) return;

  let ticking = false;
  let lastX = 0;
  let lastY = 0;

  hero.addEventListener(
    "pointermove",
    (e) => {
      const rect = hero.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      if (!ticking) {
        requestAnimationFrame(() => {
          glow.style.left = `${lastX}px`;
          glow.style.top = `${lastY}px`;
          glow.style.opacity = "1";
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  hero.addEventListener("pointerleave", () => {
    glow.style.opacity = "0";
  });
}

/* -------------------- Cursor follower -------------------- */
export function initCursorFollower() {
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

  const dot = document.querySelector("[data-cursor-dot]");
  const ring = document.querySelector("[data-cursor-ring]");
  if (!dot || !ring) return;

  let ringX = 0;
  let ringY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener(
    "pointermove",
    (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
    },
    { passive: true }
  );

  function animateRing() {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
    el.addEventListener("pointerenter", () => ring.classList.add("is-active"));
    el.addEventListener("pointerleave", () => ring.classList.remove("is-active"));
  });
}

/* -------------------- Card tilt -------------------- */
export function initCardTilt() {
  if (window.matchMedia("(hover: none)").matches) return;
  const cards = document.querySelectorAll("[data-tilt]");

  cards.forEach((card) => {
    let frame = null;

    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.transform = `perspective(800px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
      });
    });

    card.addEventListener("pointerleave", () => {
      if (frame) cancelAnimationFrame(frame);
      card.style.transform = "";
    });
  });
}

/* -------------------- Magnetic buttons -------------------- */
export function initMagneticButtons() {
  if (window.matchMedia("(hover: none)").matches) return;
  const buttons = document.querySelectorAll("[data-magnetic]");

  buttons.forEach((btn) => {
    let frame = null;

    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
    });

    btn.addEventListener("pointerleave", () => {
      if (frame) cancelAnimationFrame(frame);
      btn.style.transform = "";
    });
  });
}

/* -------------------- Resize-aware re-init hook (exported for app.js) -------------------- */
export function onIdleResize(callback) {
  window.addEventListener("resize", debounce(callback, 200));
}
