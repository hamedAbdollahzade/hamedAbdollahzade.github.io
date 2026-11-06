import type {Metadata} from "next";
import {BRAND} from "@/data/services";

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
    path: string;
    image?: string;
    type?: "website" | "article" | "profile";
    keywords?: string[];
}

/** Title, description, canonical, Open Graph and Twitter tags for a page. */
export function pageMeta({title, description, path, image = OG_IMAGE, type = "website", keywords}: MetaInput): Metadata {
    const url = `${SITE}${path}`;
    return {
        title: {absolute: title},
        description,
        keywords,
        alternates: {canonical: url},
        openGraph: {type, title, description, url, siteName: ORG, locale: "fa_IR", images: [{url: image, width: 1200, height: 630}]},
        twitter: {card: "summary_large_image", title, description, images: [image]},
    };
}
