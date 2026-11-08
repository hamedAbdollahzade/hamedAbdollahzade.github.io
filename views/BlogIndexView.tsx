import Link from "next/link";
import TerminalWindow from "@/components/animations/TerminalWindow";
import JsonLd from "@/components/JsonLd";
import Shell from "@/components/Shell";
import {getCourseCopy, getCourses} from "@/data/localized";
import {getPosts} from "@/lib/blog";
import {localePath} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import {SITE} from "@/lib/site";
import {UI} from "@/lib/ui";

const TERMINAL = [
    {kind: "cmd", text: "npm create learning-path"},
    {kind: "out", text: "✓ HTML · CSS · JavaScript"},
    {kind: "out", text: "✓ Frontend roadmap · Linux · AI coding"},
] as const;

/** The tutorials index in the given language (lessons themselves are in Persian). */
export default function BlogIndexView({locale}: {locale: Locale}) {
    const t = UI[locale];
    const nf = locale === "fa" ? "fa-IR" : "en-US";
    const posts = getPosts();
    const sections = getCourses()
        .map((course) => ({course, copy: getCourseCopy(course.title, locale), posts: posts.filter((p) => p.category === course.title).sort((a, b) => a.order - b.order)}))
        .filter((s) => s.posts.length > 0);
    const url = `${SITE}${localePath(locale, "/blog/")}`;

    return (
        <Shell crumbs={[{label: t.blog.crumb}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "Blog",
                "@id": `${url}#blog`,
                url,
                name: t.blog.title,
                inLanguage: locale,
                publisher: {"@id": `${SITE}/#org`},
                blogPost: posts.map((p) => ({"@type": "BlogPosting", headline: p.title, url: `${SITE}/blog/${p.slug}/`, datePublished: p.date, inLanguage: "fa"})),
            }}/>
            <div className="card service-hero">
                <div>
                    <h1 className="page-title">{t.blog.title}</h1>
                    <p className="page-lead">{t.blog.desc}</p>
                    {t.blog.faNote && <p className="page-lead" style={{marginTop: 6}}>{t.blog.faNote}</p>}
                    <div className="filters" style={{marginTop: 22, marginBottom: 0}}>
                        {sections.map(({course, copy, posts: list}) => (
                            <a key={course.slug} className="filter" href={`#${course.slug}`}>{copy.title} <span style={{opacity: .65}}>({list.length.toLocaleString(nf)})</span></a>
                        ))}
                    </div>
                </div>
                <TerminalWindow title="~/learn" steps={[...TERMINAL]} label={t.home.terminalLabel}/>
            </div>
            {sections.map(({course, copy, posts: list}) => (
                <section className="card" id={course.slug} key={course.slug} aria-labelledby={`${course.slug}-title`}>
                    <div className="block-head">
                        <div>
                            <h2 className="block-title" id={`${course.slug}-title`}>{copy.title}</h2>
                            <p className="block-desc">{copy.description}</p>
                        </div>
                        <span className="chip">{list.length.toLocaleString(nf)} {t.blog.lessons}</span>
                    </div>
                    <ol className="lessons">
                        {list.map((p, i) => (
                            <li key={p.slug}>
                                <Link href={`/blog/${p.slug}/`} lang="fa" hrefLang="fa">
                                    <span className="lesson-num">{(i + 1).toLocaleString(nf)}</span>
                                    <span className="lesson-title">{p.title}</span>
                                    <span className="lesson-time">{p.readingMinutes.toLocaleString(nf)} {t.blog.minutes}</span>
                                </Link>
                            </li>
                        ))}
                    </ol>
                </section>
            ))}
        </Shell>
    );
}
