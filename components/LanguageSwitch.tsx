"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {switchLocalePath} from "@/lib/locale";
import {useLocale} from "./LocaleProvider";
import {GlobeIcon} from "./Icons";

/** Link to the same page in the other language (pages without a translation go to that language's home). */
export default function LanguageSwitch() {
    const {locale, t} = useLocale();
    const pathname = usePathname() || "/";
    const target = locale === "fa" ? "en" : "fa";

    return (
        <Link className="icon-btn icon-btn--text" href={switchLocalePath(pathname, target)} lang={target} hrefLang={target} aria-label={t.switchLanguageLabel} title={t.switchLanguageLabel}>
            <GlobeIcon/><span>{t.switchLanguage}</span>
        </Link>
    );
}
