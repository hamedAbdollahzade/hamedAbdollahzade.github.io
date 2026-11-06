import Link from "next/link";
import {notFound} from "next/navigation";
import {PhoneIcon} from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import OpenChat from "@/components/OpenChat";
import Shell from "@/components/Shell";
import {courseOf} from "@/data/courses";
import {BRAND} from "@/data/services";
import {getPosts} from "@/lib/blog";
import {AUTHOR, OG_IMAGE, SITE, pageMeta} from "@/lib/site";

type Params = {slug: string};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
    return getPosts().map((p) => ({slug: p.slug}));
}

export async function generateMetadata({params}: {params: Promise<Params>}) {
    const {slug} = await params;
    const post = getPosts().find((p) => p.slug === slug);
    if (!post) return {};
    return pageMeta({title: `${post.title} | ${BRAND.name}`, description: post.description, path: `/blog/${slug}/`, type: "article", keywords: post.keywords});
}

export default async function BlogPost({params}: {params: Promise<Params>}) {
    const {slug} = await params;
    const posts = getPosts();
    const post = posts.find((p) => p.slug === slug);
    if (!post) notFound();
    const url = `${SITE}/blog/${slug}/`;
    const course = courseOf(post.category);
    const siblings = posts.filter((p) => p.category === post.category).sort((a, b) => a.order - b.order);
    const at = siblings.findIndex((p) => p.slug === slug);
    const prev = at > 0 ? siblings[at - 1] : null;
    const next = at < siblings.length - 1 ? siblings[at + 1] : null;

    return (
        <Shell crumbs={[{label: "آموزش‌ها و مقالات", href: "/blog/"}, {label: post.category, href: `/blog/#${course?.slug ?? ""}`}, {label: post.title}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "BlogPosting", "@id": `${url}#post`, headline: post.title, description: post.description, articleSection: post.category,
                        datePublished: post.date, dateModified: post.date, inLanguage: "fa", url, mainEntityOfPage: url, image: OG_IMAGE,
                        author: {"@type": "Person", "@id": `${SITE}/#person`, name: AUTHOR},
                        publisher: {"@id": `${SITE}/#org`},
                    },
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: BRAND.name, item: `${SITE}/`},
                        {"@type": "ListItem", position: 2, name: "آموزش‌ها و مقالات", item: `${SITE}/blog/`},
                        {"@type": "ListItem", position: 3, name: post.title, item: url},
                    ]},
                ],
            }}/>
            <article className="card" style={{maxWidth: 860, width: "100%", marginInline: "auto"}}>
                <div className="post-meta" style={{marginBottom: 10}}>
                    <span className="chip chip--green">{post.category}</span>
                    <time dateTime={post.date}>{post.dateFa}</time>
                    <span>· {post.readingMinutes.toLocaleString("fa-IR")} دقیقه مطالعه</span>
                </div>
                <h1 className="page-title">{post.title}</h1>
                <p className="page-lead">{post.description}</p>
                <div className="prose" style={{marginTop: 26}} dangerouslySetInnerHTML={{__html: post.html}}/>
            </article>
            <div className="cta-card" style={{maxWidth: 860, width: "100%", marginInline: "auto"}}>
                <h2>ایده‌ای دارید؟ برایمان بگویید</h2>
                <p>مشاوره و پیشنهاد اولیه رایگان است.</p>
                <div className="btn-row">
                    <OpenChat className="btn btn--lg">شروع گفتگو</OpenChat>
                    <a className="btn btn--lg btn--ghost" href={`tel:${BRAND.phone}`}><PhoneIcon/>تماس با ما</a>
                </div>
            </div>
            {(prev || next) && (
                <nav className="sibling-nav" aria-label="درس قبلی و بعدی" style={{maxWidth: 860, width: "100%", marginInline: "auto"}}>
                    {prev ? <Link href={`/blog/${prev.slug}/`}>→ {prev.title}</Link> : <span/>}
                    {next ? <Link href={`/blog/${next.slug}/`}>{next.title} ←</Link> : <span/>}
                </nav>
            )}
        </Shell>
    );
}
