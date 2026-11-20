/* Project data: single source for the home page cards and the generated project pages
   (rendered by app/projects/[slug]/page.tsx). */

export interface Screenshot {
  src: string;
  caption: string;
  width: number;
  height: number;
}

/** One sub-project of a larger project, with its own text and screenshots. */
export interface ProjectPart {
  title: string;
  text: string;
  points?: string[];
  tech?: string[];
  /** Wide (desktop) screenshots. */
  desktop?: Screenshot[];
  /** Tall (phone) screenshots or vertical video frames. */
  mobile?: Screenshot[];
}

const RM = "assets/images/robot-market";
const desk = (dir: string, name: string, caption: string): Screenshot => ({src: `${RM}/${dir}/${name}-desktop.webp`, caption, width: 1440, height: 900});
const phone = (dir: string, name: string, caption: string): Screenshot => ({src: `${RM}/${dir}/${name}-mobile.webp`, caption, width: 600, height: 1298});
const frame = (name: string, caption: string): Screenshot => ({src: `${RM}/video/${name}.webp`, caption, width: 600, height: 1066});

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  learned: string[];
  story?: {title: string; text: string}[];
  /** Sub-projects shown one after another, each with text and screenshots. */
  parts?: ProjectPart[];
  tech: string[];
  links: {label: string; url: string}[];
  img: string;
  images?: {src: string; caption: string}[];
  /** Screen recordings shown at the top of the project page (a wide one and/or a phone one). */
  videos?: {src: string; poster: string; caption: string; width: number; height: number}[];
  /** Phone/app screenshots shown in a grid instead of full-width figures. */
  gallery?: {src: string; caption: string; width: number; height: number}[];
  /** Set when the project was built by another member of the team. */
  author?: {fa: string; en: string};
  /** Use "contain" for transparent app mockups so they aren't cropped in cards. */
  imgFit?: "cover" | "contain";
}

