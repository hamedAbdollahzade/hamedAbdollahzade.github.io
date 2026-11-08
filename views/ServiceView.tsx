import Link from "next/link";
import {notFound} from "next/navigation";
import ServiceArt from "@/components/animations/ServiceArt";
import {PhoneIcon, ServiceIcon, WhatsAppIcon} from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import OpenChat from "@/components/OpenChat";
import Shell from "@/components/Shell";
import {getBrand, getProjects, getServices} from "@/data/localized";
import {localePath} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import {SITE, waLink} from "@/lib/site";
import {UI} from "@/lib/ui";

/** One service page in the given language. */
export default function ServiceView({locale, slug}: {locale: Locale; slug: string}) {
    const t = UI[locale];
    const brand = getBrand(locale);
    const s = getServices(locale).find((x) => x.slug === slug);
    if (!s) notFound();
    const url = `${SITE}${localePath(locale, `/services/${slug}/`)}`;

    return (
        <Shell crumbs={[{label: t.service.crumb, href: localePath(locale, "/#services")}, {label: s.title}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "Service", "@id": `${url}#service`, name: s.title, description: s.description, url, inLanguage: locale,
                        areaServed: {"@type": "Country", name: "Iran"},
                        provider: {"@type": "Organization", "@id": `${SITE}/#org`, name: brand.name, url: `${SITE}/`},
                    },
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: brand.name, item: `${SITE}${localePath(locale, "/")}`},
                        {"@type": "ListItem", position: 2, name: s.title, item: url},
                    ]},
                ],
            }}/>
            <JsonLd data={{"@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.faq.map(([q, a]) => ({"@type": "Question", name: q, acceptedAnswer: {"@type": "Answer", text: a}}))}}/>
            <div className="card service-hero">
                <div>
                    <div className="dev-top" style={{alignItems: "flex-start"}}>
                        <span className="tile-icon"><ServiceIcon slug={s.slug}/></span>
                        <div>
                            <h1 className="page-title">{s.title}</h1>
                            <p className="page-lead">{s.intro}</p>
                        </div>
                    </div>
                    <div className="btn-row" style={{marginTop: 18}}>
                        <OpenChat className="btn btn--lg" topic={s.title}>{t.service.request}</OpenChat>
                        <a className="btn btn--lg btn--ghost" href={`tel:${brand.phone}`}><PhoneIcon/>{t.service.freeConsult}</a>
                        <a className="btn btn--lg btn--wa" href={waLink(t.chat.serviceWa(s.title))} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>{t.service.whatsapp}</a>
                    </div>
                </div>
                <ServiceArt slug={s.slug}/>
            </div>
            <div className="card page-card">
                <h2>{t.service.forWhom}</h2>
                <ul className="list">{s.for.map((i) => <li key={i}>{i}</li>)}</ul>
                <h2>{t.service.deliver}</h2>
                <ul className="list">{s.deliver.map((i) => <li key={i}>{i}</li>)}</ul>
                <h2>{t.service.tech}</h2>
                <ul className="tags">{s.tech.map((tech) => <li key={tech}>{tech}</li>)}</ul>
                <h2>{t.service.related}</h2>
                <ul className="list">{getProjects(locale).slice(0, 3).map((p) => <li key={p.slug}><Link href={localePath(locale, `/projects/${p.slug}/`)}>{p.title}</Link></li>)}</ul>
            </div>
            <div className="card">
                <div className="block-head"><h2 className="block-title">{t.service.faq}</h2></div>
                <div className="faq">
                    {s.faq.map(([q, a]) => <details className="faq-item" key={q}><summary>{q}</summary><p>{a}</p></details>)}
                </div>
            </div>
            <div className="cta-card">
                <h2>{t.service.ctaTitle}</h2>
                <p>{t.service.ctaText}</p>
                <div className="btn-row"><OpenChat className="btn btn--lg" topic={s.title}>{t.home.startChat}</OpenChat><a className="btn btn--lg btn--ghost" href={`tel:${brand.phone}`}><PhoneIcon/>{t.contactUs}</a></div>
            </div>
        </Shell>
    );
}
