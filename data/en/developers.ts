/* English copy for the developer profile (skills group titles, timeline and mentors). */

import type {TimelineEntry} from "../about";

export const SKILL_TITLES_EN: Record<string, string> = {
  "مبانی وب": "Web Fundamentals",
};

export const TIMELINE_EN: Pick<TimelineEntry, "period" | "role" | "org" | "text">[] = [
  {
    period: "May 2026 – present",
    role: "Frontend Developer",
    org: "Robot Market • Mashhad, Iran",
    text: "At Robot Market I work as a frontend developer on several vending products: a PWA that connects automatically to offline devices and the online panel, a React app on ESP32 for pricing, users and wallet management, a next-generation offline interface on Orange Pi, and the main website with Next.js.",
  },
  {
    period: "Dec 2024 – Mar 2026",
    role: "Frontend Developer",
    org: "Kando • Link CRM / Link ERP",
    text: "Developed and maintained a large-scale enterprise CRM/ERP platform with React. Designed reusable components, improved UI/UX, integrated REST APIs, managed state with Redux Toolkit, worked closely with backend and product teams, and focused on performance, scalability and maintainability.",
  },
  {
    period: "2024",
    role: "Frontend Developer",
    org: "WikiQ Startup",
    text: "Developed UI components, fixed bugs, integrated the frontend with backend APIs, worked in a Git-based team and got to know the Agile process.",
  },
  {
    period: "Dec 2022 – Dec 2023",
    role: "Frontend Developer Trainee",
    org: "Faravin • one-year training and internship",
    text: "Completed a one-year frontend training and internship program and built practical projects including admin dashboards and modern web interfaces with React.",
  },
  {
    period: "2013 – 2017",
    role: "BSc in Computer Science",
    org: "Birjand University of Technology",
    text: "Studied core computer science topics including algorithms, data structures, programming fundamentals, databases and software design, and developed analysis and problem-solving skills.",
  },
  {
    period: "Continuous learning",
    role: "Specialised and self-directed learning",
    org: "Study and personal projects",
    text: "Continuous learning through reading documentation, personal projects, practising software architecture, TypeScript, design patterns, SOLID principles and performance optimisation of React apps.",
  },
];

export const DEVELOPER_EN: Record<string, {role: string; bio: string; mentors: {name: string; role: string; text: string; linkLabel: string}[]}> = {
  "hamed-abdollahzade": {
    role: "Founder · Frontend Developer",
    bio: "A mid-level frontend developer. My experience ranges from enterprise CRM and ERP panels to the user interfaces of vending machines. I work with React, Next.js, TypeScript and Vue, and these days I focus on offline apps, PWAs and connecting user interfaces with hardware. An important part of my learning happened in the Faravin program, and I learned a lot from teachers such as Mojtaba Ghasemzadeh Tehrani and Erfan Taghinia.",
    mentors: [
      {
        name: "Mojtaba Ghasemzadeh Tehrani",
        role: "Instructor of the comprehensive frontend course · Faravin",
        text: "MSc in software from Ferdowsi University, instructor and faculty member at Faravin, founder of EcmaScript.ir and a member of the development teams of Virasty, Nasim Rezvan and Gap. His comprehensive frontend course, with more than 60 hours of video, is free for everyone.",
        linkLabel: "EcmaScript.ir",
      },
      {
        name: "Erfan Taghinia",
        role: "Instructor at Faravin · Senior Software Engineer",
        text: "A senior software engineer focused on Go, Python and TypeScript. On GitHub he publishes collections such as Clean_Code_QA, Golang_QA and JS_IS_FUN, and his motto is: stay curious, keep learning, help others.",
        linkLabel: "GitHub: etg-dev",
      },
    ],
  },
  "mohammad-ghorbani": {
    role: "Frontend and App Developer",
    bio: "A developer who builds everything from right-to-left web interfaces to Android apps. He built a student portal and a bilingual portfolio as demos, and developed the TaskSnap planner with Flutter and Kotlin; version 0.9.1 was submitted to Myket and Cafe Bazaar for review.",
    mentors: [],
  },
};