export const PROJECTS: Project[] = [
  {
    id: 8,
    slug: "aura-shop",
    title: "فروشگاه اورا؛ سایت فروش دستگاه تهویه کراتین",
    description: "فروشگاه اورا یک سایت فروش تک‌محصولی برای دستگاه تهویه کراتین Aura Vent است که مخصوص سالن‌های زیبایی ساخته شده. سایت را از طراحی تا انتشار خودم ساخته‌ام: با Next.js 16 و TypeScript، به‌صورت خروجی استاتیک روی GitHub Pages، فارسی و راست‌چین، با تم شیشه‌ای تیره و حالت روشن. سفارش از راه تلفن و واتساپ انجام می‌شود و سایت سبد خرید و پرداخت آنلاین ندارد.",
    learned: [
      "ساخت مدل سه‌بعدی کامل یک دستگاه فقط با کد Three.js و یک لودینگ انیمیشنی ۷ ثانیه‌ای",
      "ویدیوی تمام‌صفحه با چند کلیپ پشت سر هم که در زمان لودینگ از قبل بارگذاری می‌شوند",
      "انیمیشن‌های اسکرول سبک بدون کتابخانه، با احترام به تنظیم «کاهش حرکت» کاربر",
      "سئوی کامل یک فروشگاه استاتیک: نقشه‌ی سایت، لینک canonical و داده‌های ساخت‌یافته",
    ],
    story: [
      {title: "لودینگ سه‌بعدی با Three.js", text: "سایت با یک مدل سه‌بعدی از خود دستگاه شروع می‌شود: بدنه‌ی مشکی با نوار فیلتر آبی، لوله‌ی خرطومی و حلقه‌ی نور LED، همه با کد ساخته شده‌اند و هیچ فایل مدلی دانلود نمی‌شود. این مقدمه‌ی ۷ ثانیه‌ای فقط تزئینی نیست؛ در همین مدت ویدیوهای صفحه‌ی اول بافر می‌شوند تا بعد از آن بی‌وقفه پخش شوند."},
      {title: "ویدیوی تمام‌صفحه و بخار", text: "صفحه‌ی اول با کلیپ‌های سالن پر می‌شود که پشت سر هم پخش و با CSS رنگ‌بندی می‌شوند. روی آن یک لایه‌ی بخار روی canvas ذرات نورانی را بالا می‌برد و به حلقه‌ی نور دستگاه می‌رساند؛ انگار هوا به داخل دستگاه کشیده می‌شود. وقتی صفحه دیده نمی‌شود، انیمیشن متوقف می‌شود."},
      {title: "معرفی کلمه‌به‌کلمه و انیمیشن اسکرول", text: "متن معرفی هنگام اسکرول کلمه‌به‌کلمه روشن می‌شود و بخش‌ها با حرکتی نرم وارد صفحه می‌شوند. همه‌ی این افکت‌ها بدون کتابخانه و با چند خط JavaScript ساخته شده‌اند و بدون JavaScript هم محتوا کامل دیده می‌شود."},
      {title: "صفحه‌ی محصول و سفارش", text: "صفحه‌ی محصول گالری تصاویر، ویژگی‌ها، ویدیوی دستگاه و بخش سفارش دارد. چون فروش با مشاوره انجام می‌شود، به‌جای سبد خرید، دکمه‌های تماس و واتساپ در دسترس هستند. یک خانه‌ی تنظیمات، نام فروشگاه، شماره و محصولات را برای همه‌ی صفحه‌ها نگه می‌دارد."},
    ],
    tech: ["Next.js", "TypeScript", "Three.js", "CSS", "Canvas", "SEO", "GitHub Pages"],
    links: [],
    img: "assets/images/aura-shop/hero-desktop.webp",
    videos: [
      {src: "assets/video/projects/aura-shop-desktop.mp4", poster: "assets/images/aura-shop/hero-desktop.webp", caption: "ویدیوی سایت در دسکتاپ: لودینگ سه‌بعدی، صفحه‌ی اول و بخش‌ها", width: 1280, height: 720},
      {src: "assets/video/projects/aura-shop-mobile.mp4", poster: "assets/images/aura-shop/hero-mobile.webp", caption: "ویدیوی سایت در موبایل", width: 600, height: 1298},
    ],
    images: [
      {src: "assets/images/aura-shop/loader-desktop.webp", caption: "لودینگ سه‌بعدی دستگاه"},
      {src: "assets/images/aura-shop/hero-desktop.webp", caption: "صفحه‌ی اول با ویدیوی تمام‌صفحه"},
      {src: "assets/images/aura-shop/about-desktop.webp", caption: "معرفی که کلمه‌به‌کلمه روشن می‌شود"},
      {src: "assets/images/aura-shop/features-desktop.webp", caption: "ویژگی‌های دستگاه"},
      {src: "assets/images/aura-shop/product-desktop.webp", caption: "تصاویر و مشخصات"},
      {src: "assets/images/aura-shop/order-desktop.webp", caption: "قیمت و سفارش (شماره‌ی فروشنده محو شده است)"},
      {src: "assets/images/aura-shop/product-page-desktop.webp", caption: "صفحه‌ی محصول"},
    ],
    gallery: [
      {src: "assets/images/aura-shop/loader-mobile.webp", caption: "لودینگ در موبایل", width: 600, height: 1298},
      {src: "assets/images/aura-shop/hero-mobile.webp", caption: "صفحه‌ی اول در موبایل", width: 600, height: 1298},
      {src: "assets/images/aura-shop/features-mobile.webp", caption: "ویژگی‌ها", width: 600, height: 1298},
      {src: "assets/images/aura-shop/order-mobile.webp", caption: "سفارش", width: 600, height: 1298},
      {src: "assets/images/aura-shop/product-page-mobile.webp", caption: "صفحه‌ی محصول", width: 600, height: 1298},
      {src: "assets/images/aura-shop/footer-mobile.webp", caption: "فوتر با نام طراح", width: 600, height: 1298},
    ],
  },
  {
    id: 1,
    slug: "robot-market",
    title: "توسعه فرانت‌اند اکوسیستم وندینگ ربات مارکت",
    description: "در ربات مارکت روی مجموعه‌ای از محصولات متصل به دستگاه‌های وندینگ کار می‌کنم. مسئله مشترک این محصولات، فراهم‌کردن تجربه‌ای قابل استفاده برای مدیریت و کار با دستگاه، هم در دسترسی آنلاین و هم در محیط آفلاین است. نقش من توسعه فرانت‌اند چند بخش از این مجموعه، از رابط روی دستگاه تا پنل و وب‌سایت اصلی است.",
    learned: [
      "توسعه رابط‌های کاربری متناسب با محدودیت‌های اجرای آفلاین و سخت‌افزار",
      "بازنویسی یک رابط قدیمی HTML/JavaScript با React بدون ازدست‌دادن سبکی آن روی ESP32",
      "پیاده‌سازی جریان‌های مدیریت قیمت‌گذاری، کاربران و کیف پول",
      "ساخت PWA نصب‌شونده با قفل محلی، ورود بیومتریک و رمزنگاری اطلاعات دستگاه‌ها",
      "کار روی چند محصول مرتبط با نیازها و محیط‌های اجرای متفاوت، از برد سخت‌افزاری تا بازی سه‌بعدی و ویدیو",
    ],
    parts: [
      {
        title: "رابط ESP32، نسخه‌ی اول: HTML و JavaScript خالص",
        text: "نسخه‌ی اول رابط مدیریت دستگاه (ESP-DEFAULT-V1) سیزده صفحه‌ی HTML با CSS و JavaScript خالص بود که به‌صورت رشته داخل فریمور ESP32 قرار می‌گرفت. فریمور هنگام ارسال هر صفحه، برچسب‌ها و مقدارها را جای‌گذاری می‌کرد. صفحه‌ها ساده و جدا از هم بودند: ورود، تنظیم نام، تعداد و قیمت کالای هر ردیف، موجودی کیف پول مشتریان، تنظیمات وای‌فای و کارتخوان، و گزارش لحظه‌ای. همین نسخه پایه‌ی بازنویسی بعدی با React شد.",
        tech: ["HTML", "CSS", "JavaScript", "ESP32"],
        desktop: [
          desk("esp-v1", "products", "نسخه‌ی اول: تنظیم کالا، تعداد و قیمت هر ردیف"),
          desk("esp-v1", "balance", "نسخه‌ی اول: موجودی کیف پول مشتریان"),
        ],
        mobile: [
          phone("esp-v1", "login", "نسخه‌ی اول: صفحه‌ی ورود"),
          phone("esp-v1", "settings", "نسخه‌ی اول: منوی تنظیمات"),
        ],
      },
      {
        title: "رابط ESP32، بازنویسی با React",
        text: "نسخه‌ی اول را از پایه با React بازنویسی کردم (robot-market-ui-offline-Esp32). برنامه همچنان روی خود ESP32 و بدون اینترنت اجرا می‌شود، اما حالا یک پنل کامل و واکنش‌گرا با منوی کناری در دسکتاپ و منوی کشویی در موبایل است. خروجی ساخت عمداً فقط یک فایل HTML، یک JavaScript و یک CSS است تا حافظه‌ی محدود برد آن را به‌راحتی سرو کند. این پروژه تا نسخه‌ی ۲.۴ و بیش از ۱۴۰ کامیت پیش رفته است.",
        points: [
          "ورود با رمز عبور یا رمز یک‌بارمصرف، بازیابی رمز و تغییر رمز در اولین ورود",
          "داشبورد فروش، تراکنش‌ها، موجودی و سلامت دستگاه",
          "مدیریت قیمت و موجودی کانال‌ها، کاربران و کیف پول",
          "تنظیمات وای‌فای، نقطه‌ی دسترسی، تاریخ و ساعت، کارتخوان، MQTT و به‌روزرسانی OTA",
          "نمایش صفحه‌ها و دکمه‌ها بر اساس دسترسی‌هایی که دستگاه می‌فرستد",
          "بک‌اند شبیه‌ساز برای توسعه بدون دستگاه واقعی",
        ],
        tech: ["React", "Vite", "Redux Toolkit", "Axios", "Tailwind CSS", "ESP32"],
        desktop: [
          desk("esp32", "dashboard", "داشبورد فروش و وضعیت دستگاه"),
          desk("esp32", "prices", "مدیریت قیمت و موجودی کانال‌ها"),
          desk("esp32", "info", "اطلاعات سخت‌افزار، فریمور و شبکه"),
        ],
        mobile: [
          phone("esp32", "login", "ورود با رمز یا کد یک‌بارمصرف"),
          phone("esp32", "dashboard", "داشبورد در موبایل"),
          phone("esp32", "prices", "مدیریت کالاها"),
          phone("esp32", "settings", "تنظیمات شبکه و دستگاه"),
        ],
      },
      {
        title: "نسل جدید وندینگ: Orange Pi",
        text: "در پروژه‌ی دستگاه‌های جدید، روی برد Orange Pi و برنامه‌ی React آفلاین کار می‌کنم تا رابط کاربری مورد نیاز دستگاه در محیط محلی اجرا شود.",
        tech: ["React", "Orange Pi"],
      },
      {
        title: "لانچر PWA برای مدیریت دستگاه‌ها",
        text: "یک برنامه‌ی نصب‌شونده که مدیر را به پنل آنلاین و به پنل آفلاین دستگاه‌های داخل شبکه‌ی محلی می‌رساند. برنامه فقط در حالت نصب‌شده اجرا می‌شود و در تب معمولی مرورگر راهنمای نصب را نشان می‌دهد.",
        points: [
          "رمز ۶ رقمی با هش SHA-256 و ورود با اثرانگشت، Face ID یا Windows Hello",
          "قفل خودکار بعد از دو دقیقه ماندن برنامه در پس‌زمینه",
          "ثبت دستگاه محلی با DHCP/mDNS یا IP ثابت و بازکردن پنل دستگاه داخل برنامه",
          "رمزنگاری رمز دستگاه‌ها و پنل آنلاین با AES-GCM",
          "فارسی و انگلیسی، تم روشن و تیره، تاریخ شمسی و بررسی واقعی اتصال اینترنت",
        ],
        tech: ["React", "Vite", "PWA", "Redux Toolkit", "Ant Design", "Tailwind CSS"],
        desktop: [
          desk("launcher", "hub", "هاب: پنل آنلاین و دستگاه‌های آفلاین"),
          desk("launcher", "install", "راهنمای نصب در تب معمولی مرورگر"),
        ],
        mobile: [
          phone("launcher", "splash", "صفحه‌ی شروع"),
          phone("launcher", "auth", "تعیین رمز ۶ رقمی"),
          phone("launcher", "hub", "هاب مدیریت دستگاه‌ها"),
          phone("launcher", "install", "راهنمای نصب"),
        ],
      },
      {
        title: "پنل مدیریت آنلاین",
        text: "فرانت‌اند پنل مدیریت ربات مارکت با Next.js: ورود، داشبورد، محصولات و دستگاه‌ها، سفارش‌ها، کاربران و دسترسی‌ها، تیکت‌های پشتیبانی و تنظیمات. ساختار پروژه بر اساس بخش‌ها (feature) جدا شده و با Vitest و Playwright تست می‌شود. داده‌ها فعلاً نمونه هستند تا بک‌اند آماده شود.",
        tech: ["Next.js", "Ant Design", "Tailwind CSS", "Redux Toolkit", "Axios", "Vitest", "Playwright"],
        desktop: [
          desk("admin", "dashboard", "داشبورد مدیریت"),
          desk("admin", "products", "محصولات و دستگاه‌ها"),
          desk("admin", "tickets", "تیکت‌های پشتیبانی"),
          desk("admin", "login", "ورود به پنل"),
        ],
        mobile: [
          phone("admin", "dashboard", "داشبورد در موبایل"),
          phone("admin", "orders", "سفارش‌ها"),
          phone("admin", "users", "کاربران و دسترسی‌ها"),
        ],
      },
      {
        title: "سایت معرفی و فروش دستگاه‌ها",
        text: "سایت معرفی دستگاه‌های وندینگ ربات مارکت با Next.js: ویترین متحرک دستگاه‌ها، صفحه‌ی هر مدل، سبد خریدی که بعد از بارگذاری دوباره هم حفظ می‌شود، ورود با کد یک‌بارمصرف یا رمز عبور و داشبورد مشتری. سایت دوزبانه است، تم روشن و تیره دارد و برای اجرا با Docker آماده شده است.",
        tech: ["Next.js", "Ant Design", "Tailwind CSS", "Redux Toolkit", "Axios", "Docker"],
        desktop: [
          desk("showcase", "home", "صفحه‌ی اصلی"),
          desk("showcase", "home2", "ویترین مدل‌ها"),
          desk("showcase", "products", "فهرست دستگاه‌ها"),
          desk("showcase", "product", "صفحه‌ی مدل ۴۸ کانال"),
        ],
        mobile: [
          phone("showcase", "home", "صفحه‌ی اصلی در موبایل"),
          phone("showcase", "home2", "ویترین مدل‌ها"),
          phone("showcase", "products", "فهرست دستگاه‌ها"),
          phone("showcase", "product", "صفحه‌ی مدل"),
        ],
      },
      {
        title: "لینک‌هاب ربات مارکت",
        text: "یک صفحه‌ی سبک و واکنش‌گرا که راه‌های ارتباط با ربات مارکت را در یک گرید جمع می‌کند: وب‌سایت، سفارش تلفنی، اینستاگرام، کانال پیام‌رسان و آدرس‌ها. خروجی کاملاً استاتیک است و روی GitHub Pages منتشر می‌شود.",
        tech: ["Next.js", "PWA", "GitHub Pages"],
        desktop: [desk("hub", "home", "لینک‌هاب در دسکتاپ")],
        mobile: [phone("hub", "home", "لینک‌هاب در موبایل")],
      },
      {
        title: "بازی سه‌بعدی «عملیات مشهد»",
        text: "یک بازی مرورگری سه‌بعدی و بدون خشونت برای معرفی برند: پدر و فرزندی از کارخانه راه می‌افتند، در خیابان‌های مشهد دستگاه‌های وندینگ ربات مارکت را پیدا می‌کنند و با هر خرید امتیاز می‌گیرند. روبات راهنما از دستگاه بیرون می‌آید و آن‌ها را راهنمایی می‌کند. موتور Three.js از رابط React جداست، بازی روی موبایل کنترل لمسی دارد و به‌صورت PWA آفلاین هم اجرا می‌شود.",
        tech: ["React", "Three.js", "Redux Toolkit", "Tailwind CSS", "PWA"],
        desktop: [
          desk("game", "start", "صفحه‌ی شروع بازی"),
          desk("game", "play", "گشت‌وگذار در شهر و رسیدن به دستگاه"),
        ],
        mobile: [
          phone("game", "start", "صفحه‌ی شروع در موبایل"),
          phone("game", "play2", "بازی با کنترل لمسی"),
        ],
      },
      {
        title: "ویدیوهای معرفی با Remotion",
        text: "ویدیوهای عمودی ۱۰۸۰×۱۹۲۰ برای ریلز اینستاگرام که با کد و Remotion ساخته شده‌اند: معرفی مدل‌های ۳۵، ۴۸ و ۶۰ کانال با کاراکتر روبات، گویندگی و موسیقی، و یک نسخه‌ی فانتزی با صحنه‌ها و صداهای تازه.",
        tech: ["Remotion", "React", "TypeScript"],
        mobile: [
          frame("intro", "شروع ریلز معرفی"),
          frame("model-35", "مدل ۳۵ کانال"),
          frame("fantasy-35", "نسخه‌ی فانتزی: مدل ۳۵ کانال"),
          frame("fantasy-snacks", "نسخه‌ی فانتزی: تنقلات"),
        ],
      },
    ],
    tech: ["React", "Next.js", "Vite", "PWA", "Redux Toolkit", "Ant Design", "Tailwind CSS", "Three.js", "Remotion", "ESP32", "Orange Pi"],
    links: [{label: "وب‌سایت ربات مارکت", url: "https://my-rm.com/"}],
    img: "assets/images/robot-market.webp",
    images: [{src: "assets/images/robot-market.webp", caption: "نمای پنل مدیریت ربات مارکت"}],
  },
  {
    id: 2,
    slug: "link-crm",
    title: "لینک CRM / لینک ERP",
    description:
        "لینک یک پلتفرم CRM/ERP فارسی برای مدیریت مشتریان، فروش، پیام‌رسانی و امور مالی کسب‌وکارهاست که روی کامپیوتر و موبایل یک تجربه‌ی یکسان دارد. من به‌عنوان توسعه‌دهنده فرانت‌اند در یک تیم حرفه‌ای روی بخش‌های اصلی پنل کار کرده‌ام: جریان فروش، صندوق پیام‌ها، مخاطبین، امور مالی، گزارش‌ها، یادآورها، فرم‌ساز و صفحه‌ساز. تمرکز کارم ساخت کامپوننت‌های قابل استفاده‌ی مجدد، فرم‌های پیچیده، داشبوردها و بهبود UI/UX برای گردش‌های کاری واقعی کسب‌وکار بوده است.",
    learned: [
      "مدیریت state پیچیده در مقیاس بزرگ با Redux Toolkit",
      "ساخت کامپوننت‌های قابل استفاده مجدد، جدول‌ها و فرم‌های چندمرحله‌ای",
      "پیاده‌سازی رابط‌های واکنش‌گرا که روی دسکتاپ و موبایل یکسان کار می‌کنند",
      "یکپارچه‌سازی REST API با سرویس‌های بک‌اند و درگاه‌ها",
      "همکاری تیمی با استاندارد کدنویسی و ریویو در یک پروژه واقعی",
    ],
    story: [
      {title: "جریان؛ قیف فروش مرحله‌به‌مرحله", text: "در بخش جریان، فرآیند فروش با مراحل و انواع سفارشی نمایش داده می‌شود و کاربر قیف فروش، پیگیری‌ها و احتمال خرید هر مشتری را یک‌جا می‌بیند. من رابط این بخش، از نمای مراحل تا کارت‌ها و فیلترها، را با کامپوننت‌های قابل استفاده‌ی مجدد توسعه داده‌ام."},
      {title: "پیام‌رسان؛ صندوق یکپارچه‌ی گفتگوها", text: "گفتگوهای پیام‌رسان‌ها و پیامک در یک صندوق جمع می‌شوند و هر گفتگو به جریان مرتبط وصل می‌شود. در این بخش روی رابط گفتگو، فهرست مکالمه‌ها و اتصال آن‌ها به مشتری و جریان کار کرده‌ام."},
      {title: "مخاطبین؛ پرونده‌ی کامل هر مشتری", text: "پروفایل هر مشتری با برچسب، دسته‌بندی، بدهی و اعتبار و داشبوردی برای منبع جذب مشتری. من فرم‌ها، جدول‌های مخاطبین، فیلدهای سفارشی و ورود گروهی را در رابط پیاده‌سازی کرده‌ام."},
      {title: "امور مالی؛ فاکتور، پرداخت و مانده‌ی مشتری", text: "صدور فاکتور و پیش‌فاکتور، تأیید واریزی‌ها و پیگیری مانده‌ی هر مشتری. روی صفحه‌های فاکتور، فرم‌های محاسباتی و جدول‌های مالی کار کرده‌ام تا ثبت و مرور اطلاعات مالی روان و کم‌خطا باشد."},
      {title: "گزارش‌ها؛ تصویر لحظه‌ای کسب‌وکار", text: "نمودارها و گزارش‌های روند درآمد، وضعیت پرداخت فاکتورها و پرفروش‌ترین کالاها. در این بخش داشبوردها و نمودارها را به داده‌ی API وصل کرده و نمایش آن‌ها را روی اندازه‌های مختلف صفحه بهینه کرده‌ام."},
      {title: "یادآورها، فرم‌ساز و صفحه‌ساز", text: "یادآورهای یک‌باره یا تکراری با ارسال پیامک، فرم‌ساز برای ثبت‌نام و نظرسنجی که پاسخ‌ها را مستقیم به مخاطبین می‌فرستد، و صفحه‌ساز برای ساخت سریع صفحه‌ی معرفی کسب‌وکار. رابط‌ ساخت و مدیریت این ابزارها بخشی از کار من بوده است."},
    ],
    images: [
      {src: "assets/images/linkcrm/home.webp", caption: "صفحه‌ی اصلی پنل لینک"},
      {src: "assets/images/linkcrm/flow.webp", caption: "جریان فروش و قیف مرحله‌ها"},
      {src: "assets/images/linkcrm/inbox.webp", caption: "صندوق یکپارچه‌ی پیام‌ها"},
      {src: "assets/images/linkcrm/contacts.webp", caption: "مدیریت مخاطبین و پرونده‌ی مشتری"},
      {src: "assets/images/linkcrm/finance.webp", caption: "امور مالی، فاکتور و پرداخت‌ها"},
      {src: "assets/images/linkcrm/reports.webp", caption: "گزارش‌های درآمد و فروش"},
      {src: "assets/images/linkcrm/reminders.webp", caption: "یادآورها"},
      {src: "assets/images/linkcrm/form.webp", caption: "فرم‌ساز"},
      {src: "assets/images/linkcrm/landing.webp", caption: "صفحه‌ساز"},
    ],
    tech: ["React", "Ant Design", "Redux Toolkit", "Axios", "JavaScript", "Vite"],
    links: [{ label: "مشاهده", url: "https://linkcrm.app/" }],
    img: "assets/images/link-Crm-Project.png",
  },
  {
    id: 4,
    slug: "wikiq",
    title: "ویکی‌کیو؛ پنل مدیریت پلتفرم آزمون آنلاین",
    description:
        "ویکی‌کیو یک پلتفرم آنلاین آزمون و بانک نمونه سوالات تستی است که از پایه تا دکتری و آزمون‌های استخدامی را پوشش می‌دهد و اپلیکیشن اندروید و ویندوز هم دارد. من به‌عنوان توسعه‌دهنده فرانت‌اند در توسعه پنل مدیریت این پلتفرم همکاری داشتم؛ پنلی برای مدیریت محتوا و گردش‌های کاری داخلی، با معماری فرانت‌اند تمیز، مدرن و مقیاس‌پذیر.",
    learned: [
      "معماری فرانت‌اند مقیاس‌پذیر با Vite و Context API",
      "طراحی رابط کاربری تمیز و سریع با Tailwind CSS",
      "هماهنگی با تیم محصول برای مدیریت گردش‌های کاری داخلی",
    ],
    story: [
      {title: "پلتفرم چیست؟", text: "ویکی‌کیو خدمات ساخت و برگزاری آزمون‌های آنلاین و بسته‌های نمونه سوال تستی را ارائه می‌دهد. کاربران می‌توانند بسته‌های تستی و آزمون‌ها را از وب‌سایت یا اپلیکیشن بخرند، در آزمون‌ها شرکت کنند و نتیجه‌ی خود را ببینند."},
      {title: "بانک سوال و آزمون‌های آنلاین", text: "بانک تست پلتفرم بر اساس مقطع و رشته دسته‌بندی شده است؛ از آزمون‌های دکتری و کارشناسی ارشد تا پیام نور، متوسطه تا کنکور، ابتدایی و آزمون‌های عمومی و تخصصی. آزمون‌های آنلاین زمان‌دار هستند و تعداد تست، مدت و ظرفیت شرکت‌کنندگان برای هر آزمون مشخص است."},
      {title: "اپلیکیشن موبایل و دسکتاپ", text: "در اپلیکیشن، کاربر آزمون را به‌صورت آنلاین یا آفلاین برگزار می‌کند و بعد از آزمون نمره‌ی کل، نتیجه‌ی هر درس و پاسخنامه‌ی تفکیکی را می‌بیند. بیش از ۲۲۴۷ رشته با امکان جست‌وجو، بسته‌های پیشنهادی بر اساس خریدهای قبلی و اشتراک ماهانه‌ی هر رشته هم در دسترس است."},
      {title: "ساخت بسته سوال و آزمون توسط کاربران", text: "کاربران می‌توانند سوالات خود را به‌صورت فایل اکسل، عکس، ویدیو یا صدا بارگذاری کنند، بسته‌ی تستی بسازند و بخشی از درآمد فروش آن را دریافت کنند. همچنین می‌توانند آزمون آنلاین برگزار کنند."},
      {title: "نقش من: پنل مدیریت", text: "سهم من توسعه فرانت‌اند پنل مدیریت پلتفرم بود: رابطی برای مدیریت محتوا و گردش‌های کاری داخلی که با React، Vite، Tailwind CSS و Context API ساخته شد و به API پلتفرم وصل است. تصاویر زیر از اپلیکیشن ویکی‌کیو هستند و نمایی از محصولی را نشان می‌دهند که این پنل از آن پشتیبانی می‌کند."},
    ],
    tech: ["React", "Vite", "Tailwind CSS", "Context API"],
    links: [
      {label: "وب‌سایت ویکی‌کیو", url: "https://wikiq.co/"},
      {label: "اپلیکیشن ویکی‌کیو", url: "https://wikiq.co/download-app"},
    ],
    img: "assets/images/wikiq/appImg1.webp",
    imgFit: "contain",
    images: [],
    gallery: [
      {src: "assets/images/wikiq/app.webp", caption: "صفحه‌ی اصلی اپلیکیشن: جست‌وجوی بسته‌ها و بسته‌های پیشنهادی", width: 950, height: 1200},
      {src: "assets/images/wikiq/appImg1.webp", caption: "ساخت آزمون آنلاین و پاسخ به سوال‌ها", width: 1000, height: 1017},
      {src: "assets/images/wikiq/appImg2.webp", caption: "شرکت در آزمون آنلاین با زمان‌سنج", width: 550, height: 1000},
      {src: "assets/images/wikiq/appImg3.webp", caption: "نتیجه‌ی آزمون و نمره‌ی هر درس", width: 550, height: 1000},
      {src: "assets/images/wikiq/appImg4.webp", caption: "پاسخنامه‌ی دقیق آزمون", width: 550, height: 1000},
      {src: "assets/images/wikiq/appImg5.webp", caption: "فهرست رشته‌ها و دسته‌بندی‌ها", width: 550, height: 1000},
    ],
  },

  {
    id: 5,
    slug: "university-student-portal",
    title: "پورتال دانشجویی",
    description: "نمونه‌ی دمو از یک پورتال دانشگاهی با ورود چندنقشه‌ای برای دانشجو، کارمند آموزش و مدیر. رابط کاملاً راست‌به‌چپ و فارسی است و داده‌های نمایشی فقط در مرورگر ذخیره می‌شوند. ",
    learned: [
      "طراحی جریان ورود و ثبت‌نام برای چند نقش کاربری",
      "رابط راست‌به‌چپ با تم روشن و تاریک",
      "نسخه‌ی نمایشی بدون سرور؛ داده‌ها فقط در مرورگر می‌مانند",
    ],
    tech: ["Frontend", "RTL", "Dark mode", "Role-based UI"],
    links: [{label: "مشاهده‌ی دمو", url: "https://university-demo.mohammadghorbani-dev.ir/"}],
    author: {fa: "محمد قربانی", en: "Mohammad Ghorbani"},
    img: "assets/images/mohammad/university.webp",
  },
  {
    id: 6,
    slug: "personal-portfolio",
    title: "پورتفولیوی شخصی دوزبانه",
    description: "نمونه‌ی دمو از یک وب‌سایت رزومه برای توسعه‌دهنده‌ی فرانت‌اند با پس‌زمینه‌ی متحرک، بخش پروژه‌ها، مسیر کاری، مهارت‌ها و تماس، و سوییچ فارسی/انگلیسی. محتوای صفحه خیالی است و فقط برای نمایش کار ساخته شده.",
    learned: [
      "پس‌زمینه‌ی متحرک و رابط شیشه‌ای",
      "سوییچ زبان فارسی و انگلیسی",
      "ساختار رزومه: پروژه‌ها، مسیر، مهارت‌ها و تماس",
    ],
    tech: ["Frontend", "Animation", "FA / EN"],
    links: [{label: "مشاهده‌ی دمو", url: "https://portfolio-demo.mohammadghorbani-dev.ir/"}],
    author: {fa: "محمد قربانی", en: "Mohammad Ghorbani"},
    img: "assets/images/mohammad/portfolio.webp",
  },
  {
    id: 7,
    slug: "tasksnap",
    title: "TaskSnap؛ اپلیکیشن اندروید برنامه‌ریزی",
    description: "برنامه‌ریز اندرویدی برای ثبت سریع کارها و ایده‌ها، یادآور و پیگیری برنامه‌ی روزانه. کارها سه وضعیت دارند (باز، نیمه‌کاره، انجام‌شده) و رابط فارسی و انگلیسی با تقویم شمسی و میلادی پشتیبانی می‌شود. نسخه‌ی ۰٫۹٫۱ برای بررسی به مایکت و کافه‌بازار ارسال شده است.",
    learned: [
      "رابط Flutter با ذخیره‌ی محلی در SQLite",
      "یادآور و تقویم دستگاه از طریق Kotlin",
      "پشتیبان‌گیری قابل حمل با عکس و صدا و بازیابی بدون تکرار",
    ],
    tech: ["Flutter", "Kotlin", "SQLite", "Android"],
    links: [],
    author: {fa: "محمد قربانی", en: "Mohammad Ghorbani"},
    img: "assets/images/mohammad/tasksnap-today.webp",
    imgFit: "contain",
    gallery: [
      {src: "assets/images/mohammad/tasksnap-today.webp", caption: "نمای امروز با پیشرفت و سه وضعیت کار", width: 450, height: 800},
      {src: "assets/images/mohammad/tasksnap-ideas.webp", caption: "ایده‌ها", width: 450, height: 800},
      {src: "assets/images/mohammad/tasksnap-insights.webp", caption: "نمودار پیشرفت", width: 450, height: 800},
    ],
  },
];
