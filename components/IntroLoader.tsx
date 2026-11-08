"use client";

import {useEffect, useRef} from "react";
import {BRAND} from "@/data/services";

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789ابپتجدرزسشعفقکلمنهی";
const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789<>/{}=+-*";
const BRAND_START = 700;      // ms until the brand name starts to appear
const LETTER_GAP = 110;       // ms between letters
const SCRAMBLE = 420;         // ms a letter flickers before it locks
const HOLD = 700;             // ms the finished name stays on screen
const FADE = 700;             // ms of the fade-out

/**
 * Matrix-style intro for the home page: small letters rain down, then the brand name
 * resolves letter by letter. Shown once per session; skippable; not shown with reduced motion.
 * The overlay is only displayed when <html> carries the "intro-on" class (set by an inline script).
 */
export default function IntroLoader() {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const subRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const html = document.documentElement;
        const root = rootRef.current;
        const canvas = canvasRef.current;
        if (!html.classList.contains("intro-on") || !root || !canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) { html.classList.remove("intro-on"); return; }

        const name = BRAND.name;
        const fontSize = window.innerWidth < 640 ? 14 : 17;
        let width = 0, height = 0, columns: {y: number; speed: number; delay: number}[] = [];

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.fillStyle = "#04181a";
            ctx.fillRect(0, 0, width, height);
            const count = Math.ceil(width / fontSize);
            columns = Array.from({length: count}, () => ({y: -Math.random() * height * 0.6, speed: 0.55 + Math.random() * 1.1, delay: Math.random() * 900}));
        };
        resize();
        window.addEventListener("resize", resize);

        const start = performance.now();
        let finished = false;
        let fadeTimer: ReturnType<typeof setTimeout> | undefined;
        let endTimer: ReturnType<typeof setTimeout> | undefined;
        const lockAt = (i: number) => BRAND_START + i * LETTER_GAP + SCRAMBLE;
        const doneAt = lockAt(name.length - 1);

        const finish = (fast: boolean) => {
            if (finished) return;
            finished = true;
            root.classList.add("is-out");
            if (fast) root.style.transitionDuration = ".35s";
            endTimer = setTimeout(() => {
                try { sessionStorage.setItem("webino-intro", "1"); } catch { /* storage may be blocked */ }
                html.classList.remove("intro-on");
                cleanup();
            }, fast ? 380 : FADE + 40);
        };

        const tick = () => {
            const now = performance.now() - start;

            // Rain: fade the previous frame, then draw the head and a bright tail character per column.
            ctx.fillStyle = "rgba(4, 24, 26, 0.09)";
            ctx.fillRect(0, 0, width, height);
            ctx.font = `${fontSize}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
            ctx.textAlign = "center";
            columns.forEach((col, i) => {
                if (now < col.delay) return;
                const x = i * fontSize + fontSize / 2;
                const step = col.speed * fontSize * 0.95;
                // Draw a glyph at every cell the column moved through, so fast columns stay continuous.
                for (let y = col.y; y < col.y + step; y += fontSize) {
                    ctx.fillStyle = "rgba(51, 176, 164, 0.95)";
                    ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - fontSize);
                    ctx.fillStyle = "#d8fff9";
                    ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y);
                }
                col.y += step;
                if (col.y > height + fontSize && Math.random() > 0.97) col.y = -fontSize * Math.random() * 6;
                else if (col.y > height + fontSize * 20) col.y = -fontSize;
            });

            // Brand name: each letter flickers through random glyphs, then locks.
            name.split("").forEach((final, i) => {
                const el = letterRefs.current[i];
                if (!el) return;
                const begin = BRAND_START + i * LETTER_GAP;
                if (now < begin) return;
                el.style.opacity = "1";
                if (now >= lockAt(i)) {
                    if (el.textContent !== final) el.textContent = final;
                    el.classList.add("is-locked");
                } else {
                    el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                }
            });
            if (now >= doneAt && subRef.current) subRef.current.classList.add("is-visible");
            if (now >= doneAt + HOLD) finish(false);
        };

        const timer = setInterval(tick, 42);
        const onSkip = () => finish(true);
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish(true); };
        root.addEventListener("click", onSkip);
        document.addEventListener("keydown", onKey);

        function cleanup() {
            clearInterval(timer);
            if (fadeTimer) clearTimeout(fadeTimer);
            if (endTimer) clearTimeout(endTimer);
            window.removeEventListener("resize", resize);
            root!.removeEventListener("click", onSkip);
            document.removeEventListener("keydown", onKey);
        }
        return cleanup;
    }, []);

    return (
        <div className="intro" ref={rootRef} role="status" aria-label={`در حال بارگذاری ${BRAND.name}`}>
            <canvas ref={canvasRef} aria-hidden="true"/>
            <div className="intro-center">
                <div className="intro-brand" aria-hidden="true" dir="ltr">
                    {BRAND.name.split("").map((c, i) => (
                        <span key={i} className="intro-letter" ref={(el) => { letterRefs.current[i] = el; }}>{c}</span>
                    ))}
                </div>
                <p className="intro-sub" ref={subRef}>{BRAND.tagline}</p>
            </div>
            <button type="button" className="intro-skip">رد کردن</button>
        </div>
    );
}
