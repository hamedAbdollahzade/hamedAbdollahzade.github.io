import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import JsonLd from "@/components/JsonLd";
import {Logo, PhoneIcon, WhatsAppIcon} from "@/components/Icons";
import Shell from "@/components/Shell";
import {EXPLORE_POSTS, exploreText, getExplorePost} from "@/data/explore";
import {localePath} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import {SITE} from "@/lib/site";
import {UI} from "@/lib/ui";

/** One explore post: video and photos in a swipeable strip, caption and buy buttons beside it. */
export default function ExplorePostView({locale, slug}: {locale: Locale; slug: string}) {
    const t = UI[locale].explore;
    const post = getExplorePost(slug);
    if (!post) notFound();
    const x = exploreText(post, locale);
    const url = `${SITE}${localePath(locale, `/explore/${slug}/`)}`;
    const others = EXPLORE_POSTS.filter((p) => p.slug !== slug);
    const date = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {dateStyle: "long"}).format(new Date(post.date));
    const wa = `https://wa.me/${post.phone.replace("+", "")}?text=${encodeURIComponent(t.waText(x.title))}`;

    return (
        <Shell crumbs={[{label: t.crumb, href: localePath(locale, "/explore/")}, {label: x.title}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "Product", "@id": `${url}#product`, name: x.title, description: x.caption, url, inLanguage: locale,
                        image: post.images.map((i) => `${SITE}/${i.src}`), brand: {"@type": "Brand", name: "Webino-Dev"},
                    },
                    ...(post.aparat ? [{
                        "@type": "VideoObject", name: x.title, description: x.caption, uploadDate: post.date,
                        embedUrl: `https://www.aparat.com/video/video/embed/videohash/${post.aparat}/vt/frame`,
                        thumbnailUrl: `${SITE}/${post.images[0].src}`,
                    }] : []),
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: "Webino-Dev", item: `${SITE}${localePath(locale, "/")}`},
                        {"@type": "ListItem", position: 2, name: t.crumb, item: `${SITE}${localePath(locale, "/explore/")}`},
                        {"@type": "ListItem", position: 3, name: x.title, item: url},
                    ]},
                ],
            }}/>
            <article className="xp-post card">
                <div className="xp-media" tabIndex={0} role="group" aria-label={x.title}>
                    {post.aparat && (
                        <div className="xp-slide xp-slide--video">
                            <iframe
                                src={`https://www.aparat.com/video/video/embed/videohash/${post.aparat}/vt/frame`}
                                title={t.videoTitle}
                                loading="lazy"
                                allowFullScreen
                                allow="fullscreen; picture-in-picture"
                            />
                        </div>
                    )}
                    {post.images.map((img, i) => (
                        <div className="xp-slide" key={img.src}>
                            <Image src={`/${img.src}`} alt={img.alt[locale] || t.image(i + 1)} width={900} height={900} priority={i === 0 && !post.aparat}/>
                        </div>
                    ))}
                </div>
                <div className="xp-side">
                    <div className="xp-author">
                        <span className="xp-avatar xp-avatar--sm" aria-hidden="true"><Logo/></span>
                        <div><strong>Webino-Dev</strong><time dateTime={post.date}>{date}</time></div>
                    </div>
                    <h1 className="xp-title">{x.title}</h1>
                    <p className="xp-caption">{x.caption}</p>
                    <ul className="tags">{x.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                    <div className="xp-buy">
                        <div className="xp-buy-label">{t.buy}</div>
                        <a className="xp-phone" href={`tel:${post.phone}`} dir="ltr">{post.phoneDisplay}</a>
                        <div className="btn-row">
                            <a className="btn" href={`tel:${post.phone}`}><PhoneIcon/> {t.call}</a>
                            <a className="btn btn--green" href={wa} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/> {t.whatsapp}</a>
                        </div>
                    </div>
                </div>
            </article>
            {others.length > 0 && (
                <section className="section">
                    <h2 style={{fontSize: 22, fontWeight: 800, marginBottom: 14}}>{t.more}</h2>
                    <div className="xp-grid">
                        {others.map((p) => (
                            <Link className="xp-tile" key={p.slug} href={localePath(locale, `/explore/${p.slug}/`)} aria-label={exploreText(p, locale).title}>
                                <Image src={`/${p.images[0].src}`} alt={p.images[0].alt[locale]} width={600} height={600}/>
                                <span className="xp-over"><strong>{exploreText(p, locale).title}</strong></span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
            <nav className="sibling-nav" aria-label={t.backToFeed}>
                <Link href={localePath(locale, "/explore/")}>{UI[locale].arrow === "←" ? "→" : "←"} {t.backToFeed}</Link>
            </nav>
        </Shell>
    );
}
