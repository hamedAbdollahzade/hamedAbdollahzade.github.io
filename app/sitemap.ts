import type {MetadataRoute} from "next";
import {PROJECTS} from "@/data/projects";
import {DEVELOPERS} from "@/data/developers";
import {SERVICES} from "@/data/services";
import {getPosts} from "@/lib/blog";
import {SITE} from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    return [
        {url: `${SITE}/`, lastModified: now, priority: 1},
        ...SERVICES.map((s) => ({url: `${SITE}/services/${s.slug}/`, lastModified: now, priority: 0.9})),
        {url: `${SITE}/about/`, lastModified: now, priority: 0.8},
        {url: `${SITE}/developers/`, lastModified: now, priority: 0.8},
        ...DEVELOPERS.map((d) => ({url: `${SITE}/developers/${d.slug}/`, lastModified: now, priority: 0.7})),
        {url: `${SITE}/blog/`, lastModified: now, priority: 0.8},
        ...getPosts().map((p) => ({url: `${SITE}/blog/${p.slug}/`, lastModified: new Date(p.date), priority: 0.7})),
        ...PROJECTS.map((p) => ({url: `${SITE}/projects/${p.slug}/`, lastModified: now, priority: 0.7})),
        {url: `${SITE}/resume.html`, lastModified: now, priority: 0.6},
    ];
}
