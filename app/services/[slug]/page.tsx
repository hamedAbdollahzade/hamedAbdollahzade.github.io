import Link from "next/link";
import {notFound} from "next/navigation";
import {PhoneIcon, ServiceIcon, WhatsAppIcon} from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import OpenChat from "@/components/OpenChat";
import Shell from "@/components/Shell";
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
        <Shell crumbs={[{label: "خدمات", href: "/#services"}, {label: s.title}]}>
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
            <div className="card">
                <div className="dev-top" style={{alignItems: "flex-start"}}>
                    <span className="tile-icon"><ServiceIcon slug={s.slug}/></span>
                    <div>
                        <h1 className="page-title">{s.title}</h1>
                        <p className="page-lead">{s.intro}</p>
                    </div>
                </div>
                <div className="btn-row" style={{marginTop: 18}}>
                    <OpenChat className="btn btn--lg" topic={s.title}>ثبت درخواست</OpenChat>
                    <a className="btn btn--lg btn--ghost" href={`tel:${BRAND.phone}`}><PhoneIcon/>تماس برای مشاوره‌ی رایگان</a>
                    <a className="btn btn--lg btn--wa" href={waLink(`سلام، درباره‌ی «${s.title}» می‌خواهم مشورت بگیرم.`)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>واتساپ</a>
                </div>
            </div>
            <div className="card page-card">
                <h2>این خدمت برای چه کسانی است؟</h2>
                <ul className="list">{s.for.map((i) => <li key={i}>{i}</li>)}</ul>
                <h2>چه چیزی تحویل می‌گیرید؟</h2>
                <ul className="list">{s.deliver.map((i) => <li key={i}>{i}</li>)}</ul>
                <h2>فناوری‌های مورد استفاده</h2>
                <ul className="tags">{s.tech.map((t) => <li key={t}>{t}</li>)}</ul>
                <h2>نمونه‌کارهای مرتبط</h2>
                <ul className="list">{PROJECTS.slice(0, 3).map((p) => <li key={p.slug}><Link href={`/projects/${p.slug}/`}>{p.title}</Link></li>)}</ul>
            </div>
            <div className="card">
                <div className="block-head"><h2 className="block-title">سؤالات پرتکرار</h2></div>
                <div className="faq">
                    {s.faq.map(([q, a]) => <details className="faq-item" key={q}><summary>{q}</summary><p>{a}</p></details>)}
                </div>
            </div>
            <div className="cta-card">
                <h2>ایده‌ات را برایمان بگو</h2>
                <p>مشاوره و پیشنهاد اولیه رایگان است. گفتگو را شروع کن یا تماس بگیر.</p>
                <div className="btn-row"><OpenChat className="btn btn--lg" topic={s.title}>شروع گفتگو</OpenChat><a className="btn btn--lg btn--ghost" href={`tel:${BRAND.phone}`}><PhoneIcon/>تماس با ما</a></div>
            </div>
        </Shell>
    );
}
