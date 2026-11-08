import type {Metadata} from "next";
import {BRAND} from "@/data/services";
import {OG_LOCALE, localePath} from "./locale";
import type {Locale} from "./locale";

export const SITE = "https://webino-dev.ir";
export const OG_IMAGE = `${SITE}/assets/images/og-image.jpg`;
export const AUTHOR = "حامد عبداله زاده";
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
    type?: "website" | "article" | "profile";
    keywords?: string[];
}

/** Title, description, canonical, hreflang, Open Graph and Twitter tags for a page. */
export function pageMeta({title, description, path, locale = "fa", translated = false, image = OG_IMAGE, type = "website", keywords}: MetaInput): Metadata {
    const url = `${SITE}${localePath(locale, path)}`;
    const alternates: Metadata["alternates"] = {canonical: url};
    if (translated) {
        alternates.languages = {
            fa: `${SITE}${localePath("fa", path)}`,
            en: `${SITE}${localePath("en", path)}`,
            "x-default": `${SITE}${localePath("fa", path)}`,
        };
    }
    return {
        title: {absolute: title},
        description,
        keywords,
        alternates,
        openGraph: {type, title, description, url, siteName: ORG, locale: OG_LOCALE[locale], images: [{url: image, width: 1200, height: 630}]},
        twitter: {card: "summary_large_image", title, description, images: [image]},
    };
}
