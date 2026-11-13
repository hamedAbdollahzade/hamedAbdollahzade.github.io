"use client";

import {useEffect, useState} from "react";
import {useReducedMotion} from "./useReducedMotion";

const KEYWORDS = /\b(import|export|from|const|let|return|await|async|function|if|else|new|true|false|null)\b/g;

/** Wraps keywords, strings, comments and numbers of one code line in colour spans (pastel colours). */
function highlight(line: string) {
    const parts: {text: string; cls: string}[] = [];
    const commentAt = line.indexOf("//");
    const code = commentAt >= 0 ? line.slice(0, commentAt) : line;
    const comment = commentAt >= 0 ? line.slice(commentAt) : "";
    const re = /("[^"]*"|'[^']*'|`[^`]*`)|(\b\d+\b)|(\w+)|(\W+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(code))) {
        if (m[1]) parts.push({text: m[1], cls: "tok-str"});
        else if (m[2]) parts.push({text: m[2], cls: "tok-num"});
        else if (m[3]) parts.push({text: m[3], cls: KEYWORDS.test(m[3]) ? "tok-kw" : ""});
        else parts.push({text: m[4], cls: ""});
        KEYWORDS.lastIndex = 0;
    }
    if (comment) parts.push({text: comment, cls: "tok-com"});
    return parts;
}

/** A code editor that types its lines out and loops (a GIF-style animation made with real text). */
export default function CodeWindow({file, lines, label}: {file: string; lines: string[]; label: string}) {
    const full = lines.join("\n");
    const reduced = useReducedMotion();
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (reduced) { setCount(full.length); return; }
        const timer = setInterval(() => {
            setCount((c) => {
                if (c >= full.length + 38) return 0; // hold the finished code for ~1.5 s, then restart
                return c + 1;
            });
        }, 42);
        return () => clearInterval(timer);
    }, [full, reduced]);

    const shown = full.slice(0, Math.min(count, full.length)).split("\n");
    return (
        <figure className="anim-window" role="img" aria-label={label}>
            <div className="anim-bar"><i/><i/><i/><span>{file}</span></div>
            <pre className="anim-code" dir="ltr" aria-hidden="true">
                {shown.map((line, i) => (
                    <span className="code-line" key={i}>
                        {highlight(line).map((p, j) => <span key={j} className={p.cls}>{p.text}</span>)}
                        {i === shown.length - 1 && <span className="caret"/>}
                        {"\n"}
                    </span>
                ))}
            </pre>
        </figure>
    );
}
