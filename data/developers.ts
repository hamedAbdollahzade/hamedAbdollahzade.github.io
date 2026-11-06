/* Developers of the team. Add one object per member; each gets a /developers/<slug>/ page. */

import {SKILLS, TIMELINE} from "./about";
import type {SkillGroup, TimelineEntry} from "./about";

export interface Developer {
    slug: string;
    name: string;
    nameEn: string;
    role: string;
    photo: string;
    bio: string;
    skills: string[];
    links: {label: string; url: string}[];
    skillGroups?: SkillGroup[];
    timeline?: TimelineEntry[];
    mentors?: {name: string; role: string; text: string; url: string; linkLabel: string}[];
}

export const DEVELOPERS: Developer[] = [
    {
        slug: "hamed-abdollahzade",
        name: "حامد عبداله زاده",
        nameEn: "Hamed Abdollahzade",
        role: "مؤسس · توسعه‌دهنده فرانت‌اند",
        photo: "assets/images/me.jpg",
        bio: "توسعه‌دهنده فرانت‌اند در سطح میدلول؛ تجربه‌ام از پنل‌های سازمانی CRM و ERP تا رابط‌های کاربری دستگاه‌های وندینگ را در بر می‌گیرد. با React، Next.js، TypeScript و Vue کار می‌کنم و تمرکزم این روزها روی برنامه‌های آفلاین، PWA و ارتباط رابط کاربری با سخت‌افزار است. بخش مهمی از مسیر یادگیری‌ام را در دوره‌ی فراوین گذرانده‌ام و از اساتیدی مثل مجتبی قاسم‌زاده تهرانی و عرفان تقی‌نیا چیزهای زیادی یاد گرفته‌ام.",
        skills: ["React", "Next.js", "TypeScript", "Vue", "Redux Toolkit", "PWA", "REST API", "WebSocket"],
        links: [
            {label: "GitHub", url: "https://github.com/hamedAbdollahzade"},
            {label: "LinkedIn", url: "https://www.linkedin.com/in/hamed-abdollahzade"},
        ],
        skillGroups: SKILLS,
        timeline: TIMELINE,
        mentors: [
            {
                name: "مجتبی قاسم‌زاده تهرانی",
                role: "مدرس دوره‌ی جامع فرانت‌اند · فراوین",
                text: "کارشناسی ارشد نرم‌افزار از دانشگاه فردوسی، مربی و عضو هیئت علمی فراوین، مؤسس EcmaScript.ir و عضو تیم توسعه‌ی ویراستی، نسیم رضوان و گپ. دوره‌ی جامع فرانت‌اند او با بیش از ۶۰ ساعت ویدئوی آموزشی را رایگان در اختیار همه گذاشته است.",
                url: "https://ecmascript.ir/",
                linkLabel: "EcmaScript.ir",
            },
            {
                name: "عرفان تقی‌نیا",
                role: "مدرس در فراوین · Senior Software Engineer",
                text: "مهندس نرم‌افزار ارشد با تمرکز روی Go، Python و TypeScript. در گیت‌هاب مجموعه‌هایی مثل Clean_Code_QA، Golang_QA و JS_IS_FUN را منتشر کرده و شعارش این است: کنجکاو بمان، یاد بگیر و به دیگران کمک کن.",
                url: "https://github.com/etg-dev",
                linkLabel: "GitHub: etg-dev",
            },
        ],
    },
];
