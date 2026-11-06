/* Slides of the home page hero: our own ad copy next to project screenshots. */

export interface Slide {
    id: string;
    badge: string;
    title: string;
    text: string;
    cta: {label: string; href?: string; chatTopic?: string};
    image: string;
    imageAlt: string;
    caption: string;
    captionHref: string;
    contain?: boolean;
}

export const SLIDES: Slide[] = [
    {
        id: "ai",
        badge: "هوش مصنوعی",
        title: "ایده‌ات را با هوش مصنوعی به محصول تبدیل کن",
        text: "طراحی سایت، پنل و اپلیکیشن با قابلیت‌های هوش مصنوعی؛ چت‌بات، دستیار هوشمند و اتوماسیون. مشاوره‌ی اولیه رایگان است.",
        cta: {label: "ثبت درخواست پروژه", chatTopic: "هوش مصنوعی"},
        image: "assets/images/linkcrm/flow.webp",
        imageAlt: "داشبورد جریان فروش در پلتفرم لینک CRM",
        caption: "نمونه‌کار: لینک CRM",
        captionHref: "/projects/link-crm/",
    },
    {
        id: "panel",
        badge: "پنل هوشمند",
        title: "پنل مدیریتی با دستیار هوش مصنوعی",
        text: "داشبورد، فاکتور و گزارش‌های لحظه‌ای که با هوش مصنوعی خلاصه و تحلیل می‌شوند؛ ساخته‌شده با تجربه‌ی یک CRM/ERP واقعی.",
        cta: {label: "درباره‌ی پنل‌ها", href: "/services/admin-panel-crm/"},
        image: "assets/images/linkcrm/inbox.webp",
        imageAlt: "صندوق پیام یکپارچه در پلتفرم لینک CRM",
        caption: "نمونه‌کار: لینک CRM",
        captionHref: "/projects/link-crm/",
    },
    {
        id: "app",
        badge: "اپلیکیشن",
        title: "اپلیکیشن و PWA هوشمند، حتی بدون اینترنت",
        text: "برنامه‌ی نصب‌پذیر با پشتیبانی آفلاین و امکان افزودن هوش مصنوعی؛ مثل پلتفرم آزمون آنلاین ویکی‌کیو.",
        cta: {label: "درباره‌ی اپلیکیشن‌ها", href: "/services/web-app-pwa/"},
        image: "assets/images/wikiq/appImg1.webp",
        imageAlt: "اپلیکیشن آزمون آنلاین ویکی‌کیو",
        caption: "نمونه‌کار: ویکی‌کیو",
        captionHref: "/projects/wikiq/",
        contain: true,
    },
    {
        id: "device",
        badge: "دستگاه‌های هوشمند",
        title: "رابط دستگاه‌های وندینگ و سخت‌افزار",
        text: "برنامه‌ی سبک و آفلاین روی ESP32 و Orange Pi، هماهنگ با پنل آنلاین و آماده‌ی اتصال به هوش مصنوعی.",
        cta: {label: "درباره‌ی رابط دستگاه‌ها", href: "/services/device-interface/"},
        image: "assets/images/robot-market.webp",
        imageAlt: "پنل مدیریت ربات مارکت",
        caption: "نمونه‌کار: ربات مارکت",
        captionHref: "/projects/robot-market/",
    },
];
