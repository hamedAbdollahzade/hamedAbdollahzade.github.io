/* ==========================================================================
   Projects Module — Data, Rendering, Filtering, Modal
   ========================================================================== */

const PROJECTS = [
  {
    id: 1,
    title: "پنل مدیریت دستگاه‌های ربات مارکت",
    description:
        "داشبورد مدیریت مبتنی بر وب برای دستگاه‌های فروش هوشمند ربات مارکت مبتنی بر ESP32. این پنل به مدیران امکان مدیریت تنظیمات دستگاه، مانیتورینگ وضعیت سیستم، مدیریت قیمت‌ها و موجودی مشتریان و دریافت لاگ‌های لحظه‌ای از طریق WebSocket را می‌دهد.",
    tech: ["JavaScript", "HTML", "CSS", "REST API", "WebSocket", "ESP32"],
    links: [{ label: "مشاهده", url: "https://my-rm.com/" }],
    img: "../assets/images/robot-market.png",
    filter: "html,css,js",
  },
  {
    id: 2,
    title: "لینک CRM / لینک ERP",
    description:
        "اپلیکیشن وب CRM/ERP در مقیاس بزرگ که به عنوان بخشی از یک تیم حرفه‌ای توسعه یافته است. تمرکز بر ساخت کامپوننت‌های قابل استفاده مجدد، فرم‌های پیچیده، داشبوردها و بهبود UI/UX برای گردش‌های کاری کسب‌وکار.",
    tech: ["React", "Ant Design", "Redux Toolkit", "Axios", "JavaScript", "Vite"],
    links: [{ label: "مشاهده", url: "https://linkcrm.app/" }],
    img: "../assets/images/link-Crm-Project.png",
    filter: "react",
  },
  {
    id: 3,
    title: "سیستم مدیریت انبار (استاکیو)",
    description:
        "سیستم مدیریت انبار فول‌استک ساخته شده با Laravel و Vue.js. پیاده‌سازی ردیابی موجودی مبتنی بر رویداد با موجودی اولیه، حرکات ورود/خروج، تعدیل‌ها و محاسبه کاردکس لحظه‌ای.",
    tech: ["Laravel", "MySQL", "REST API", "Vue.js", "Vite", "Tailwind CSS", "Axios"],
    links: [
      { label: "فرانت‌اند", url: "https://github.com/hamedAbdollahzade/warehouse-frontend" },
      { label: "بک‌اند", url: "https://github.com/hamedAbdollahzade/warehouse-backend" },
    ],
    img: "../assets/images/warehouse.webp",
    filter: "fullStack",
  },
  {
    id: 4,
    title: "پنل مدیریت ویکی‌کیو",
    description:
        "همکاری در توسعه پنل مدیریت ویکی‌کیو با تمرکز بر مدیریت محتوای پلتفرم و گردش‌های کاری داخلی با معماری فرانت‌اند تمیز، مدرن و مقیاس‌پذیر.",
    tech: ["React", "Vite", "Tailwind CSS", "Context API"],
    links: [{ label: "مشاهده", url: "https://wikiq.co/" }],
    img: "../assets/images/wiqiQ.png",
    filter: "react",
  },
  {
    id: 5,
    title: "اپلیکیشن پیام‌رسان",
    description:
        "اپلیکیشن پیام‌رسان توسعه یافته به عنوان اولین پروژه عملی برای یادگیری React در طول بوت‌کمپ. تمرکز بر ساخت رابط کاربری مدولار و پاسخگو و یکپارچه‌سازی با API پیام‌رسانی واقعی.",
    tech: ["React", "Vite", "Tailwind CSS", "Farawin API"],
    links: [
      { label: "گیت‌هاب", url: "https://github.com/hamedAbdollahzade/messanger" },
      { label: "مشاهده", url: "https://hamedabdollahzade.github.io/messanger/" },
    ],
    img: "../assets/images/Messenger.png",
    filter: "react",
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
    <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="grad-${color.replace("#", "")}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#09090b" stop-opacity="0.95" />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill="url(#grad-${color.replace("#", "")})" />
      <circle cx="330" cy="40" r="70" fill="#ffffff" opacity="0.06" />
      <circle cx="60" cy="220" r="90" fill="#ffffff" opacity="0.05" />
    </svg>
  `;
}

/**
 * Returns the set of filter keywords a project belongs to.
 * `filter` in the data can be a single value ("react") or a
 * comma-separated list ("html,css,js") meaning the project should
 * appear under any one of those filter buttons.
 */
function getProjectFilters(project) {
  return project.filter.split(",").map((f) => f.trim().toLowerCase());
}

function projectMatchesFilter(project, filterValue) {
  if (!filterValue || filterValue.toLowerCase() === "all") return true;
  return getProjectFilters(project).includes(filterValue.toLowerCase());
}

function renderLinks(project, containerClass = "project-links") {
  return `
    <div class="${containerClass}">
      ${project.links
      .map(
          (link) =>
              `<a href="${link.url}" class="project-link" target="_blank" rel="noopener noreferrer">${link.label}</a>`
      )
      .join("")}
    </div>
  `;
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";
  card.setAttribute("data-tilt", "");
  card.setAttribute("data-category", project.filter);
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `مشاهده جزئیات پروژه ${project.title}`);

  const color = getProjectColor(project);

  card.innerHTML = `
    <div class="project-thumb" style="background: linear-gradient(135deg, ${color}22, #09090b);">
      <img
        src="${project.img}"
        alt="${project.title}"
        loading="lazy"
        onerror="this.replaceWith(Object.assign(document.createElement('div'), { innerHTML: \`${placeholderSVG(
      color
  ).replace(/`/g, "\\`")}\`, className: 'project-thumb-fallback' }).firstElementChild)"
      />
    </div>
    <div class="project-body">
      <h3 class="project-title">${project.title}</h3>
      <p class="project-desc">${project.description}</p>
      <div class="project-tech">
        ${project.tech.map((t) => `<span class="skill-tag">${t}</span>`).join("")}
      </div>
      ${renderLinks(project)}
    </div>
  `;

  const openModal = (e) => {
    // Don't hijack clicks that land directly on a link inside the card.
    if (e.target.closest("a")) return;
    document.dispatchEvent(new CustomEvent("project:open", { detail: project }));
  };

  card.addEventListener("click", openModal);
  card.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && !e.target.closest("a")) {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent("project:open", { detail: project }));
    }
  });

  return card;
}

function renderProjects(grid, filterValue) {
  grid.innerHTML = "";
  const filtered = PROJECTS.filter((p) => projectMatchesFilter(p, filterValue));
  const fragment = document.createDocumentFragment();

  filtered.forEach((project, index) => {
    const card = createProjectCard(project);
    card.setAttribute("data-reveal", "fade");
    card.setAttribute("data-reveal-delay", String(index * 80));
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
  document.dispatchEvent(new CustomEvent("projects:rendered"));
}

function initFilters(grid, filterButtons) {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderProjects(grid, btn.dataset.filter);
    });
  });
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
      linksEl.innerHTML = project.links
          .map(
              (link) =>
                  `<a href="${link.url}" class="btn" target="_blank" rel="noopener noreferrer">${link.label}</a>`
          )
          .join("");
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
  const grid = document.querySelector("[data-projects-grid]");
  const filterButtons = document.querySelectorAll("[data-filter]");
  if (!grid) return;

  renderProjects(grid, "all");
  if (filterButtons.length) initFilters(grid, filterButtons);
  initModal();
}