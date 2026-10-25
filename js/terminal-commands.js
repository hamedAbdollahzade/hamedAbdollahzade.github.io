/* ==========================================================================
   Terminal Commands — Every section is rendered from the portfolio data
   ========================================================================== */

import {h} from "./terminal.js";
import {asciiRows} from "./ascii.js";

export const MENU = ["resume", "skills", "projects", "experience", "about", "contact", "help"];

/* -------------------- Output helpers -------------------- */
const line = (...children) => h("div", {class: "t-line", dir: "auto"}, ...children);
const gap = () => h("div", {class: "t-gap"});
const c = (cls, ...children) => h("span", {class: cls}, ...children);
const para = (text) => h("p", {class: "t-para", dir: "auto"}, text);
const cmd = (command, label = command) => h("button", {class: "t-cmd", type: "button", "data-cmd": command}, label);
const tags = (list) => h("div", {class: "t-tags"}, list.map((tag) => c("t-tag", tag)));
const prettyHref = (href) => href.replace(/^(mailto:|tel:|https?:\/\/(www\.)?)/, "").replace(/\/$/, "");

function link({label, href, external}, text = label) {
    const isWeb = /^https?:/.test(href);
    return h("a", {
        class: "t-link", href, dir: "auto",
        target: external || isWeb ? "_blank" : null,
        rel: external || isWeb ? "noopener noreferrer" : null,
    }, text);
}

function heading({eyebrow, title, desc}) {
    return [
        line(c("c-yellow c-bold", `── ${eyebrow} ──`)),
        title && line(c("c-bold", title)),
        desc && para(desc),
        gap(),
    ];
}

function timeline(entries) {
    return entries.map((entry) => h("div", {class: "t-entry"},
        line(c("c-yellow", entry.period)),
        line(c("c-green c-bold", entry.role), c("c-muted", "  @  "), c("c-cyan", entry.org)),
        para(entry.text),
        tags(entry.tags),
    ));
}

function socialLinks(links) {
    return h("div", {class: "t-grid"}, links.map((item) => [
        c("c-magenta c-bold", item.label),
        h("span", {}, link(item, prettyHref(item.href))),
    ]));
}

function menu() {
    return line(MENU.map((name, i) => [
        i ? c("c-muted", " | ") : "",
        h("button", {class: "t-cmd t-menu", type: "button", "data-cmd": name}, c("c-yellow", `[${i + 1}]`), " ", name),
    ]));
}

