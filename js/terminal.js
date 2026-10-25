/* ==========================================================================
   Terminal — GNOME Terminal style shell: input, history, completion,
   typewriter output and a command queue
   ========================================================================== */

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

/* requestAnimationFrame with a timer fallback, so output still finishes
   when the browser pauses frames (background or embedded views). */
function nextFrame(callback) {
    let called = false;
    const run = () => {
        if (called) return;
        called = true;
        callback(performance.now());
    };
    window.requestAnimationFrame(run);
    window.setTimeout(run, 60);
}

/** Tiny DOM builder; children may be nodes, strings or (nested) arrays. */
export function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
        if (value == null || value === false) continue;
        if (key === "class") el.className = value;
        else el.setAttribute(key, value === true ? "" : value);
    }
    for (const child of children.flat(Infinity)) {
        if (child == null || child === false) continue;
        el.append(child instanceof Node ? child : String(child));
    }
    return el;
}

export function promptEl() {
    return h("span", {class: "prompt"},
        h("span", {class: "p-user"}, "guest@portfolio"),
        h("span", {class: "p-sep"}, ":"),
        h("span", {class: "p-path"}, "~"),
        h("span", {class: "p-sign"}, "$ "),
    );
}

function commonPrefix(words) {
    return words.reduce((prefix, word) => {
        let i = 0;
        while (i < prefix.length && prefix[i] === word[i]) i++;
        return prefix.slice(0, i);
    });
}

export class Terminal {
    constructor(root, {commands, aliases = {}, context = {}}) {
        this.root = root;
        this.commands = commands;
        this.aliases = aliases;
        this.context = {...context, term: this};
        this.history = [];
        this.historyIndex = 0;
        this.draft = "";
        this.queue = Promise.resolve();
        this.pending = 0;
        this.locked = false;
        this.skipRequested = false;
        this.lastKeyWasTab = false;
        this.instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        this.mount();
    }

    /* -------------------- DOM -------------------- */
    mount() {
        this.before = h("span", {class: "term-before"});
        this.cursor = h("span", {class: "term-cursor"}, " ");
        this.after = h("span", {class: "term-after"});
        this.input = h("input", {
            class: "term-input", type: "text", "aria-label": "Terminal input",
            autocomplete: "off", autocapitalize: "off", autocorrect: "off", spellcheck: "false", enterkeyhint: "send",
        });
        this.output = h("div", {class: "term-output", role: "log"});
        this.inputLine = h("div", {class: "t-line term-input-line"}, promptEl(), this.before, this.cursor, this.after, this.input);
        this.scroller = h("div", {class: "term-scroll"}, this.output, this.inputLine);
        this.root.append(this.scroller);

        this.input.addEventListener("keydown", (e) => this.onKeyDown(e));
        for (const type of ["input", "keyup", "click", "select", "focus", "blur"]) {
            this.input.addEventListener(type, () => this.renderInput());
        }
        this.scroller.addEventListener("scroll", () => {
            const {scrollTop, scrollHeight, clientHeight} = this.scroller;
            this.stick = scrollHeight - scrollTop - clientHeight < 48;
        }, {passive: true});

        this.root.addEventListener("click", (e) => {
            const cmd = e.target.closest("[data-cmd]");
            if (cmd) {
                if (window.matchMedia("(pointer: fine)").matches) this.focus();
                this.run(cmd.dataset.cmd, {typed: true});
                return;
            }
            if (this.pending) this.skipRequested = true;
            if (!e.target.closest("a, button") && !window.getSelection()?.toString()) this.focus();
        });
        this.renderInput();
    }

    focus() {
        this.input.focus({preventScroll: true});
    }

    renderInput() {
        const value = this.input.value;
        const pos = this.input.selectionStart ?? value.length;
        this.before.textContent = value.slice(0, pos);
        this.cursor.textContent = value[pos] || " ";
        this.after.textContent = value.slice(pos + 1);
        this.root.classList.toggle("is-focused", document.activeElement === this.input);
    }

    setInput(value) {
        this.input.value = value;
        this.input.setSelectionRange(value.length, value.length);
        this.renderInput();
    }

    scrollToBottom(smooth = false) {
        this.scroller.scrollTo({top: this.scroller.scrollHeight, behavior: smooth && !this.instant ? "smooth" : "auto"});
    }

    clear() {
        this.output.replaceChildren();
    }

    reset() {
        this.skipRequested = true;
        this.clear();
        this.setInput("");
    }

    /* -------------------- Output -------------------- */
    echo(raw, suffix = "") {
        this.output.append(h("div", {class: "t-line t-echo"}, promptEl(), h("span", {}, raw), suffix && h("span", {class: "c-muted"}, suffix)));
    }

    async print(content) {
        const block = h("div", {class: "t-block"}, content);
        this.output.append(block);
        this.stick = true;
        await this.typewrite(block);
    }

