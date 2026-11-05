/* Labs theme behaviour: full-screen menu, solid header on scroll, carousel arrows, reveal on scroll. */

const header = document.querySelector(".site-header");
const menu = document.querySelector("[data-menu]");
const menuBtn = document.querySelector("[data-menu-btn]");

function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "بستن منو" : "باز کردن منو");
    document.body.style.overflow = open ? "hidden" : "";
    header?.classList.toggle("is-solid", !open && window.scrollY > 40);
    if (open) header?.classList.remove("is-solid");
}

menuBtn?.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
menu?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

const solidAfter = header?.dataset.solid === "always" ? -1 : 40;
function onScroll() {
    if (menu?.classList.contains("is-open")) return;
    header?.classList.toggle("is-solid", window.scrollY > solidAfter);
}
onScroll();
window.addEventListener("scroll", onScroll, {passive: true});

document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector("[data-carousel-track]");
    const step = () => (track.querySelector(".project-card")?.offsetWidth || 320) + 24;
    root.querySelector("[data-carousel-prev]")?.addEventListener("click", () => track.scrollBy({left: -step(), behavior: "smooth"}));
    root.querySelector("[data-carousel-next]")?.addEventListener("click", () => track.scrollBy({left: step(), behavior: "smooth"}));
});

const revealTargets = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
        });
    }, {rootMargin: "0px 0px -8% 0px"});
    revealTargets.forEach((el) => io.observe(el));
} else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
}

document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

/* Contact form: build a WhatsApp message from the fields (the site is static, nothing is stored). */
document.querySelectorAll("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const text = `سلام، من ${data.get("name")} هستم.\nشماره‌ی تماس: ${data.get("phone")}\nایده/پروژه: ${data.get("idea")}`;
        window.open(`https://wa.me/989107902735?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });
});