function formatDate(date) {
    const part = (options) => date.toLocaleString("en-US", options);
    const pad = (n) => String(n).padStart(2, "0");
    const zone = new Intl.DateTimeFormat("en-US", {timeZoneName: "short"}).formatToParts(date)
        .find((p) => p.type === "timeZoneName")?.value || "";
    return `${part({weekday: "short"})} ${part({month: "short"})} ${String(date.getDate()).padStart(2, " ")} `
        + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${zone} ${date.getFullYear()}`;
}

function formatUptime(ms) {
    const minutes = Math.floor(ms / 60000);
    if (minutes < 1) return `${Math.floor(ms / 1000)} secs`;
    return minutes === 1 ? "1 min" : `${minutes} mins`;
}

/* -------------------- Commands -------------------- */
export function createCommands(data, {openResume, closeTerminal, startedAt}) {
    const projects = data.projects.items;
    const files = {
        "about.txt": "about",
        "skills.txt": "skills",
        "experience.txt": "experience",
        "education.txt": "education",
        "contact.txt": "contact",
    };
    const projectFiles = projects.map((p, i) => `${i + 1}.md`);
    const skillCount = data.skills.groups.reduce((sum, g) => sum + g.tags.length, 0);

    function projectDetail(project, index) {
        const images = project.images || [{src: project.img, caption: project.title}];
        return [
            line(c("c-yellow c-bold", `[${String(index + 1).padStart(2, "0")}] `), c("c-bold", project.title)),
            gap(),
            para(project.description),
            h("div", {class: "t-gallery"}, images.map((image) =>
                h("figure", {},
                    h("button", {class: "t-thumb", type: "button", "data-image": image.src, "data-caption": image.caption, "aria-label": image.caption},
                        h("img", {src: image.src, alt: image.caption, decoding: "async"})),
                    h("figcaption", {dir: "auto"}, image.caption)),
            )),
            project.story && [
                gap(),
                project.story.map((chapter, i) => h("div", {class: "t-entry"},
                    line(c("c-cyan c-bold", `${i + 1}. ${chapter.title}`)),
                    para(chapter.text),
                )),
            ],
            gap(),
            line(c("c-yellow", "What I did:")),
            project.learned.map((item) => line(c("c-green", "  • "), item)),
            gap(),
            tags(project.tech),
            line(project.links.map((l, i) => [i ? c("c-muted", "  ·  ") : "", link({...l, external: true}, `↗ ${l.label}`)])),
        ];
    }

    function showProject(arg) {
        const index = Number(String(arg).replace(/^projects\//, "").replace(/\.md$/, "")) - 1;
        const project = projects[index];
        if (!project) return line(c("c-red", `projects: ${arg}: no such project (1-${projects.length})`));
        return projectDetail(project, index);
    }

    const commands = {
        help: {
            desc: "Show this help message",
            run: () => [
                line(c("c-yellow c-bold", "Available commands")),
                gap(),
                h("div", {class: "t-grid"}, Object.entries(commands)
                    .filter(([name, command]) => !command.hidden && !name.startsWith("__"))
                    .map(([name, command]) => [cmd(name), c("c-muted", command.desc)])),
                gap(),
                line(c("c-yellow c-bold", "Shortcuts")),
                h("div", {class: "t-grid"},
                    c("c-cyan", "↑ / ↓"), c("c-muted", "Browse command history"),
                    c("c-cyan", "Tab"), c("c-muted", "Autocomplete commands and files"),
                    c("c-cyan", "Ctrl+L"), c("c-muted", "Clear the screen"),
                    c("c-cyan", "Ctrl+C"), c("c-muted", "Cancel the current line"),
                    c("c-cyan", "1 – 7"), c("c-muted", "Shortcuts for the welcome menu"),
                ),
            ],
        },

        about: {
            desc: "Who I am",
            run: () => [
                heading(data.about),
                data.about.paragraphs.map(para),
                gap(),
                h("div", {class: "t-grid"}, data.about.stats.map((s) => [c("c-green c-bold", s.value), h("span", {dir: "auto"}, s.label)])),
            ],
        },

        skills: {
            desc: "Technologies and tools I work with",
            run: () => [
                heading(data.skills),
                data.skills.groups.map((group) => h("div", {class: "t-entry"},
                    line(c("c-cyan c-bold", `▸ ${group.title}`)),
                    tags(group.tags),
                )),
                line(c("c-muted", `${skillCount} skills in ${data.skills.groups.length} groups`)),
            ],
        },

        projects: {
            desc: "Selected projects (projects <n> for details)",
            complete: () => projects.map((p, i) => String(i + 1)),
            run: ([arg]) => arg ? showProject(arg) : [
                heading(data.projects),
                projects.map((project, i) => h("div", {class: "t-entry"},
                    line(c("c-yellow c-bold", `[${String(i + 1).padStart(2, "0")}] `), c("c-bold", project.title)),
                    tags(project.tech),
                    line(
                        project.links.map((l) => [link({...l, external: true}, `↗ ${l.label}`), c("c-muted", "  ·  ")]),
                        cmd(`projects ${i + 1}`, "details →"),
                    ),
                )),
                line(c("c-muted", "Run "), cmd("projects 1", "projects <n>"), c("c-muted", " to read the full story.")),
            ],
        },

        experience: {
            desc: "Work experience",
            run: () => [
                heading({...data.experience, desc: ""}),
                timeline(data.experience.work),
                line(c("c-muted", "See also: "), cmd("education")),
            ],
        },

        education: {
            desc: "Education and learning path",
            run: () => [
                heading({eyebrow: data.experience.eyebrow, title: data.experience.title}),
                timeline(data.experience.education),
            ],
        },

        contact: {
            desc: "How to reach me",
            run: () => [
                heading(data.contact),
                h("div", {class: "t-grid"}, data.contact.cards.map((card) => [
                    c("c-yellow", card.label),
                    card.href ? h("span", {}, link({label: card.value, href: card.href})) : h("span", {dir: "auto"}, card.value),
                ])),
                gap(),
                socialLinks(data.contact.socials),
                gap(),
                line(c("c-muted", data.footer.copy)),
            ],
        },

        resume: {
            desc: "Open my resume (PDF)",
            run: () => {
                openResume();
                return [
                    line(c("c-green", "✔ "), `Opening ${data.resume.fileName} in Document Viewer…`),
                    line(c("c-muted", "  ↓ "), h("a", {class: "t-link", href: data.resume.href, download: true, dir: "auto"}, data.resume.label)),
                ];
            },
        },

        whoami: {
            desc: "Print the current user",
            run: () => [
                line(c("c-green c-bold", "guest")),
                gap(),
                line(c("c-muted", "You are browsing the portfolio of")),
                line(c("c-bold", data.hero.name), c("c-muted", " — "), c("c-cyan", data.hero.role)),
                para(data.hero.subtitle),
                line(c("c-green", "● "), data.hero.badge),
                gap(),
                socialLinks(data.hero.socials),
            ],
        },

        neofetch: {
            desc: "Show system information",
            run: () => {
                const row = (key, value) => line(c("c-orange c-bold", `${key}: `), h("span", {dir: "auto"}, value));
                const place = [data.person.locality, data.person.country].filter(Boolean).join(", ");
                return h("div", {class: "t-neofetch"},
                    h("img", {class: "t-neofetch-photo", src: data.person.photo, alt: data.hero.name}),
                    h("div", {},
                        line(c("c-green c-bold", "guest"), "@", c("c-blue c-bold", "portfolio")),
                        line(c("c-muted", "─".repeat(15))),
                        row("OS", "Ubuntu 24.04 LTS x86_64"),
                        row("Host", data.hero.name),
                        row("Role", data.person.jobTitle || data.hero.role),
                        row("Uptime", formatUptime(Date.now() - startedAt)),
                        row("Shell", "bash 5.2.21"),
                        row("DE", "GNOME 46"),
                        row("Terminal", "gnome-terminal"),
                        place && row("Location", place),
                        row("Stack", data.person.knowsAbout.join(", ")),
                        row("Skills", `${skillCount} (${data.skills.groups.length} groups)`),
                        row("Projects", String(projects.length)),
                        row("Resolution", `${window.screen.width}x${window.screen.height}`),
                        h("div", {class: "t-palette", "aria-hidden": "true", "data-tw-block": true},Array.from({length: 8}, (_, i) => h("span", {class: `t-swatch t-swatch--${i}`}))),
                    ),
                );
            },
        },

        ls: {
            desc: "List directory contents",
            complete: () => ["projects/"],
            run: ([dir]) => {
                if (dir && dir.replace(/\/$/, "") === "projects") {
                    return h("div", {class: "t-grid"}, projects.map((p, i) => [cmd(`cat projects/${projectFiles[i]}`, projectFiles[i]), h("span", {class: "c-muted", dir: "auto"}, p.title)]));
                }
                if (dir && !["~", ".", "./"].includes(dir)) return line(`ls: cannot access '${dir}': No such file or directory`);
                return h("div", {class: "t-columns"},
                    Object.keys(files).map((file) => cmd(`cat ${file}`, file)),
                    cmd("ls projects", h("span", {class: "c-blue c-bold"}, "projects/")),
                    cmd("resume", h("span", {class: "c-magenta"}, data.resume.fileName)),
                    cmd("./welcome.sh", h("span", {class: "c-green c-bold"}, "welcome.sh")),
                );
            },
        },

        cat: {
            desc: "Print file contents (cat <file>)",
            complete: () => [...Object.keys(files), "projects/", ...projectFiles.map((f) => `projects/${f}`), data.resume.fileName, "welcome.sh"],
            run: async ([file], ctx) => {
                if (!file) return line("cat: missing file operand. Try 'ls'.");
                const name = file.replace(/^\.\//, "");
                if (files[name]) return commands[files[name]].run([], ctx);
                if (/^projects\/\d+\.md$/.test(name)) return showProject(name);
                if (name.replace(/\/$/, "") === "projects") return line(`cat: ${file}: Is a directory`);
                if (name === data.resume.fileName) return commands.resume.run([], ctx);
                if (name === "welcome.sh") {
                    return h("div", {class: "c-muted"},
                        line("#!/usr/bin/env bash"),
                        line(`figlet "${data.person.latinName}"`),
                        line('echo "What would you like to explore?"'),
                    );
                }
                return line(`cat: ${file}: No such file or directory`);
            },
        },

        date: {
            desc: "Print the system date and time",
            run: () => line(formatDate(new Date())),
        },

        history: {
            desc: "Show command history",
            run: (args, {term}) => term.history.map((entry, i) => line(c("c-muted", `${String(i + 1).padStart(5, " ")}  `), entry)),
        },

        clear: {
            desc: "Clear the terminal screen",
            run: (args, {term}) => {
                term.clear();
                return null;
            },
        },

        sudo: {
            desc: "Execute a command as another user",
            run: (args) => args.length
                ? [
                    line("[sudo] password for guest: ", c("c-muted", "********")),
                    line(c("c-red", "guest is not in the sudoers file. This incident will be reported.")),
                ]
                : line("usage: sudo command"),
        },

        "./welcome.sh": {
            hidden: true,
            run: () => [
                h("div", {class: "t-ascii", "aria-label": data.person.latinName, role: "img"},
                    data.person.latinName.split(" ").map((word) => [
                        asciiRows(word).map((row) => h("div", {"data-tw-block": true, "aria-hidden": "true"}, row)),
                    ]),
                ),
                gap(),
                line(c("c-bold", data.hero.name), c("c-muted", " — "), c("c-cyan", data.hero.role)),
                para(data.hero.subtitle),
                line(c("c-green", "● "), data.hero.badge),
                gap(),
                line(c("c-yellow c-bold", "What would you like to explore?")),
                menu(),
                gap(),
                line(c("c-muted", "Click an option or type a command. ↑/↓ history · Tab autocomplete · 'help' for more.")),
            ],
        },

        echo: {hidden: true, run: (args) => line(args.join(" "))},
        pwd: {hidden: true, run: () => line("/home/guest")},
        cd: {
            hidden: true,
            run: ([dir]) => (!dir || dir === "~" ? null : line(`bash: cd: ${dir}: Permission denied — try `, cmd(`ls ${dir}`))),
        },
        exit: {
            hidden: true,
            run: () => {
                closeTerminal();
                return null;
            },
        },
        project: {hidden: true, run: (args, ctx) => commands.projects.run(args, ctx), complete: () => commands.projects.complete()},

        __notFound: {
            run: ([name]) => [
                line(`bash: ${name}: command not found`),
                line(c("c-muted", "Type '"), cmd("help"), c("c-muted", "' to see available commands.")),
            ],
        },
    };

    const aliases = {welcome: "./welcome.sh", "welcome.sh": "./welcome.sh"};
    MENU.forEach((name, i) => (aliases[String(i + 1)] = name));

    return {commands, aliases};
}
