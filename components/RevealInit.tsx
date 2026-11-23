"use client";

import {usePathname} from "next/navigation";
import {useEffect} from "react";

/** Fades in every [data-reveal] element as it scrolls into view (re-runs on each route). */
export default function RevealInit() {
    const pathname = usePathname();
    useEffect(() => {
        if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const targets = document.querySelectorAll(
            "[data-reveal], [data-reveal] :is(.grid, .steps, .faq) > *"
        );
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-in");
                    io.unobserve(entry.target);
                }
            });
        }, {rootMargin: "0px 0px -8% 0px"});
        targets.forEach((el) => {
            if (el.getBoundingClientRect().top < window.innerHeight) return;
            el.classList.add("reveal-ready");
            io.observe(el);
        });
        return () => {
            io.disconnect();
            targets.forEach(el => el.classList.remove("reveal-ready", "is-in"));
        };
    }, [pathname]);
    return null;
}
