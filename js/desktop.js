/* ==========================================================================
   Desktop — Ubuntu/GNOME shell: boot screen, top bar clock, dock,
   draggable windows, document viewer and the terminal
   ========================================================================== */

import {readPortfolio} from "./portfolio-data.js";
import {Terminal} from "./terminal.js";
import {createCommands} from "./terminal-commands.js";

const $ = (selector, root = document) => root.querySelector(selector);
const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
const startedAt = Date.now();

function session(key, value) {
    try {
        if (value === undefined) return window.sessionStorage.getItem(key);
        window.sessionStorage.setItem(key, value);
    } catch {
        return null;
    }
    return null;
}

/* -------------------- Footer year (kept in the source content) -------------------- */
function setFooterYear() {
    const el = $("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
}

/* -------------------- Top bar clock -------------------- */
function initClock(el) {
    const tick = () => {
        const now = new Date();
        const day = now.toLocaleDateString("en-US", {weekday: "short", month: "short", day: "numeric"});
        const time = now.toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"});
        el.textContent = `${day}  ${time}`;
        el.dateTime = now.toISOString();
    };
    tick();
    window.setInterval(tick, 1000);
}

/* -------------------- Toast -------------------- */
let toastTimer;
function toast(message) {
    const el = $("[data-toast]");
    el.textContent = message;
    el.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.classList.remove("is-visible"), 2600);
}

/* -------------------- Window manager -------------------- */
let zIndex = 10;
const windows = new Set();

class AppWindow {
    constructor(el, {dockItem, size, onOpen, onClose}) {
        this.el = el;
        this.dockItem = dockItem;
        this.size = size;
        this.onOpen = onOpen;
        this.onClose = onClose;
        this.state = "closed";
        this.placed = false;
        windows.add(this);

        el.addEventListener("pointerdown", () => this.focus());
        el.querySelectorAll("[data-win-action]").forEach((btn) => {
            btn.addEventListener("click", () => this[btn.dataset.winAction]());
        });
        const handle = $("[data-win-drag]", el);
        handle.addEventListener("pointerdown", (e) => this.startDrag(e, handle));
        handle.addEventListener("dblclick", (e) => {
            if (!e.target.closest("button, a")) this.maximize();
        });
    }

    workArea() {
        const top = $(".topbar").offsetHeight;
        const left = isMobile() ? 0 : $(".dock").offsetWidth;
        return {top, left, width: window.innerWidth - left, height: window.innerHeight - top};
    }

    place() {
        const area = this.workArea();
        const offset = this.size.offset || 0;
        const width = Math.min(this.size.width, area.width - 48 - offset);
        const height = Math.min(this.size.height, area.height - 32 - offset);
        Object.assign(this.el.style, {
            width: `${width}px`,
            height: `${height}px`,
            left: `${area.left + (area.width - width) / 2 + offset / 2}px`,
            top: `${area.top + Math.max((area.height - height) / 2 - 12, 12) + offset / 2}px`,
        });
        this.placed = true;
    }

    clampIntoView() {
        if (this.state === "closed" || isMobile()) return;
        const area = this.workArea();
        const rect = this.el.getBoundingClientRect();
        this.el.style.left = `${Math.min(Math.max(rect.left, area.left - rect.width + 120), window.innerWidth - 120)}px`;
        this.el.style.top = `${Math.min(Math.max(rect.top, area.top), window.innerHeight - 48)}px`;
    }

    animate(keyframes, duration = 240) {
        if (reduceMotion) return Promise.resolve();
        return this.el.animate(keyframes, {duration, easing: "cubic-bezier(.2,.8,.2,1)"}).finished.catch(() => {});
    }

    toDockTransform() {
        const win = this.el.getBoundingClientRect();
        const dock = this.dockItem.getBoundingClientRect();
        const dx = dock.left + dock.width / 2 - (win.left + win.width / 2);
        const dy = dock.top + dock.height / 2 - (win.top + win.height / 2);
        return `translate(${dx}px, ${dy}px) scale(.08)`;
    }

    syncDock() {
        this.dockItem.hidden = false;
        this.dockItem.classList.toggle("is-running", this.state !== "closed");
        if (this.dockItem.classList.contains("dock-item--viewer")) this.dockItem.hidden = this.state === "closed";
    }

    async open() {
        if (this.state === "open") return this.focus();
        if (this.state === "minimized") return this.restore();
        if (!this.placed) this.place();
        this.state = "open";
        this.el.hidden = false;
        this.syncDock();
        this.focus();
        this.onOpen?.();
        await this.animate([{opacity: 0, transform: "scale(.9)"}, {opacity: 1, transform: "none"}], 280);
    }

