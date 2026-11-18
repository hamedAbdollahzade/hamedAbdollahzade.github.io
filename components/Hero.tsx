"use client";

import {useEffect, useRef} from "react";
import {localePath} from "@/lib/locale";
import {useLocale} from "./LocaleProvider";
import OpenChat from "./OpenChat";

const VIDEO = "/assets/video";

/** Full-screen home hero: a looping video of the projects behind the slogan and the main call to action. */
export default function Hero() {
    const {locale, t} = useLocale();
    const h = t.home;
    const ref = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        const section = ref.current;
        if (!video || !section) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        // React does not always render `muted` into the HTML, and browsers only autoplay muted video.
        video.muted = true;
        if (reduce.matches) video.pause();
        else video.play().catch(() => { /* autoplay blocked: the poster stays */ });

        // Fill the screen below the header: measure where the hero starts.
        const fit = () => section.style.setProperty("--hero-top", `${Math.max(0, section.getBoundingClientRect().top + window.scrollY)}px`);
        fit();
        window.addEventListener("resize", fit);

        // Fade and lift the hero text while the page scrolls past it.
        let frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const p = Math.min(1, Math.max(0, window.scrollY / section.offsetHeight));
                section.style.setProperty("--hero-p", p.toFixed(3));
            });
        };
        if (!reduce.matches) {
            onScroll();
            window.addEventListener("scroll", onScroll, {passive: true});
        }
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", fit);
        };
    }, []);

    return (
        <section className="vh-hero" ref={ref} aria-labelledby="hero-title">
            <video className="vh-video" ref={videoRef} autoPlay muted loop playsInline preload="auto" poster={`${VIDEO}/hero-desktop-poster.webp`} aria-label={h.heroVideo}>
                <source src={`${VIDEO}/hero-mobile.mp4`} type="video/mp4" media="(max-width: 700px)"/>
                <source src={`${VIDEO}/hero-desktop.mp4`} type="video/mp4"/>
            </video>
            <div className="vh-shade" aria-hidden="true"/>
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
            <a className="vh-scroll" href="#services" aria-label={h.heroScroll}><span aria-hidden="true"/></a>
        </section>
    );
}
