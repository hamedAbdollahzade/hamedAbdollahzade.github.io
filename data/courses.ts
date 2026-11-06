/* Learning courses shown on /blog/. Each article's `category` in content/blog/*.md must match a course title. */

export interface Course {
    slug: string;
    title: string;
    description: string;
}

export const COURSES: Course[] = [
    {slug: "html", title: "HTML", description: "ساختار صفحه‌ی وب: تگ‌ها، فرم‌ها، semantic HTML، دسترس‌پذیری و SEO؛ از مبتدی تا پیشرفته."},
    {slug: "css", title: "CSS", description: "ظاهر و چیدمان: Flexbox، Grid، طراحی واکنش‌گرا، انیمیشن و معماری CSS مدرن."},
    {slug: "javascript", title: "JavaScript", description: "مسیر کامل یادگیری جاوااسکریپت: مبانی، متدهای داخلی، سطح متوسط و پیشرفته."},
    {slug: "frontend-roadmap", title: "مسیر فرانت‌اند", description: "مهارت‌های نقشه‌ی راه roadmap.sh/frontend: ابزارها، TypeScript، فریم‌ورک‌ها، تست، امنیت، عملکرد و استقرار."},
    {slug: "linux-ubuntu", title: "لینوکس اوبونتو", description: "دستورات ترمینال، مدیریت پکیج‌ها، برنامه‌ها و Docker روی Ubuntu."},
    {slug: "ai-coding", title: "کدنویسی با هوش مصنوعی", description: "جریان کاری برنامه‌نویسی با هوش مصنوعی: محدودیت‌های LLM، برنامه‌ریزی، معماری و بازخورد."},
    {slug: "articles", title: "راهنما و مقاله", description: "راهنمای عملی برای صاحبان ایده و کسب‌وکار درباره‌ی هوش مصنوعی و ساخت محصول."},
];

export const courseOf = (title: string) => COURSES.find((c) => c.title === title);
