/* ==========================================================================
   Project Pages — Generates a crawlable page per project from PROJECTS,
   refreshes the header, cards and footer in index.html, and rewrites sitemap.xml.
   Run from the repository root: node scripts/build-project-pages.mjs
   ========================================================================== */

import {existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} from "node:fs";
import {PROJECTS} from "../js/projects.js";
import {BRAND, FAQ, PROCESS, SERVICES} from "../js/services.js";

const SITE = "https://webino-dev.ir";
const AUTHOR = "حامد عبداله زاده";
const ORG = `${BRAND.name} | وبینو دِو`;
const OG_IMAGE = `${SITE}/assets/images/og-image.jpg`;

const escapeHtml = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const pagePath = (project) => `projects/${project.slug}.html`;
const pageUrl = (project) => `${SITE}/${pagePath(project)}`;
const projectImages = (project) => project.images || [{src: project.img, caption: project.title}];

/* Search snippets are cut at around 155 characters, so end on a whole word. */
function summarize(text, limit = 155) {
    if (text.length <= limit) return text;
    return `${text.slice(0, limit).replace(/\s+\S*$/, "")}…`;
}

const LOGO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>`;
const PHONE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.99.36 1.96.68 2.9a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.18-1.18a2 2 0 0 1 2.11-.45c.94.32 1.91.55 2.9.68A2 2 0 0 1 22 16.92z"/></svg>`;
const WA_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.25-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.17-.28.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.02-.38.1-.5.11-.11.25-.28.37-.42.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03 0 1.2.87 2.35 1 2.51.12.17 1.7 2.6 4.12 3.64 2.43 1.04 2.43.7 2.87.65.44-.04 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z"/></svg>`;
const waLink = (text = "سلام، می‌خواهم درباره‌ی یک ایده/پروژه مشورت بگیرم.") => `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;
const servicePath = (service) => `services/${service.slug}.html`;
const serviceUrl = (service) => `${SITE}/${servicePath(service)}`;

function siteHeader(solid) {
    return `<header class="site-header"${solid ? ' data-solid="always"' : ""}>
    <a class="brand" href="/" aria-label="${BRAND.name}، صفحه اصلی">${LOGO}<span>${BRAND.name}</span></a>
    <div class="header-actions">
        <a class="header-call" href="tel:${BRAND.phone}" aria-label="تماس با ${BRAND.name}">${PHONE_ICON}<span dir="ltr">${BRAND.phoneDisplay}</span></a>
        <button class="menu-btn" type="button" data-menu-btn aria-expanded="false" aria-controls="site-menu" aria-label="باز کردن منو"><span></span><span></span></button>
    </div>
</header>
<nav class="menu" id="site-menu" data-menu aria-label="منوی اصلی">
    <a href="/#services">خدمات</a>
    <a href="/#projects">نمونه‌کارها</a>
    <a href="/#process">روند کار</a>
    <a href="/about.html">درباره‌ی ما</a>
    <a href="/blog/">بلاگ</a>
    <a href="/#faq">سؤالات متداول</a>
    <a href="/#contact">تماس و سفارش</a>
</nav>`;
}

function callBar() {
    return `<div class="call-bar" role="complementary" aria-label="تماس سریع">
    <a class="call-bar-btn call-bar-btn--call" href="tel:${BRAND.phone}">${PHONE_ICON}<span>تماس</span></a>
    <a class="call-bar-btn call-bar-btn--wa" href="${waLink()}" target="_blank" rel="noopener noreferrer">${WA_ICON}<span>واتساپ</span></a>
</div>`;
}

function siteFooter() {
    return `<footer class="site-footer">
    <div class="container">
        <div class="footer-cols">
            <div class="footer-brand"><a class="brand" href="/">${LOGO}<span>${BRAND.name}</span></a><p>تیم توسعه وب و نرم‌افزار در ${BRAND.city}. ایده‌ی شما را به محصولی واقعی تبدیل می‌کنیم.</p></div>
            <div><h2>خدمات</h2><ul>
${SERVICES.map((service) => `                <li><a href="/${servicePath(service)}">${escapeHtml(service.title)}</a></li>`).join("\n")}
            </ul></div>
            <div><h2>نمونه‌کارها</h2><ul>