    async restore() {
        this.state = "open";
        this.el.hidden = false;
        this.syncDock();
        this.focus();
        await this.animate([{opacity: 0, transform: this.toDockTransform()}, {opacity: 1, transform: "none"}], 260);
    }

    async minimize() {
        if (this.state !== "open") return;
        this.state = "minimized";
        this.syncDock();
        await this.animate([{opacity: 1, transform: "none"}, {opacity: 0, transform: this.toDockTransform()}], 260);
        if (this.state === "minimized") this.el.hidden = true;
        this.focusTopmost();
    }

    async close() {
        if (this.state === "closed") return;
        this.state = "closed";
        this.syncDock();
        await this.animate([{opacity: 1, transform: "none"}, {opacity: 0, transform: "scale(.94)"}], 180);
        if (this.state === "closed") {
            this.el.hidden = true;
            this.el.classList.remove("is-max");
            this.onClose?.();
        }
        this.focusTopmost();
    }

    maximize() {
        if (isMobile()) return;
        this.el.classList.add("is-resizing");
        this.el.classList.toggle("is-max");
        window.setTimeout(() => this.el.classList.remove("is-resizing"), 260);
    }

    focus() {
        windows.forEach((w) => w.el.classList.toggle("is-focused", w === this));
        this.el.style.zIndex = String(++zIndex);
        this.el.dispatchEvent(new CustomEvent("window:focus"));
    }

    focusTopmost() {
        const open = [...windows].filter((w) => w.state === "open").sort((a, b) => b.el.style.zIndex - a.el.style.zIndex);
        if (open[0]) open[0].focus();
        else windows.forEach((w) => w.el.classList.remove("is-focused"));
    }

    isFocused() {
        return this.el.classList.contains("is-focused");
    }

    /* Dock click: open, restore, focus or minimize like GNOME. */
    toggleFromDock() {
        if (this.state === "open" && this.isFocused()) this.minimize();
        else this.open();
    }

    startDrag(e, handle) {
        if (e.button !== 0 || e.target.closest("button, a") || isMobile()) return;
        const start = {x: e.clientX, y: e.clientY};
        let rect = this.el.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        let dragging = false;

        const move = (ev) => {
            if (!dragging) {
                if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 4) return;
                dragging = true;
                if (this.el.classList.contains("is-max")) {
                    const ratio = offsetX / rect.width;
                    this.el.classList.remove("is-max");
                    rect = this.el.getBoundingClientRect();
                    offsetX = ratio * rect.width;
                }
                this.el.classList.add("is-dragging");
            }
            const area = this.workArea();
            const left = Math.min(Math.max(ev.clientX - offsetX, area.left - rect.width + 120), window.innerWidth - 120);
            const top = Math.min(Math.max(ev.clientY - offsetY, area.top), window.innerHeight - 48);
            this.el.style.left = `${left}px`;
            this.el.style.top = `${top}px`;
        };
        const end = () => {
            this.el.classList.remove("is-dragging");
            handle.removeEventListener("pointermove", move);
        };
        handle.setPointerCapture(e.pointerId);
        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", end, {once: true});
        handle.addEventListener("pointercancel", end, {once: true});
    }
}

/* -------------------- Document / image viewer -------------------- */
function createViewer(data) {
    const el = $('[data-window="viewer"]');
    const body = $("[data-viewer-body]", el);
    const title = $("[data-viewer-title]", el);
    const download = $("[data-viewer-download]", el);
    const openTab = $("[data-viewer-open]", el);
    const win = new AppWindow(el, {
        dockItem: $('[data-dock="viewer"]'),
        size: {width: 880, height: 1100, offset: 36},
        onClose: () => body.replaceChildren(),
    });

    function show({src, name, kind}) {
        title.textContent = name;
        download.href = src;
        download.setAttribute("download", "");
        openTab.href = src;
        if (kind === "pdf") {
            const frame = document.createElement("iframe");
            frame.className = "viewer-frame";
            frame.title = name;
            frame.src = `${src}#navpanes=0&view=FitH`;
            const fallback = document.createElement("div");
            fallback.className = "viewer-fallback";
            const label = document.createElement("p");
            label.textContent = name;
            const open = Object.assign(document.createElement("a"), {className: "viewer-button", href: src, target: "_blank", rel: "noopener noreferrer", textContent: "Open PDF"});
            const save = Object.assign(document.createElement("a"), {className: "viewer-button viewer-button--ghost", href: src, textContent: data.resume.label});
            save.setAttribute("download", "");
            fallback.append(label, open, save);
            body.replaceChildren(frame, fallback);
        } else {
            const img = Object.assign(document.createElement("img"), {className: "viewer-image", src, alt: name});
            body.replaceChildren(img);
        }
        if (win.state === "open") win.focus();
        else win.open();
    }

    return {
        win,
        openResume: () => show({src: data.resume.href, name: data.resume.fileName, kind: "pdf"}),
        openImage: (src, caption) => show({src, name: caption || src.split("/").pop(), kind: "image"}),
    };
}

