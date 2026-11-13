"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Fragment, useEffect, useState} from "react";
import type {ReactNode} from "react";
import {getBrand, getProjects, getServices} from "@/data/localized";
import {localePath, parsePath} from "@/lib/locale";
import Footer from "./Footer";
import {ChevronIcon, Logo, MenuIcon, PhoneIcon} from "./Icons";
import LanguageSwitch from "./LanguageSwitch";
import {useLocale} from "./LocaleProvider";
import ThemeToggle from "./ThemeToggle";

/* `spy` lists the home-page sections that highlight this item while they are on screen. */
const NAV = [
    {key: "home", href: "/", path: (p: string) => p === "/", spy: ["", "process", "faq", "contact"]},
    {key: "services", href: "/#services", path: (p: string) => p.startsWith("/services"), spy: ["services"]},
    {key: "projects", href: "/#projects", path: (p: string) => p.startsWith("/projects"), spy: ["projects"]},
    {key: "learn", href: "/blog/", path: (p: string) => p.startsWith("/blog"), spy: ["learn"]},
    {key: "developers", href: "/developers/", path: (p: string) => p.startsWith("/developers"), spy: ["developers"]},
    {key: "explore", href: "/explore/", path: (p: string) => p.startsWith("/explore"), spy: []},
    {key: "about", href: "/about/", path: (p: string) => p.startsWith("/about"), spy: []},
] as const;

const SPY_IDS = ["services", "projects", "learn", "developers", "process", "faq", "contact"];

export interface Crumb { label: string; href?: string }

export default function Shell({children, crumbs}: {children: ReactNode; crumbs?: Crumb[]}) {
    const {locale, t} = useLocale();
    const pathname = usePathname() || "/";
    const {path: currentPath} = parsePath(pathname);
    const brand = getBrand(locale);
    const [section, setSection] = useState("");
    const isHome = currentPath === "/";

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

    const label = (key: (typeof NAV)[number]["key"]) => (key === "home" ? t.homeLabel : t.nav[key]);

    const [open, setOpen] = useState(false);
    const [sub, setSub] = useState("");
    const services = getServices(locale).map((x) => ({label: x.title, href: `/services/${x.slug}/`}));
    const projects = getProjects(locale).map((x) => ({label: x.title, href: `/projects/${x.slug}/`}));
    const children_: Record<string, {label: string; href: string}[]> = {services, projects};

    const items = NAV.map(({key, href, path, spy}) => ({
        key,
        label: label(key),
        href,
        active: isHome ? (spy as readonly string[]).includes(section) : path(currentPath),
        sub: children_[key] ?? [],
    }));

    // Close the mobile panel when the page changes, the chat opens, the screen grows or Escape is pressed.
    useEffect(() => { setOpen(false); setSub(""); }, [pathname]);
    useEffect(() => {
        const close = () => setOpen(false);
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        const onResize = () => { if (window.innerWidth > 980) setOpen(false); };
        window.addEventListener("webino:open-chat", close);
        window.addEventListener("keydown", onKey);
        window.addEventListener("resize", onResize);
        window.addEventListener("pagehide", close);
        return () => {
            window.removeEventListener("webino:open-chat", close);
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("pagehide", close);
        };
    }, []);
    useEffect(() => {
        document.documentElement.classList.toggle("nav-open", open);
        return () => document.documentElement.classList.remove("nav-open");
    }, [open]);

    const go = (key: string, href: string) => {
        if (isHome && href.startsWith("/#")) setSection(href.slice(2));
        if (isHome && href === "/") setSection("");
        setOpen(false);
        void key;
    };

    return (
        <>
            <header className="topbar">
                <div className="topbar-in">
                    <Link className="brand" href={localePath(locale, "/")} aria-label={`${brand.name}, ${t.brandHome}`}>
                        <span className="brand-mark"><Logo/></span><span>{brand.name}</span>
                    </Link>
                    <nav className="top-links" aria-label={t.mainNav}>
                        {items.map((it) => (
                            <div key={it.key} className={`top-item${it.sub.length ? " has-sub" : ""}`}>
                                <Link className={`top-link${it.active ? " is-active" : ""}`} href={localePath(locale, it.href)} aria-current={it.active ? "page" : undefined} onClick={() => go(it.key, it.href)}>
                                    {it.label}{it.sub.length > 0 && <ChevronIcon/>}
                                </Link>
                                {it.sub.length > 0 && (
                                    <ul className="top-sub">
                                        {it.sub.map((s) => <li key={s.href}><Link href={localePath(locale, s.href)} onClick={() => setOpen(false)}>{s.label}</Link></li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </nav>
                    <div className="top-end">
                        <LanguageSwitch/>
                        <ThemeToggle/>
                        <Link className="btn top-cta" href={localePath(locale, "/#contact")}><PhoneIcon/>{t.contactUs}</Link>
                        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t.closeMenu : t.openMenu} onClick={() => setOpen((v) => !v)}><MenuIcon/></button>
                    </div>
                </div>
                <nav id="mobile-nav" className={`m-panel${open ? " is-open" : ""}`} aria-label={t.mainNav} aria-hidden={!open} inert={!open}>
                    {items.map((it) => (
                        <div key={it.key} className="m-item">
                            <div className="m-row">
                                <Link className={`m-link${it.active ? " is-active" : ""}`} href={localePath(locale, it.href)} onClick={() => go(it.key, it.href)}>{it.label}</Link>
                                {it.sub.length > 0 && (
                                    <button type="button" className="m-exp" aria-expanded={sub === it.key} aria-label={it.label} onClick={() => setSub(sub === it.key ? "" : it.key)}><ChevronIcon/></button>
                                )}
                            </div>
                            {it.sub.length > 0 && sub === it.key && (
                                <ul className="m-sub">
                                    {it.sub.map((s) => <li key={s.href}><Link href={localePath(locale, s.href)} onClick={() => setOpen(false)}>{s.label}</Link></li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                    <Link className="btn btn--lg m-cta" href={localePath(locale, "/#contact")} onClick={() => setOpen(false)}><PhoneIcon/>{t.contactUs}</Link>
                </nav>
            </header>
            <div className={`scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true"/>

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
