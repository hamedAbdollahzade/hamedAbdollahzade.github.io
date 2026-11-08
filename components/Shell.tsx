"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Fragment, useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";
import {getBrand} from "@/data/localized";
import {localePath, parsePath} from "@/lib/locale";
import Footer from "./Footer";
import {ChevronIcon, Logo, MenuIcon, PhoneIcon} from "./Icons";
import LanguageSwitch from "./LanguageSwitch";
import {useLocale} from "./LocaleProvider";
import OpenChat from "./OpenChat";
import ThemeToggle from "./ThemeToggle";

/* `spy` lists the home-page sections that highlight this item while they are on screen. */
const NAV = [
    {key: "home", href: "/", path: (p: string) => p === "/", spy: ["", "process", "faq", "contact"]},
    {key: "services", href: "/#services", path: (p: string) => p.startsWith("/services"), spy: ["services"]},
    {key: "projects", href: "/#projects", path: (p: string) => p.startsWith("/projects"), spy: ["projects"]},
    {key: "learn", href: "/blog/", path: (p: string) => p.startsWith("/blog"), spy: ["learn"]},
    {key: "developers", href: "/developers/", path: (p: string) => p.startsWith("/developers"), spy: ["developers"]},
    {key: "about", href: "/about/", path: (p: string) => p.startsWith("/about"), spy: []},
] as const;

const SPY_IDS = ["services", "projects", "learn", "developers", "process", "faq", "contact"];

export interface Crumb { label: string; href?: string }

export default function Shell({children, crumbs}: {children: ReactNode; crumbs?: Crumb[]}) {
    const {locale, t} = useLocale();
    const pathname = usePathname() || "/";
    const {path: currentPath} = parsePath(pathname);
    const brand = getBrand(locale);
    const [open, setOpen] = useState(false);
    const [section, setSection] = useState("");
    const toggleRef = useRef<HTMLButtonElement>(null);
    const isHome = currentPath === "/";

    useEffect(() => setOpen(false), [pathname]);

    // On the home page, highlight the item of the section that is currently on screen.
    useEffect(() => {
        if (!isHome) { setSection(""); return; }
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
    }, [isHome]);

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

    const label = (key: (typeof NAV)[number]["key"]) => (key === "home" ? t.homeLabel : t.nav[key]);

    const links = (inPanel: boolean) => NAV.map(({key, href, path, spy}) => {
        const active = isHome ? (spy as readonly string[]).includes(section) : path(currentPath);
        return (
            <Link
                key={key}
                href={localePath(locale, href)}
                className={`nav-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => {
                    setOpen(false);
                    // Same-page links don't change the route, so select the item right away.
                    if (isHome && href.startsWith("/#")) setSection(href.slice(2));
                    if (isHome && href === "/") setSection("");
                }}
                tabIndex={inPanel && !open ? -1 : undefined}
            >
                {label(key)}
            </Link>
        );
    });

    return (
        <>
            <header className="navbar">
                <Link className="brand" href={localePath(locale, "/")} aria-label={`${brand.name}, ${t.brandHome}`} onClick={() => setOpen(false)}>
                    <span className="brand-mark"><Logo/></span><span>{brand.name}</span>
                </Link>
                <nav className="nav-links" aria-label={t.mainNav}>{links(false)}</nav>
                <div className="nav-end">
                    <LanguageSwitch/>
                    <ThemeToggle/>
                    <Link className="btn nav-cta" href={localePath(locale, "/#contact")}><PhoneIcon/>{t.contactUs}</Link>
                    <button
                        ref={toggleRef}
                        className="menu-toggle"
                        type="button"
                        aria-label={open ? t.closeMenu : t.openMenu}
                        aria-controls="nav-panel"
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                    >
                        <MenuIcon/>
                    </button>
                </div>
            </header>
            <div className={`scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true"/>
            <div className={`nav-panel${open ? " is-open" : ""}`} id="nav-panel" role="navigation" aria-label={t.mobileNav} inert={!open}>
                {links(true)}
                <div className="nav-panel-cta">
                    <OpenChat className="btn btn--lg">{t.requestProject}</OpenChat>
                    <Link className="btn btn--lg btn--soft" href={localePath(locale, "/#contact")}><PhoneIcon/>{t.contactUs}</Link>
                </div>
            </div>

            <div className="main">
                <main className="content" id="main-content">
                    {crumbs && crumbs.length > 0 && (
                        <nav className="crumbs" aria-label={t.breadcrumbs}>
                            <Link href={localePath(locale, "/")}>{t.homeLabel}</Link>
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
