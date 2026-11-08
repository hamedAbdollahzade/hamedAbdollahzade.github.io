import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import {PhoneIcon, ServiceIcon, WhatsAppIcon} from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import OpenChat from "@/components/OpenChat";
import TechStrip from "@/components/TechStrip";
import Shell from "@/components/Shell";
import {COURSES} from "@/data/courses";
import {DEVELOPERS} from "@/data/developers";
import {PROJECTS} from "@/data/projects";
import {BRAND, FAQ, PROCESS, SERVICES} from "@/data/services";
import {getPosts} from "@/lib/blog";
import {OG_IMAGE, SITE, pageMeta, summarize, waLink} from "@/lib/site";

const TITLE = "Webino-Dev | هوش مصنوعی، طراحی سایت و پنل مدیریتی در مشهد";
const DESC = "Webino-Dev تیم توسعه وب و نرم‌افزار در مشهد با تمرکز بر هوش مصنوعی: چت‌بات و دستیار هوشمند، طراحی سایت، پنل مدیریتی CRM/ERP، اپلیکیشن وب و PWA. ایده‌ات را بگو، با هوش مصنوعی می‌سازیمش. مشاوره‌ی اولیه رایگان.";

export const metadata = pageMeta({
    title: TITLE,
    description: DESC,
    path: "/",
    keywords: ["Webino-Dev", "وبینو دو", "هوش مصنوعی", "چت‌بات هوش مصنوعی", "افزودن هوش مصنوعی به سایت", "برنامه‌نویسی با هوش مصنوعی", "طراحی سایت مشهد", "توسعه پنل مدیریتی", "CRM", "ERP", "اپلیکیشن وب", "PWA", "برنامه‌نویس React", "Next.js", "سفارش نرم‌افزار"],
});

const same = ["https://github.com/hamedAbdollahzade", "https://www.linkedin.com/in/hamed-abdollahzade"];

const graph = {
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
            description: DESC,
            telephone: BRAND.phone,
            email: BRAND.email,
            address: {"@type": "PostalAddress", addressLocality: BRAND.city, addressCountry: "IR"},
            areaServed: {"@type": "Country", name: "ایران"},
            founder: {"@id": `${SITE}/#person`},
            sameAs: same,
            knowsAbout: ["هوش مصنوعی", "طراحی وب‌سایت", "پنل مدیریتی", "CRM", "ERP", "PWA", "React", "Next.js", "TypeScript"],
        },
        {
            "@type": "Person", "@id": `${SITE}/#person`, name: "حامد عبداله زاده",
            alternateName: ["Hamed Abdollahzade", "حامد عبدالله‌زاده"], jobTitle: "Frontend Developer",
            image: `${SITE}/assets/images/me.jpg`, url: `${SITE}/developers/hamed-abdollahzade/`, worksFor: {"@id": `${SITE}/#org`}, sameAs: same,
        },
        {"@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "Webino-Dev", inLanguage: "fa", publisher: {"@id": `${SITE}/#org`}},
    ],
};

const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({"@type": "Question", name: q, acceptedAnswer: {"@type": "Answer", text: a}})),
};


