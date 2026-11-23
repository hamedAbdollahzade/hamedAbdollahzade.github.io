"use client";

import {useEffect} from "react";
import {BRAND} from "@/data/services";

import {useLocale} from "./LocaleProvider";

function skipIntro() {
    document.documentElement.classList.remove("intro-on");
}

export default function IntroLoader() {
    const {t, locale} = useLocale();

    useEffect(() => {
        if (!document.documentElement.classList.contains("intro-on")) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") skipIntro();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className="intro" id="site-intro">
            <span className="sr-only" role="status">{t.intro.label(BRAND.name)}</span>
            <div className="intro-stage" aria-hidden="true">
                {(["browser", "phone"] as const).map(device => (
                    <div className={`intro-device intro-${device}`} key={device}>
                        <div className="intro-blueprint">
                            <div className="intro-toolbar"><i/><i/><i/></div>
                            <div className="intro-sketch" dir="ltr">
                                <span className="intro-portrait"/>
                                <div dir={locale === "fa" ? "rtl" : "ltr"} className="intro-copy">
                                    <strong>{t.home.heroTitle}</strong>
                                    <span>{t.home.heroAccent}</span>
                                    <i/><i/>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <code className="intro-tag" dir="ltr">{"<main>"}</code>
            </div>
            <button type="button" className="intro-skip" onClick={skipIntro}>{t.intro.skip}</button>
        </div>
    );
}
