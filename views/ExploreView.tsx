import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {Logo} from "@/components/Icons";
import Shell from "@/components/Shell";
import {EXPLORE_POSTS, exploreText} from "@/data/explore";
import {localePath} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import {SITE} from "@/lib/site";
import {UI} from "@/lib/ui";

/** Instagram-style grid of every explore post. */
export default function ExploreView({locale}: {locale: Locale}) {
    const t = UI[locale].explore;
    const url = `${SITE}${localePath(locale, "/explore/")}`;
    const posts = [...EXPLORE_POSTS].sort((a, b) => b.date.localeCompare(a.date));

    return (
        <Shell crumbs={[{label: t.crumb}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {"@type": "CollectionPage", "@id": `${url}#page`, url, name: t.metaTitle, inLanguage: locale, isPartOf: {"@id": `${SITE}/#website`}},
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: "Webino-Dev", item: `${SITE}${localePath(locale, "/")}`},
                        {"@type": "ListItem", position: 2, name: t.crumb, item: url},
                    ]},
                ],
            }}/>
            <div className="card xp-profile">
                <span className="xp-avatar" aria-hidden="true"><Logo/></span>
                <div>
                    <h1 className="page-title">{t.title}</h1>
                    <p className="page-lead">{t.desc}</p>
                    <p className="xp-count"><strong>{posts.length.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}</strong> {t.posts}</p>
                </div>
            </div>
            {posts.length === 0 && <p className="page-lead">{t.empty}</p>}
            <div className="xp-grid">
                {posts.map((post) => {
                    const x = exploreText(post, locale);
                    return (
                        <Link className="xp-tile" href={localePath(locale, `/explore/${post.slug}/`)} key={post.slug} aria-label={x.title}>
                            <Image src={`/${post.images[0].src}`} alt={post.images[0].alt[locale]} width={600} height={600}/>
                            <span className="xp-badges" aria-hidden="true">
                                {post.aparat && <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7 4.5v15l13-7.5-13-7.5Z"/></svg>}
                                {post.images.length > 1 && <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="3" y="7" width="13" height="13" rx="2"/><path d="M8 4h11a2 2 0 0 1 2 2v11"/></svg>}
                            </span>
                            <span className="xp-over"><strong>{x.title}</strong></span>
                        </Link>
                    );
                })}
            </div>
        </Shell>
    );
}