export default function Home() {
    const posts = getPosts();
    const courses = COURSES.map((c) => ({...c, count: posts.filter((p) => p.category === c.title).length})).filter((c) => c.count > 0);
    return (
        <Shell>
            <JsonLd data={graph}/>
            <JsonLd data={faqLd}/>

            <HeroSlider/>
            <TechStrip/>

            <section className="card" id="services" aria-labelledby="services-title" data-reveal>
                <div className="block-head">
                    <div>
                        <h2 className="block-title" id="services-title">هوش مصنوعی و توسعه‌ی نرم‌افزار، از ایده تا اجرا</h2>
                        <p className="block-desc">هر ایده‌ای که دارید را با هوش مصنوعی هوشمندتر و سریع‌تر پیاده می‌کنیم.</p>
                    </div>
                </div>
                <div className="grid grid--services">
                    {SERVICES.map((s) => (
                        <Link className="tile-card" href={`/services/${s.slug}/`} key={s.slug}>
                            <span className="tile-icon"><ServiceIcon slug={s.slug}/></span>
                            <h3>{s.title}</h3>
                            <p>{s.short}</p>
                            <span className="tile-more">اطلاعات بیشتر ←</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="card" id="projects" aria-labelledby="projects-title" data-reveal>
                <div className="block-head">
                    <div>
                        <h2 className="block-title" id="projects-title">نمونه‌کارها</h2>
                        <p className="block-desc">پروژه‌های واقعی در حوزه‌ی CRM/ERP، وندینگ و آزمون آنلاین.</p>
                    </div>
                </div>
                <div className="grid grid--cards">
                    {PROJECTS.map((p) => (
                        <Link className="project-card" href={`/projects/${p.slug}/`} key={p.slug}>
                            <div className={`project-media${p.imgFit === "contain" ? " project-media--contain" : ""}`}><Image src={`/${p.img}`} alt={p.title} width={720} height={540}/></div>
                            <h3>{p.title}</h3>
                            <p>{summarize(p.description, 140)}</p>
                            <span className="tile-more">مشاهده جزئیات ←</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="card" id="learn" aria-labelledby="learn-title" data-reveal>
                <div className="block-head">
                    <div>
                        <h2 className="block-title" id="learn-title">آموزش‌های رایگان</h2>
                        <p className="block-desc">{posts.length.toLocaleString("fa-IR")} درس و مقاله درباره‌ی برنامه‌نویسی، هوش مصنوعی و ساخت محصول.</p>
                    </div>
                    <Link className="link-more" href="/blog/">همه‌ی آموزش‌ها ←</Link>
                </div>
                <div className="grid grid--services">
                    {courses.map((c) => (
                        <Link className="tile-card" href={`/blog/#${c.slug}`} key={c.slug}>
                            <h3>{c.title}</h3>
                            <p>{c.description}</p>
                            <span className="tile-more">{c.count.toLocaleString("fa-IR")} درس ←</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="card" id="developers" aria-labelledby="devs-title" data-reveal>
                <div className="block-head">
                    <div>
                        <h2 className="block-title" id="devs-title">برنامه‌نویسان</h2>
                        <p className="block-desc">افرادی که روی پروژه‌ی شما کار می‌کنند.</p>
                    </div>
                    <Link className="link-more" href="/developers/">مشاهده‌ی همه ←</Link>
                </div>
                <div className="grid grid--cards">
                    {DEVELOPERS.map((d) => (
                        <Link className="dev-card" href={`/developers/${d.slug}/`} key={d.slug}>
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
                <div className="block-head"><h2 className="block-title" id="process-title">روند کار</h2></div>
                <ol className="steps">
                    {PROCESS.map(([t, d], i) => (
                        <li className="step" key={t}><span className="step-num">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>
                    ))}
                </ol>
            </section>

            <section className="card" id="faq" aria-labelledby="faq-title" data-reveal>
                <div className="block-head"><h2 className="block-title" id="faq-title">سؤالات متداول</h2></div>
                <div className="faq">
                    {FAQ.map(([q, a]) => <details className="faq-item" key={q}><summary>{q}</summary><p>{a}</p></details>)}
                </div>
            </section>

            <section className="cta-card" id="contact" aria-labelledby="contact-title" data-reveal>
                <h2 id="contact-title">ایده‌ات را برایمان بگو</h2>
                <p>موضوع و ایده‌ات را در چت بنویس؛ درخواست در واتساپ برای ما ارسال می‌شود و به‌زودی تماس می‌گیریم. بررسی اولیه و پیشنهاد، رایگان است.</p>
                <div className="btn-row">
                    <OpenChat className="btn btn--lg">شروع گفتگو</OpenChat>
                    <a className="btn btn--lg btn--wa" href={waLink()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>واتساپ</a>
                    <a className="btn btn--lg btn--ghost" href={`tel:${BRAND.phone}`}><PhoneIcon/>تماس تلفنی</a>
                </div>
            </section>
        </Shell>
    );
}
