import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import {SKILLS, TIMELINE} from "@/data/about";
import {BRAND} from "@/data/services";
import {SITE, pageMeta} from "@/lib/site";

const TITLE = "درباره‌ی Webino-Dev | تیم توسعه وب و نرم‌افزار در مشهد";
const DESC = "با تیم Webino-Dev و حامد عبداله زاده، توسعه‌دهنده فرانت‌اند، آشنا شوید؛ تجربه‌ی کار روی پلتفرم CRM/ERP، دستگاه‌های وندینگ و برنامه‌های آفلاین، و مسیر همکاری ما با شما.";

export const metadata = pageMeta({
    title: TITLE,
    description: DESC,
    path: "/about/",
    type: "profile",
    keywords: ["Webino-Dev", "درباره ما", "حامد عبداله زاده", "توسعه‌دهنده فرانت‌اند", "تیم توسعه نرم‌افزار مشهد"],
});

export default function About() {
    return (
        <>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {"@type": "AboutPage", "@id": `${SITE}/about/#page`, url: `${SITE}/about/`, name: TITLE, inLanguage: "fa", isPartOf: {"@id": `${SITE}/#website`}, about: {"@id": `${SITE}/#org`}},
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: "Webino-Dev", item: `${SITE}/`},
                        {"@type": "ListItem", position: 2, name: "درباره‌ی ما", item: `${SITE}/about/`},
                    ]},
                ],
            }}/>
            <Header/>
            <section className="page-top">
                <div className="container">
                    <span className="eyebrow" style={{color: "rgba(255,255,255,.65)"}}>درباره‌ی ما</span>
                    <h1>Webino-Dev؛ تیمی که ایده‌ها را به محصول تبدیل می‌کند</h1>
                    <p className="page-intro">ما یک تیم کوچک و چابک توسعه وب و نرم‌افزار در مشهد هستیم. هر ایده‌ای که دارید را می‌شنویم، ساده‌ترین مسیر اجرایش را پیشنهاد می‌دهیم و تا تحویل و پشتیبانی کنارتان می‌مانیم.</p>
                    <div className="hero-actions">
                        <a className="pill" href={`tel:${BRAND.phone}`}>تماس برای مشاوره‌ی رایگان</a>
                        <Link className="pill pill--ghost" href="/#contact">ثبت درخواست پروژه</Link>
                    </div>
                </div>
            </section>

            <main id="main-content">
                <section className="section" id="story" aria-labelledby="story-title">
                    <div className="container about-split">
                        <div data-reveal>
                            <span className="eyebrow">داستان ما</span>
                            <h2 className="section-title" id="story-title">محصول‌هایی که در شرایط واقعی کار می‌کنند</h2>
                            <div className="about-text" style={{marginInline: 0, maxWidth: "none"}}>
                                <p>Webino-Dev برای کسب‌وکارها و ایده‌پردازانی ساخته شده که می‌خواهند ایده‌شان را بدون پیچیدگی غیرضروری و با هزینه‌ی قابل‌پیش‌بینی به یک محصول واقعی تبدیل کنند.</p>
                                <p>تجربه‌ی ما از کار روی پلتفرم‌های سازمانی CRM/ERP تا رابط‌های دستگاه‌های وندینگ می‌آید؛ محصولاتی که باید با داده‌های پیچیده و گاهی بدون اینترنت کار کنند. همین تجربه را روی ایده‌ی شما هم به کار می‌بریم.</p>
                                <p>با هر پروژه مثل یک شریک فنی رفتار می‌کنیم: مسئله را درست می‌فهمیم، محدودیت‌ها را شفاف می‌گوییم و راه‌حلی متناسب با نیاز و بودجه‌ی شما می‌سازیم.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section section--alt" id="team" aria-labelledby="team-title">
                    <div className="container">
                        <div className="section-head" data-reveal>
                            <span className="eyebrow">تیم</span>
                            <h2 className="section-title" id="team-title">افرادی که روی پروژه‌ی شما کار می‌کنند</h2>
                        </div>
                        <div className="team-grid">
                            <article className="team-card" data-reveal>
                                <Image src="/assets/images/me.jpg" alt="حامد عبداله زاده، مؤسس و توسعه‌دهنده فرانت‌اند Webino-Dev" width={120} height={120}/>
                                <h3>حامد عبداله زاده</h3>
                                <p className="team-role">مؤسس · توسعه‌دهنده فرانت‌اند</p>
                                <p>توسعه‌دهنده فرانت‌اند در سطح میدلول؛ تجربه‌ام از پنل‌های سازمانی CRM و ERP تا رابط‌های کاربری دستگاه‌های وندینگ را در بر می‌گیرد. با React، Next.js، TypeScript و Vue کار می‌کنم و تمرکزم این روزها روی برنامه‌های آفلاین، PWA و ارتباط رابط کاربری با سخت‌افزار است.</p>
                                <p><a href="/resume.html">مشاهده‌ی رزومه</a> · <a href="/assets/HamedAbdollahzade-Resume.pdf" download>دانلود PDF</a></p>
                            </article>
                            {/* TODO(webino): add one <article className="team-card"> per extra team member (photo, name, role, 2-3 lines). */}
                        </div>
                    </div>
                </section>

                <section className="section" id="skills" aria-labelledby="skills-title">
                    <div className="container">
                        <div className="section-head" data-reveal>
                            <span className="eyebrow">مهارت‌ها</span>
                            <h2 className="section-title" id="skills-title">فناوری‌ها، ابزارها و تخصص‌هایی که با آن‌ها توسعه می‌دهیم</h2>
                        </div>
                        <div className="skills-grid">
                            {SKILLS.map((group) => (
                                <div className="skill-card" key={group.title} data-reveal>
                                    <div className="skill-card-icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" dangerouslySetInnerHTML={{__html: group.icon}}/>
                                    </div>
                                    <h3 className="skill-card-title">{group.title}</h3>
                                    <div className="skill-tags">{group.tags.map((t) => <span className="skill-tag" key={t}>{t}</span>)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section section--alt" id="experience" aria-labelledby="exp-title">
                    <div className="container">
                        <div className="section-head" data-reveal>
                            <span className="eyebrow">سابقه کاری و تحصیلی</span>
                            <h2 className="section-title" id="exp-title">مسیر حرفه‌ای و یادگیری</h2>
                        </div>
                        <div className="timeline">
                            {TIMELINE.map((e) => (
                                <div className="timeline-item" data-entry={e.kind} key={e.period + e.org} data-reveal>
                                    <div className="timeline-card">
                                        <div className="timeline-period">{e.period}</div>
                                        <h3 className="timeline-role">{e.role}</h3>
                                        <div className="timeline-org">{e.org}</div>
                                        <p>{e.text}</p>
                                        <div className="timeline-tags">{e.tags.map((t) => <span className="skill-tag" key={t}>{t}</span>)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}
