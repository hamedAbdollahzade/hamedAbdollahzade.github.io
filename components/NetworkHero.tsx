"use client";

import {useRouter} from "next/navigation";
import type {MouseEvent} from "react";
import {getBrand, getDevelopers, getProjects, getServices, getSlides} from "@/data/localized";
import {localePath} from "@/lib/locale";
import {useLocale} from "./LocaleProvider";
import OpenChat from "./OpenChat";

interface GNode {id: string; label: string; href: string; x: number; y: number; kind: "hub" | "leaf"; parent: string; side: "start" | "end" | "middle"; above?: boolean}

const WIDE = {W: 1000, H: 560, rx: 255, ry: 150};
const TALL = {W: 400, H: 540, rx: 128, ry: 205};
type Layout = typeof WIDE;
const rad = (deg: number) => (deg * Math.PI) / 180;
const TALL_ANGLES: Record<string, number> = {services: -90, projects: -39, learn: 13, explore: 64, developers: 116, about: 167, contact: 219};
const clip = (s: string, n = 15) => (s.length > n ? `${s.slice(0, n - 1).trim()}…` : s);

/** Builds the site map: one hub per section around the centre, with the pages of that section around each hub. */
function buildGraph(locale: "fa" | "en", labels: Record<string, string>, L: Layout, compact: boolean) {
    const CX = L.W / 2, CY = L.H / 2;
    const hubs: {id: string; angle: number; fan?: number; href: string; leaves: {label: string; href: string}[]}[] = [
        {id: "services", angle: -135, fan: -170, href: "/#services", leaves: getServices(locale).map((s) => ({label: s.title, href: `/services/${s.slug}/`}))},
        {id: "projects", angle: -65, fan: -15, href: "/#projects", leaves: getProjects(locale).map((p) => ({label: p.title, href: `/projects/${p.slug}/`}))},
        {id: "learn", angle: -15, href: "/blog/", leaves: []},
        {id: "explore", angle: 35, href: "/explore/", leaves: []},
        {id: "developers", angle: 85, fan: 60, href: "/developers/", leaves: getDevelopers(locale).map((d) => ({label: d.name, href: `/developers/${d.slug}/`}))},
        {id: "about", angle: 135, href: "/about/", leaves: []},
        {id: "contact", angle: 180, href: "/#contact", leaves: []},
    ];
    const nodes: GNode[] = [];
    for (const h of hubs) {
        const angle = compact ? TALL_ANGLES[h.id] : h.angle;
        const hx = CX + L.rx * Math.cos(rad(angle)), hy = CY + L.ry * Math.sin(rad(angle));
        nodes.push({id: h.id, label: labels[h.id], href: h.href, x: hx, y: hy, kind: "hub", parent: "core", side: "middle"});
        if (compact) continue; // phones show the hubs only; each hub page lists its items
        const n = h.leaves.length;
        const spread = n > 1 ? Math.min(150, 40 * (n - 1)) : 0;
        h.leaves.forEach((leaf, i) => {
            const a = (h.fan ?? h.angle) + (n > 1 ? -spread / 2 + (spread * i) / (n - 1) : 0);
            const lx = hx + 122 * Math.cos(rad(a)), ly = hy + 122 * Math.sin(rad(a));
            const c = Math.cos(rad(a));
            nodes.push({id: `${h.id}-${i}`, label: clip(leaf.label), href: leaf.href, x: lx, y: ly, kind: "leaf", parent: h.id, side: c > 0.3 ? "start" : c < -0.3 ? "end" : "middle", above: Math.sin(rad(a)) < 0});
        });
    }
    return nodes;
}


function Graph({className, layout, nodes, brand, label, onGo, href}: {className: string; layout: Layout; nodes: GNode[]; brand: string; label: string; onGo: (h: string) => (e: MouseEvent<Element>) => void; href: (h: string) => string}) {
    const CX = layout.W / 2, CY = layout.H / 2;
    const byId = new Map(nodes.map((n) => [n.id, n]));
    return (
        <svg className={className} viewBox={`0 0 ${layout.W} ${layout.H}`} role="group" aria-label={label}>
            {nodes.map((n) => {
                const p = byId.get(n.parent);
                return <line key={`e-${n.id}`} className={`edge${n.kind === "leaf" ? " edge--leaf" : ""}`} x1={p ? p.x : CX} y1={p ? p.y : CY} x2={n.x} y2={n.y}/>;
            })}
            <g transform={`translate(${CX} ${CY})`}>
                <g className="gnode gnode--core">
                    <circle className="core-ring" r="66"/><circle className="core-dot" r="50"/>
                    <text className="core-label" textAnchor="middle" dy=".35em">{brand}</text>
                </g>
            </g>
            {nodes.map((n, i) => {
                const w = n.kind === "hub" ? Math.max(86, n.label.length * 10 + 38) : 0;
                return (
                    <a key={n.id} href={href(n.href)} onClick={onGo(n.href)} aria-label={n.label}>
                        <g transform={`translate(${n.x} ${n.y})`}>
                            <g className={`gnode gnode--${n.kind}`} style={{animationDelay: `${(i % 7) * -0.7}s`}}>
                                {n.kind === "hub" ? (
                                    <>
                                        <rect x={-w / 2} y={-19} width={w} height={38} rx={19}/>
                                        <text textAnchor="middle" dy=".35em">{n.label}</text>
                                    </>
                                ) : (
                                    <>
                                        <circle r="7"/>
                                        <text className="leaf-text" textAnchor={n.side} x={n.side === "start" ? 14 : n.side === "end" ? -14 : 0} y={n.side === "middle" ? (n.above ? -16 : 24) : 4}>{n.label}</text>
                                    </>
                                )}
                            </g>
                        </g>
                    </a>
                );
            })}
        </svg>
    );
}

/** Home hero: a short pitch and an interactive network graph of the whole site; every node opens its page. */
export default function NetworkHero() {
    const {locale, t} = useLocale();
    const router = useRouter();
    const slide = getSlides(locale)[0];
    const brand = getBrand(locale);
    const labels = {...t.nav, contact: t.contactUs};
    const hint = locale === "fa" ? "نقشه‌ی سایت؛ روی هر گره بزنید تا وارد همان بخش شوید." : "Site map: click any node to open that section.";
    const mapLabel = locale === "fa" ? "گراف شبکه‌ای بخش‌های سایت" : "Network graph of the site sections";

    const go = (href: string) => (e: MouseEvent<Element>) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        router.push(localePath(locale, href));
    };

    return (
        <section className="net-hero" aria-labelledby="hero-title">
            <div className="net-text">
                <span className="hero-badge">{slide.badge}</span>
                <h1 className="net-title" id="hero-title">{slide.title}</h1>
                <p>{slide.text}</p>
                <div className="btn-row"><OpenChat className="btn btn--lg" topic={slide.cta.chatTopic}>{slide.cta.label}</OpenChat></div>
            </div>
            <div className="net-wrap">
                {([[WIDE, false, "net net--wide"], [TALL, true, "net net--tall"]] as const).map(([L, compact, cls]) => (
                    <Graph key={cls} className={cls} layout={L} nodes={buildGraph(locale, labels, L, compact)} brand={brand.name} label={mapLabel} onGo={go} href={(h) => localePath(locale, h)}/>
                ))}
                <p className="net-hint">{hint}</p>
            </div>
        </section>
    );
}
