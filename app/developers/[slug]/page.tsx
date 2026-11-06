import Image from "next/image";
import {notFound} from "next/navigation";
import JsonLd from "@/components/JsonLd";
import OpenChat from "@/components/OpenChat";
import Shell from "@/components/Shell";
import {DEVELOPERS} from "@/data/developers";
import {BRAND} from "@/data/services";
import {SITE, pageMeta, summarize} from "@/lib/site";

type Params = {slug: string};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
    return DEVELOPERS.map((d) => ({slug: d.slug}));
}

export async function generateMetadata({params}: {params: Promise<Params>}) {
    const {slug} = await params;
    const d = DEVELOPERS.find((x) => x.slug === slug);
    if (!d) return {};
    return pageMeta({
        title: `${d.name} (${d.nameEn}) | ${d.role} | ${BRAND.name}`,
        description: summarize(d.bio),
        path: `/developers/${slug}/`,
        type: "profile",
        image: `${SITE}/${d.photo}`,
        keywords: [d.name, d.nameEn, ...d.skills],
    });
}

export default async function DeveloperPage({params}: {params: Promise<Params>}) {
    const {slug} = await params;
    const d = DEVELOPERS.find((x) => x.slug === slug);
    if (!d) notFound();
    const url = `${SITE}/developers/${slug}/`;

    return (
        <Shell crumbs={[{label: "برنامه‌نویسان", href: "/developers/"}, {label: d.name}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "ProfilePage", "@id": `${url}#page`, url, inLanguage: "fa", mainEntity: {"@id": `${SITE}/#person`},
                    },
                    {
                        "@type": "Person", "@id": `${SITE}/#person`, name: d.name, alternateName: d.nameEn, jobTitle: "Frontend Developer",
                        image: `${SITE}/${d.photo}`, url, description: d.bio, knowsAbout: d.skills, worksFor: {"@id": `${SITE}/#org`}, sameAs: d.links.map((l) => l.url),
                    },
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: BRAND.name, item: `${SITE}/`},
                        {"@type": "ListItem", position: 2, name: "برنامه‌نویسان", item: `${SITE}/developers/`},
                        {"@type": "ListItem", position: 3, name: d.name, item: url},
                    ]},
                ],
            }}/>
            <div className="profile">
                <aside className="card profile-side">
                    <Image className="avatar" src={`/${d.photo}`} alt={d.name} width={128} height={128} priority/>
                    <h1 className="block-title" style={{fontSize: 24}}>{d.name}</h1>
                    <div className="dev-role">{d.role}</div>
                    <ul className="tags" style={{justifyContent: "center"}}>{d.skills.map((s) => <li key={s}>{s}</li>)}</ul>
                    <div className="btn-row" style={{justifyContent: "center"}}>
                        <OpenChat>درخواست همکاری</OpenChat>
                        <a className="btn btn--soft" href="/resume.html">رزومه</a>
                    </div>
                    <div className="btn-row" style={{justifyContent: "center"}}>
                        {d.links.map((l) => <a className="link-more" key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
                    </div>
                </aside>
                <div className="profile-main">
                    <section className="card page-card">
                        <h2>درباره‌ی {d.name}</h2>
                        <p>{d.bio}</p>
                    </section>
                    {d.skillGroups && (
                        <section className="card" aria-labelledby="skills-title">
                            <div className="block-head"><h2 className="block-title" id="skills-title">مهارت‌ها و ابزارها</h2></div>
                            <div className="skills-grid">
                                {d.skillGroups.map((g) => (
                                    <div className="skill-card" key={g.title}>
                                        <div className="skill-card-icon" aria-hidden="true">
                                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" dangerouslySetInnerHTML={{__html: g.icon}}/>
                                        </div>
                                        <h3 className="skill-card-title">{g.title}</h3>
                                        <div className="skill-tags">{g.tags.map((t) => <span className="skill-tag" key={t}>{t}</span>)}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {d.timeline && (
                        <section className="card" aria-labelledby="exp-title">
                            <div className="block-head"><h2 className="block-title" id="exp-title">سابقه کاری و تحصیلی</h2></div>
                            <div className="timeline">
                                {d.timeline.map((e) => (
                                    <div className="timeline-item" data-entry={e.kind} key={e.period + e.org}>
                                        <div className="timeline-card">
                                            <div className="timeline-period">{e.period}</div>
                                            <h3 className="timeline-role">{e.role}</h3>
                                            <div className="timeline-org">{e.org}</div>
                                            <p>{e.text}</p>
                                            <div className="timeline-tags">{e.tags.map((t) => <span className="skill-tag" key={t}>{t}</span>)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </Shell>
    );
}
