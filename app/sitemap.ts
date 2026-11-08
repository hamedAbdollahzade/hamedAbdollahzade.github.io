import type {MetadataRoute} from "next";
import {PROJECTS} from "@/data/projects";
import {SERVICES} from "@/data/services";
import {DEVELOPERS} from "@/data/developers";
import {getPosts} from "@/lib/blog";
import {localePath} from "@/lib/locale";
import {SITE} from "@/lib/site";

export const dynamic = "force-static";

/** One entry per translated page, with hreflang alternates for both languages. */
function bilingual(path: string, priority: number, lastModified: Date): MetadataRoute.Sitemap[number] {
    return {
        url: `${SITE}${localePath("fa", path)}`,
        lastModified,
        priority,
        alternates: {languages: {fa: `${SITE}${localePath("fa", path)}`, en: `${SITE}${localePath("en", path)}`}},
    };
}

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const pages: MetadataRoute.Sitemap = [
        bilingual("/", 1, now),
        ...SERVICES.map((s) => bilingual(`/services/${s.slug}/`, 0.9, now)),
        bilingual("/about/", 0.8, now),
        bilingual("/developers/", 0.8, now),
        ...DEVELOPERS.map((d) => bilingual(`/developers/${d.slug}/`, 0.7, now)),
        bilingual("/blog/", 0.8, now),
        ...PROJECTS.map((p) => bilingual(`/projects/${p.slug}/`, 0.7, now)),
    ];
    // English URLs listed on their own as well, so crawlers that ignore alternates still find them.
    const englishOnly: MetadataRoute.Sitemap = pages.map((entry) => ({url: entry.url.replace(SITE, `${SITE}/en`).replace(`${SITE}/en/`, `${SITE}/en/`), lastModified: now, priority: entry.priority}));
    return [
        ...pages,
        ...englishOnly,
        ...getPosts().map((p) => ({url: `${SITE}/blog/${p.slug}/`, lastModified: new Date(p.date), priority: 0.7})),
        {url: `${SITE}/resume.html`, lastModified: now, priority: 0.6},
    ];
}
