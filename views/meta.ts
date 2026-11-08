/* Metadata (title, description, canonical, hreflang) for each page in each language. */

import type {Metadata} from "next";
import {getDevelopers, getProjects, getServices} from "@/data/localized";
import type {Locale} from "@/lib/locale";
import {SITE, pageMeta, summarize} from "@/lib/site";
import {UI} from "@/lib/ui";

const KEYWORDS = {
    fa: ["Webino-Dev", "وبینو دو", "هوش مصنوعی", "چت‌بات هوش مصنوعی", "افزودن هوش مصنوعی به سایت", "برنامه‌نویسی با هوش مصنوعی", "طراحی سایت مشهد", "توسعه پنل مدیریتی", "CRM", "ERP", "اپلیکیشن وب", "PWA", "برنامه‌نویس React", "Next.js", "سفارش نرم‌افزار"],
    en: ["Webino-Dev", "AI", "AI chatbot", "add AI to website", "web development Mashhad", "admin panel", "CRM", "ERP", "web app", "PWA", "React developer", "Next.js", "custom software"],
};

export function homeMeta(locale: Locale): Metadata {
    const t = UI[locale];
    return pageMeta({title: t.home.meta.title, description: t.home.meta.description, path: "/", locale, translated: true, keywords: KEYWORDS[locale]});
}

export function aboutMeta(locale: Locale): Metadata {
    const t = UI[locale];
    return pageMeta({title: t.about.meta.title, description: t.about.meta.description, path: "/about/", locale, translated: true, type: "profile"});
}

export function developersMeta(locale: Locale): Metadata {
    const t = UI[locale];
    return pageMeta({title: t.developers.metaTitle, description: t.developers.desc, path: "/developers/", locale, translated: true});
}

export function developerMeta(locale: Locale, slug: string): Metadata {
    const d = getDevelopers(locale).find((x) => x.slug === slug);
    if (!d) return {};
    return pageMeta({
        title: `${d.name} (${d.nameEn}) | ${d.role} | Webino-Dev`,
        description: summarize(d.bio),
        path: `/developers/${slug}/`,
        locale,
        translated: true,
        type: "profile",
        image: `${SITE}/${d.photo}`,
        keywords: [d.name, d.nameEn, ...d.skills],
    });
}

export function serviceMeta(locale: Locale, slug: string): Metadata {
    const s = getServices(locale).find((x) => x.slug === slug);
    if (!s) return {};
    return pageMeta({title: s.seoTitle, description: summarize(s.description, 160), path: `/services/${slug}/`, locale, translated: true, keywords: [...s.tech, "Webino-Dev", s.title]});
}

export function projectMeta(locale: Locale, slug: string): Metadata {
    const p = getProjects(locale).find((x) => x.slug === slug);
    if (!p) return {};
    return pageMeta({title: `${p.title} | Webino-Dev`, description: summarize(p.description), path: `/projects/${slug}/`, locale, translated: true, image: `${SITE}/${p.img}`, type: "article", keywords: [...p.tech, "Webino-Dev"]});
}

export function blogMeta(locale: Locale): Metadata {
    const t = UI[locale];
    return pageMeta({title: t.blog.metaTitle, description: t.blog.desc, path: "/blog/", locale, translated: true, keywords: locale === "fa" ? ["آموزش هوش مصنوعی", "آموزش HTML", "آموزش CSS", "آموزش جاوااسکریپت", "آموزش فرانت‌اند", "آموزش شبکه", "آموزش امنیت", "WireGuard", "Docker"] : ["HTML tutorial", "CSS tutorial", "JavaScript tutorial", "frontend roadmap", "networking", "WireGuard", "AI coding"]});
}
