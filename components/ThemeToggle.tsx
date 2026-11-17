"use client";

import {useEffect, useState} from "react";
import {useLocale} from "./LocaleProvider";
import {MoonIcon, SunIcon} from "./Icons";

type Theme = "dark" | "light";

/** Switches between the dark and light theme and remembers the choice (the initial value is set by an inline script). */
export default function ThemeToggle() {
    const {t} = useLocale();
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    }, []);

    function toggle() {
        const next: Theme = theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem("webino-theme", next); } catch { /* storage may be blocked */ }
        setTheme(next);
    }

    const label = theme === "dark" ? t.theme.toLight : t.theme.toDark;
    return (
        <button className="icon-btn" type="button" onClick={toggle} aria-label={label} title={label}>
            {theme === "dark" ? <SunIcon/> : <MoonIcon/>}
        </button>
    );
}
