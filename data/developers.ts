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
}

export const DEVELOPERS: Developer[] = [
    {
        slug: "hamed-abdollahzade",
        name: "حامد عبداله زاده",
        nameEn: "Hamed Abdollahzade",
        role: "مؤسس · توسعه‌دهنده فرانت‌اند",
        photo: "assets/images/me.jpg",
        bio: "توسعه‌دهنده فرانت‌اند در سطح میدلول؛ تجربه‌ام از پنل‌های سازمانی CRM و ERP تا رابط‌های کاربری دستگاه‌های وندینگ را در بر می‌گیرد. با React، Next.js، TypeScript و Vue کار می‌کنم و تمرکزم این روزها روی برنامه‌های آفلاین، PWA و ارتباط رابط کاربری با سخت‌افزار است.",
        skills: ["React", "Next.js", "TypeScript", "Vue", "Redux Toolkit", "PWA", "REST API", "WebSocket"],
        links: [
            {label: "GitHub", url: "https://github.com/hamedAbdollahzade"},
            {label: "LinkedIn", url: "https://www.linkedin.com/in/hamed-abdollahzade"},
        ],
        skillGroups: SKILLS,
        timeline: TIMELINE,
    },
];