    /* Reveal text node by text node; images and [data-tw-block] appear whole. */
    typewrite(root) {
        if (this.instant || this.skipRequested) {
            this.scrollToBottom();
            return Promise.resolve();
        }

        const units = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.data.trim()) {
                    units.push({node, chars: Array.from(node.data)});
                    node.data = "";
                }
            } else {
                node.style.visibility = "hidden";
                if (node.matches("img, svg, [data-tw-block]")) {
                    units.push({node, block: true});
                    let next = walker.nextSibling();
                    while (!next && walker.parentNode()) next = walker.nextSibling();
                    node = next;
                    continue;
                }
            }
            node = walker.nextNode();
        }

        const reveal = (el) => {
            for (; el && el !== root; el = el.parentElement) el.style.visibility = "";
        };
        const cost = units.reduce((sum, u) => sum + (u.block ? 14 : u.chars.length), 0);
        const rate = cost / Math.min(Math.max(cost * 4, 280), 2200);

        return new Promise((resolve) => {
            let index = 0, offset = 0, budget = 0, last = performance.now();
            const step = (now) => {
                budget = this.skipRequested ? Infinity : budget + (now - last) * rate;
                last = now;
                while (budget > 0 && index < units.length) {
                    const unit = units[index];
                    if (unit.block) {
                        reveal(unit.node);
                        budget -= 14;
                        index++;
                        continue;
                    }
                    if (offset === 0) reveal(unit.node.parentElement);
                    const take = Math.min(unit.chars.length - offset, Math.ceil(budget));
                    offset += take;
                    budget -= take;
                    unit.node.data = unit.chars.slice(0, offset).join("");
                    if (offset >= unit.chars.length) {
                        index++;
                        offset = 0;
                    }
                }
                if (this.stick) this.scrollToBottom();
                if (index < units.length) nextFrame(step);
                else resolve();
            };
            nextFrame(step);
        });
    }

    /* -------------------- Execution -------------------- */
    run(raw, {typed = false} = {}) {
        if (this.pending) this.skipRequested = true;
        this.pending++;
        this.root.classList.add("is-busy");
        this.queue = this.queue
            .then(async () => {
                this.skipRequested = false;
                if (typed) {
                    this.root.classList.remove("is-busy");
                    await this.autoType(raw);
                    this.root.classList.add("is-busy");
                    this.setInput("");
                }
                await this.execute(raw);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.pending--;
                if (!this.pending) {
                    this.root.classList.remove("is-busy");
                    this.skipRequested = false;
                    this.renderInput();
                    this.scrollToBottom(true);
                }
            });
        return this.queue;
    }

    async autoType(text) {
        this.locked = true;
        this.setInput("");
        this.scrollToBottom();
        for (const ch of text) {
            if (this.skipRequested || this.instant) break;
            this.setInput(this.input.value + ch);
            await sleep(45 + Math.random() * 55);
        }
        this.setInput(text);
        if (!this.skipRequested && !this.instant) await sleep(220);
        this.locked = false;
    }

    resolve(name) {
        return this.aliases[name] || name;
    }

    async execute(raw) {
        const line = raw.trim();
        this.echo(raw);
        if (!line) return;
        if (this.history.at(-1) !== line) this.history.push(line);
        this.historyIndex = this.history.length;

        const [first, ...args] = line.split(/\s+/);
        const command = this.commands[this.resolve(first)];
        if (!command) {
            await this.print(this.commands.__notFound.run([first], this.context));
            return;
        }
        const result = await command.run(args, this.context);
        if (result) await this.print(result);
    }

    /* -------------------- Keyboard -------------------- */
    onKeyDown(e) {
        if (this.locked) {
            e.preventDefault();
            this.skipRequested = true;
            return;
        }
        const key = e.key;
        const ctrl = e.ctrlKey || e.metaKey;
        const wasTab = this.lastKeyWasTab;
        this.lastKeyWasTab = key === "Tab";

        if (this.pending && (key === "Enter" || key === "Escape")) {
            e.preventDefault();
            this.skipRequested = true;
            if (key === "Escape") return;
        }

        if (key === "Enter") {
            e.preventDefault();
            const value = this.input.value;
            this.setInput("");
            this.run(value);
        } else if (key === "ArrowUp") {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (key === "ArrowDown") {
            e.preventDefault();
            this.navigateHistory(1);
        } else if (key === "Tab") {
            e.preventDefault();
            this.complete(wasTab);
        } else if (ctrl && key.toLowerCase() === "l") {
            e.preventDefault();
            this.queue = this.queue.then(() => this.clear());
        } else if (ctrl && key.toLowerCase() === "c" && this.input.selectionStart === this.input.selectionEnd) {
            e.preventDefault();
            if (this.pending) return;
            this.echo(this.input.value, "^C");
            this.setInput("");
            this.scrollToBottom();
        } else if (ctrl && key.toLowerCase() === "u") {
            e.preventDefault();
            this.setInput("");
        }
    }

    navigateHistory(direction) {
        if (!this.history.length) return;
        if (this.historyIndex === this.history.length) this.draft = this.input.value;
        this.historyIndex = Math.min(Math.max(this.historyIndex + direction, 0), this.history.length);
        this.setInput(this.historyIndex === this.history.length ? this.draft : this.history[this.historyIndex]);
    }

    complete(listOnAmbiguity) {
        const value = this.input.value;
        const parts = value.split(" ");
        const word = parts.at(-1);
        const candidates = parts.length === 1
            ? Object.entries(this.commands).filter(([name, cmd]) => !cmd.hidden && !name.startsWith("__")).map(([name]) => name)
            : this.commands[this.resolve(parts[0])]?.complete?.(this.context) || [];
        const matches = [...new Set(candidates)].filter((c) => c.startsWith(word)).sort();
        if (!matches.length) return;

        const replaceWord = (next) => this.setInput([...parts.slice(0, -1), next].join(" "));
        if (matches.length === 1) {
            replaceWord(matches[0] + (matches[0].endsWith("/") ? "" : " "));
            return;
        }
        const prefix = commonPrefix(matches);
        if (prefix.length > word.length) {
            replaceWord(prefix);
        } else if (listOnAmbiguity && !this.pending) {
            this.echo(value);
            this.output.append(h("div", {class: "t-block t-columns"}, matches.map((m) => h("span", {}, m))));
            this.scrollToBottom();
        }
    }
}
