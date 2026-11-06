"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {BRAND} from "@/data/services";
import {Logo, PhoneIcon} from "./Icons";

const LINKS = [
    ["/#services", "خدمات"],
    ["/#projects", "نمونه‌کارها"],
    ["/#process", "روند کار"],
    ["/about/", "درباره‌ی ما"],
    ["/blog/", "بلاگ"],
    ["/#faq", "سؤالات متداول"],
    ["/#contact", "تماس و سفارش"],
] as const;

export default function Header({solidAlways = false}: {solidAlways?: boolean}) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const solid = !open && (solidAlways || scrolled);

    return (
        <>
            <header className={`site-header${solid ? " is-solid" : ""}`}>
                <Link className="brand" href="/" aria-label={`${BRAND.name}، صفحه اصلی`}><Logo/><span>{BRAND.name}</span></Link>
                <div className="header-actions">
                    <a className="header-call" href={`tel:${BRAND.phone}`} aria-label={`تماس با ${BRAND.name}`}>
                        <PhoneIcon/><span dir="ltr">{BRAND.phoneDisplay}</span>
                    </a>
                    <button className="menu-btn" type="button" aria-expanded={open} aria-controls="site-menu"
                            aria-label={open ? "بستن منو" : "باز کردن منو"} onClick={() => setOpen(!open)}>
                        <span/><span/>
                    </button>
                </div>
            </header>
            <nav className={`menu${open ? " is-open" : ""}`} id="site-menu" aria-label="منوی اصلی" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
                {LINKS.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
            </nav>
        </>
    );
}
