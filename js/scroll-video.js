/* Scrub a muted, paused video with native page scrolling. No autoplay or scroll hijacking. */
export function initScrollVideo() {
    const video = document.querySelector("[data-scroll-video]");
    const stage = document.querySelector("[data-scroll-video-stage]");
    const toggle = document.querySelector("[data-video-motion]");
    const source = video?.dataset.videoSrc?.trim();
    if (!video || !stage || !source) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection;
    let paused = reducedMotion.matches || Boolean(connection?.saveData);
    let loaded = false;
    let failed = false;
    let ready = false;
    let frame = 0;
    let targetTime = 0;

    function syncToggle() {
        if (!toggle) return;
        toggle.hidden = failed;
        toggle.setAttribute("aria-pressed", String(paused));
        toggle.textContent = paused ? "فعال‌کردن حرکت پس‌زمینه" : "توقف حرکت پس‌زمینه";
    }

    function seek() {
        frame = 0;
        if (paused || failed || !ready || document.hidden || video.seeking) return;
        if (Math.abs(video.currentTime - targetTime) < 1 / 60) return;
        try {
            video.currentTime = targetTime;
        } catch {
            // Some browsers cannot seek until enough media data is available.
            // loadeddata/canplay will schedule another attempt.
        }
    }

    function schedule() {
        if (paused || failed || document.hidden) return;
        const range = document.documentElement.scrollHeight - window.innerHeight;
        const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
        // Avoid seeking past the final decodable frame.
        const end = Number.isFinite(video.duration) ? Math.max(0, video.duration - 1 / 30) : 0;
        targetTime = progress * end;
        if (!frame) frame = window.requestAnimationFrame(seek);
    }

    function load() {
        if (loaded || paused || failed) return;
        loaded = true;
        video.muted = true;
        video.preload = "auto";
        video.src = source;
        video.load();
    }

    function setPaused(value) {
        paused = value;
        if (paused && frame) {
            window.cancelAnimationFrame(frame);
            frame = 0;
        }
        video.pause();
        syncToggle();
        load();
        schedule();
    }

    video.addEventListener("loadedmetadata", schedule);
    video.addEventListener("loadeddata", () => {
        ready = Number.isFinite(video.duration) && video.duration > 0;
        if (ready) stage.classList.add("is-ready");
        schedule();
    });
    video.addEventListener("canplay", schedule);
    // Serialize seeks, then catch up to the most recent scroll position.
    video.addEventListener("seeked", schedule);
    video.addEventListener("error", () => {
        failed = true;
        stage.classList.remove("is-ready");
        setPaused(true);
    });
    toggle?.addEventListener("click", () => setPaused(!paused));
    reducedMotion.addEventListener("change", () => setPaused(reducedMotion.matches || Boolean(connection?.saveData)));
    connection?.addEventListener?.("change", () => setPaused(reducedMotion.matches || Boolean(connection.saveData)));
    window.addEventListener("scroll", schedule, {passive: true});
    window.addEventListener("resize", schedule, {passive: true});
    window.addEventListener("pageshow", schedule);
    document.addEventListener("visibilitychange", schedule);
    if ("ResizeObserver" in window) {
        new ResizeObserver(schedule).observe(document.body);
    }
    syncToggle();
    load();
}
