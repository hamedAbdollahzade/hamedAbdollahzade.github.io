"use client";

import {useEffect, useState} from "react";
import {useReducedMotion} from "./useReducedMotion";

export interface TerminalStep {kind: "cmd" | "out"; text: string}

/** A terminal that types commands and prints their output, then loops. */
export default function TerminalWindow({title, steps, label}: {title: string; steps: TerminalStep[]; label: string}) {
    const reduced = useReducedMotion();
    const [line, setLine] = useState(0);   // index of the step being shown
    const [chars, setChars] = useState(0); // characters typed in the current command

    useEffect(() => {
        if (reduced) { setLine(steps.length); return; }
        const current = steps[line];
        let timer: ReturnType<typeof setTimeout>;
        if (line >= steps.length) {
            timer = setTimeout(() => { setLine(0); setChars(0); }, 2200);
        } else if (current.kind === "cmd" && chars < current.text.length) {
            timer = setTimeout(() => setChars(chars + 1), 55);
        } else {
            timer = setTimeout(() => { setLine(line + 1); setChars(0); }, current.kind === "cmd" ? 450 : 650);
        }
        return () => clearTimeout(timer);
    }, [line, chars, steps, reduced]);

    return (
        <figure className="anim-window anim-window--term" role="img" aria-label={label}>
            <div className="anim-bar"><i/><i/><i/><span>{title}</span></div>
            <div className="anim-code" dir="ltr" aria-hidden="true">
                {steps.slice(0, Math.min(line + 1, steps.length)).map((s, i) => {
                    const typing = i === line;
                    const text = s.kind === "cmd" && typing ? s.text.slice(0, chars) : s.text;
                    return (
                        <div key={i} className={s.kind === "cmd" ? "term-cmd" : "term-out"}>
                            {s.kind === "cmd" && <span className="term-prompt">$ </span>}
                            {text}
                            {typing && s.kind === "cmd" && <span className="caret"/>}
                        </div>
                    );
                })}
                {line >= steps.length && <div className="term-cmd"><span className="term-prompt">$ </span><span className="caret"/></div>}
            </div>
        </figure>
    );
}
