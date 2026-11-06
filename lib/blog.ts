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
    category: string;
    order: number;
    readingMinutes: number;
    html: string;
}

const escapeHtml = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inlineMd(text: string): string {
    const codes: string[] = [];
    // Pull out `code` first so its content is never touched by the other rules.
    let s = text.replace(/`([^`]+)`/g, (_, c) => { codes.push(`<code>${escapeHtml(c)}</code>`); return `\u0000${codes.length - 1}\u0000`; });
    s = escapeHtml(s)
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => `<a href="${href}">${label}</a>`)
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>");
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[Number(i)]);
}

const cells = (row: string) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
const isTableSep = (line: string) => /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/.test(line.trim());

interface ListItem { text: string; children: ListItem[]; ordered: boolean }

function renderList(items: ListItem[], ordered: boolean): string {
    const tag = ordered ? "ol" : "ul";
    return `<${tag}>${items.map((i) => `<li>${inlineMd(i.text)}${i.children.length ? renderList(i.children, i.children[0].ordered) : ""}</li>`).join("")}</${tag}>`;
}

/** Markdown subset: headings, paragraphs, fenced code, tables, nested lists, quotes, rules, links, bold, italic, code. */
export function markdownToHtml(source: string): string {
    const lines = source.replace(/\r/g, "").split("\n");
    const out: string[] = [];
    let i = 0;

    while (i < lines.length) {
        const raw = lines[i];
        const line = raw.trim();
        let m: RegExpMatchArray | null;

        if (!line) { i++; continue; }

        // Fenced code block
        if ((m = line.match(/^```\s*([\w+-]*)/))) {
            const lang = m[1];
            const code: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
            i++;
            out.push(`<pre dir="ltr"${lang ? ` data-lang="${escapeHtml(lang)}"` : ""}><code>${escapeHtml(code.join("\n"))}</code></pre>`);
            continue;
        }
        // Heading
        if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
            const level = Math.max(2, m[1].length);
            out.push(`<h${level}>${inlineMd(m[2])}</h${level}>`);
            i++;
            continue;
        }
        // Horizontal rule
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) { out.push("<hr>"); i++; continue; }
        // Table
        if (line.startsWith("|") && i + 1 < lines.length && isTableSep(lines[i + 1])) {
            const head = cells(line);
            i += 2;
            const rows: string[][] = [];
            while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
            out.push(`<div class="table-wrap"><table><thead><tr>${head.map((c) => `<th>${inlineMd(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inlineMd(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
            continue;
        }
        // Blockquote
        if (line.startsWith(">")) {
            const quote: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith(">")) quote.push(lines[i++].trim().replace(/^>\s?/, ""));
            out.push(`<blockquote>${markdownToHtml(quote.join("\n"))}</blockquote>`);
            continue;
        }
        // List (with nesting by indentation)
        if (/^\s*([-*]|\d+[.)])\s+/.test(raw)) {
            const root: ListItem[] = [];
            const stack: {indent: number; items: ListItem[]}[] = [{indent: -1, items: root}];
            while (i < lines.length && /^\s*([-*]|\d+[.)])\s+/.test(lines[i])) {
                const lm = lines[i].match(/^(\s*)([-*]|\d+[.)])\s+(.*)$/)!;
                const indent = lm[1].replace(/\t/g, "    ").length;
                const item: ListItem = {text: lm[3], children: [], ordered: /\d/.test(lm[2])};
                while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
                stack[stack.length - 1].items.push(item);
                stack.push({indent, items: item.children});
                i++;
                // Continuation lines belonging to this item
                while (i < lines.length && lines[i].trim() && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+[.)])\s+/.test(lines[i])) { item.text += " " + lines[i].trim(); i++; }
            }
            out.push(renderList(root, root[0].ordered));
            continue;
        }
        // Paragraph
        const para: string[] = [];
        while (i < lines.length && lines[i].trim() && !/^(```|#{1,4}\s|>|---+$|\|)/.test(lines[i].trim()) && !/^\s*([-*]|\d+[.)])\s+/.test(lines[i])) para.push(lines[i++].trim());
        if (para.length) out.push(`<p>${inlineMd(para.join(" "))}</p>`);
        else i++;
    }
    return out.join("\n");
}

/** Frontmatter: title, description, date (YYYY-MM-DD), optional category (e.g. آموزش) and keywords list. */
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
            const html = markdownToHtml(body);
            const words = body.split(/\s+/).filter(Boolean).length;
            return {
                slug: file.replace(/\.md$/, ""),
                title: String(meta.title),
                description: String(meta.description),
                date,
                dateFa: toFa(date),
                keywords: Array.isArray(meta.keywords) ? meta.keywords : [],
                category: meta.category ? String(meta.category) : "راهنما و مقاله",
                order: meta.order ? Number(meta.order) : 0,
                readingMinutes: Math.max(1, Math.round(words / 180)),
                html,
            };
        })
        .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order || a.slug.localeCompare(b.slug));
}