/* -------------------- Boot & login -------------------- */
async function runBoot(data) {
    const boot = $("[data-boot]");
    if (reduceMotion || session("ubuntu-booted")) {
        boot.remove();
        return;
    }

    $("[data-login-avatar]").src = data.person.photo;
    $("[data-login-name]").textContent = data.hero.name;

    const skipped = new Promise((resolve) => {
        window.addEventListener("keydown", resolve, {once: true});
        boot.addEventListener("pointerdown", resolve, {once: true});
    });
    const sequence = (async () => {
        await sleep(1100);
        boot.classList.add("is-login");
        await sleep(450);
        const dots = $("[data-login-dots]");
        for (let i = 0; i < 8; i++) {
            dots.textContent += "•";
            await sleep(55);
        }
        $("[data-login-status]").textContent = "Signing in…";
        await sleep(350);
    })();

    await Promise.race([sequence, skipped]);
    boot.classList.add("is-done");
    session("ubuntu-booted", "1");
    await sleep(reduceMotion ? 0 : 450);
    boot.remove();
}

/* -------------------- Bootstrap -------------------- */
document.addEventListener("DOMContentLoaded", async () => {
    setFooterYear();
    const data = readPortfolio();
    initClock($("[data-clock]"));

    const viewer = createViewer(data);
    const termEl = $("[data-terminal]");
    let terminalWin;

    const {commands, aliases} = createCommands(data, {
        openResume: viewer.openResume,
        closeTerminal: () => terminalWin.close(),
        startedAt,
    });
    const terminal = new Terminal(termEl, {commands, aliases});
    const autoFocus = () => {
        if (window.matchMedia("(pointer: fine)").matches) terminal.focus();
    };

    terminalWin = new AppWindow($('[data-window="terminal"]'), {
        dockItem: $('[data-dock="terminal"]'),
        size: {width: 860, height: 540},
        onOpen: () => {
            terminal.reset();
            autoFocus();
            terminal.run("./welcome.sh", {typed: true});
        },
    });
    terminalWin.el.addEventListener("window:focus", autoFocus);

    termEl.addEventListener("click", (e) => {
        const thumb = e.target.closest("[data-image]");
        if (thumb) viewer.openImage(thumb.dataset.image, thumb.dataset.caption);
    });

    /* Dock */
    const unavailable = {files: "Files", firefox: "Firefox", trash: "Trash", apps: "Applications"};
    document.querySelectorAll("[data-dock]").forEach((item) => {
        item.addEventListener("click", () => {
            const app = item.dataset.dock;
            if (app === "terminal") return terminalWin.toggleFromDock();
            if (app === "viewer") return viewer.win.toggleFromDock();
            item.classList.remove("is-bouncing");
            void item.offsetWidth;
            item.classList.add("is-bouncing");
            toast(`${unavailable[app]} isn't available here — try the Terminal.`);
        });
    });
    $("[data-activities]").addEventListener("click", () => terminalWin.open());

    /* Desktop resume icon: double-click (or tap / Enter) opens the PDF viewer */
    const icon = $("[data-desktop-resume]");
    icon.addEventListener("click", () => icon.classList.add("is-selected"));
    icon.addEventListener("dblclick", viewer.openResume);
    icon.addEventListener("pointerup", (e) => {
        if (e.pointerType === "touch") viewer.openResume();
    });
    icon.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            viewer.openResume();
        }
    });
    $(".wallpaper").addEventListener("pointerdown", () => icon.classList.remove("is-selected"));

    window.addEventListener("resize", () => windows.forEach((w) => w.clampIntoView()));

    await runBoot(data);
    const wait = Math.max(2000 - (Date.now() - startedAt), 350);
    await sleep(reduceMotion ? 0 : wait);
    terminalWin.open();
});
