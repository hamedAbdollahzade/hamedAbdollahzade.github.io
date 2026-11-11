"use client";

import {useEffect, useState} from "react";
import {useReducedMotion} from "./useReducedMotion";

/** A terminal-style installer: bars fill one after another, then the run restarts (a GIF-like loop). */
export default function ProgressWindow({title, tasks, label}: {title: string; tasks: string[]; label: string}) {
    const reduced = useReducedMotion();
    const [tick, setTick] = useState(0);
    const span = 20; // ticks one task needs to fill
    const length = tasks.length * span + 30;

    useEffect(() => {
        if (reduced) { setTick(length); return; }
        const id = setInterval(() => setTick((t) => (t >= length ? 0 : t + 1)), 90);
        return () => clearInterval(id);
    }, [length, reduced]);

    return (
        <figure className="anim-window anim-window--term" role="img" aria-label={label}>
            <div className="anim-bar"><i/><i/><i/><span>{title}</span></div>
            <div className="anim-code prog" dir="ltr" aria-hidden="true">
                {tasks.map((task, i) => {
                    const pct = Math.max(0, Math.min(100, Math.round(((tick - i * span) / span) * 100)));
                    if (tick < i * span) return null;
                    return (
                        <div className="prog-row" key={task}>
                            <span className="prog-name">{task}</span>
                            <span className="prog-bar"><span style={{width: `${pct}%`}}/></span>
                            <span className="prog-pct">{pct === 100 ? "✓" : `${pct}%`}</span>
                        </div>
                    );
                })}
            </div>
        </figure>
    );
}