${PROJECTS.map((project) => `                <li><a href="/${pagePath(project)}">${escapeHtml(project.title)}</a></li>`).join("\n")}
            </ul></div>
            <div><h2>${BRAND.name}</h2><ul>
                <li><a href="/about.html">درباره‌ی ما و تیم</a></li>
                <li><a href="/blog/">بلاگ</a></li>
                <li><a href="/resume.html">رزومه‌ی حامد عبداله زاده</a></li>
                <li><a href="/#faq">سؤالات متداول</a></li>
                <li><a href="/#contact">تماس و سفارش</a></li>
            </ul></div>
            <div><h2>تماس</h2><ul>
                <li><a href="tel:${BRAND.phone}" dir="ltr">${BRAND.phoneDisplay}</a></li>
                <li><a href="${waLink()}" target="_blank" rel="noopener noreferrer">واتساپ</a></li>
                <li><a href="mailto:${BRAND.email}" dir="ltr">${BRAND.email}</a></li>
                <li><a href="https://github.com/hamedAbdollahzade" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/hamed-abdollahzade" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul></div>
        </div>
        <p class="footer-copy">© <span data-year>2026</span> ${BRAND.name}. تمام حقوق محفوظ است.</p>
    </div>
</footer>
${callBar()}`;
}

function serviceCard(service, index) {
    return `                <a class="service-card" href="/${servicePath(service)}" data-reveal>
                    <span class="service-num" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
                    <h3>${escapeHtml(service.title)}</h3>
                    <p>${escapeHtml(service.short)}</p>
                    <span class="project-more">اطلاعات بیشتر ←</span>
                </a>`;
}

function processSteps() {
    return PROCESS.map(([title, text], i) => `                <li class="process-step" data-reveal><span class="process-num">${i + 1}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></li>`).join("\n");
}

function faqItems(items) {
    return items.map(([q, a]) => `            <details class="faq-item" data-reveal><summary>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`).join("\n");
}

function faqJsonLd(items) {
    return `<script type="application/ld+json">\n${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map(([q, a]) => ({"@type": "Question", name: q, acceptedAnswer: {"@type": "Answer", text: a}})),
    }, null, 2).replace(/</g, "\\u003c")}\n    </script>`;
}

function projectCard(project) {
    return `                <a class="project-card" href="/${pagePath(project)}">
                    <div class="project-media"><img src="/${escapeHtml(project.img)}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async"/></div>
                    <h3>${escapeHtml(project.title)}</h3>
                    <p>${escapeHtml(summarize(project.description, 140))}</p>
                    <span class="project-more">مشاهده جزئیات ←</span>
                </a>`;
}

function heroCards() {
    return PROJECTS.slice(0, 4)
        .map((project) => `        <div class="float-card" aria-hidden="true"><img src="/${escapeHtml(project.img)}" alt="" width="290" height="218" decoding="async" style="width:100%;height:100%;object-fit:cover"/></div>`)
        .join("\n");
}

/* Replace everything between <!-- name:start --> and <!-- name:end --> in index.html. */
function fillMarkers(html, name, content) {
    const start = `<!-- ${name}:start -->`;
    const end = `<!-- ${name}:end -->`;
    const from = html.indexOf(start);
    const to = html.indexOf(end);
    if (from === -1 || to === -1) throw new Error(`Markers for ${name} are missing from index.html`);
    return `${html.slice(0, from + start.length)}\n${content}\n${html.slice(to)}`;
}

function structuredData(project, images) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${pageUrl(project)}#project`,
                name: project.title,
                description: project.description,
                url: pageUrl(project),
                image: images.map((image) => `${SITE}/${image.src}`),
                keywords: project.tech.join(", "),
                inLanguage: "fa",
                author: {"@type": "Person", "@id": `${SITE}/#person`, name: AUTHOR, url: `${SITE}/`},
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {"@type": "ListItem", position: 1, name: AUTHOR, item: `${SITE}/`},
                    {"@type": "ListItem", position: 2, name: project.title, item: pageUrl(project)},
                ],
            },
        ],
    };
}

