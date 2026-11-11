import type {ReactNode} from "react";
import {DIR} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import ChatWidget from "./ChatWidget";
import IntroLoader from "./IntroLoader";
import {LocaleProvider} from "./LocaleProvider";
import RevealInit from "./RevealInit";
import {UI} from "@/lib/ui";

/* Runs before first paint: marks JS support, applies the saved/system theme and decides whether to show the intro. */
const BOOT_SCRIPT = '(function(){var d=document.documentElement;d.classList.add("js");try{var s=localStorage.getItem("webino-theme");d.dataset.theme=s||"light"}catch(e){d.dataset.theme="light"}try{var p=location.pathname;if((p==="/"||p==="/en"||p==="/en/")&&!sessionStorage.getItem("webino-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("intro-on")}}catch(e){}})();';

const FONTS: Record<Locale, string> = {
    fa: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800&display=swap",
    en: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Vazirmatn:wght@400;500;700;800&display=swap",
};

/** The <html> document shared by both languages' root layouts. */
export default function RootDocument({locale, children}: {locale: Locale; children: ReactNode}) {
    return (
        <html lang={locale} dir={DIR[locale]} data-theme="light" suppressHydrationWarning>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
            <link href={FONTS[locale]} rel="stylesheet"/>
            <script dangerouslySetInnerHTML={{__html: BOOT_SCRIPT}}/>
        </head>
        <body>
        <LocaleProvider locale={locale}>
            <IntroLoader/>
            <a className="skip-link" href="#main-content">{UI[locale].skipToContent}</a>
            {children}
            <ChatWidget/>
            <RevealInit/>
        </LocaleProvider>
        </body>
        </html>
    );
}
