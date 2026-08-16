/* ==========================================================================
   Projects Module — Data, Scroll Timeline Rendering, Progress Line, Modal
   ========================================================================== */

const PROJECTS = [
  {
    id: 1,
    title: "پنل مدیریت دستگاه‌های ربات مارکت",
    description:
        "داشبورد مدیریت مبتنی بر وب برای دستگاه‌های فروش هوشمند ربات مارکت مبتنی بر ESP32. این پنل به مدیران امکان مدیریت تنظیمات دستگاه، مانیتورینگ وضعیت سیستم، مدیریت قیمت‌ها و موجودی مشتریان و دریافت لاگ‌های لحظه‌ای از طریق WebSocket را می‌دهد.",
    learned: [
      "ارتباط بلادرنگ با دستگاه‌های سخت‌افزاری از طریق WebSocket",
      "طراحی و پیاده‌سازی REST API برای مدیریت تنظیمات و موجودی",
      "به‌روزرسانی رابط کاربری بر اساس داده‌های زنده، بدون رفرش صفحه",
    ],
    tech: ["JavaScript", "HTML", "CSS", "REST API", "WebSocket", "ESP32"],
    links: [{ label: "مشاهده", url: "https://my-rm.com/" }],
    img: "../assets/images/robot-market.png",
  },
  {
    id: 2,
    title: "لینک CRM / لینک ERP",
    description:
        "اپلیکیشن وب CRM/ERP در مقیاس بزرگ که به عنوان بخشی از یک تیم حرفه‌ای توسعه یافته است. تمرکز بر ساخت کامپوننت‌های قابل استفاده مجدد، فرم‌های پیچیده، داشبوردها و بهبود UI/UX برای گردش‌های کاری کسب‌وکار.",
    learned: [
      "مدیریت state پیچیده در مقیاس بزرگ با Redux Toolkit",
      "ساخت کامپوننت‌های قابل استفاده مجدد و فرم‌های چندمرحله‌ای",
      "همکاری تیمی با استاندارد کدنویسی و ریویو در یک پروژه واقعی",
    ],
    tech: ["React", "Ant Design", "Redux Toolkit", "Axios", "JavaScript", "Vite"],
    links: [{ label: "مشاهده", url: "https://linkcrm.app/" }],
    img: "../assets/images/link-Crm-Project.png",
  },
  {
    id: 3,
    title: "سیستم مدیریت انبار (استاکیو)",
    description:
        "سیستم مدیریت انبار فول‌استک ساخته شده با Laravel و Vue.js. پیاده‌سازی ردیابی موجودی مبتنی بر رویداد با موجودی اولیه، حرکات ورود/خروج، تعدیل‌ها و محاسبه کاردکس لحظه‌ای.",
    learned: [
      "طراحی دیتابیس رابطه‌ای و منطق رویداد-محور برای موجودی",
      "توسعه فول‌استک و ارتباط API بین بک‌اند Laravel و فرانت‌اند Vue",
      "محاسبه گزارش کاردکس و مدیریت تراکنش‌های ورود و خروج انبار",
    ],
    tech: ["Laravel", "MySQL", "REST API", "Vue.js", "Vite", "Tailwind CSS", "Axios"],
    links: [
      { label: "فرانت‌اند", url: "https://github.com/hamedAbdollahzade/warehouse-frontend" },
      { label: "بک‌اند", url: "https://github.com/hamedAbdollahzade/warehouse-backend" },
    ],
    img: "../assets/images/warehouse.webp",
  },
  {
    id: 4,
    title: "پنل مدیریت ویکی‌کیو",
    description:
        "همکاری در توسعه پنل مدیریت ویکی‌کیو با تمرکز بر مدیریت محتوای پلتفرم و گردش‌های کاری داخلی با معماری فرانت‌اند تمیز، مدرن و مقیاس‌پذیر.",
    learned: [
      "معماری فرانت‌اند مقیاس‌پذیر با Vite و Context API",
      "طراحی رابط کاربری تمیز و سریع با Tailwind CSS",
      "هماهنگی با تیم محصول برای مدیریت گردش‌های کاری داخلی",
    ],
    tech: ["React", "Vite", "Tailwind CSS", "Context API"],
    links: [{ label: "مشاهده", url: "https://wikiq.co/" }],
    img: "../assets/images/wiqiQ.png",
  },
  {
    id: 5,
    title: "اپلیکیشن پیام‌رسان",
    description:
        "اپلیکیشن پیام‌رسان توسعه یافته به عنوان اولین پروژه عملی برای یادگیری React در طول بوت‌کمپ. تمرکز بر ساخت رابط کاربری مدولار و پاسخگو و یکپارچه‌سازی با API پیام‌رسانی واقعی.",
    learned: [
      "اولین تجربه یکپارچه‌سازی با یک API واقعی پیام‌رسانی",
      "یادگیری اصول React از پایه در قالب یک پروژه عملی",
      "ساخت رابط کاربری واکنش‌گرا (Responsive) برای موبایل و دسکتاپ",
    ],
    tech: ["React", "Vite", "Tailwind CSS", "Farawin API"],
    links: [
      { label: "گیت‌هاب", url: "https://github.com/hamedAbdollahzade/messanger" },
      { label: "مشاهده", url: "https://hamedabdollahzade.github.io/messanger/" },
    ],
    img: "../assets/images/Messenger.png",
  },
];

/* Colors used as a fallback gradient behind the thumbnail while the image
   loads, and as a placeholder if the image fails to load. */
