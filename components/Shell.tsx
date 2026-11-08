"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Fragment, useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";
import {BRAND} from "@/data/services";
import Footer from "./Footer";
import {BookIcon, ChevronIcon, FolderIcon, HomeIcon, InfoIcon, LayersIcon, Logo, MailIcon, MenuIcon, PhoneIcon, SearchIcon, UsersIcon} from "./Icons";
import OpenChat from "./OpenChat";

/* `spy` lists the home-page sections that highlight this item while they are on screen. */
const NAV = [
    {href: "/", label: "خانه", icon: HomeIcon, path: (p: string) => p === "/", spy: ["", "process", "faq"]},
    {href: "/#services", label: "خدمات", icon: LayersIcon, path: (p: string) => p.startsWith("/services"), spy: ["services"]},
    {href: "/#projects", label: "نمونه‌کارها", icon: FolderIcon, path: (p: string) => p.startsWith("/projects"), spy: ["projects"]},
    {href: "/blog/", label: "آموزش‌ها", icon: BookIcon, path: (p: string) => p.startsWith("/blog"), spy: ["learn"]},
    {href: "/developers/", label: "برنامه‌نویسان", icon: UsersIcon, path: (p: string) => p.startsWith("/developers"), spy: ["developers"]},
    {href: "/about/", label: "درباره‌ی ما", icon: InfoIcon, path: (p: string) => p.startsWith("/about"), spy: []},
    {href: "/#contact", label: "تماس و سفارش", icon: MailIcon, path: () => false, spy: ["contact"]},
];

const SPY_IDS = ["services", "projects", "learn", "developers", "process", "faq", "contact"];

export interface Crumb { label: string; href?: string }

export default function Shell({children, crumbs}: {children: ReactNode; crumbs?: Crumb[]}) {
    const pathname = usePathname() || "/";
    const [open, setOpen] = useState(false);
    const [section, setSection] = useState("");

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
    const toggleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            setOpen((wasOpen) => {
                if (wasOpen) toggleRef.current?.focus();
                return false;
            });
        };
        // Opening the chat (from the drawer or anywhere) must not leave the drawer open behind it.
        const onChat = () => setOpen(false);
        // Leaving the phone layout (rotation, resize) resets the drawer.
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

    // Lock page scroll behind the open drawer.
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    // Swipe toward the right edge (the side the drawer lives on) closes it.
    const touchX = useRef<number | null>(null);

    return (
        <>
            <aside
                id="site-sidebar"
                className={`sidebar${open ? " is-open" : ""}`}
                aria-label="منوی اصلی"
                onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                    if (touchX.current !== null && e.changedTouches[0].clientX - touchX.current > 60) setOpen(false);
                    touchX.current = null;
                }}
            >
                <div className="sidebar-head">
                    <Link className="brand" href="/" aria-label={`${BRAND.name}، صفحه اصلی`} onClick={() => setOpen(false)}>
                        <span className="brand-mark"><Logo/></span><span>{BRAND.name}</span>
                    </Link>
                    <button className="sidebar-close" type="button" aria-label="بستن منو" onClick={() => setOpen(false)}>×</button>
                </div>
                <nav>
                    {NAV.map(({href, label, icon: Icon, path, spy}) => {
                        const active = pathname === "/" ? spy.includes(section) : path(pathname);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`nav-item${active ? " is-active" : ""}`}
                                aria-current={active ? "page" : undefined}
                                onClick={() => {
                                    setOpen(false);
                                    // Same-page links don't change the route, so select the item right away.
                                    if (pathname === "/" && href.startsWith("/#")) setSection(href.slice(2));
                                    if (pathname === "/" && href === "/") setSection("");
                                }}
                            >
                                <span className="nav-icon"><Icon/></span>{label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="sidebar-cta">
                    <Link className="btn btn--soft" href="/#contact"><PhoneIcon/>تماس با ما</Link>
                    <OpenChat className="btn btn--green">ثبت درخواست پروژه</OpenChat>
                </div>
            </aside>
            <div className={`scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true"/>

            <div className="main">
                <header className="topbar">
                    <button ref={toggleRef} className="menu-toggle" type="button" aria-label={open ? "بستن منو" : "باز کردن منو"} aria-controls="site-sidebar" aria-expanded={open} onClick={() => setOpen(!open)}><MenuIcon/></button>
                    <OpenChat className="search-pill"><SearchIcon/><span>ایده‌ات را بگو؛ با هوش مصنوعی می‌سازیمش…</span></OpenChat>
                    <div className="topbar-actions">
                        <Link className="btn btn--soft" href="/#contact"><PhoneIcon/>تماس با ما</Link>
                        <OpenChat className="btn">درخواست پروژه</OpenChat>
                    </div>
                </header>
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
