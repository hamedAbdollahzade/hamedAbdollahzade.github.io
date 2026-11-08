"use client";

import Image from "next/image";
import Link from "next/link";
import {useCallback, useEffect, useState} from "react";
import {getSlides} from "@/data/localized";
import {localePath} from "@/lib/locale";
import {ChevronIcon} from "./Icons";
import {useLocale} from "./LocaleProvider";
import OpenChat from "./OpenChat";

const INTERVAL = 6500;

/** Hero slideshow: our ad copy next to project screenshots. All slides are in the HTML for crawlers. */
export default function HeroSlider() {
    const {locale, t} = useLocale();
    const SLIDES = getSlides(locale);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const onChange = () => setReduced(mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), []);

    useEffect(() => {
        if (paused || reduced) return;
        const t = setTimeout(() => go(index + 1), INTERVAL);
        return () => clearTimeout(t);
    }, [index, paused, reduced, go]);

    return (
        <section
            className="slider"
            aria-roledescription="carousel"
            aria-label={t.slider.label}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            <div className="slides" aria-live={paused || reduced ? "polite" : "off"}>
                {SLIDES.map((s, i) => {
                    const Heading = i === 0 ? "h1" : "h2";
                    const active = i === index;
                    return (
                        <article
                            key={s.id}
                            className={`slide${active ? " is-active" : ""}`}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={t.slider.slide(i + 1, SLIDES.length)}
                            aria-hidden={!active}
                            inert={!active}
                        >
                            <div className="slide-text">
                                <span className="hero-badge">{s.badge}</span>
                                <Heading className="slide-title">{s.title}</Heading>
                                <p>{s.text}</p>
                                <div className="btn-row">
                                    {s.cta.href
                                        ? <Link className="btn btn--lg" href={localePath(locale, s.cta.href)} tabIndex={active ? 0 : -1}>{s.cta.label}</Link>
                                        : <OpenChat className="btn btn--lg" topic={s.cta.chatTopic}>{s.cta.label}</OpenChat>}
                                </div>
                            </div>
                            <div className="slide-media">
                                <div className={`mock${s.contain ? " mock--phone" : ""}`}>
                                    {!s.contain && <div className="mock-bar"><i/><i/><i/></div>}
                                    <Image src={`/${s.image}`} alt={s.imageAlt} width={1440} height={900} priority={i === 0} loading="eager" decoding="sync"/>
                                </div>
                                <Link className="slide-caption" href={localePath(locale, s.captionHref)} tabIndex={active ? 0 : -1}>{s.caption} {t.arrow}</Link>
                            </div>
                        </article>
                    );
                })}
            </div>
            <div className="slider-controls">
                <button type="button" className="slider-btn" aria-label={t.slider.prev} onClick={() => go(index - 1)}><ChevronIcon/></button>
                <div className="slider-dots" role="tablist" aria-label={t.slider.pick}>
                    {SLIDES.map((s, i) => (
                        <button key={s.id} type="button" role="tab" aria-selected={i === index} aria-label={t.slider.dot(i + 1)} className={`dot${i === index ? " is-active" : ""}`} onClick={() => go(i)}/>
                    ))}
                </div>
                <button type="button" className="slider-btn slider-btn--next" aria-label={t.slider.next} onClick={() => go(index + 1)}><ChevronIcon/></button>
            </div>
        </section>
    );
}