function renderPage(project, index) {
    const images = projectImages(project);
    const title = `${project.title} | ${AUTHOR}`;
    const description = summarize(project.description);
    const previous = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
    const next = PROJECTS[(index + 1) % PROJECTS.length];
    // "<" is escaped so the JSON can't close its script tag.
    const jsonLd = JSON.stringify(structuredData(project, images), null, 2).replace(/</g, "\\u003c");

    return `<!DOCTYPE html>
<!-- Generated by scripts/build-project-pages.mjs from js/projects.js. Do not edit by hand. -->
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}"/>
    <meta name="keywords" content="${escapeHtml(project.tech.join(", "))}, ${AUTHOR}"/>
    <meta name="author" content="${AUTHOR}"/>
    <meta name="robots" content="index, follow, max-image-preview:large"/>
    <meta name="theme-color" content="#0b0b0d"/>
    <link rel="canonical" href="${pageUrl(project)}"/>

    <meta property="og:type" content="article"/>
    <meta property="og:title" content="${escapeHtml(title)}"/>
    <meta property="og:description" content="${escapeHtml(description)}"/>
    <meta property="og:image" content="${SITE}/${escapeHtml(project.img)}"/>
    <meta property="og:locale" content="fa_IR"/>
    <meta property="og:site_name" content="${ORG}"/>
    <meta property="og:url" content="${pageUrl(project)}"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content="${escapeHtml(title)}"/>
    <meta name="twitter:description" content="${escapeHtml(description)}"/>
    <meta name="twitter:image" content="${SITE}/${escapeHtml(project.img)}"/>

    <link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml"/>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;700&family=Vazirmatn:wght@400;500;700&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="/css/labs.css"/>
    <script>document.documentElement.classList.add("js");</script>
    <script type="application/ld+json">
${jsonLd}
    </script>
</head>
<body>
<a class="skip-link" href="#main-content">پرش به محتوای اصلی</a>
${siteHeader(false)}

<section class="page-top">
    <div class="container">
        <span class="eyebrow" style="color:rgba(255,255,255,.65)">پروژه</span>
        <h1>${escapeHtml(project.title)}</h1>
        <ul class="tags" dir="ltr">
            ${project.tech.map((tech) => `<li>${escapeHtml(tech)}</li>`).join("\n            ")}
        </ul>
    </div>
</section>

<main class="page-body" id="main-content">
    ${images.map((image, i) => `<figure>
        <img src="/${escapeHtml(image.src)}" alt="${escapeHtml(image.caption)}"${i ? ' loading="lazy"' : ""} decoding="async"/>
        <figcaption>${escapeHtml(image.caption)}</figcaption>
    </figure>`).join("\n    ")}

    <p class="lead">${escapeHtml(project.description)}</p>
${(project.story || []).map((chapter) => `
    <section class="chapter">
        <h2>${escapeHtml(chapter.title)}</h2>
        <p>${escapeHtml(chapter.text)}</p>
    </section>`).join("\n")}

    <section class="contribution">
        <h2>تجربه و سهم من در پروژه</h2>
        <ul>
            ${project.learned.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n            ")}
        </ul>
    </section>

    <div class="links">
        ${project.links.map((link) => `<a class="pill pill--dark" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`).join("\n        ")}
    </div>
</main>

<nav class="siblings" aria-label="پروژه‌های دیگر">
    <a href="/${pagePath(previous)}">→ ${escapeHtml(previous.title)}</a>
    <a href="/${pagePath(next)}">${escapeHtml(next.title)} ←</a>
</nav>

${siteFooter()}
<script type="module" src="/js/labs.js"></script>
</body>
</html>
`;
}

/* ---------- Blog: content/blog/*.md -> /blog/<slug>.html ---------- */

function inlineMd(text) {
    return escapeHtml(text)
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => `<a href="${href}">${label}</a>`)
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
}

/* Small Markdown subset: ## / ### headings, paragraphs, - lists, 1. lists, > quotes. */
function markdownToHtml(source) {
    const out = [];
    let list = null;
    let para = [];
    const flushPara = () => { if (para.length) out.push(`<p>${inlineMd(para.join(" "))}</p>`); para = []; };
    const flushList = () => { if (list) out.push(`</${list}>`); list = null; };
    for (const raw of source.split("\n")) {
        const line = raw.trim();
        let m;
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

/* Frontmatter: title, description, date (YYYY-MM-DD) and an optional keywords list. */
function parseFrontmatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) throw new Error("Blog post is missing frontmatter");
    const meta = {keywords: []};
    let key = null;
    for (const line of match[1].split("\n")) {
        const item = line.match(/^\s+-\s+(.*)$/);
        if (item && key) { meta[key].push(item[1].trim()); continue; }
        const pair = line.match(/^(\w+):\s*(.*)$/);
        if (!pair) continue;
        key = pair[1];
        meta[key] = pair[2] === "" ? [] : pair[2].trim();
    }
    return {meta, body: match[2]};
}

const faDate = (date) => new Date(date).toLocaleDateString("fa-IR", {year: "numeric", month: "long", day: "numeric", timeZone: "UTC"});
const postPath = (post) => `blog/${post.slug}.html`;
const postUrl = (post) => `${SITE}/${postPath(post)}`;

