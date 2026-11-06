"use client";

import {usePathname} from "next/navigation";
import {useEffect} from "react";

/** Fades in every [data-reveal] element as it scrolls into view (re-runs on each route). */
export default function RevealInit() {
    const pathname = usePathname();
    useEffect(() => {
        const targets = document.querySelectorAll("[data-reveal]:not(.is-in)");
        if (!("IntersectionObserver" in window)) {
            targets.forEach((el) => el.classList.add("is-in"));
            return;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-in");
                    io.unobserve(entry.target);
                }
            });
        }, {rootMargin: "0px 0px -8% 0px"});
        targets.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [pathname]);
    return null;
}
