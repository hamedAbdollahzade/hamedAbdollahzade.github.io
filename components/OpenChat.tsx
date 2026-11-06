"use client";

import type {ReactNode} from "react";

/** Button that opens the chat widget (optionally with a topic preselected). */
export default function OpenChat({children, className = "btn", topic}: {children: ReactNode; className?: string; topic?: string}) {
    return (
        <button type="button" className={className} onClick={() => window.dispatchEvent(new CustomEvent("webino:open-chat", {detail: {topic}}))}>
            {children}
        </button>
    );
}
