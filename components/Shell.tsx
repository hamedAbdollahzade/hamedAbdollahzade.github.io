"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Fragment, useEffect, useState} from "react";
import type {ReactNode} from "react";
import {getBrand} from "@/data/localized";
import {localePath, parsePath} from "@/lib/locale";
import Footer from "./Footer";
import Dock from "./Dock";
import {ChevronIcon, Logo, PhoneIcon} from "./Icons";
import {useLocale} from "./LocaleProvider";

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

    const dockItems = NAV.map(({key, href, path, spy}) => ({
        key,
        label: label(key),
        href: localePath(locale, href),
        active: isHome ? (spy as readonly string[]).includes(section) : path(currentPath),
        // Same-page links don't change the route, so select the item right away.
        onClick: () => {
            if (isHome && href.startsWith("/#")) setSection(href.slice(2));
            if (isHome && href === "/") setSection("");
        },
    }));

    return (
        <>
            <header className="navbar">
                <Link className="brand" href={localePath(locale, "/")} aria-label={`${brand.name}, ${t.brandHome}`}>
                    <span className="brand-mark"><Logo/></span><span>{brand.name}</span>
                </Link>
                <div className="nav-end">
                    <Link className="btn nav-cta" href={localePath(locale, "/#contact")}><PhoneIcon/>{t.contactUs}</Link>
                </div>
            </header>
            <Dock items={dockItems} label={t.mainNav}/>

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
