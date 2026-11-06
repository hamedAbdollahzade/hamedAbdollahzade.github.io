import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "content", "blog");

export interface Post {
    slug: string;
    title: string;
    description: string;
    date: string;
    dateFa: string;
    keywords: string[];
    html: string;
}

const escapeHtml = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inlineMd(text: string): string {
    return escapeHtml(text)
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => `<a href="${href}">${label}</a>`)
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
}

/** Small Markdown subset: ## / ### headings, paragraphs, - lists, 1. lists, > quotes. */
export function markdownToHtml(source: string): string {
    const out: string[] = [];
    let list: "ul" | "ol" | null = null;
    let para: string[] = [];
    const flushPara = () => { if (para.length) out.push(`<p>${inlineMd(para.join(" "))}</p>`); para = []; };
    const flushList = () => { if (list) out.push(`</${list}>`); list = null; };
    for (const raw of source.split("\n")) {
        const line = raw.trim();
        let m: RegExpMatchArray | null;
        if (!line) { flushPara(); flushList(); }
        else if ((m = line.match(/^(#{2,3})\s+(.*)$/))) { flushPara(); flushList(); out.push(`<h${m[1].length}>${inlineMd(m[2])}</h${m[1].length}>`); }
        else if ((m = line.match(/^[-*]\s+(.*)$/))) { flushPara(); if (list !== "ul") { flushList(); out.push("<ul>"); list = "ul"; } out.push(`<li>${inlineMd(m[1])}</li>`); }
        else if ((m = line.match(/^\d+[.)]\s+(.*)$/))) { flushPara(); if (list !== "ol") { flushList(); out.push("<ol>"); list = "ol"; } out.push(`<li>${inlineMd(m[1])}</li>`); }
        else if ((m = line.match(/^>\s?(.*)$/))) { flushPara(); flushList(); out.push(`<blockquote><p>${inlineMd(m[1])}</p></blockquote>`); }
        else { flushList(); para.push(line); }
    }
    flushPara(); flushList();
    return out.join("\n");
}

/** Frontmatter: title, description, date (YYYY-MM-DD) and an optional keywords list. */
function parseFrontmatter(text: string): {meta: Record<string, string | string[]>; body: string} {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) throw new Error("Blog post is missing frontmatter");
    const meta: Record<string, string | string[]> = {};
    let key: string | null = null;
    for (const line of match[1].split("\n")) {
        const item = line.match(/^\s+-\s+(.*)$/);
        if (item && key && Array.isArray(meta[key])) { (meta[key] as string[]).push(item[1].trim()); continue; }
        const pair = line.match(/^(\w+):\s*(.*)$/);
        if (!pair) continue;
        key = pair[1];
        meta[key] = pair[2] === "" ? [] : pair[2].trim();
    }
    return {meta, body: match[2]};
}

const toFa = (date: string) =>
    new Date(date).toLocaleDateString("fa-IR", {year: "numeric", month: "long", day: "numeric", timeZone: "UTC"});

/** Reads content/blog/*.md (files starting with "_" are ignored), newest first. */
export function getPosts(): Post[] {
    if (!fs.existsSync(DIR)) return [];
    return fs.readdirSync(DIR)
        .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
        .map((file) => {
            const {meta, body} = parseFrontmatter(fs.readFileSync(path.join(DIR, file), "utf8"));
            for (const field of ["title", "description", "date"]) if (!meta[field]) throw new Error(`${file}: missing ${field}`);
            const date = String(meta.date);
            return {
                slug: file.replace(/\.md$/, ""),
                title: String(meta.title),
                description: String(meta.description),
                date,
                dateFa: toFa(date),
                keywords: Array.isArray(meta.keywords) ? meta.keywords : [],
                html: markdownToHtml(body),
            };
        })
        .sort((a, b) => b.date.localeCompare(a.date));
}
