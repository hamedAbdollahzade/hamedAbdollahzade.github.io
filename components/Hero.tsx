"use client";

import Image from "next/image";
import Link from "next/link";
import {getSlides} from "@/data/localized";
import {localePath} from "@/lib/locale";
import {useLocale} from "./LocaleProvider";
import OpenChat from "./OpenChat";

/** Home hero: a centred two-tone headline over a starfield, then a browser window showing a real project. */
export default function Hero() {
    const {locale, t} = useLocale();
    const slide = getSlides(locale)[0];

    return (
        <section className="lr-hero" aria-labelledby="hero-title">
            <div className="lr-stars" aria-hidden="true"><i/><i/><i/></div>
            <div className="lr-hero-text">
                <span className="hero-badge">{slide.badge}</span>
                <h1 className="lr-title" id="hero-title">
                    <span>{t.home.heroLine1}</span>
                    <span className="lr-title-dim">{t.home.heroLine2}</span>
                </h1>
                <p className="lr-lead">{slide.text}</p>
                <div className="lr-pill">
                    <span><b>{t.home.heroPill}</b></span>
                    <OpenChat className="lr-pill-btn" topic={slide.cta.chatTopic}>{t.home.heroPillCta}</OpenChat>
                </div>
            </div>

            <div className="lr-browser">
                <div className="lr-browser-bar" dir="ltr">
                    <span className="lr-dots" aria-hidden="true"><i/><i/><i/></span>
                    <span className="lr-url">https://webino-dev.ir{localePath(locale, slide.captionHref)}</span>
                </div>
                <Link className="lr-browser-body" href={localePath(locale, slide.captionHref)} aria-label={slide.caption}>
                    <Image src={`/${slide.image}`} alt={slide.imageAlt} width={1280} height={760} priority/>
                </Link>
            </div>
        </section>
    );
}
