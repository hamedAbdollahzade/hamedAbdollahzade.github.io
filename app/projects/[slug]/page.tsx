import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import {PROJECTS} from "@/data/projects";
import {AUTHOR, SITE, pageMeta, summarize} from "@/lib/site";

type Params = {slug: string};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
    return PROJECTS.map((p) => ({slug: p.slug}));
}

export async function generateMetadata({params}: {params: Promise<Params>}) {
    const {slug} = await params;
    const p = PROJECTS.find((x) => x.slug === slug);
    if (!p) return {};
    return pageMeta({
        title: `${p.title} | Webino-Dev`,
        description: summarize(p.description),
        path: `/projects/${slug}/`,
        image: `${SITE}/${p.img}`,
        type: "article",
        keywords: [...p.tech, AUTHOR, "Webino-Dev"],
    });
}

export default async function ProjectPage({params}: {params: Promise<Params>}) {
    const {slug} = await params;
    const index = PROJECTS.findIndex((x) => x.slug === slug);
    if (index === -1) notFound();
    const p = PROJECTS[index];
    const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
    const next = PROJECTS[(index + 1) % PROJECTS.length];
    const images = p.images ?? [{src: p.img, caption: p.title}];
    const url = `${SITE}/projects/${slug}/`;

    return (
        <>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "CreativeWork", "@id": `${url}#project`, name: p.title, description: p.description, url,
                        image: images.map((i) => `${SITE}/${i.src}`), keywords: p.tech.join(", "), inLanguage: "fa",
                        author: {"@type": "Person", "@id": `${SITE}/#person`, name: AUTHOR},
                        publisher: {"@id": `${SITE}/#org`},
                    },
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: "Webino-Dev", item: `${SITE}/`},
                        {"@type": "ListItem", position: 2, name: p.title, item: url},
                    ]},
                ],
            }}/>
            <Header/>
            <section className="page-top">
                <div className="container">
                    <span className="eyebrow" style={{color: "rgba(255,255,255,.65)"}}>پروژه</span>
                    <h1>{p.title}</h1>
                    <ul className="tags" dir="ltr">{p.tech.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
            </section>
            <main className="page-body" id="main-content">
                {images.map((img, i) => (
                    <figure key={img.src}>
                        <Image src={`/${img.src}`} alt={img.caption} width={1440} height={900} priority={i === 0} style={{width: "100%", height: "auto"}}/>
                        <figcaption>{img.caption}</figcaption>
                    </figure>
                ))}
                <p className="lead">{p.description}</p>
                {(p.story ?? []).map((c) => (
                    <section className="chapter" key={c.title}><h2>{c.title}</h2><p>{c.text}</p></section>
                ))}
                <section className="contribution">
                    <h2>تجربه و سهم من در پروژه</h2>
                    <ul>{p.learned.map((l) => <li key={l}>{l}</li>)}</ul>
                </section>
                <div className="links">
                    {p.links.map((l) => <a className="pill pill--dark" key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
                </div>
            </main>
            <nav className="siblings" aria-label="پروژه‌های دیگر">
                <Link href={`/projects/${prev.slug}/`}>→ {prev.title}</Link>
                <Link href={`/projects/${next.slug}/`}>{next.title} ←</Link>
            </nav>
            <Footer/>
        </>
    );
}
