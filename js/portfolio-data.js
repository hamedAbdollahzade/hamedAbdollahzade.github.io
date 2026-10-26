/* ==========================================================================
   Portfolio Data — Reads the existing page content and project data
   The semantic markup in index.html and PROJECTS in projects.js remain the
   single source of truth; this module only turns them into plain objects.
   ========================================================================== */

import {PROJECTS} from "./projects.js";

const clean = (value) => (value ?? "").replace(/\s+/g, " ").trim();
const text = (el) => clean(el?.textContent);
const all = (root, selector) => [...root.querySelectorAll(selector)];

function toLink(anchor) {
    return {
        label: clean(anchor.getAttribute("aria-label")) || text(anchor),
        href: anchor.getAttribute("href"),
        external: anchor.getAttribute("target") === "_blank",
        icon: anchor.querySelector("svg")?.cloneNode(true) || null,
    };
}

function sectionHead(section) {
    return {
        eyebrow: text(section?.querySelector(".section-eyebrow")),
        title: text(section?.querySelector(".section-title")),
        desc: text(section?.querySelector(".section-desc")),
    };
}

function timelineEntry(item) {
    return {
        kind: item.dataset.entry || "work",
        period: text(item.querySelector(".timeline-period")),
        role: text(item.querySelector(".timeline-role")),
        org: text(item.querySelector(".timeline-org")),
        text: text(item.querySelector(".timeline-card p")),
        tags: all(item, ".skill-tag").map(text),
    };
}

function readStructuredData(root) {
    try {
        return JSON.parse(root.querySelector('script[type="application/ld+json"]')?.textContent || "{}");
    } catch {
        return {};
    }
}

/* "assets/HamedAbdollahzade-Resume.pdf" -> "Hamed Abdollahzade" */
function latinNameFrom(href) {
    const base = (href || "").split("/").pop().replace(/\.[a-z]+$/i, "").split(/[-_]/)[0];
    return base.replace(/([a-z])([A-Z])/g, "$1 $2");
}

/* Same-origin path for an absolute site URL, so local previews work too. */
function localPath(url) {
    try {
        return new URL(url).pathname.replace(/^\//, "");
    } catch {
        return url || "";
    }
}

export function readPortfolio(root = document) {
    const source = root.querySelector("[data-portfolio-source]") || root;
    const hero = source.querySelector("#hero");
    const heroTitle = hero.querySelector(".hero-title");
    const resumeAnchor = hero.querySelector("a[download]");
    const ld = readStructuredData(root);

    const about = source.querySelector("#about");
    const skills = source.querySelector("#skills");
    const experience = source.querySelector("#experience");
    const projects = source.querySelector("#projects");
    const contact = source.querySelector("#contact");
    const timeline = all(experience, ".timeline-item").map(timelineEntry);

    const resumeHref = resumeAnchor?.getAttribute("href") || "";

    return {
        hero: {
            name: clean([...heroTitle.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join(" ")),
            role: text(heroTitle.querySelector(".hero-role")),
            subtitle: text(hero.querySelector(".hero-subtitle")),
            badge: text(hero.querySelector(".hero-badge")),
            actions: all(hero, ".hero-actions a").map(toLink),
            socials: all(hero, ".hero-socials a").map(toLink),
        },
        person: {
            latinName: latinNameFrom(resumeHref),
            jobTitle: ld.jobTitle || "",
            locality: ld.address?.addressLocality || "",
            country: ld.address?.addressCountry || "",
            knowsAbout: ld.knowsAbout || [],
            photo: localPath(ld.image),
        },
        resume: {
            href: resumeHref,
            label: text(resumeAnchor),
            fileName: resumeHref.split("/").pop(),
        },
        about: {
            ...sectionHead(about),
            paragraphs: all(about, ".about-text p").map(text),
            stats: all(about, ".stat-card").map((card) => ({
                value: text(card.querySelector(".stat-number")),
                label: text(card.querySelector(".stat-label")),
            })),
        },
        skills: {
            ...sectionHead(skills),
            groups: all(skills, ".skill-card").map((card) => ({
                title: text(card.querySelector(".skill-card-title")),
                tags: all(card, ".skill-tag").map(text),
            })),
        },
        experience: {
            ...sectionHead(experience),
            work: timeline.filter((entry) => entry.kind === "work"),
            education: timeline.filter((entry) => entry.kind === "education"),
        },
        projects: {
            ...sectionHead(projects),
            items: PROJECTS,
        },
        contact: {
            ...sectionHead(contact),
            cards: all(contact, ".contact-info-card").map((card) => {
                const anchor = card.querySelector("a.contact-info-value");
                return {
                    label: text(card.querySelector(".contact-info-label")),
                    value: text(card.querySelector(".contact-info-value")),
                    href: anchor?.getAttribute("href") || null,
                };
            }),
            socials: all(contact, ".contact-socials a").map(toLink),
        },
        footer: {
            copy: text(source.querySelector(".footer-copy")),
            socials: all(source, ".footer-socials a").map(toLink),
        },
    };
}
