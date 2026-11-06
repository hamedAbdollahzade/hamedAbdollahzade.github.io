import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import {getPosts} from "@/lib/blog";
import {SITE, pageMeta} from "@/lib/site";

const DESC = "مقاله‌ها و راهنماهای Webino-Dev درباره‌ی طراحی سایت، ساخت پنل مدیریتی، PWA و تبدیل ایده به محصول.";

export const metadata = pageMeta({title: "بلاگ Webino-Dev | راهنمای طراحی سایت و توسعه نرم‌افزار", description: DESC, path: "/blog/"});

export default function BlogIndex() {
    const posts = getPosts();
    return (
        <>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "Blog",
                "@id": `${SITE}/blog/#blog`,
                url: `${SITE}/blog/`,
                name: "بلاگ Webino-Dev",
                inLanguage: "fa",
                publisher: {"@id": `${SITE}/#org`},
                blogPost: posts.map((p) => ({"@type": "BlogPosting", headline: p.title, url: `${SITE}/blog/${p.slug}/`, datePublished: p.date})),
            }}/>
            <Header solidAlways/>
            <section className="page-top">
                <div className="container">
                    <span className="eyebrow" style={{color: "rgba(255,255,255,.65)"}}>بلاگ</span>
                    <h1>راهنماهایی برای تبدیل ایده به محصول</h1>
                    <p className="page-intro">{DESC}</p>
                </div>
            </section>
            <main id="main-content" className="section">
                <div className="container">
                    {posts.length === 0 && <p>به‌زودی مقاله‌ها اینجا منتشر می‌شوند.</p>}
                    <div className="service-grid">
                        {posts.map((post) => (
                            <Link className="service-card" href={`/blog/${post.slug}/`} key={post.slug} data-reveal>
                                <span className="service-num">{post.dateFa}</span>
                                <h2>{post.title}</h2>
                                <p>{post.description}</p>
                                <span className="project-more">خواندن مقاله ←</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
}
