"use client";

import Image from "next/image";
import Link from "next/link";
import {getSlides} from "@/data/localized";
import {localePath} from "@/lib/locale";
import {useLocale} from "./LocaleProvider";
import OpenChat from "./OpenChat";

/** Home hero: a soft rounded panel with the pitch on one side and a browser window showing a real project on the other. */
export default function Hero() {
    const {locale, t} = useLocale();
    const slide = getSlides(locale)[0];

    return (
        <section className="bx-hero" aria-labelledby="hero-title">
            <div className="bx-hero-text">
                <span className="hero-badge">{slide.badge}</span>
                <h1 className="bx-title" id="hero-title">
                    {t.home.heroLine1} <span className="bx-swoosh">{t.home.heroLine2}</span>
                </h1>
                <p className="bx-lead">{slide.text}</p>
                <ul className="bx-points">{t.home.heroPoints.map((x: string) => <li key={x}>{x}</li>)}</ul>
                <div className="btn-row">
                    <OpenChat className="btn btn--lg" topic={slide.cta.chatTopic}>{slide.cta.label}</OpenChat>
                    <a className="btn btn--lg btn--ghost" href={localePath(locale, "/#services")}>{t.nav.services}</a>
                </div>
            </div>

            <div className="bx-hero-media">
                <div className="bx-browser">
                    <div className="bx-browser-bar" dir="ltr">
                        <span className="bx-dots" aria-hidden="true"><i/><i/><i/></span>
                        <span className="bx-url">webino-dev.ir{localePath(locale, slide.captionHref)}</span>
                    </div>
                    <Link className="bx-browser-body" href={localePath(locale, slide.captionHref)} aria-label={slide.caption}>
                        <Image src={`/${slide.image}`} alt={slide.imageAlt} width={1280} height={760} priority/>
                    </Link>
                </div>
                <div className="bx-float" aria-hidden="true">
                    <span className="bx-float-dot"/>
                    <span><b>{t.home.heroPill}</b><small>{slide.caption}</small></span>
                </div>
            </div>
        </section>
    );
}
