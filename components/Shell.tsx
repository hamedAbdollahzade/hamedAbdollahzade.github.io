"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Fragment, useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";
import {BRAND} from "@/data/services";
import Footer from "./Footer";
import {ChevronIcon, Logo, MenuIcon, PhoneIcon} from "./Icons";
import OpenChat from "./OpenChat";

/* `spy` lists the home-page sections that highlight this item while they are on screen. */
const NAV = [
    {href: "/", label: "خانه", path: (p: string) => p === "/", spy: ["", "process", "faq", "contact"]},
    {href: "/#services", label: "خدمات", path: (p: string) => p.startsWith("/services"), spy: ["services"]},
    {href: "/#projects", label: "نمونه‌کارها", path: (p: string) => p.startsWith("/projects"), spy: ["projects"]},
    {href: "/blog/", label: "آموزش‌ها", path: (p: string) => p.startsWith("/blog"), spy: ["learn"]},
    {href: "/developers/", label: "برنامه‌نویسان", path: (p: string) => p.startsWith("/developers"), spy: ["developers"]},
    {href: "/about/", label: "درباره‌ی ما", path: (p: string) => p.startsWith("/about"), spy: []},
];

const SPY_IDS = ["services", "projects", "learn", "developers", "process", "faq", "contact"];

export interface Crumb { label: string; href?: string }

export default function Shell({children, crumbs}: {children: ReactNode; crumbs?: Crumb[]}) {
    const pathname = usePathname() || "/";
    const [open, setOpen] = useState(false);
    const [section, setSection] = useState("");
    const toggleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => setOpen(false), [pathname]);

    // On the home page, highlight the item of the section that is currently on screen.
    useEffect(() => {
        if (pathname !== "/") { setSection(""); return; }
        let timer: ReturnType<typeof setTimeout> | undefined;
        const update = () => {
            timer = undefined;
            let current = "";
            for (const id of SPY_IDS) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
            }
            setSection(current);
        };
        const onScroll = () => { if (!timer) timer = setTimeout(update, 60); };
        update();
        window.addEventListener("scroll", onScroll, {passive: true});
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (timer) clearTimeout(timer);
        };
    }, [pathname]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            setOpen((wasOpen) => {
                if (wasOpen) toggleRef.current?.focus();
                return false;
            });
        };
        // Opening the chat must not leave the menu open behind it.
        const onChat = () => setOpen(false);
        // Leaving the phone layout (rotation, resize) resets the menu.
        const mq = window.matchMedia("(min-width: 981px)");
        const onMq = () => { if (mq.matches) setOpen(false); };
        document.addEventListener("keydown", onKey);
        window.addEventListener("webino:open-chat", onChat);
        window.addEventListener("pagehide", onChat);
        mq.addEventListener("change", onMq);
        return () => {
            document.removeEventListener("keydown", onKey);
            window.removeEventListener("webino:open-chat", onChat);
            window.removeEventListener("pagehide", onChat);
            mq.removeEventListener("change", onMq);
        };
    }, []);

    // Lock page scroll behind the open menu.
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const links = (inPanel: boolean) => NAV.map(({href, label, path, spy}) => {
        const active = pathname === "/" ? spy.includes(section) : path(pathname);
        return (
            <Link
                key={href}
                href={href}
                className={`nav-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => {
                    setOpen(false);
                    // Same-page links don't change the route, so select the item right away.
                    if (pathname === "/" && href.startsWith("/#")) setSection(href.slice(2));
                    if (pathname === "/" && href === "/") setSection("");
                }}
                tabIndex={inPanel && !open ? -1 : undefined}
            >
                {label}
            </Link>
        );
    });

    return (
        <>
            <header className="navbar">
                <Link className="brand" href="/" aria-label={`${BRAND.name}، صفحه اصلی`} onClick={() => setOpen(false)}>
                    <span className="brand-mark"><Logo/></span><span>{BRAND.name}</span>
                </Link>
                <nav className="nav-links" aria-label="منوی اصلی">{links(false)}</nav>
                <div className="nav-end">
                    <Link className="btn nav-cta" href="/#contact"><PhoneIcon/>تماس با ما</Link>
                    <button
                        ref={toggleRef}
                        className="menu-toggle"
                        type="button"
                        aria-label={open ? "بستن منو" : "باز کردن منو"}
                        aria-controls="nav-panel"
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                    >
                        <MenuIcon/>
                    </button>
                </div>
            </header>
            <div className={`scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true"/>
            <div className={`nav-panel${open ? " is-open" : ""}`} id="nav-panel" role="navigation" aria-label="منوی موبایل" inert={!open}>
                {links(true)}
                <div className="nav-panel-cta">
                    <OpenChat className="btn btn--lg">ثبت درخواست پروژه</OpenChat>
                    <Link className="btn btn--lg btn--soft" href="/#contact"><PhoneIcon/>تماس با ما</Link>
                </div>
            </div>

            <div className="main">
                <main className="content" id="main-content">
                    {crumbs && crumbs.length > 0 && (
                        <nav className="crumbs" aria-label="مسیر صفحه">
                            <Link href="/">خانه</Link>
                            {crumbs.map((c, i) => (
                                <Fragment key={c.label}>
                                    <ChevronIcon/>
                                    {c.href && i < crumbs.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                                </Fragment>
                            ))}
                        </nav>
                    )}
                    {children}
                </main>
                <Footer/>
            </div>
        </>
    );
}
