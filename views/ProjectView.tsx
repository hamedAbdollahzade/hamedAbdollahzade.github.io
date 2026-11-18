import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import JsonLd from "@/components/JsonLd";
import OpenChat from "@/components/OpenChat";
import Shell from "@/components/Shell";
import {getProjects} from "@/data/localized";
import {localePath} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import {AUTHOR, SITE} from "@/lib/site";
import {UI} from "@/lib/ui";

/** One project page in the given language. */
export default function ProjectView({locale, slug}: {locale: Locale; slug: string}) {
    const t = UI[locale];
    const projects = getProjects(locale);
    const index = projects.findIndex((x) => x.slug === slug);
    if (index === -1) notFound();
    const p = projects[index];
    const prev = projects[(index - 1 + projects.length) % projects.length];
    const next = projects[(index + 1) % projects.length];
    const images = p.images ?? (p.gallery ? [] : [{src: p.img, caption: p.title}]);
    const partImages = (p.parts ?? []).flatMap((part) => [...(part.desktop ?? []), ...(part.mobile ?? [])]);
    const allImages = [...images, ...(p.gallery ?? []), ...partImages];
    const url = `${SITE}${localePath(locale, `/projects/${slug}/`)}`;
    const rtl = locale === "fa";

    return (
        <Shell crumbs={[{label: t.project.crumb, href: localePath(locale, "/#projects")}, {label: p.title}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "CreativeWork", "@id": `${url}#project`, name: p.title, description: p.description, url,
                        image: allImages.map((i) => `${SITE}/${i.src}`), keywords: p.tech.join(", "), inLanguage: locale,
                        author: {"@type": "Person", "@id": `${SITE}/#person`, name: AUTHOR},
                        publisher: {"@id": `${SITE}/#org`},
                    },
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: "Webino-Dev", item: `${SITE}${localePath(locale, "/")}`},
                        {"@type": "ListItem", position: 2, name: p.title, item: url},
                    ]},
                ],
            }}/>
            <div className="card">
                <h1 className="page-title">{p.title}</h1>
                {p.author && <p className="page-lead" style={{marginTop: 8}}>{t.project.by} <strong>{p.author[locale]}</strong></p>}
                <ul className="tags" style={{marginTop: 14}}>{p.tech.map((tech) => <li key={tech}>{tech}</li>)}</ul>
            </div>
            <div className="card page-card">
                {images.map((img, i) => (
                    <figure className="figure" key={img.src}>
                        <Image src={`/${img.src}`} alt={img.caption} width={1440} height={900} priority={i === 0}/>
                        <figcaption>{img.caption}</figcaption>
                    </figure>
                ))}
                <p className="lead">{p.description}</p>
                {(p.story ?? []).map((c) => (
                    <section key={c.title}><h2>{c.title}</h2><p>{c.text}</p></section>
                ))}
                {(p.parts ?? []).map((part) => {
                    const both = Boolean(part.desktop?.length && part.mobile?.length);
                    return (
                        <section className="part" key={part.title}>
                            <h2>{part.title}</h2>
                            <p>{part.text}</p>
                            {part.points && <ul className="list">{part.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>}
                            {part.tech && <ul className="tags">{part.tech.map((tech) => <li key={tech}>{tech}</li>)}</ul>}
                            {part.desktop && (
                                <>
                                    {both && <h3 className="part-label">{t.project.desktop}</h3>}
                                    <div className="shots">
                                        {part.desktop.map((s) => (
                                            <figure className="shot" key={s.src}>
                                                <a href={`/${s.src}`} target="_blank" rel="noopener"><Image src={`/${s.src}`} alt={s.caption} width={s.width} height={s.height} loading="lazy"/></a>
                                                <figcaption>{s.caption}</figcaption>
                                            </figure>
                                        ))}
                                    </div>
                                </>
                            )}
                            {part.mobile && (
                                <>
                                    {both && <h3 className="part-label">{t.project.mobile}</h3>}
                                    <div className="gallery">
                                        {part.mobile.map((s) => (
                                            <figure className="gallery-item" key={s.src}>
                                                <a href={`/${s.src}`} target="_blank" rel="noopener"><Image src={`/${s.src}`} alt={s.caption} width={s.width} height={s.height} loading="lazy"/></a>
                                                <figcaption>{s.caption}</figcaption>
                                            </figure>
                                        ))}
                                    </div>
                                </>
                            )}
                        </section>
                    );
                })}
                {p.gallery && (
                    <>
                        <h2>{t.project.appImages}</h2>
                        <div className="gallery">
                            {p.gallery.map((g) => (
                                <figure className="gallery-item" key={g.src}>
                                    <Image src={`/${g.src}`} alt={g.caption} width={g.width} height={g.height} loading="lazy"/>
                                    <figcaption>{g.caption}</figcaption>
                                </figure>
                            ))}
                        </div>
                    </>
                )}
                <h2>{p.author ? t.project.about : t.project.myPart}</h2>
                <ul className="list">{p.learned.map((l) => <li key={l}>{l}</li>)}</ul>
                <div className="btn-row" style={{marginTop: 24}}>
                    {p.links.map((l) => <a className="btn" key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
                    <OpenChat className="btn btn--green">{t.project.similar}</OpenChat>
                </div>
            </div>
            <nav className="sibling-nav" aria-label={t.project.others}>
                <Link href={localePath(locale, `/projects/${prev.slug}/`)}>{rtl ? "→" : "←"} {prev.title}</Link>
                <Link href={localePath(locale, `/projects/${next.slug}/`)}>{next.title} {rtl ? "←" : "→"}</Link>
            </nav>
        </Shell>
    );
}
