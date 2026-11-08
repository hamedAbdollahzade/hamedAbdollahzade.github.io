"use client";

import {useLocale} from "./LocaleProvider";

const TECH = ["React", "Next.js", "TypeScript", "Vue", "Node.js", "Tailwind CSS", "PWA", "REST API", "WebSocket", "Redux", "Vite", "Docker", "AI", "Claude", "Prompt Engineering", "GitHub"];

/** Slow horizontal strip of the technologies we work with (decorative; the list is also in the services pages). */
export default function TechStrip() {
    const {t} = useLocale();
    const items = [...TECH, ...TECH];
    return (
        <div className="strip" aria-label={t.tech.label} role="group">
            <div className="strip-track" aria-hidden="true">
                {items.map((t, i) => <span className="strip-item" key={i}>{t}</span>)}
            </div>
            <ul className="sr-only">{TECH.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
    );
}
