import Link from "next/link";
import {notFound} from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {PhoneIcon} from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import {PROJECTS} from "@/data/projects";
import {BRAND, SERVICES} from "@/data/services";
import {SITE, pageMeta, summarize, waLink} from "@/lib/site";

type Params = {slug: string};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
    return SERVICES.map((s) => ({slug: s.slug}));
}

export async function generateMetadata({params}: {params: Promise<Params>}) {
    const {slug} = await params;
    const s = SERVICES.find((x) => x.slug === slug);
    if (!s) return {};
    return pageMeta({title: s.seoTitle, description: summarize(s.description, 160), path: `/services/${slug}/`, keywords: [...s.tech, BRAND.name, s.title]});
}

export default async function ServicePage({params}: {params: Promise<Params>}) {
    const {slug} = await params;
    const s = SERVICES.find((x) => x.slug === slug);
    if (!s) notFound();
    const url = `${SITE}/services/${slug}/`;

    return (
        <>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "Service", "@id": `${url}#service`, name: s.title, description: s.description, url, inLanguage: "fa",
                        areaServed: {"@type": "Country", name: "ایران"},
                        provider: {"@type": "Organization", "@id": `${SITE}/#org`, name: BRAND.name, url: `${SITE}/`},
                    },
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: BRAND.name, item: `${SITE}/`},
                        {"@type": "ListItem", position: 2, name: s.title, item: url},
                    ]},
                ],
            }}/>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: s.faq.map(([q, a]) => ({"@type": "Question", name: q, acceptedAnswer: {"@type": "Answer", text: a}})),
            }}/>
            <Header/>
            <section className="page-top">
                <div className="container">
                    <span className="eyebrow" style={{color: "rgba(255,255,255,.65)"}}>خدمات {BRAND.name}</span>
                    <h1>{s.title}</h1>
                    <p className="page-intro">{s.intro}</p>
                    <div className="hero-actions">
                        <a className="pill" href={`tel:${BRAND.phone}`}><PhoneIcon/>تماس برای مشاوره‌ی رایگان</a>
                        <a className="pill pill--ghost" href={waLink(`سلام، درباره‌ی «${s.title}» می‌خواهم مشورت بگیرم.`)} target="_blank" rel="noopener noreferrer">پیام در واتساپ</a>
                    </div>
                </div>
            </section>
            <main className="page-body" id="main-content">
                <h2>این خدمت برای چه کسانی است؟</h2>
                <ul>{s.for.map((i) => <li key={i}>{i}</li>)}</ul>
                <h2>چه چیزی تحویل می‌گیرید؟</h2>
                <ul>{s.deliver.map((i) => <li key={i}>{i}</li>)}</ul>
                <h2>فناوری‌های مورد استفاده</h2>
                <ul className="tags" dir="ltr" style={{listStyle: "none", padding: 0}}>{s.tech.map((t) => <li key={t}>{t}</li>)}</ul>
                <h2>نمونه‌کارهای مرتبط</h2>
                <ul>{PROJECTS.slice(0, 3).map((p) => <li key={p.slug}><Link href={`/projects/${p.slug}/`}>{p.title}</Link></li>)}</ul>
                <h2>سؤالات پرتکرار</h2>
                <div className="faq">
                    {s.faq.map(([q, a]) => <details className="faq-item" key={q}><summary>{q}</summary><p>{a}</p></details>)}
                </div>
                <div className="cta-box">
                    <h2>ایده‌ات را برایمان بگو</h2>
                    <p>مشاوره و پیشنهاد اولیه رایگان است. زنگ بزنید یا پیام بدهید.</p>
                    <div className="hero-actions">
                        <a className="pill pill--dark" href={`tel:${BRAND.phone}`}><PhoneIcon/><span dir="ltr">{BRAND.phoneDisplay}</span></a>
                        <Link className="pill pill--ghost" href="/#contact">فرم درخواست</Link>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
}
