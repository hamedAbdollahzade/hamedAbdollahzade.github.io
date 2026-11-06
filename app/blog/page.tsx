import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Shell from "@/components/Shell";
import {COURSES} from "@/data/courses";
import {getPosts} from "@/lib/blog";
import {SITE, pageMeta} from "@/lib/site";

const DESC = "آموزش‌های رایگان HTML، CSS، JavaScript، مسیر فرانت‌اند، لینوکس اوبونتو و کدنویسی با هوش مصنوعی، همراه با راهنماهای عملی Webino-Dev.";

export const metadata = pageMeta({
    title: "آموزش‌ها و مقالات | HTML، CSS، JavaScript و هوش مصنوعی | Webino-Dev",
    description: DESC,
    path: "/blog/",
    keywords: ["آموزش HTML", "آموزش CSS", "آموزش جاوااسکریپت", "آموزش فرانت‌اند", "آموزش هوش مصنوعی", "آموزش لینوکس", "آموزش Docker", "Webino-Dev"],
});

export default function BlogIndex() {
    const posts = getPosts();
    const sections = COURSES.map((course) => ({
        course,
        posts: posts.filter((p) => p.category === course.title).sort((a, b) => a.order - b.order),
    })).filter((s) => s.posts.length > 0);

    return (
        <Shell crumbs={[{label: "آموزش‌ها و مقالات"}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "Blog",
                "@id": `${SITE}/blog/#blog`,
                url: `${SITE}/blog/`,
                name: "آموزش‌ها و مقالات Webino-Dev",
                inLanguage: "fa",
                publisher: {"@id": `${SITE}/#org`},
                blogPost: posts.map((p) => ({"@type": "BlogPosting", headline: p.title, url: `${SITE}/blog/${p.slug}/`, datePublished: p.date})),
            }}/>
            <div className="card">
                <h1 className="page-title">آموزش‌ها و مقالات</h1>
                <p className="page-lead">{DESC}</p>
                <div className="filters" style={{marginTop: 22, marginBottom: 0}}>
                    {sections.map(({course, posts: list}) => (
                        <a key={course.slug} className="filter" href={`#${course.slug}`}>{course.title} <span style={{opacity: .65}}>({list.length.toLocaleString("fa-IR")})</span></a>
                    ))}
                </div>
            </div>
            {sections.map(({course, posts: list}) => (
                <section className="card" id={course.slug} key={course.slug} aria-labelledby={`${course.slug}-title`}>
                    <div className="block-head">
                        <div>
                            <h2 className="block-title" id={`${course.slug}-title`}>{course.title}</h2>
                            <p className="block-desc">{course.description}</p>
                        </div>
                        <span className="chip">{list.length.toLocaleString("fa-IR")} درس</span>
                    </div>
                    <ol className="lessons">
                        {list.map((p, i) => (
                            <li key={p.slug}>
                                <Link href={`/blog/${p.slug}/`}>
                                    <span className="lesson-num">{(i + 1).toLocaleString("fa-IR")}</span>
                                    <span className="lesson-title">{p.title}</span>
                                    <span className="lesson-time">{p.readingMinutes.toLocaleString("fa-IR")} دقیقه</span>
                                </Link>
                            </li>
                        ))}
                    </ol>
                </section>
            ))}
        </Shell>
    );
}
