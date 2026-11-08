import Image from "next/image";
import {notFound} from "next/navigation";
import CodeWindow from "@/components/animations/CodeWindow";
import JsonLd from "@/components/JsonLd";
import OpenChat from "@/components/OpenChat";
import Shell from "@/components/Shell";
import {getDevelopers} from "@/data/localized";
import {localePath} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import {SITE} from "@/lib/site";
import {UI} from "@/lib/ui";

/** One developer profile in the given language. */
export default function DeveloperView({locale, slug}: {locale: Locale; slug: string}) {
    const t = UI[locale];
    const d = getDevelopers(locale).find((x) => x.slug === slug);
    if (!d) notFound();
    const url = `${SITE}${localePath(locale, `/developers/${slug}/`)}`;
    const snippet = [
        "const developer = {",
        `  name: "${d.nameEn}",`,
        '  role: "Frontend Developer",',
        `  stack: [${d.skills.slice(0, 3).map((s) => `"${s}"`).join(", ")}],`,
        "  learning: true, // always",
        "};",
    ];

    return (
        <Shell crumbs={[{label: t.developers.crumb, href: localePath(locale, "/developers/")}, {label: d.name}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {"@type": "ProfilePage", "@id": `${url}#page`, url, inLanguage: locale, mainEntity: {"@id": `${SITE}/#person`}},
                    {
                        "@type": "Person", "@id": `${SITE}/#person`, name: d.name, alternateName: d.nameEn, jobTitle: "Frontend Developer",
                        image: `${SITE}/${d.photo}`, url, description: d.bio, knowsAbout: d.skills, worksFor: {"@id": `${SITE}/#org`}, sameAs: d.links.map((l) => l.url),
                    },
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: "Webino-Dev", item: `${SITE}${localePath(locale, "/")}`},
                        {"@type": "ListItem", position: 2, name: t.developers.crumb, item: `${SITE}${localePath(locale, "/developers/")}`},
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
                        <OpenChat>{t.developers.collaborate}</OpenChat>
                        <a className="btn btn--soft" href="/resume.html">{t.developers.resume}</a>
                    </div>
                    <div className="btn-row" style={{justifyContent: "center"}}>
                        {d.links.map((l) => <a className="link-more" key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
                    </div>
                </aside>
                <div className="profile-main">
                    <section className="card page-card">
                        <h2>{t.developers.aboutPerson(d.name)}</h2>
                        <p>{d.bio}</p>
                        <div style={{marginTop: 22}}><CodeWindow file="developer.ts" lines={snippet} label={t.home.codeLabel}/></div>
                    </section>
                    {d.mentors && (
                        <section className="card" aria-labelledby="mentors-title">
                            <div className="block-head">
                                <div>
                                    <h2 className="block-title" id="mentors-title">{t.developers.mentorsTitle}</h2>
                                    <p className="block-desc">{t.developers.mentorsDesc}</p>
                                </div>
                            </div>
                            <div className="grid grid--cards">
                                {d.mentors.map((m) => (
                                    <article className="mentor-card" key={m.url}>
                                        <h3>{m.name}</h3>
                                        <div className="dev-role">{m.role}</div>
                                        <p>{m.text}</p>
                                        <a className="link-more" href={m.url} target="_blank" rel="noopener noreferrer">{m.linkLabel} {t.arrow}</a>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                    {d.skillGroups && (
                        <section className="card" aria-labelledby="skills-title">
                            <div className="block-head"><h2 className="block-title" id="skills-title">{t.developers.skillsTitle}</h2></div>
                            <div className="skills-grid">
                                {d.skillGroups.map((g) => (
                                    <div className="skill-card" key={g.title}>
                                        <div className="skill-card-icon" aria-hidden="true">
                                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" dangerouslySetInnerHTML={{__html: g.icon}}/>
                                        </div>
                                        <h3 className="skill-card-title">{g.title}</h3>
                                        <div className="skill-tags">{g.tags.map((tag) => <span className="skill-tag" key={tag}>{tag}</span>)}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {d.timeline && (
                        <section className="card" aria-labelledby="exp-title">
                            <div className="block-head"><h2 className="block-title" id="exp-title">{t.developers.experienceTitle}</h2></div>
                            <div className="timeline">
                                {d.timeline.map((e) => (
                                    <div className="timeline-item" data-entry={e.kind} key={e.period + e.org}>
                                        <div className="timeline-card">
                                            <div className="timeline-period">{e.period}</div>
                                            <h3 className="timeline-role">{e.role}</h3>
                                            <div className="timeline-org">{e.org}</div>
                                            <p>{e.text}</p>
                                            <div className="timeline-tags">{e.tags.map((tag) => <span className="skill-tag" key={tag}>{tag}</span>)}</div>
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
