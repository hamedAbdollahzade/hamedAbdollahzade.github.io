"use client";

import {useRef} from "react";
import type {ReactNode} from "react";

export default function Carousel({children}: {children: ReactNode}) {
    const track = useRef<HTMLDivElement>(null);
    const scroll = (dir: number) => {
        const el = track.current;
        if (!el) return;
        const card = el.querySelector<HTMLElement>(".project-card");
        el.scrollBy({left: dir * ((card?.offsetWidth ?? 320) + 24), behavior: "smooth"});
    };
    return (
        <div className="carousel">
            <div className="carousel-track" ref={track}>{children}</div>
            <div className="carousel-nav">
                <button className="round-btn" type="button" aria-label="پروژه قبلی" onClick={() => scroll(-1)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6"/></svg>
                </button>
                <button className="round-btn" type="button" aria-label="پروژه بعدی" onClick={() => scroll(1)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>
                </button>
            </div>
        </div>
    );
}