function loadPosts() {
    if (!existsSync("content/blog")) return [];
    return readdirSync("content/blog")
        .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
        .map((file) => {
            const {meta, body} = parseFrontmatter(readFileSync(`content/blog/${file}`, "utf8"));
            for (const field of ["title", "description", "date"]) if (!meta[field]) throw new Error(`${file}: missing ${field}`);
            return {slug: file.replace(/\.md$/, ""), ...meta, dateFa: faDate(meta.date), html: markdownToHtml(body)};
        })
        .sort((a, b) => b.date.localeCompare(a.date));
}

const POSTS = loadPosts();

function pageHead({title, description, path, type = "website", keywords = [], image = OG_IMAGE, jsonLd = []}) {
    const url = `${SITE}${path}`;
    return `<meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}"/>
    ${keywords.length ? `<meta name="keywords" content="${escapeHtml(keywords.join(", "))}"/>` : ""}
    <meta name="author" content="${BRAND.name}"/>
    <meta name="robots" content="index, follow, max-image-preview:large"/>
    <meta name="theme-color" content="#0b0b0d"/>
    <link rel="canonical" href="${url}"/>
    <meta property="og:type" content="${type}"/>
    <meta property="og:title" content="${escapeHtml(title)}"/>
    <meta property="og:description" content="${escapeHtml(description)}"/>
    <meta property="og:image" content="${image}"/>
    <meta property="og:locale" content="fa_IR"/>
    <meta property="og:site_name" content="${ORG}"/>
    <meta property="og:url" content="${url}"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content="${escapeHtml(title)}"/>
    <meta name="twitter:description" content="${escapeHtml(description)}"/>
    <meta name="twitter:image" content="${image}"/>
    <link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml"/>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;700&family=Vazirmatn:wght@400;500;700&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="/css/labs.css"/>
    <script>document.documentElement.classList.add("js");</script>
${jsonLd.map((data) => `    <script type="application/ld+json">\n${JSON.stringify(data, null, 2).replace(/</g, "\\u003c")}\n    </script>`).join("\n")}`;
}

function postCard(post) {
    return `                <a class="service-card" href="/${postPath(post)}" data-reveal>
                    <span class="service-num">${post.dateFa}</span>
                    <h3>${escapeHtml(post.title)}</h3>
                    <p>${escapeHtml(post.description)}</p>
                    <span class="project-more">خواندن مقاله ←</span>
                </a>`;
}

function renderBlogIndex() {
    const description = "مقاله‌ها و راهنماهای Webino-Dev درباره‌ی طراحی سایت، ساخت پنل مدیریتی، PWA و تبدیل ایده به محصول.";
    const title = "بلاگ Webino-Dev | راهنمای طراحی سایت و توسعه نرم‌افزار";
    return `<!DOCTYPE html>
<!-- Generated by scripts/build-project-pages.mjs from content/blog/*.md. Do not edit by hand. -->
<html lang="fa" dir="rtl">
<head>
    ${pageHead({title, description, path: "/blog/", jsonLd: [{
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${SITE}/blog/#blog`,
        url: `${SITE}/blog/`,
        name: "بلاگ Webino-Dev",
        inLanguage: "fa",
        publisher: {"@id": `${SITE}/#org`},
        blogPost: POSTS.map((post) => ({"@type": "BlogPosting", headline: post.title, url: postUrl(post), datePublished: post.date})),
    }]})}
</head>
<body>
<a class="skip-link" href="#main-content">پرش به محتوای اصلی</a>
${siteHeader(true)}
<section class="page-top">
    <div class="container">
        <span class="eyebrow" style="color:rgba(255,255,255,.65)">بلاگ</span>
        <h1>راهنماهایی برای تبدیل ایده به محصول</h1>
        <p class="page-intro">${escapeHtml(description)}</p>
    </div>
</section>
<main id="main-content" class="section">
    <div class="container">
        <div class="service-grid">
${POSTS.map(postCard).join("\n")}
        </div>
    </div>
</main>
${siteFooter()}
<script type="module" src="/js/labs.js"></script>
</body>
</html>
`;
}

function renderPostPage(post) {
    const url = postUrl(post);
    const others = POSTS.filter((p) => p !== post).slice(0, 2);
    return `<!DOCTYPE html>
