/* About page data: skills and experience. Edit here. */

export interface SkillGroup { title: string; icon: string; tags: string[] }
export interface TimelineEntry { kind: "work" | "education"; period: string; role: string; org: string; text: string; tags: string[] }

export const SKILLS: SkillGroup[] = [
  {
    "title": "مبانی وب",
    "icon": "<circle cx=\"12\" cy=\"12\" r=\"9\"/> <path d=\"M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18\"/>",
    "tags": [
      "Internet",
      "HTTP / HTTPS",
      "DNS",
      "Hosting",
      "Domain",
      "Browser Rendering"
    ]
  },
  {
    "title": "Front-End Development",
    "icon": "<path d=\"m18 16 4-4-4-4\"/> <path d=\"m6 8-4 4 4 4\"/> <path d=\"M14.5 4 9.5 20\"/>",
    "tags": [
      "HTML5",
      "Semantic HTML",
      "CSS3",
      "Flexbox",
      "CSS Grid",
      "Responsive Design",
      "JavaScript (ES6+)",
      "TypeScript"
    ]
  },
  {
    "title": "React Ecosystem",
    "icon": "<circle cx=\"12\" cy=\"12\" r=\"2\"/> <ellipse cx=\"12\" cy=\"12\" rx=\"10\" ry=\"4\"/> <ellipse cx=\"12\" cy=\"12\" rx=\"10\" ry=\"4\" transform=\"rotate(60 12 12)\"/> <ellipse cx=\"12\" cy=\"12\" rx=\"10\" ry=\"4\" transform=\"rotate(-60 12 12)\"/>",
    "tags": [
      "React 18",
      "Hooks",
      "Redux Toolkit",
      "React Router",
      "Reusable Components",
      "React Hook Form",
      "Performance Optimization",
      "Lazy Loading",
      "Zustand"
    ]
  },
  {
    "title": "Next.js",
    "icon": "<circle cx=\"12\" cy=\"12\" r=\"9\"/> <path d=\"M9 16V8l7 8V8\"/>",
    "tags": [
      "App Router",
      "File Routing",
      "Server Components",
      "Client Components",
      "SSR",
      "SSG",
      "SEO",
      "Metadata API"
    ]
  },
  {
    "title": "UI & Styling",
    "icon": "<path d=\"M12 2L2 7l10 5 10-5-10-5z\"/> <path d=\"m2 17 10 5 10-5\"/> <path d=\"m2 12 10 5 10-5\"/>",
    "tags": [
      "Tailwind CSS",
      "Ant Design",
      "Material UI",
      "Bootstrap",
      "Sass",
      "Design System",
      "Theming",
      "Adaptive Layout",
      "GSAP",
      "Framer Motion"
    ]
  },
  {
    "title": "Testing",
    "icon": "<path d=\"M9 11l3 3L22 4\"/> <path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"/>",
    "tags": [
      "Vitest",
      "Jest",
      "React Testing Library",
      "Cypress",
      "Unit Testing",
      "Integration Testing",
      "E2E Testing",
      "API Mocking"
    ]
  },
  {
    "title": "Tools & Infrastructure",
    "icon": "<path d=\"M20 7 9 18l-5-5\"/>",
    "tags": [
      "Git",
      "GitHub",
      "Vite",
      "REST API",
      "Axios",
      "WebSocket",
      "PWA",
      "Responsive Web Apps",
      "npm",
      "ESLint",
      "Prettier",
      "Figma",
      "GitHub Pages"
    ]
  },
  {
    "title": "Web Security & Auth",
    "icon": "<path d=\"M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z\"/>",
    "tags": [
      "HTTPS",
      "CORS",
      "CSP",
      "OWASP",
      "JWT",
      "OAuth",
      "Session / Token Handling"
    ]
  },
  {
    "title": "Accessibility & Performance",
    "icon": "<circle cx=\"12\" cy=\"12\" r=\"9\"/> <path d=\"M12 7v5l3 3\"/>",
    "tags": [
      "Accessibility (a11y)",
      "ARIA",
      "Keyboard Navigation",
      "Lighthouse",
      "Chrome DevTools",
      "Core Web Vitals"
    ]
  },
  {
    "title": "AI-Assisted Development",
    "icon": "<path d=\"M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2\"/>",
    "tags": [
      "Claude Code",
      "GitHub Copilot",
      "Cursor",
      "Prompt Engineering"
    ]
  }
];

