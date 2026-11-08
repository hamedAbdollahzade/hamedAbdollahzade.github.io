import Image from "next/image";
import Link from "next/link";
import CodeWindow from "@/components/animations/CodeWindow";
import Pipeline from "@/components/animations/Pipeline";
import TerminalWindow from "@/components/animations/TerminalWindow";
import HeroSlider from "@/components/HeroSlider";
import {PhoneIcon, ServiceIcon, WhatsAppIcon} from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import OpenChat from "@/components/OpenChat";
import Shell from "@/components/Shell";
import TechStrip from "@/components/TechStrip";
import {getBrand, getCourseCopy, getCourses, getDevelopers, getFaq, getProcess, getProjects, getServices} from "@/data/localized";
import {getPosts} from "@/lib/blog";
import {localePath} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import {OG_IMAGE, SITE, summarize, waLink} from "@/lib/site";
import {UI} from "@/lib/ui";

const SAME_AS = ["https://github.com/hamedAbdollahzade", "https://www.linkedin.com/in/hamed-abdollahzade"];

const CODE_LINES = [
    'import { build } from "webino-dev";',
    "",
    'const idea = "your next product";',
    "const product = await build(idea, { ai: true });",
    "",
    "product.launch(); // from idea to production",
];

const TERMINAL_STEPS = [
    {kind: "cmd", text: "npm run build"},
    {kind: "out", text: "✓ Compiled successfully"},
    {kind: "out", text: "✓ Pages generated"},
    {kind: "cmd", text: "git push origin main"},
    {kind: "out", text: "✓ Deployed to webino-dev.ir"},
] as const;

function graph(locale: Locale) {
    const brand = getBrand(locale);
    const t = UI[locale];
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": ["Organization", "ProfessionalService"],
                "@id": `${SITE}/#org`,
                name: "Webino-Dev",
                alternateName: "وبینو دِو",
                url: `${SITE}/`,
                logo: `${SITE}/assets/icons/favicon.svg`,
                image: OG_IMAGE,
                description: t.home.meta.description,
                telephone: brand.phone,
                email: brand.email,
                address: {"@type": "PostalAddress", addressLocality: "Mashhad", addressCountry: "IR"},
                areaServed: {"@type": "Country", name: "Iran"},
                founder: {"@id": `${SITE}/#person`},
                sameAs: SAME_AS,
                knowsAbout: ["Artificial intelligence", "هوش مصنوعی", "Web development", "Admin panels", "CRM", "ERP", "PWA", "React", "Next.js", "TypeScript"],
            },
            {
                "@type": "Person", "@id": `${SITE}/#person`, name: "حامد عبداله زاده",
                alternateName: ["Hamed Abdollahzade", "حامد عبدالله‌زاده"], jobTitle: "Frontend Developer",
                image: `${SITE}/assets/images/me.jpg`, url: `${SITE}/developers/hamed-abdollahzade/`, worksFor: {"@id": `${SITE}/#org`}, sameAs: SAME_AS,
            },
            {"@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "Webino-Dev", inLanguage: ["fa", "en"], publisher: {"@id": `${SITE}/#org`}},
        ],
    };
}

