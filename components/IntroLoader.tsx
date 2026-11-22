"use client";

import {useEffect} from "react";
import {BRAND} from "@/data/services";
import {Logo} from "./Icons";
import {useLocale} from "./LocaleProvider";

function skipIntro() {
    document.documentElement.classList.remove("intro-on");
}

export default function IntroLoader() {
    const {t} = useLocale();

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
            <div className="intro-brand" role="status" aria-label={t.intro.label(BRAND.name)}>
                <span className="intro-brand-icon"><Logo/></span>
                <span dir="ltr">{BRAND.name}</span>
            </div>

            <div className="intro-stage" aria-hidden="true">
                <div className="intro-scene intro-scene--code">
                    <div className="intro-window" dir="ltr">
                        <div className="intro-window-bar"><i/><i/><i/><span>app.tsx</span></div>
                        <pre className="intro-code"><code>
                            <span><b>export function</b> App() {"{"}</span>
                            <span>{"  "}<b>return</b> (</span>
                            <span>{"    "}<em>{"<main>"}</em></span>
                            <span>{"      "}<em>{"<Hero />"}</em></span>
                            <span>{"      "}<em>{"<Projects />"}</em></span>
                            <span>{"    "}<em>{"</main>"}</em></span>
                            <span>{"  );"}</span>
                            <span>{"}"}</span>
                        </code></pre>
                    </div>
                    <p className="intro-caption">{t.intro.coding}</p>
                </div>

                <div className="intro-scene intro-scene--web">
                    <div className="intro-window" dir="ltr">
                        <div className="intro-window-bar"><i/><i/><i/><span>webino-dev.ir</span></div>
                        <div className="intro-web">
                            <div className="intro-web-nav"><Logo/><i/><i/></div>
                            <div className="intro-web-hero">
                                <div><i/><i/><i/></div>
                                <span className="intro-web-art"/>
                            </div>
                            <div className="intro-web-cards"><i/><i/><i/></div>
                        </div>
                    </div>
                    <p className="intro-caption">{t.intro.website}</p>
                </div>

                <div className="intro-scene intro-scene--app">
                    <div className="intro-phone" dir="ltr">
                        <div className="intro-phone-camera"/>
                        <div className="intro-phone-head"><Logo/><i/></div>
                        <div className="intro-phone-chart"><i/><i/><i/><i/><i/></div>
                        <div className="intro-phone-list"><i/><i/><i/></div>
                    </div>
                    <p className="intro-caption">{t.intro.application}</p>
                </div>
            </div>

            <div className="intro-progress" aria-hidden="true"><i/></div>
            <button type="button" className="intro-skip" onClick={skipIntro}>{t.intro.skip}</button>
        </div>
    );
}
