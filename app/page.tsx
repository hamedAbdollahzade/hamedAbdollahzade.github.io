import Image from "next/image";
import Link from "next/link";
import {PhoneIcon, ServiceIcon, WhatsAppIcon} from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import OpenChat from "@/components/OpenChat";
import Shell from "@/components/Shell";
import {DEVELOPERS} from "@/data/developers";
import {PROJECTS} from "@/data/projects";
import {BRAND, FAQ, PROCESS, SERVICES} from "@/data/services";
import {getPosts} from "@/lib/blog";
import {OG_IMAGE, SITE, pageMeta, summarize, waLink} from "@/lib/site";

const TITLE = "Webino-Dev | طراحی سایت، پنل مدیریتی و اپلیکیشن وب در مشهد";
const DESC = "Webino-Dev تیم توسعه وب و نرم‌افزار در مشهد: طراحی سایت، پنل مدیریتی CRM/ERP، اپلیکیشن وب و PWA و رابط دستگاه‌های سخت‌افزاری. ایده‌ات را بگو، ما می‌سازیمش. مشاوره‌ی اولیه رایگان.";

export const metadata = pageMeta({
    title: TITLE,
    description: DESC,
    path: "/",
    keywords: ["Webino-Dev", "وبینو دو", "طراحی سایت مشهد", "توسعه پنل مدیریتی", "CRM", "ERP", "اپلیکیشن وب", "PWA", "برنامه‌نویس React", "Next.js", "سفارش نرم‌افزار"],
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
            knowsAbout: ["طراحی وب‌سایت", "پنل مدیریتی", "CRM", "ERP", "PWA", "React", "Next.js", "TypeScript"],
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

const WHY = [
    ["تجربه‌ی واقعی", "کار روی پلتفرم CRM/ERP در مقیاس بزرگ و محصولات دستگاه‌های وندینگ، نه فقط سایت‌های ساده."],
    ["شفاف و مرحله‌ای", "دامنه‌ی کار، زمان و قیمت از ابتدا مکتوب است و پروژه مرحله به مرحله پیش می‌رود."],
    ["ارتباط مستقیم", "با کسی که کد را می‌نویسد صحبت می‌کنید؛ بدون واسطه و بدون وقت‌کشی."],
    ["بعد از تحویل هم هستیم", "پشتیبانی، رفع اشکال و توسعه‌ی ادامه‌دار برای محصولی که رشد می‌کند."],
];

export default function Home() {
    const posts = getPosts().slice(0, 3);
    return (
        <Shell>
            <JsonLd data={graph}/>
            <JsonLd data={faqLd}/>

            <section className="hero-card" aria-labelledby="hero-title">
                <div>
                    <span className="hero-badge">تیم توسعه وب و نرم‌افزار · مشهد</span>
                    <h1 id="hero-title">ایده‌ات را بگو؛ <em>ما می‌سازیمش</em></h1>
                    <p>طراحی سایت، پنل مدیریتی، اپلیکیشن وب و PWA، از ایده تا اجرا. مشاوره‌ی اولیه رایگان است؛ با ما صحبت کنید تا ایده‌تان را با هم بررسی کنیم.</p>
                    <div className="btn-row">
                        <OpenChat className="btn btn--lg">ثبت درخواست پروژه</OpenChat>
                        <a className="btn btn--lg btn--ghost" href={`tel:${BRAND.phone}`}><PhoneIcon/>تماس تلفنی</a>
                    </div>
                    <div className="hero-trust"><span>مشاوره‌ی رایگان</span><span>قیمت و زمان شفاف</span><span>پشتیبانی بعد از تحویل</span></div>
                </div>
                <div className="mock" aria-hidden="true">
                    <div className="mock-bar"><i/><i/><i/></div>
                    <Image src="/assets/images/linkcrm/flow.webp" alt="" width={1440} height={900} priority/>
                </div>
            </section>

            <section className="card" id="services" aria-labelledby="services-title" data-reveal>
                <div className="block-head">
                    <div>
                        <h2 className="block-title" id="services-title">هر ایده‌ای که دارید، پیاده‌اش می‌کنیم</h2>
                        <p className="block-desc">از یک صفحه‌ی معرفی ساده تا پنل سازمانی بزرگ.</p>
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
                        <p className="block-desc">پروژه‌های واقعی در حوزه‌ی CRM/ERP، وندینگ و پنل‌های مدیریتی.</p>
                    </div>
                </div>
                <div className="grid grid--cards">
                    {PROJECTS.map((p) => (
                        <Link className="project-card" href={`/projects/${p.slug}/`} key={p.slug}>
                            <div className="project-media"><Image src={`/${p.img}`} alt={p.title} width={720} height={540}/></div>
                            <h3>{p.title}</h3>
                            <p>{summarize(p.description, 140)}</p>
                            <span className="tile-more">مشاهده جزئیات ←</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="card" id="why" aria-labelledby="why-title" data-reveal>
                <div className="block-head"><h2 className="block-title" id="why-title">چرا Webino-Dev؟</h2></div>
                <div className="grid grid--why">
                    {WHY.map(([t, d]) => <div className="why-card" key={t}><h3>{t}</h3><p>{d}</p></div>)}
                </div>
            </section>

            <section className="card" id="learn" aria-labelledby="learn-title" data-reveal>
                <div className="block-head">
                    <div>
                        <h2 className="block-title" id="learn-title">آموزش‌ها و مقالات</h2>
                        <p className="block-desc">راهنماهای کاربردی برای صاحبان ایده و کسب‌وکار.</p>
                    </div>
                    <Link className="link-more" href="/blog/">همه‌ی مقاله‌ها ←</Link>
                </div>
                <div className="grid grid--cards">
                    {posts.map((post) => (
                        <Link className="post-card" href={`/blog/${post.slug}/`} key={post.slug}>
                            <div className="post-meta"><span className="chip chip--green">{post.category}</span><span>{post.dateFa}</span></div>
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                            <span className="tile-more">خواندن مقاله ←</span>
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
                    <Link className="link-more" href="/developers/">همه‌ی برنامه‌نویسان ←</Link>
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
                <p>در گفتگوی کوتاه چت، موضوع و ایده‌ات را بنویس؛ درخواست در واتساپ برای ما ارسال می‌شود و به‌زودی تماس می‌گیریم. بررسی اولیه و پیشنهاد رایگان است.</p>
                <div className="btn-row">
                    <OpenChat className="btn btn--lg">شروع گفتگو</OpenChat>
                    <a className="btn btn--lg btn--green" href={waLink()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>واتساپ</a>
                    <a className="btn btn--lg btn--ghost" href={`tel:${BRAND.phone}`}><PhoneIcon/><span dir="ltr">{BRAND.phoneDisplay}</span></a>
                </div>
            </section>

            <section className="card" aria-label="اطلاعات تماس" data-reveal>
                <div className="contact-grid">
                    <a className="contact-card" href={`tel:${BRAND.phone}`}><div className="contact-label">تماس تلفنی</div><div className="contact-value" dir="ltr">+98 910 790 2735</div></a>
                    <a className="contact-card" href={`mailto:${BRAND.email}`}><div className="contact-label">ایمیل</div><div className="contact-value" dir="ltr">{BRAND.email}</div></a>
                    <div className="contact-card"><div className="contact-label">موقعیت</div><div className="contact-value">مشهد، ایران؛ همکاری با سراسر کشور</div></div>
                </div>
            </section>
        </Shell>
    );
}
