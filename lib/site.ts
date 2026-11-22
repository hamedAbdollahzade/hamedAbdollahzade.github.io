import type {Metadata} from "next";
import {BRAND} from "@/data/services";
import {OG_LOCALE, localePath} from "./locale";
import type {Locale} from "./locale";

export const SITE = "https://webino-dev.ir";
export const OG_IMAGE = `${SITE}/assets/images/og-image.jpg`;
export const AUTHOR = "حامد عبداله زاده";
export const AUTHOR_EN = "Hamed Abdollahzade";
/** Spellings people search for; used in keywords and structured data. */
export const AUTHOR_NAMES = [AUTHOR, "حامد عبدالله زاده", "حامد عبداله‌زاده", "حامد عبدالله‌زاده", AUTHOR_EN];
export const AUTHOR_URL = `${SITE}/developers/hamed-abdollahzade/`;
export const AUTHOR_PHOTO = `${SITE}/assets/images/hamed-abdollahzade.jpg`;
const PHOTO_SIZE = 460;

/** Alt text and caption for Hamed's photo, with his name in both scripts for image search. */
export const photoAlt = (locale: Locale) =>
    locale === "fa" ? `${AUTHOR} (${AUTHOR_EN})، طراح و توسعه‌دهنده‌ی وب در مشهد` : `${AUTHOR_EN} (${AUTHOR}), web designer and developer in Mashhad`;

/** schema.org ImageObject for Hamed's photo. */
export const photoObject = (locale: Locale) => ({
    "@type": "ImageObject", "@id": `${SITE}/#photo`, url: AUTHOR_PHOTO, contentUrl: AUTHOR_PHOTO,
    width: PHOTO_SIZE, height: PHOTO_SIZE, caption: photoAlt(locale), name: locale === "fa" ? AUTHOR : AUTHOR_EN,
    creditText: AUTHOR_EN, copyrightNotice: AUTHOR_EN,
});
export const ORG = `${BRAND.name} | وبینو دِو`;

export const waLink = (text = "سلام، می‌خواهم درباره‌ی یک ایده/پروژه مشورت بگیرم.") =>
    `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;

export function summarize(text: string, limit = 155): string {
    if (text.length <= limit) return text;
    return `${text.slice(0, limit).replace(/\s+\S*$/, "")}…`;
}

interface MetaInput {
    title: string;
    description: string;
    /** Locale-free path, e.g. "/about/". */
    path: string;
    locale?: Locale;
    /** Set when the page exists in both languages, so hreflang alternates are emitted. */
    translated?: boolean;
    image?: string;
    /** Alt text of the share image; defaults to the site image showing Hamed. */
    imageAlt?: string;
    type?: "website" | "article" | "profile";
    keywords?: string[];
}

/** Title, description, canonical, hreflang, Open Graph and Twitter tags for a page. */
export function pageMeta({title, description, path, locale = "fa", translated = false, image = OG_IMAGE, imageAlt, type = "website", keywords}: MetaInput): Metadata {
    const url = `${SITE}${localePath(locale, path)}`;
    const alternates: Metadata["alternates"] = {canonical: url};
    if (translated) {
        alternates.languages = {
            fa: `${SITE}${localePath("fa", path)}`,
            en: `${SITE}${localePath("en", path)}`,
            "x-default": `${SITE}${localePath("fa", path)}`,
        };
    }
    // Only the site image has a known size; other images are sent without one.
    const ogImage = image === OG_IMAGE
        ? {url: image, width: 1200, height: 630, alt: imageAlt ?? photoAlt(locale)}
        : {url: image, alt: imageAlt ?? title};
    return {
        title: {absolute: title},
        description,
        keywords,
        alternates,
        openGraph: {type, title, description, url, siteName: ORG, locale: OG_LOCALE[locale], images: [ogImage]},
        twitter: {card: "summary_large_image", title, description, images: [ogImage]},
    };
}
