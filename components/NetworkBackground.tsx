"use client";

import {useEffect, useRef} from "react";
import {useLocale} from "./LocaleProvider";

interface Dot {x: number; y: number; vx: number; vy: number; r: number; label?: string}

/** Full-page animated network: drifting nodes joined by lines, a few of them carrying the section names. */
export default function NetworkBackground() {
    const ref = useRef<HTMLCanvasElement>(null);
    const {t} = useLocale();
    const labels = Object.values(t.nav) as string[];

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        let w = 0, h = 0, dots: Dot[] = [], raf = 0, last = 0;
        let line = "", fill = "", ink = "";
        const pointer = {x: -999, y: -999};

        const colors = () => {
            const cs = getComputedStyle(document.documentElement);
            const light = document.documentElement.dataset.theme === "light";
            const brand = cs.getPropertyValue("--brand").trim() || "#6e6ef0";
            line = brand; fill = brand; ink = light ? "rgba(10,10,11,.5)" : "rgba(245,245,246,.55)";
        };

        const build = () => {
            const dpr = Math.min(devicePixelRatio || 1, 2);
            w = innerWidth; h = innerHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.round(Math.min(90, Math.max(26, (w * h) / 16000)));
            dots = Array.from({length: count}, (_, i) => ({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
                r: i < labels.length ? 4.5 : 1.6 + Math.random() * 1.4,
                label: labels[i],
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            const reach = w < 700 ? 110 : 150;
            for (const d of dots) {
                d.x += d.vx; d.y += d.vy;
                if (d.x < -20) d.x = w + 20; else if (d.x > w + 20) d.x = -20;
                if (d.y < -20) d.y = h + 20; else if (d.y > h + 20) d.y = -20;
            }
            ctx.lineWidth = 1;
            ctx.strokeStyle = line;
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const a = dots[i], b = dots[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < reach) {
                        ctx.globalAlpha = (1 - dist / reach) * 0.28;
                        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                    }
                }
                const d = dots[i];
                const near = Math.hypot(d.x - pointer.x, d.y - pointer.y);
                if (near < reach * 1.2) {
                    ctx.globalAlpha = (1 - near / (reach * 1.2)) * 0.4;
                    ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
                }
            }
            ctx.fillStyle = fill;
            ctx.font = "600 12px system-ui, sans-serif";
            ctx.textAlign = "center";
            for (const d of dots) {
                ctx.globalAlpha = d.label ? 0.55 : 0.4;
                ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
                if (d.label) {
                    ctx.globalAlpha = 0.7; ctx.fillStyle = ink;
                    ctx.fillText(d.label, d.x, d.y - 11);
                    ctx.fillStyle = fill;
                }
            }
            ctx.globalAlpha = 1;
        };

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame);
            if (now - last < 33) return; // about 30 fps is plenty for a background
            last = now;
            draw();
        };
        const start = () => { if (!raf && !reduced) raf = requestAnimationFrame(frame); };
        const stop = () => { cancelAnimationFrame(raf); raf = 0; };
        const onVisibility = () => (document.hidden ? stop() : start());
        const onMove = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; };
        const onLeave = () => { pointer.x = pointer.y = -999; };
        const onResize = () => { build(); if (reduced) draw(); };

        colors(); build(); draw(); start();
        const observer = new MutationObserver(() => { colors(); if (reduced) draw(); });
        observer.observe(document.documentElement, {attributes: true, attributeFilter: ["data-theme"]});
        addEventListener("resize", onResize);
        addEventListener("pointermove", onMove, {passive: true});
        document.addEventListener("pointerleave", onLeave);
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            stop(); observer.disconnect();
            removeEventListener("resize", onResize);
            removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerleave", onLeave);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [labels.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

    return <canvas ref={ref} className="net-bg" aria-hidden="true"/>;
}