const FALLBACK_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#ef4444"];

function getProjectColor(project) {
  return FALLBACK_COLORS[(project.id - 1) % FALLBACK_COLORS.length];
}

function placeholderSVG(color) {
  return `
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="grad-${color.replace("#", "")}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#09090b" stop-opacity="0.95" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad-${color.replace("#", "")})" />
      <circle cx="330" cy="40" r="90" fill="#ffffff" opacity="0.06" />
      <circle cx="60" cy="340" r="110" fill="#ffffff" opacity="0.05" />
    </svg>
  `;
}

function renderLinks(project, btnClass = "btn btn-ghost btn-sm") {
  return project.links
      .map(
          (link) =>
              `<a href="${link.url}" class="${btnClass}" target="_blank" rel="noopener noreferrer">${link.label}</a>`
      )
      .join("");
}

function toPersianDigits(str) {
  const fa = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(str).replace(/\d/g, (d) => fa[Number(d)]);
}

function createTimelineItem(project, index) {
  const item = document.createElement("article");
  item.className = "pt-item";
  item.setAttribute("data-pt-item", "");

  const color = getProjectColor(project);
  const indexLabel = toPersianDigits(String(index + 1).padStart(2, "0"));

  item.innerHTML = `
    <div class="pt-col pt-col--desc" data-reveal="slide-right">
      <span class="pt-index">${indexLabel}</span>
      <h3 class="pt-title">${project.title}</h3>
      <p class="pt-desc">${project.description}</p>
      <div class="project-tech">
        ${project.tech.map((t) => `<span class="skill-tag">${t}</span>`).join("")}
      </div>
    </div>

    <div class="pt-media" data-reveal="scale">
      <div class="pt-media-inner" style="background: linear-gradient(135deg, ${color}66, #09090b);" tabindex="0" role="button" aria-label="مشاهده جزئیات پروژه ${project.title}">
        <img
          src="${project.img}"
          alt="${project.title}"
          loading="lazy"
          onerror="this.replaceWith(Object.assign(document.createElement('div'), { innerHTML: \`${placeholderSVG(
      color
  ).replace(/`/g, "\\`")}\`, className: 'pt-media-fallback' }).firstElementChild)"
        />
      </div>
    </div>

    <div class="pt-col pt-col--learned" data-reveal="slide-left">
      <h4 class="pt-learned-title">چیزهایی که یاد گرفتم</h4>
      <ul class="pt-learned-list">
        ${project.learned.map((l) => `<li>${l}</li>`).join("")}
      </ul>
      <div class="project-links">${renderLinks(project)}</div>
    </div>
  `;

  const openModal = (e) => {
    if (e.target.closest("a")) return;
    document.dispatchEvent(new CustomEvent("project:open", { detail: project }));
  };

  const media = item.querySelector(".pt-media-inner");
  media.addEventListener("click", openModal);
  media.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent("project:open", { detail: project }));
    }
  });

  return item;
}

function renderTimeline(container) {
  const track = container.querySelector(".proj-timeline-track");
  const fragment = document.createDocumentFragment();

  PROJECTS.forEach((project, index) => {
    fragment.appendChild(createTimelineItem(project, index));
  });

  container.appendChild(fragment);
  // Keep the progress track as the very first child so items render on top of it.
  if (track) container.prepend(track);

  document.dispatchEvent(new CustomEvent("projects:rendered"));
}

/* -------------------- Scroll-driven progress line -------------------- */
function initTimelineProgress(container) {
  const progress = container.querySelector("[data-timeline-progress]");
  if (!progress) return;

  let ticking = false;

  function update() {
    ticking = false;
    const rect = container.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const triggerLine = viewportH * 0.78;

    const raw = rect.height > 0 ? (triggerLine - rect.top) / rect.height : 0;
    const clamped = Math.min(Math.max(raw, 0), 1);
    progress.style.transform = `scaleY(${clamped})`;

    container.querySelectorAll("[data-pt-item]").forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const isActive = itemRect.top <= triggerLine;
      item.classList.toggle("is-active", isActive);
    });
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

function initModal() {
  const overlay = document.querySelector("[data-project-modal]");
  if (!overlay) return;

  const closeBtn = overlay.querySelector("[data-modal-close]");
  const titleEl = overlay.querySelector("[data-modal-title]");
  const descEl = overlay.querySelector("[data-modal-desc]");
  const thumbEl = overlay.querySelector("[data-modal-thumb]");
  const techEl = overlay.querySelector("[data-modal-tech]");
  const linksEl = overlay.querySelector("[data-modal-links]");

  let lastFocused = null;

  function openModal(project) {
    lastFocused = document.activeElement;
    titleEl.textContent = project.title;
    descEl.textContent = project.description;

    const color = getProjectColor(project);
    thumbEl.innerHTML = `<img src="${project.img}" alt="${project.title}" onerror="this.outerHTML = \`${placeholderSVG(
        color
    ).replace(/`/g, "\\`")}\`" />`;

    techEl.innerHTML = project.tech.map((t) => `<span class="skill-tag">${t}</span>`).join("");

    if (linksEl) {
      linksEl.innerHTML = renderLinks(project, "btn btn-primary");
    }

    overlay.classList.add("is-open");
    overlay.removeAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.addEventListener("project:open", (e) => openModal(e.detail));
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) closeModal();
  });
}

export function initProjects() {
  const container = document.querySelector("[data-projects-timeline]");
  if (!container) return;

  renderTimeline(container);
  initTimelineProgress(container);
  initModal();
}