export const TIMELINE: TimelineEntry[] = [
  {
    "kind": "work",
    "period": "خرداد ۱۴۰۵ — اکنون",
    "role": "Frontend Developer",
    "org": "Robot Market • Mashhad, Iran",
    "text": "در ربات مارکت روی چند بخش از محصولات وندینگ به‌عنوان توسعه‌دهنده فرانت‌اند کار می‌کنم: PWA برای اتصال خودکار به دستگاه‌های آفلاین و پنل آنلاین، برنامه React روی ESP32 برای مدیریت قیمت‌گذاری، کاربران و کیف پول، رابط آفلاین نسل جدید دستگاه‌ها روی Orange Pi و توسعه سایت اصلی با Next.js.",
    "tags": [
      "JavaScript",
      "HTML5",
      "CSS3",
      "REST API",
      "WebSocket",
      "ESP32",
      "Embedded UI"
    ]
  },
  {
    "kind": "work",
    "period": "دی ۱۴۰۳ — فروردین ۱۴۰۵",
    "role": "Frontend Developer",
    "org": "Kando • Link CRM / Link ERP",
    "text": "توسعه و نگهداری یک پلتفرم سازمانی CRM/ERP در مقیاس بزرگ با React. طراحی کامپوننت‌های قابل استفاده مجدد، بهبود UI/UX، یکپارچه‌سازی REST API، مدیریت State با Redux Toolkit، همکاری نزدیک با تیم‌های Backend و Product و تمرکز بر Performance، Scalability و Maintainability.",
    "tags": [
      "React",
      "Redux Toolkit",
      "Ant Design",
      "Axios",
      "REST API",
      "Vite"
    ]
  },
  {
    "kind": "work",
    "period": "۱۴۰۳",
    "role": "Frontend Developer",
    "org": "WikiQ Startup",
    "text": "توسعه کامپوننت‌های رابط کاربری، رفع باگ‌ها، یکپارچه‌سازی Frontend با Backend API، همکاری تیمی مبتنی بر Git و آشنایی با فرآیند توسعه Agile.",
    "tags": [
      "React",
      "JavaScript",
      "Git",
      "REST API",
      "HTML",
      "CSS"
    ]
  },
  {
    "kind": "work",
    "period": "دی ۱۴۰۱ — دی ۱۴۰۲",
    "role": "کارآموز برنامه‌نویس فرانت‌اند",
    "org": "فراوین • دوره یک‌ساله آموزش و کارورزی",
    "text": "گذراندن دوره یک‌ساله آموزش و کارورزی توسعه Front-End و ساخت پروژه‌های عملی شامل داشبوردهای مدیریتی و رابط‌های وب مدرن با React.",
    "tags": [
      "React",
      "JavaScript",
      "Tailwind CSS",
      "Node.js"
    ]
  },
  {
    "kind": "education",
    "period": "۱۳۹۲ — ۱۳۹۶",
    "role": "کارشناسی علوم کامپیوتر",
    "org": "دانشگاه صنعتی بیرجند",
    "text": "مطالعه مباحث پایه علوم کامپیوتر شامل الگوریتم‌ها، ساختمان داده، مبانی برنامه‌نویسی، پایگاه داده، طراحی نرم‌افزار و توسعه مهارت‌های تحلیل و حل مسئله.",
    "tags": [
      "Algorithms",
      "Data Structures",
      "Programming",
      "Databases"
    ]
  },
  {
    "kind": "education",
    "period": "یادگیری مستمر",
    "role": "توسعه تخصصی و یادگیری مستقل",
    "org": "مطالعه و پروژه‌های شخصی",
    "text": "یادگیری مستمر از طریق مطالعه مستندات، توسعه پروژه‌های شخصی، تمرین معماری نرم‌افزار، TypeScript، الگوهای طراحی، اصول SOLID و بهینه‌سازی عملکرد برنامه‌های React.",
    "tags": [
      "TypeScript",
      "React",
      "Redux",
      "GitHub",
      "PWA",
      "Responsive Design"
    ]
  }
];
