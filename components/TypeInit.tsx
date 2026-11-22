"use client";

import {usePathname} from "next/navigation";
import {useEffect} from "react";

/* Text that is typed out; the full text stays in the HTML for search engines and no-JS visitors. */
const TARGETS = "main :is(h1, h2, h3, p, li, figcaption, summary, .tile-more, .dev-role, .vh-eyebrow), .site-footer :is(h2, h3, p, li)";
/* Left alone: long articles, code, forms and anything interactive. */
const SKIP = ".prose :not(h1), pre, code, form, button, .crumbs, .sr-only, [aria-hidden=\"true\"], [data-no-type]";
const MS_PER_CHAR = 28;
const MIN_MS = 300;
const MAX_MS = 1400;

interface Job { el: HTMLElement; nodes: Text[]; full: string[]; length: number }

/** Blanks an element's text (keeping its size) and returns what is needed to type it back. */
function prepare(el: HTMLElement): Job | null {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.nodeValue && n.nodeValue.trim()) nodes.push(n as Text);
    if (!nodes.length) return null;
    const box = el.getBoundingClientRect();
    el.style.minHeight = `${box.height}px`;
    el.style.minWidth = `${box.width}px`;
    const full = nodes.map((n) => n.nodeValue ?? "");
    nodes.forEach((n) => { n.nodeValue = ""; });
    el.dataset.typed = "pending";
    return {el, nodes, full, length: full.reduce((sum, t) => sum + [...t].length, 0)};
}

/** Types the text back, character by character, then releases the reserved size. */
function play(job: Job) {
    const {el, nodes, full, length} = job;
    const chars = full.map((t) => [...t]);
    const duration = Math.min(MAX_MS, Math.max(MIN_MS, length * MS_PER_CHAR));
    el.classList.add("is-typing");
    const start = performance.now();
    const step = (now: number) => {
        let left = Math.min(length, Math.floor(((now - start) / duration) * length));
        nodes.forEach((n, i) => {
            const take = Math.min(left, chars[i].length);
            n.nodeValue = chars[i].slice(0, take).join("");
            left -= take;
        });
        if (now - start < duration) requestAnimationFrame(step);
        else {
            nodes.forEach((n, i) => { n.nodeValue = full[i]; });
            el.classList.remove("is-typing");
            el.style.minHeight = "";
            el.style.minWidth = "";
            el.dataset.typed = "done";
        }
    };
    requestAnimationFrame(step);
}

/** Types out the page's text as it scrolls into view (re-runs on each route). */
export default function TypeInit() {
    const pathname = usePathname();
    useEffect(() => {
        if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
        const html = document.documentElement;
        let io: IntersectionObserver | undefined;
        let waiter: MutationObserver | undefined;

        const begin = () => {
            const candidates = [...document.querySelectorAll<HTMLElement>(TARGETS)]
                .filter((el) => !el.dataset.typed && !el.closest(SKIP))
                // Type the innermost elements only (a <li> holding a <p> types the <p>).
                .filter((el, _, all) => !all.some((other) => other !== el && el.contains(other)));
            const jobs = new Map<Element, Job>();
            candidates.forEach((el) => { const job = prepare(el); if (job) jobs.set(el, job); });
            io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const job = jobs.get(entry.target);
                    if (!entry.isIntersecting || !job) return;
                    io?.unobserve(entry.target);
                    jobs.delete(entry.target);
                    play(job);
                });
            }, {rootMargin: "0px 0px -6% 0px"});
            jobs.forEach((_, el) => io?.observe(el));
        };

        // Wait for the intro to finish so the hero is typed where it can be seen.
        if (html.classList.contains("intro-on")) {
            waiter = new MutationObserver(() => {
                if (!html.classList.contains("intro-on")) { waiter?.disconnect(); begin(); }
            });
            waiter.observe(html, {attributes: true, attributeFilter: ["class"]});
        } else begin();

        return () => { io?.disconnect(); waiter?.disconnect(); };
    }, [pathname]);
    return null;
}
