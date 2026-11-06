"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Fragment, useEffect, useState} from "react";
import type {ReactNode} from "react";
import {BRAND} from "@/data/services";
import Footer from "./Footer";
import {BookIcon, ChevronIcon, FolderIcon, HomeIcon, InfoIcon, LayersIcon, Logo, MailIcon, MenuIcon, PhoneIcon, SearchIcon, UsersIcon} from "./Icons";
import OpenChat from "./OpenChat";

const NAV = [
    {href: "/", label: "خانه", icon: HomeIcon, match: (p: string) => p === "/"},
    {href: "/#services", label: "خدمات", icon: LayersIcon, match: (p: string) => p.startsWith("/services")},
    {href: "/#projects", label: "نمونه‌کارها", icon: FolderIcon, match: (p: string) => p.startsWith("/projects")},
    {href: "/blog/", label: "آموزش‌ها", icon: BookIcon, match: (p: string) => p.startsWith("/blog")},
    {href: "/developers/", label: "برنامه‌نویسان", icon: UsersIcon, match: (p: string) => p.startsWith("/developers")},
    {href: "/about/", label: "درباره‌ی ما", icon: InfoIcon, match: (p: string) => p.startsWith("/about")},
    {href: "/#contact", label: "تماس و سفارش", icon: MailIcon, match: () => false},
];

export interface Crumb { label: string; href?: string }

export default function Shell({children, crumbs}: {children: ReactNode; crumbs?: Crumb[]}) {
    const pathname = usePathname() || "/";
    const [open, setOpen] = useState(false);

    useEffect(() => setOpen(false), [pathname]);
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    return (
        <>
            <aside className={`sidebar${open ? " is-open" : ""}`} aria-label="منوی اصلی">
                <Link className="brand" href="/" aria-label={`${BRAND.name}، صفحه اصلی`}>
                    <span className="brand-mark"><Logo/></span><span>{BRAND.name}</span>
                </Link>
                <nav>
                    {NAV.map(({href, label, icon: Icon, match}) => (
                        <Link key={href} href={href} className={`nav-item${match(pathname) ? " is-active" : ""}`} onClick={() => setOpen(false)}>
                            <span className="nav-icon"><Icon/></span>{label}
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-cta">
                    <Link className="btn btn--soft" href="/#contact"><PhoneIcon/>تماس با ما</Link>
                    <OpenChat className="btn btn--green">ثبت درخواست پروژه</OpenChat>
                </div>
            </aside>
            <div className={`scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true"/>

            <div className="main">
                <header className="topbar">
                    <button className="menu-toggle" type="button" aria-label="باز کردن منو" aria-expanded={open} onClick={() => setOpen(!open)}><MenuIcon/></button>
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