<!-- Generated by scripts/build-project-pages.mjs from content/blog/${post.slug}.md. Do not edit by hand. -->
<html lang="fa" dir="rtl">
<head>
    ${pageHead({title: `${post.title} | ${BRAND.name}`, description: post.description, path: `/${postPath(post)}`, type: "article", keywords: post.keywords, jsonLd: [{
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting", "@id": `${url}#post`, headline: post.title, description: post.description,
                datePublished: post.date, dateModified: post.date, inLanguage: "fa", url, mainEntityOfPage: url, image: OG_IMAGE,
                author: {"@type": "Person", "@id": `${SITE}/#person`, name: AUTHOR},
                publisher: {"@id": `${SITE}/#org`},
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {"@type": "ListItem", position: 1, name: BRAND.name, item: `${SITE}/`},
                    {"@type": "ListItem", position: 2, name: "بلاگ", item: `${SITE}/blog/`},
                    {"@type": "ListItem", position: 3, name: post.title, item: url},
                ],
            },
        ],
    }]})}
</head>
<body>
<a class="skip-link" href="#main-content">پرش به محتوای اصلی</a>
${siteHeader(true)}
<section class="page-top">
    <div class="container">
        <span class="eyebrow" style="color:rgba(255,255,255,.65)"><a href="/blog/">بلاگ</a> · <time datetime="${post.date}">${post.dateFa}</time></span>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="page-intro">${escapeHtml(post.description)}</p>
    </div>
</section>
<main class="page-body" id="main-content">
    <article class="prose">
${post.html}
    </article>
    <div class="cta-box">
        <h2>ایده‌ای دارید؟ برایمان بگویید</h2>
        <p>مشاوره و پیشنهاد اولیه رایگان است.</p>
        <div class="hero-actions">
            <a class="pill pill--dark" href="tel:${BRAND.phone}" dir="ltr">${BRAND.phoneDisplay}</a>
            <a class="pill pill--ghost" href="/#contact">فرم درخواست</a>
        </div>
    </div>
