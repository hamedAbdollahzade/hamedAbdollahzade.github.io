import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {PhoneIcon} from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
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
            image: `${SITE}/assets/images/me.jpg`, url: `${SITE}/about/`, worksFor: {"@id": `${SITE}/#org`}, sameAs: same,
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
        <>
            <JsonLd data={graph}/>
            <JsonLd data={faqLd}/>
            <Header/>
            <main id="main-content">
                <section className="hero" id="hero" aria-labelledby="hero-title">
                    {PROJECTS.slice(0, 4).map((p) => (
                        <div className="float-card" aria-hidden="true" key={p.slug}>
                            <Image src={`/${p.img}`} alt="" width={290} height={218} style={{width: "100%", height: "100%", objectFit: "cover"}}/>
                        </div>
                    ))}
                    <div className="hero-content">
                        <span className="hero-badge">Webino-Dev · تیم توسعه وب و نرم‌افزار</span>
                        <h1 id="hero-title">ایده‌ات را بگو؛<small>ما می‌سازیمش</small></h1>
                        <p>طراحی سایت، پنل مدیریتی، اپلیکیشن وب و PWA، از ایده تا اجرا. مشاوره‌ی اولیه رایگان است؛ زنگ بزنید و با هم ایده‌تان را بررسی کنیم.</p>
                        <div className="hero-actions">
                            <a className="pill" href={`tel:${BRAND.phone}`}><PhoneIcon/>تماس برای مشاوره‌ی رایگان</a>
                            <a className="pill pill--ghost" href="#contact">ثبت درخواست پروژه</a>
                        </div>
                    </div>
                </section>

                <section className="section" id="services" aria-labelledby="services-title">
                    <div className="container">
                        <div className="section-head" data-reveal>
                            <span className="eyebrow">خدمات</span>
                            <h2 className="section-title" id="services-title">هر ایده‌ای که دارید، می‌توانیم پیاده‌اش کنیم</h2>
                            <p className="section-desc">از یک صفحه‌ی معرفی ساده تا پنل سازمانی بزرگ؛ با تمرکز روی چیزی که واقعاً به کسب‌وکار شما کمک می‌کند.</p>
                        </div>
                        <div className="service-grid">
                            {SERVICES.map((s, i) => (
                                <Link className="service-card" href={`/services/${s.slug}/`} key={s.slug} data-reveal>
                                    <span className="service-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                                    <h3>{s.title}</h3>
                                    <p>{s.short}</p>
                                    <span className="project-more">اطلاعات بیشتر ←</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section section--alt projects" id="projects" aria-labelledby="projects-title">
                    <div className="container section-head" data-reveal>
                        <span className="eyebrow">نمونه‌کارها</span>
                        <h2 className="section-title" id="projects-title">محصولاتی که ساخته‌ایم</h2>
                        <p className="section-desc">پروژه‌های واقعی در حوزه‌ی CRM/ERP، وندینگ و پنل‌های مدیریتی؛ با شرح مسئله و کاری که انجام داده‌ایم.</p>
                    </div>
                    <Carousel>
                        {PROJECTS.map((p) => (
                            <Link className="project-card" href={`/projects/${p.slug}/`} key={p.slug}>
                                <div className="project-media">
                                    <Image src={`/${p.img}`} alt={p.title} width={720} height={540} style={{width: "100%", height: "100%", objectFit: "cover"}}/>
                                </div>
                                <h3>{p.title}</h3>
                                <p>{summarize(p.description, 140)}</p>
                                <span className="project-more">مشاهده جزئیات ←</span>
                            </Link>
                        ))}
                    </Carousel>
                </section>

                <section className="section about" id="why" aria-labelledby="why-title">
                    <span className="blob blob--pink" aria-hidden="true"/>
                    <span className="blob blob--lilac" aria-hidden="true"/>
                    <div className="container">
                        <span className="eyebrow" data-reveal>چرا Webino-Dev</span>
                        <h2 className="section-title about-lead" id="why-title" data-reveal>تیمی کوچک و چابک که مثل یک شریک فنی کنار شما کار می‌کند.</h2>
                        <div className="why-grid" data-reveal>
                            {WHY.map(([t, d]) => <div className="stat-card" key={t}><h3>{t}</h3><p>{d}</p></div>)}
                        </div>
                        <div className="hero-actions" data-reveal style={{marginTop: 36}}><Link className="pill pill--dark" href="/about/">با تیم آشنا شوید</Link></div>
                    </div>
                </section>

                <section className="section section--alt" id="process" aria-labelledby="process-title">
                    <div className="container">
                        <div className="section-head section-head--center" data-reveal>
                            <span className="eyebrow">روند کار</span>
                            <h2 className="section-title" id="process-title">از اولین تماس تا تحویل، چطور پیش می‌رویم</h2>
                        </div>
                        <ol className="process">
                            {PROCESS.map(([t, d], i) => (
                                <li className="process-step" key={t} data-reveal><span className="process-num">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>
                            ))}
                        </ol>
                    </div>
                </section>

                {posts.length > 0 && (
                    <section className="section" id="blog" aria-labelledby="blog-title">
                        <div className="container">
                            <div className="section-head" data-reveal>
                                <span className="eyebrow">بلاگ</span>
                                <h2 className="section-title" id="blog-title">راهنماهایی برای صاحبان ایده و کسب‌وکار</h2>
                            </div>
                            <div className="service-grid">
                                {posts.map((post) => (
                                    <Link className="service-card" href={`/blog/${post.slug}/`} key={post.slug} data-reveal>
                                        <span className="service-num">{post.dateFa}</span>
                                        <h3>{post.title}</h3>
                                        <p>{post.description}</p>
                                        <span className="project-more">خواندن مقاله ←</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="section section--alt" id="faq" aria-labelledby="faq-title">
                    <div className="container">
                        <div className="section-head section-head--center" data-reveal>
                            <span className="eyebrow">سؤالات متداول</span>
                            <h2 className="section-title" id="faq-title">قبل از تماس، شاید بخواهید بدانید</h2>
                        </div>
                        <div className="faq">
                            {FAQ.map(([q, a]) => (
                                <details className="faq-item" key={q} data-reveal><summary>{q}</summary><p>{a}</p></details>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section contact" id="contact" aria-labelledby="contact-title">
                    <div className="container">
                        <div className="section-head" data-reveal>
                            <span className="eyebrow">تماس و سفارش</span>
                            <h2 className="section-title" id="contact-title">ایده‌ات را برایمان بگو</h2>
                            <p className="section-desc">زنگ بزنید یا فرم کوتاه را پر کنید. بررسی اولیه و پیشنهاد، رایگان است.</p>
                        </div>
                        <div className="contact-split">
                            <div className="contact-grid" data-reveal>
                                <a className="contact-card contact-card--primary" href={`tel:${BRAND.phone}`}><div className="contact-label">تماس تلفنی</div><div className="contact-value" dir="ltr">+98 910 790 2735</div></a>
                                <a className="contact-card" href={waLink()} target="_blank" rel="noopener noreferrer"><div className="contact-label">واتساپ</div><div className="contact-value">پیام در واتساپ</div></a>
                                <a className="contact-card" href={`mailto:${BRAND.email}`}><div className="contact-label">ایمیل</div><div className="contact-value" dir="ltr">{BRAND.email}</div></a>
                                <div className="contact-card"><div className="contact-label">موقعیت</div><div className="contact-value">مشهد، ایران؛ همکاری با سراسر کشور</div></div>
                            </div>
                            <ContactForm/>
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}
