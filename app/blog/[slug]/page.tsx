import Link from "next/link";
import {notFound} from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
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
    const others = posts.filter((p) => p.slug !== slug).slice(0, 2);

    return (
        <>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "BlogPosting", "@id": `${url}#post`, headline: post.title, description: post.description,
                        datePublished: post.date, dateModified: post.date, inLanguage: "fa", url, mainEntityOfPage: url, image: OG_IMAGE,
                        author: {"@type": "Person", "@id": `${SITE}/#person`, name: AUTHOR},
                        publisher: {"@id": `${SITE}/#org`},
                    },
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: BRAND.name, item: `${SITE}/`},
                        {"@type": "ListItem", position: 2, name: "بلاگ", item: `${SITE}/blog/`},
                        {"@type": "ListItem", position: 3, name: post.title, item: url},
                    ]},
                ],
            }}/>
            <Header solidAlways/>
            <section className="page-top">
                <div className="container">
                    <span className="eyebrow" style={{color: "rgba(255,255,255,.65)"}}><Link href="/blog/">بلاگ</Link> · <time dateTime={post.date}>{post.dateFa}</time></span>
                    <h1>{post.title}</h1>
                    <p className="page-intro">{post.description}</p>
                </div>
            </section>
            <main className="page-body" id="main-content">
                <article className="prose" dangerouslySetInnerHTML={{__html: post.html}}/>
                <div className="cta-box">
                    <h2>ایده‌ای دارید؟ برایمان بگویید</h2>
                    <p>مشاوره و پیشنهاد اولیه رایگان است.</p>
                    <div className="hero-actions">
                        <a className="pill pill--dark" href={`tel:${BRAND.phone}`} dir="ltr">{BRAND.phoneDisplay}</a>
                        <Link className="pill pill--ghost" href="/#contact">فرم درخواست</Link>
                    </div>
                </div>
            </main>
            {others.length > 0 && (
                <nav className="siblings" aria-label="مقاله‌های دیگر">
                    {others.map((p) => <Link key={p.slug} href={`/blog/${p.slug}/`}>{p.title}</Link>)}
                </nav>
            )}
            <Footer/>
        </>
    );
}