</main>
${others.length ? `<nav class="siblings" aria-label="مقاله‌های دیگر">\n${others.map((p) => `    <a href="/${postPath(p)}">${escapeHtml(p.title)}</a>`).join("\n")}\n</nav>` : ""}
${siteFooter()}
<script type="module" src="/js/labs.js"></script>
</body>
</html>
`;
}


function updatePage(file, replacements) {
    let html = readFileSync(file, "utf8");
    for (const [name, content] of Object.entries(replacements)) html = fillMarkers(html, name, content);
    writeFileSync(file, html);
}

function updateSharedPages() {
    const chrome = {"site-header": siteHeader(false), "site-footer": siteFooter()};
    updatePage("index.html", {
        ...chrome,
        "hero-cards": heroCards(),
        "service-cards": SERVICES.map(serviceCard).join("\n"),
        "project-cards": PROJECTS.map(projectCard).join("\n"),
        "process-steps": processSteps(),
        "blog-cards": POSTS.slice(0, 3).map(postCard).join("\n"),
        "faq-list": faqItems(FAQ),
        "faq-jsonld": faqJsonLd(FAQ),
    });
    updatePage("about.html", chrome);
}

function renderServicePage(service) {
    const url = serviceUrl(service);
    const description = summarize(service.description, 160);
    const related = PROJECTS.slice(0, 3);
    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "@id": `${url}#service`,
                name: service.title,
                description: service.description,
                url,
                inLanguage: "fa",
                areaServed: {"@type": "Country", name: "ایران"},
                provider: {"@type": "Organization", "@id": `${SITE}/#org`, name: BRAND.name, url: `${SITE}/`},
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {"@type": "ListItem", position: 1, name: BRAND.name, item: `${SITE}/`},
                    {"@type": "ListItem", position: 2, name: service.title, item: url},
                ],
            },
        ],
    }, null, 2).replace(/</g, "\\u003c");

    return `<!DOCTYPE html>
<!-- Generated by scripts/build-project-pages.mjs from js/services.js. Do not edit by hand. -->
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
    <title>${escapeHtml(service.seoTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}"/>
    <meta name="keywords" content="${escapeHtml(service.tech.join(", "))}, ${BRAND.name}, ${escapeHtml(service.title)}"/>
    <meta name="author" content="${BRAND.name}"/>
    <meta name="robots" content="index, follow, max-image-preview:large"/>
    <meta name="theme-color" content="#0b0b0d"/>
    <link rel="canonical" href="${url}"/>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content="${escapeHtml(service.seoTitle)}"/>
    <meta property="og:description" content="${escapeHtml(description)}"/>
    <meta property="og:image" content="${OG_IMAGE}"/>
    <meta property="og:locale" content="fa_IR"/>
    <meta property="og:site_name" content="${ORG}"/>
    <meta property="og:url" content="${url}"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content="${escapeHtml(service.seoTitle)}"/>
    <meta name="twitter:description" content="${escapeHtml(description)}"/>
    <meta name="twitter:image" content="${OG_IMAGE}"/>
    <link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml"/>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;700&family=Vazirmatn:wght@400;500;700&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="/css/labs.css"/>
    <script>document.documentElement.classList.add("js");</script>
    <script type="application/ld+json">
${jsonLd}
    </script>
    ${faqJsonLd(service.faq)}
</head>
<body>
<a class="skip-link" href="#main-content">پرش به محتوای اصلی</a>
${siteHeader(false)}

<section class="page-top">
    <div class="container">
        <span class="eyebrow" style="color:rgba(255,255,255,.65)">خدمات ${BRAND.name}</span>
        <h1>${escapeHtml(service.title)}</h1>
        <p class="page-intro">${escapeHtml(service.intro)}</p>
        <div class="hero-actions">
            <a class="pill" href="tel:${BRAND.phone}">${PHONE_ICON}تماس برای مشاوره‌ی رایگان</a>
            <a class="pill pill--ghost" href="${waLink(`سلام، درباره‌ی «${service.title}» می‌خواهم مشورت بگیرم.`)}" target="_blank" rel="noopener noreferrer">پیام در واتساپ</a>
        </div>
    </div>
</section>

<main class="page-body" id="main-content">
    <h2>این خدمت برای چه کسانی است؟</h2>
    <ul>
        ${service.for.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n        ")}
    </ul>

    <h2>چه چیزی تحویل می‌گیرید؟</h2>
    <ul>
        ${service.deliver.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n        ")}
    </ul>

    <h2>فناوری‌های مورد استفاده</h2>
    <ul class="tags" dir="ltr" style="list-style:none;padding:0">
        ${service.tech.map((tech) => `<li>${escapeHtml(tech)}</li>`).join("\n        ")}
    </ul>

    <h2>نمونه‌کارهای مرتبط</h2>
    <ul>
        ${related.map((project) => `<li><a href="/${pagePath(project)}">${escapeHtml(project.title)}</a></li>`).join("\n        ")}
    </ul>

    <h2>سؤالات پرتکرار</h2>
    <div class="faq">
${faqItems(service.faq)}
    </div>

    <div class="cta-box">
        <h2>ایده‌ات را برایمان بگو</h2>
        <p>مشاوره و پیشنهاد اولیه رایگان است. زنگ بزنید یا پیام بدهید.</p>
        <div class="hero-actions">
            <a class="pill pill--dark" href="tel:${BRAND.phone}">${PHONE_ICON}<span dir="ltr">${BRAND.phoneDisplay}</span></a>
            <a class="pill pill--ghost" href="/#contact">فرم درخواست</a>
        </div>
    </div>
</main>

${siteFooter()}
<script type="module" src="/js/labs.js"></script>
</body>
</html>
`;
}

function writeSitemap() {
    const today = new Date().toISOString().slice(0, 10);
    const urls = [
        {loc: `${SITE}/`, priority: "1.0"},
        ...SERVICES.map((service) => ({loc: serviceUrl(service), priority: "0.9"})),
        {loc: `${SITE}/about.html`, priority: "0.8"},
        {loc: `${SITE}/blog/`, priority: "0.8"},
        ...POSTS.map((post) => ({loc: postUrl(post), priority: "0.7"})),
        {loc: `${SITE}/resume.html`, priority: "0.6"},
        ...PROJECTS.map((project) => ({loc: pageUrl(project), priority: "0.7"})),
    ];
    const entries = urls.map(({loc, priority}) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
  </url>`).join("\n");
    writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`);
}

mkdirSync("projects", {recursive: true});
mkdirSync("services", {recursive: true});
mkdirSync("blog", {recursive: true});
PROJECTS.forEach((project, index) => writeFileSync(pagePath(project), renderPage(project, index)));
SERVICES.forEach((service) => writeFileSync(servicePath(service), renderServicePage(service)));
writeFileSync("blog/index.html", renderBlogIndex());
POSTS.forEach((post) => writeFileSync(postPath(post), renderPostPage(post)));
updateSharedPages();
writeSitemap();
console.log(`Built ${PROJECTS.length} project pages, ${SERVICES.length} service pages, ${POSTS.length} blog posts, shared page sections and sitemap.xml`);
