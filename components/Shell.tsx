"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Fragment, useEffect, useState} from "react";
import type {CSSProperties, MouseEvent, ReactNode} from "react";
import {getBrand, getProjects, getServices} from "@/data/localized";
import {localePath, parsePath} from "@/lib/locale";
import Footer from "./Footer";
import {ChevronIcon, Logo, PhoneIcon} from "./Icons";
import LanguageSwitch from "./LanguageSwitch";
import OpenChat from "./OpenChat";
import {useLocale} from "./LocaleProvider";
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
            document.body.dataset.homeSection = current || "hero";
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
            delete document.body.dataset.homeSection;
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

    // Close the menu when the page changes, the chat opens or Escape is pressed.
    useEffect(() => { setOpen(false); setSub(""); }, [pathname]);
    useEffect(() => {
        const close = () => setOpen(false);
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        window.addEventListener("webino:open-chat", close);
        window.addEventListener("keydown", onKey);
        window.addEventListener("pagehide", close);
        return () => {
            window.removeEventListener("webino:open-chat", close);
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("pagehide", close);
        };
    }, []);
    useEffect(() => {
        document.documentElement.classList.toggle("nav-open", open);
        return () => document.documentElement.classList.remove("nav-open");
    }, [open]);

    // The menu opens as a circle growing out of the button, so remember where the button is.
    const toggleMenu = (e: MouseEvent<HTMLButtonElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        document.documentElement.style.setProperty("--menu-x", `${r.left + r.width / 2}px`);
        document.documentElement.style.setProperty("--menu-y", `${r.top + r.height / 2}px`);
        setOpen((v) => !v);
    };

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
                    <div className="header-tools">
                        <LanguageSwitch/>
                        <ThemeToggle/>
                        <a className="icon-btn header-phone" href={`tel:${brand.phone}`} dir="ltr"
                           aria-label={`${t.contactUs} ${brand.phoneDisplay}`}>
                            <PhoneIcon/>{brand.phoneDisplay}
                        </a>
                    </div>
                    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-menu" aria-label={open ? t.closeMenu : t.openMenu} onClick={toggleMenu}>
                        <span className="burger" aria-hidden="true"><i/><i/><i/></span>
                    </button>
                </div>
            </header>
            {/* Full-screen menu: everything that used to sit in the header, on every screen size. It sits outside <header>
                because the header's backdrop-filter would trap a fixed element inside it. */}
            <nav id="site-menu" className={`m-panel${open ? " is-open" : ""}${sub ? " has-sub" : ""}`} aria-label={t.mainNav} aria-hidden={!open} inert={!open}>
                <div className="m-inner">
                    {items.map((it, i) => (
                        <div key={it.key} className="m-item" style={{"--i": i} as CSSProperties}>
                            <div className="m-row">
                                <Link className={`m-link${it.active ? " is-active" : ""}`} href={localePath(locale, it.href)} onClick={() => go(it.key, it.href)}>{it.label}</Link>
                                {it.sub.length > 0 && (
                                    <button type="button" className="m-exp" aria-expanded={sub === it.key} aria-label={it.label} onClick={() => setSub(sub === it.key ? "" : it.key)}><ChevronIcon/></button>
                                )}
                            </div>
                            {it.sub.length > 0 && sub === it.key && (
                                <ul className="m-sub">
                                    {it.sub.map((s) => <li key={s.href}><Link href={localePath(locale, s.href)} title={s.label} onClick={() => setOpen(false)}>{s.label}</Link></li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                    <div className="m-announce" style={{"--i": items.length} as CSSProperties}>
                        <p>{t.announce.text} <b>{t.announce.strong}</b></p>
                        <OpenChat className="btn btn--lg">{t.announce.cta}</OpenChat>
                        <Link className="btn btn--lg btn--ghost" href={localePath(locale, "/#contact")} onClick={() => setOpen(false)}><PhoneIcon/>{t.contactUs}</Link>
                    </div>
                    <button type="button" className="m-close" style={{"--i": items.length + 2} as CSSProperties} onClick={() => setOpen(false)}>
                        <span aria-hidden="true">✕</span>{t.closeMenu}
                    </button>
                </div>
            </nav>

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
