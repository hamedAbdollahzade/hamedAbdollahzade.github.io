/* ==========================================================================
   App Entry — Bootstraps all feature modules
   ========================================================================== */

import {initTheme} from "./theme.js";
import {initNavigation} from "./navigation.js";
import {
    initRevealOnScroll,
    initCounters,
    initTypingEffect,
    initMouseGlow,
    initCursorFollower,
    initCardTilt,
    initMagneticButtons,
} from "./animation.js";
import {initProjects} from "./projects.js";

/* -------------------- Contact form -------------------- */
function validateField(input) {
    const errorEl = input.closest(".form-group")?.querySelector(".form-error");
    let message = "";

    if (input.validity.valueMissing) {
        message = "این فیلد الزامی است.";
    } else if (input.validity.typeMismatch && input.type === "email") {
        message = "لطفاً یک ایمیل معتبر وارد کنید.";
    } else if (input.validity.tooShort) {
        message = `حداقل ${input.minLength} کاراکتر وارد کنید.`;
    }

    if (errorEl) errorEl.textContent = message;
    input.setAttribute("aria-invalid", String(Boolean(message)));
    return message === "";
}

function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;

    const statusEl = form.querySelector("[data-form-status]");
    const submitBtn = form.querySelector("[data-form-submit]");
    const inputs = form.querySelectorAll("input[required], textarea[required]");

    inputs.forEach((input) => {
        input.addEventListener("blur", () => validateField(input));
        input.addEventListener("input", () => {
            if (input.getAttribute("aria-invalid") === "true") validateField(input);
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let isValid = true;
        inputs.forEach((input) => {
            if (!validateField(input)) isValid = false;
        });

        if (!isValid) {
            statusEl.textContent = "لطفاً خطاهای فرم را برطرف کنید.";
            statusEl.classList.remove("success");
            return;
        }

        submitBtn.disabled = true;
        statusEl.classList.remove("success");
        statusEl.textContent = "در حال ارسال پیام...";

        // Simulated submission — replace with a real endpoint when available.
        window.setTimeout(() => {
            statusEl.textContent = "پیام شما با موفقیت ارسال شد. به‌زودی پاسخ می‌دهم.";
            statusEl.classList.add("success");
            submitBtn.disabled = false;
            form.reset();
        }, 900);
    });
}

/* -------------------- Hero shapes parallax on scroll -------------------- */
function initHeroParallax() {
    const shapes = document.querySelectorAll("[data-parallax]");
    if (!shapes.length) return;

    let ticking = false;

    function update() {
        const scrollY = window.scrollY;
        shapes.forEach((shape) => {
            const speed = Number(shape.dataset.parallax) || 0.1;
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        },
        {passive: true}
    );
}

/* -------------------- Re-bind interactions for dynamically rendered project cards -------------------- */
function bindDynamicProjectInteractions() {
    document.addEventListener("projects:rendered", () => {
        initRevealOnScroll();
        initCardTilt();
    });
}

/* -------------------- Footer year -------------------- */
function setFooterYear() {
    const el = document.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
}

/* -------------------- Bootstrap -------------------- */
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNavigation();
    initRevealOnScroll();
    initCounters();
    initTypingEffect();
    initMouseGlow();
    initCursorFollower();
    initCardTilt();
    initMagneticButtons();
    initHeroParallax();
    bindDynamicProjectInteractions(); // ← این خط رو بیار بالاتر
    initProjects();                   // ← این خط رو بذار بعدش
    initContactForm();
    setFooterYear();
});
