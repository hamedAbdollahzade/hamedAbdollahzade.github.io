"use client";

import Image from "next/image";
import {localePath} from "@/lib/locale";
import {photoAlt} from "@/lib/site";
import {useLocale} from "./LocaleProvider";
import OpenChat from "./OpenChat";

export default function Hero() {
    const {locale, t} = useLocale();
    const h = t.home;

    return (
        <section className="vh-hero" aria-labelledby="hero-title">
            <div className="vh-backdrop">
                <Image src="/assets/images/home-hero.webp" alt={photoAlt(locale)} fill sizes="100vw" fetchPriority="high"/>
            </div>
            <div className="vh-layout">
                <div className="vh-content">
                    <p className="vh-eyebrow">{h.heroEyebrow}</p>
                    <h1 className="vh-title" id="hero-title">{h.heroTitle} <span className="vh-accent">{h.heroAccent}</span></h1>
                    <p className="vh-lead">{h.heroLead}</p>
                    <div className="btn-row vh-actions">
                        <OpenChat className="btn btn--lg" topic={h.heroCtaTopic}>{h.heroCta}</OpenChat>
                        <a className="btn btn--lg vh-ghost" href={localePath(locale, "/#projects")}>{h.heroSecondary}</a>
                    </div>
                    <ul className="vh-points">{h.heroPoints.map((x: string) => <li key={x}>{x}</li>)}</ul>
                </div>
            </div>
            <a className="vh-scroll" href="#services" aria-label={h.heroScroll}><span aria-hidden="true"/></a>
        </section>
    );
}
