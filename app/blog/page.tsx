import JsonLd from "@/components/JsonLd";
import PostFilter from "@/components/PostFilter";
import Shell from "@/components/Shell";
import {getPosts} from "@/lib/blog";
import {SITE, pageMeta} from "@/lib/site";

const DESC = "آموزش‌ها و مقاله‌های Webino-Dev درباره‌ی هوش مصنوعی، طراحی سایت، ساخت پنل مدیریتی، PWA و تبدیل ایده به محصول.";

export const metadata = pageMeta({title: "آموزش‌ها و مقالات | Webino-Dev", description: DESC, path: "/blog/", keywords: ["آموزش هوش مصنوعی", "آموزش طراحی سایت", "آموزش برنامه‌نویسی", "راهنمای سفارش سایت", "PWA"]});

export default function BlogIndex() {
    const posts = getPosts();
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
            </div>
            <div className="card">
                <PostFilter posts={posts.map(({slug, title, description, dateFa, category, readingMinutes}) => ({slug, title, description, dateFa, category, readingMinutes}))}/>
            </div>
        </Shell>
    );
}