/** The home page in the given language. */
export default function HomeView({locale}: {locale: Locale}) {
    const t = UI[locale];
    const brand = getBrand(locale);
    const to = (path: string) => localePath(locale, path);
    const posts = getPosts();
    const courses = getCourses()
        .map((c) => ({...c, ...getCourseCopy(c.title, locale), count: posts.filter((p) => p.category === c.title).length}))
        .filter((c) => c.count > 0);
    const faq = getFaq(locale);

    return (
        <Shell>
            <JsonLd data={graph(locale)}/>
            <JsonLd data={{"@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({"@type": "Question", name: q, acceptedAnswer: {"@type": "Answer", text: a}}))}}/>

            <HeroSlider/>
            <TechStrip/>

            <section className="card" aria-labelledby="showcase-title" data-reveal>
                <div className="block-head">
                    <div>
                        <h2 className="block-title" id="showcase-title">{t.home.showcaseTitle}</h2>
                        <p className="block-desc">{t.home.showcaseDesc}</p>
                    </div>
                </div>
                <div className="showcase">
                    <CodeWindow file="idea.ts" lines={CODE_LINES} label={t.home.codeLabel}/>
                    <TerminalWindow title="~/webino-dev" steps={[...TERMINAL_STEPS]} label={t.home.terminalLabel}/>
                </div>
                <Pipeline/>
            </section>

            <section className="card" id="services" aria-labelledby="services-title" data-reveal>
                <div className="block-head">
                    <div>
                        <h2 className="block-title" id="services-title">{t.home.servicesTitle}</h2>
                        <p className="block-desc">{t.home.servicesDesc}</p>
                    </div>
                </div>
                <div className="grid grid--services">
                    {getServices(locale).map((s) => (
                        <Link className="tile-card" href={to(`/services/${s.slug}/`)} key={s.slug}>
                            <span className="tile-icon"><ServiceIcon slug={s.slug}/></span>
                            <h3>{s.title}</h3>
                            <p>{s.short}</p>
                            <span className="tile-more">{t.home.more} {t.arrow}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="card" id="projects" aria-labelledby="projects-title" data-reveal>
                <div className="block-head">
                    <div>
                        <h2 className="block-title" id="projects-title">{t.home.projectsTitle}</h2>
                        <p className="block-desc">{t.home.projectsDesc}</p>
                    </div>
                </div>
                <div className="grid grid--cards">
                    {getProjects(locale).map((p) => (
                        <Link className="project-card" href={to(`/projects/${p.slug}/`)} key={p.slug}>
                            <div className={`project-media${p.imgFit === "contain" ? " project-media--contain" : ""}`}><Image src={`/${p.img}`} alt={p.title} width={720} height={540}/></div>
                            <h3>{p.title}</h3>
                            <p>{summarize(p.description, 140)}</p>
                            <span className="tile-more">{t.home.viewDetails} {t.arrow}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="card" id="learn" aria-labelledby="learn-title" data-reveal>
                <div className="block-head">
                    <div>
                        <h2 className="block-title" id="learn-title">{t.home.learnTitle}</h2>
                        <p className="block-desc">{t.home.learnDesc(posts.length.toLocaleString(locale === "fa" ? "fa-IR" : "en-US"))}</p>
                    </div>
                    <Link className="link-more" href={to("/blog/")}>{t.home.allLearn} {t.arrow}</Link>
                </div>
                <div className="grid grid--services">
                    {courses.map((c) => (
                        <Link className="tile-card" href={to(`/blog/#${c.slug}`)} key={c.slug}>
                            <h3>{c.title}</h3>
                            <p>{c.description}</p>
                            <span className="tile-more">{c.count.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")} {t.home.lessons} {t.arrow}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="card" id="developers" aria-labelledby="devs-title" data-reveal>
                <div className="block-head">
                    <div>
                        <h2 className="block-title" id="devs-title">{t.home.devsTitle}</h2>
                        <p className="block-desc">{t.home.devsDesc}</p>
                    </div>
                    <Link className="link-more" href={to("/developers/")}>{t.home.allDevs} {t.arrow}</Link>
                </div>
                <div className="grid grid--cards">
                    {getDevelopers(locale).map((d) => (
                        <Link className="dev-card" href={to(`/developers/${d.slug}/`)} key={d.slug}>
                            <div className="dev-top">
                                <Image className="avatar" src={`/${d.photo}`} alt={d.name} width={72} height={72}/>
                                <div><h3>{d.name}</h3><div className="dev-role">{d.role}</div></div>
                            </div>
                            <p>{summarize(d.bio, 150)}</p>
                            <ul className="tags">{d.skills.slice(0, 5).map((s) => <li key={s}>{s}</li>)}</ul>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="card" id="process" aria-labelledby="process-title" data-reveal>
                <div className="block-head"><h2 className="block-title" id="process-title">{t.home.processTitle}</h2></div>
                <ol className="steps">
                    {getProcess(locale).map(([title, text], i) => (
                        <li className="step" key={title}><span className="step-num">{i + 1}</span><h3>{title}</h3><p>{text}</p></li>
                    ))}
                </ol>
            </section>

            <section className="card" id="faq" aria-labelledby="faq-title" data-reveal>
                <div className="block-head"><h2 className="block-title" id="faq-title">{t.home.faqTitle}</h2></div>
                <div className="faq">
                    {faq.map(([q, a]) => <details className="faq-item" key={q}><summary>{q}</summary><p>{a}</p></details>)}
                </div>
            </section>

            <section className="cta-card" id="contact" aria-labelledby="contact-title" data-reveal>
                <h2 id="contact-title">{t.home.ctaTitle}</h2>
                <p>{t.home.ctaText}</p>
                <div className="btn-row">
                    <OpenChat className="btn btn--lg">{t.home.startChat}</OpenChat>
                    <a className="btn btn--lg btn--wa" href={waLink(t.chat.defaultWa)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>{t.footer.whatsapp}</a>
                    <a className="btn btn--lg btn--ghost" href={`tel:${brand.phone}`}><PhoneIcon/>{t.home.callPhone}</a>
                </div>
            </section>
        </Shell>
    );
}
