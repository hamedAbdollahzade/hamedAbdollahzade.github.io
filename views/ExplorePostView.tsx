import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import JsonLd from "@/components/JsonLd";
import {Logo, PhoneIcon, WhatsAppIcon} from "@/components/Icons";
import Shell from "@/components/Shell";
import {getBrand} from "@/data/localized";
import {EXPLORE_POSTS, exploreText, getExplorePost} from "@/data/explore";
import {localePath} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import {SITE, waLink} from "@/lib/site";
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
    const brand = getBrand(locale);
    const wa = waLink(t.waText(x.title));

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
            <article className="xp-post">
                <div className="xp-main">
                    {post.aparat && (
                        <section className="xp-block" aria-labelledby="xp-video-h">
                            <h2 className="xp-block-title" id="xp-video-h">{t.video}</h2>
                            <div className="xp-video">
                                <iframe
                                    src={`https://www.aparat.com/video/video/embed/videohash/${post.aparat}/vt/frame`}
                                    title={t.videoTitle}
                                    loading="lazy"
                                    allowFullScreen
                                    allow="fullscreen; picture-in-picture"
                                />
                            </div>
                        </section>
                    )}
                    <section className="xp-block" aria-labelledby="xp-photos-h">
                        <h2 className="xp-block-title" id="xp-photos-h">{t.photos} <small>({post.images.length.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")})</small></h2>
                        <div className="xp-photos">
                            {post.images.map((img, i) => (
                                <a className="xp-photo" key={img.src} href={`/${img.src}`} target="_blank" rel="noopener noreferrer" aria-label={img.alt[locale] || t.image(i + 1)}>
                                    <Image src={`/${img.src}`} alt={img.alt[locale] || t.image(i + 1)} width={600} height={600} loading={i === 0 ? "eager" : "lazy"}/>
                                </a>
                            ))}
                        </div>
                    </section>
                </div>
                <aside className="xp-side card">
                    <div className="xp-author">
                        <span className="xp-avatar xp-avatar--sm" aria-hidden="true"><Logo/></span>
                        <div><strong>Webino-Dev</strong><time dateTime={post.date}>{date}</time></div>
                    </div>
                    <h1 className="xp-title">{x.title}</h1>
                    <p className="xp-caption">{x.caption}</p>
                    <ul className="tags">{x.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                    <div className="xp-buy">
                        <div className="xp-buy-label">{t.buy}</div>
                        <a className="xp-phone" href={`tel:${brand.phone}`} dir="ltr">{brand.phoneDisplay}</a>
                        <div className="btn-row">
                            <a className="btn" href={`tel:${brand.phone}`}><PhoneIcon/> {t.call}</a>
                            <a className="btn btn--green" href={wa} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/> {t.whatsapp}</a>
                        </div>
                    </div>
                </aside>
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
