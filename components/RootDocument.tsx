import type {ReactNode} from "react";
import {DIR} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import ChatWidget from "./ChatWidget";
import IntroLoader from "./IntroLoader";
import {LocaleProvider} from "./LocaleProvider";
import RevealInit from "./RevealInit";
import TypeInit from "./TypeInit";
import {UI} from "@/lib/ui";

/* Runs before first paint: marks JS support, applies the saved/system theme and shows the intro on every page load (not with reduced motion). */
const BOOT_SCRIPT = '(function(){var d=document.documentElement;d.classList.add("js");try{var s=localStorage.getItem("webino-theme");d.dataset.theme=s||"light"}catch(e){d.dataset.theme="light"}try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("intro-on")}}catch(e){}})();';

const PRELOAD: Record<Locale, string[]> = {
    fa: ["vazirmatn-arabic-wght-normal.woff2", "vazirmatn-latin-wght-normal.woff2"],
    en: ["inter-latin-wght-normal.woff2", "vazirmatn-arabic-wght-normal.woff2"],
};

/** The <html> document shared by both languages' root layouts. */
export default function RootDocument({locale, children}: {locale: Locale; children: ReactNode}) {
    return (
        <html lang={locale} dir={DIR[locale]} data-theme="light" suppressHydrationWarning>
        <head>
            {PRELOAD[locale].map((f) => <link key={f} rel="preload" href={`/fonts/${f}`} as="font" type="font/woff2" crossOrigin=""/>)}
            <script dangerouslySetInnerHTML={{__html: BOOT_SCRIPT}}/>
        </head>
        <body>
        <LocaleProvider locale={locale}>
            <IntroLoader/>
            <a className="skip-link" href="#main-content">{UI[locale].skipToContent}</a>
            {children}
            <ChatWidget/>
            <RevealInit/>
            <TypeInit/>
        </LocaleProvider>
        </body>
        </html>
    );
}
