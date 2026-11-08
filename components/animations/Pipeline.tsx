"use client";

import {useLocale} from "../LocaleProvider";

/** Idea -> Design -> Code -> Launch with a dot travelling along the line. */
export default function Pipeline() {
    const {t} = useLocale();
    return (
        <div className="pipeline" role="img" aria-label={t.home.pipeline.join(" → ")}>
            <div className="pipeline-track" aria-hidden="true"><span className="pipeline-dot"/></div>
            <ol className="pipeline-steps" aria-hidden="true">
                {t.home.pipeline.map((step, i) => <li key={step} style={{animationDelay: `${i * 0.9}s`}}><b>{i + 1}</b>{step}</li>)}
            </ol>
        </div>
    );
}
