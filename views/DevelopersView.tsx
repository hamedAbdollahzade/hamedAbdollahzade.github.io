import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Avatar from "@/components/Avatar";
import Shell from "@/components/Shell";
import {getDevelopers} from "@/data/localized";
import {localePath} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import {SITE, summarize} from "@/lib/site";
import {UI} from "@/lib/ui";

/** The developers list in the given language. */
export default function DevelopersView({locale}: {locale: Locale}) {
    const t = UI[locale];
    const url = `${SITE}${localePath(locale, "/developers/")}`;

    return (
        <Shell crumbs={[{label: t.developers.crumb}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {"@type": "CollectionPage", "@id": `${url}#page`, url, name: t.developers.metaTitle, inLanguage: locale, isPartOf: {"@id": `${SITE}/#website`}},
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: "Webino-Dev", item: `${SITE}${localePath(locale, "/")}`},
                        {"@type": "ListItem", position: 2, name: t.developers.crumb, item: url},
                    ]},
                ],
            }}/>
            <div className="card">
                <h1 className="page-title">{t.developers.title}</h1>
                <p className="page-lead">{t.developers.desc}</p>
            </div>
            <div className="grid grid--cards">
                {getDevelopers(locale).map((d) => (
                    <Link className="dev-card" href={localePath(locale, `/developers/${d.slug}/`)} key={d.slug}>
                        <div className="dev-top">
                            <Avatar name={d.name} photo={d.photo} size={72}/>
                            <div><h2 style={{fontSize: 20, fontWeight: 800}}>{d.name}</h2><div className="dev-role">{d.role}</div></div>
                        </div>
                        <p>{summarize(d.bio, 160)}</p>
                        <ul className="tags">{d.skills.map((s) => <li key={s}>{s}</li>)}</ul>
                        <span className="tile-more">{t.developers.profile} {t.arrow}</span>
                    </Link>
                ))}
            </div>
        </Shell>
    );
}
