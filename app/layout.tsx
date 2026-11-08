import type {Metadata, Viewport} from "next";
import type {ReactNode} from "react";
import ChatWidget from "@/components/ChatWidget";
import IntroLoader from "@/components/IntroLoader";
import RevealInit from "@/components/RevealInit";
import {ORG, SITE} from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(SITE),
    applicationName: "Webino-Dev",
    authors: [{name: "Webino-Dev"}],
    manifest: "/manifest.json",
    icons: {icon: [{url: "/assets/icons/favicon.svg", type: "image/svg+xml"}]},
    robots: {index: true, follow: true, "max-image-preview": "large", "max-snippet": -1},
    openGraph: {siteName: ORG, locale: "fa_IR"},
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: "#0a0a0b",
};

export default function RootLayout({children}: {children: ReactNode}) {
    return (
        <html lang="fa" dir="rtl" suppressHydrationWarning>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
            <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800&display=swap" rel="stylesheet"/>
            <script dangerouslySetInnerHTML={{__html: '(function(){var d=document.documentElement;d.classList.add("js");try{if(location.pathname==="/"&&!sessionStorage.getItem("webino-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("intro-on")}}catch(e){}})();'}}/>
        </head>
        <body>
        <IntroLoader/>
        <a className="skip-link" href="#main-content">پرش به محتوای اصلی</a>
        {children}
        <ChatWidget/>
        <RevealInit/>
        </body>
        </html>
    );
}
