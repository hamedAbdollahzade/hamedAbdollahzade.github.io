"use client";

import {getSlides} from "@/data/localized";
import {localePath} from "@/lib/locale";
import CodeWindow from "./animations/CodeWindow";
import {useLocale} from "./LocaleProvider";
import OpenChat from "./OpenChat";

const HERO_CODE = [
    'import { build } from "webino-dev";',
    "",
    'const idea = "your next product";',
    "const product = await build(idea, { ai: true });",
    "",
    "product.launch(); // from idea to production",
];

/** Home hero: the pitch with a checklist and a typing code editor; the network lives in the page background. */
export default function Hero() {
    const {locale, t} = useLocale();
    const slide = getSlides(locale)[0];

    return (
        <section className="net-hero" aria-labelledby="hero-title">
            <div className="net-text">
                <span className="hero-badge">{slide.badge}</span>
                <h1 className="net-title" id="hero-title">{slide.title}</h1>
                <p>{slide.text}</p>
                <ul className="hero-points">{t.home.heroPoints.map((x: string) => <li key={x}>{x}</li>)}</ul>
                <div className="btn-row">
                    <OpenChat className="btn btn--lg" topic={slide.cta.chatTopic}>{slide.cta.label}</OpenChat>
                    <a className="btn btn--lg btn--ghost" href={localePath(locale, "/#services")}>{t.nav.services}</a>
                </div>
            </div>
            <CodeWindow file="idea.ts" lines={HERO_CODE} label={t.home.codeLabel}/>
        </section>
    );
}
