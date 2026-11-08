import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import OpenChat from "@/components/OpenChat";
import Pipeline from "@/components/animations/Pipeline";
import Shell from "@/components/Shell";
import {localePath} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import {SITE} from "@/lib/site";
import {UI} from "@/lib/ui";

/** The about page in the given language. */
export default function AboutView({locale}: {locale: Locale}) {
    const t = UI[locale];
    const a = t.about;
    const url = `${SITE}${localePath(locale, "/about/")}`;

    return (
        <Shell crumbs={[{label: a.crumb}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {"@type": "AboutPage", "@id": `${url}#page`, url, name: a.meta.title, inLanguage: locale, isPartOf: {"@id": `${SITE}/#website`}, about: {"@id": `${SITE}/#org`}},
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: "Webino-Dev", item: `${SITE}${localePath(locale, "/")}`},
                        {"@type": "ListItem", position: 2, name: a.crumb, item: url},
                    ]},
                ],
            }}/>
            <div className="card">
                <h1 className="page-title">{a.title}</h1>
                <p className="page-lead">{a.lead}</p>
                <div className="btn-row" style={{marginTop: 18}}>
                    <OpenChat>{t.requestProject}</OpenChat>
                    <Link className="btn btn--soft" href={localePath(locale, "/developers/")}>{a.meetDevs}</Link>
                </div>
                <Pipeline/>
            </div>
            <div className="card page-card">
                <h2>{a.h1}</h2>
                <p>{a.p1}</p>
                <h2>{a.h2}</h2>
                <p>{a.p2}</p>
                <h2>{a.h3}</h2>
                <p>{a.p3}</p>
            </div>
        </Shell>
    );
}
