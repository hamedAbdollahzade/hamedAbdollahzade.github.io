"use client";

import Link from "next/link";
import type {ReactNode} from "react";
import {BookIcon, FolderIcon, HomeIcon, InfoIcon, LayersIcon, UsersIcon} from "./Icons";
import LanguageSwitch from "./LanguageSwitch";
import ThemeToggle from "./ThemeToggle";

export interface DockItem {key: string; label: string; href: string; active: boolean; onClick?: () => void}

const ICONS: Record<string, ReactNode> = {
    home: <HomeIcon/>, services: <LayersIcon/>, projects: <FolderIcon/>, learn: <BookIcon/>, developers: <UsersIcon/>, about: <InfoIcon/>,
};

/** macOS-style floating dock at the bottom of the page: the main navigation plus the language and theme switches. */
export default function Dock({items, label}: {items: DockItem[]; label: string}) {
    return (
        <nav className="dock" aria-label={label}>
            {items.map((item) => (
                <Link key={item.key} href={item.href} className={`dock-item${item.active ? " is-active" : ""}`} data-label={item.label} aria-label={item.label} aria-current={item.active ? "page" : undefined} onClick={item.onClick}>
                    {ICONS[item.key]}
                </Link>
            ))}
            <span className="dock-sep" aria-hidden="true"/>
            <LanguageSwitch/>
            <ThemeToggle/>
        </nav>
    );
}
