/* English copy for services, FAQ and process. Same slugs and shape as data/services.ts. */

import type {Service} from "../services";

export const BRAND_EN = {
    tagline: "Tell us your idea; we build it with AI",
    city: "Mashhad",
    phoneDisplay: "+98 910 790 2735",
};

export const SERVICES_EN: Service[] = [
    {
        slug: "ai-solutions",
        title: "AI for your business",
        short: "Chatbots, smart assistants, automation and AI features inside your site, panel or app.",
        seoTitle: "Add AI to your website and software | Chatbots and smart assistants | Webino-Dev",
        description: "Add AI to your website, admin panel or app: smart chatbots, helpful assistants, summaries, data analysis and automation of repetitive work. Webino-Dev, Mashhad, Iran. Free initial consultation.",
        intro: "AI is not just a trend. Connected to your product the right way, it frees your team's time and improves the customer experience. We add AI where it really helps your business, not for show.",
        for: ["Businesses that want to answer customers faster with an AI chatbot", "Teams with repetitive tasks, reports or data entry that AI can automate", "Products that want a smart feature (search, recommendations, summaries) for users"],
        deliver: ["A review of where AI brings the most value to you", "An AI chatbot or assistant inside your site, panel or app", "AI model integration through APIs and prompts designed for your work", "Automation of repetitive tasks such as sorting messages, summarising and reporting", "A smooth interface for using the smart features"],
        tech: ["AI", "Prompt Engineering", "Claude", "REST API", "React", "Next.js"],
        faq: [
            ["Does AI make sense for my business?", "Almost every business has one or two good places for AI, like answering common questions or summarising. In the free consultation we find where it pays off and where it does not."],
            ["Is my data safe?", "Before we start we agree on what data goes to a model and what does not, and we only use the minimum needed."],
        ],
    },
    {
        slug: "website-design",
        title: "Website design and development",
        short: "Company sites and sales landing pages: fast, SEO-ready, responsive and ready for an AI chatbot.",
        seoTitle: "Website and landing page design in Mashhad | Fast, SEO-ready and smart | Webino-Dev",
        description: "Design and development of company websites and sales landing pages with Next.js and React: high speed, search-friendly structure, great on mobile and optional AI chatbot. Webino-Dev, Mashhad.",
        intro: "A site that is not only beautiful but brings visitors to call, sign up or buy. We design page structure, copy, speed, SEO and an AI chatbot together.",
        for: ["Companies, clinics and local shops that need a professional online presence", "Businesses that need a sales landing page for a campaign or product", "Teams whose current site is slow or broken on mobile"],
        deliver: ["Custom, responsive interface design", "Code in Next.js or React, without heavy ready-made templates", "Speed, technical SEO and structured data", "Contact form, WhatsApp and, if needed, an AI chatbot", "Training on updating content and support after delivery"],
        tech: ["Next.js", "React", "TypeScript", "SEO", "Tailwind CSS"],
        faq: [
            ["How long does it take?", "A simple landing page usually takes a few days to two weeks and a company site a few weeks. After the first conversation we write an exact schedule."],
            ["Can I edit the content myself?", "Yes. Depending on the need, content is editable and delivered with training."],
        ],
    },
    {
        slug: "admin-panel-crm",
        title: "Admin panels, CRM and ERP",
        short: "Dashboards, invoices, contacts and reports: enterprise software with an AI assistant.",
        seoTitle: "Admin panel, CRM and ERP development with React and AI | Webino-Dev",
        description: "Custom admin panels, dashboards, CRM and ERP with React, TypeScript and Redux, with an optional AI assistant. Experience from a large-scale CRM/ERP platform. Free consultation and quote.",
        intro: "Panels that stay smooth with complex data: big tables, multi-step forms, roles and permissions and live reports. Our experience comes from a real CRM/ERP platform, and we can add an AI assistant to it.",
        for: ["Businesses replacing spreadsheets and scattered tools with one system", "Startups that need an admin panel or dashboard for their product", "Organisations whose process does not fit off-the-shelf software"],
        deliver: ["Needs analysis and workflow design with you", "Dashboards, tables, forms and charts built from reusable components", "Roles and permissions, invoicing and finance, reporting", "An AI assistant that summarises reports and answers questions about your data (optional)", "Integration with your backend API and support after delivery"],
        tech: ["React", "TypeScript", "Redux Toolkit", "Ant Design", "AI"],
        faq: [
            ["What if we have no backend?", "We can work with a backend team, or build a simple server with Laravel and a relational database."],
            ["Can you improve our existing panel?", "Yes. Redesigning the interface, optimising existing panels and adding AI are part of what we do."],
        ],
    },
    {
        slug: "web-app-pwa",
        title: "Web apps and PWA",
        short: "Installable, fast, offline apps, with optional AI features.",
        seoTitle: "Smart web app and PWA development | Installable and offline | Webino-Dev",
        description: "Web apps and PWAs with React and Vue: installable on phones, fast, offline-capable and ready for AI features. A good start for ideas that do not want two separate apps (Android and iOS).",
        intro: "If your idea is a tool or platform, a PWA is the quickest way to reach users: one codebase, every device, installable and feeling like a native app. AI features are easy to add.",
        for: ["Ideas that want to reach an MVP at low cost", "Businesses whose users have weak or unstable internet", "Teams that need an internal app (warehouse, orders, field work)"],
        deliver: ["Mobile-first user experience design", "A PWA with install, smart caching and offline mode", "Data sync when the internet comes back", "AI features such as smart search and suggestions (optional)", "API integration, notifications and user login"],
        tech: ["PWA", "React", "Vue", "REST API", "WebSocket"],
        faq: [
            ["Does a PWA replace Android and iOS apps?", "For many ideas, yes, especially at the start. If you need a special device feature we tell you honestly before we begin."],
            ["Does it really work offline?", "Yes. What can be stored works offline and syncs after reconnecting."],
        ],
    },
    {
        slug: "device-interface",
        title: "Device and hardware interfaces",
        short: "Web interfaces for vending machines, ESP32 and Orange Pi: offline, light and stable.",
        seoTitle: "User interfaces for hardware devices (vending, ESP32, Orange Pi) | Webino-Dev",
        description: "Design and development of web interfaces for vending machines and ESP32 and Orange Pi hardware: offline apps, local connection and an online admin panel. Real experience in the vending ecosystem.",
        intro: "Few teams know web interfaces and also cope with hardware limits. We have built interfaces that run on an ESP32 module and an Orange Pi board and work with an online panel.",
        for: ["Makers of vending machines and IoT devices that need a user interface", "Hardware teams that cannot build the frontend and panel themselves", "Projects that must also work on a local network without internet"],
        deliver: ["A light offline React app for limited memory and CPU", "Pricing, users and wallet management on the device", "REST API and WebSocket connection to device and server", "A PWA that connects to devices and the online panel automatically", "Testing on real hardware and documentation"],
        tech: ["React", "ESP32", "Orange Pi", "WebSocket", "PWA"],
        faq: [
            ["Do you build the hardware too?", "We focus on software and user interfaces and work with your hardware team."],
            ["Will the interface be slow on the device?", "We keep it light on purpose and test on the real device."],
        ],
    },
];

export const FAQ_EN: [string, string][] = [
    ["What exactly is Webino-Dev and who is behind it?", "Webino-Dev is a small, agile web and software team in Mashhad with a strong focus on AI. We start with your idea and stay with you until it is live. The core of the team, Hamed Abdollahzade, is a frontend developer with experience on CRM/ERP platforms and vending machine products."],
    ["How can you add AI to my product?", "After a short conversation we find where AI adds the most value, such as a support chatbot, a panel assistant or automation of repetitive work. Then we connect it to your site, panel or app."],
    ["I only have a rough idea and I am not technical. What do I do?", "No problem. In a short conversation we clarify the idea, propose the simplest version that can be built, and write down time and cost clearly."],
    ["Is the first consultation paid?", "No. Reviewing your idea and the first proposal are free."],
    ["How is the project price decided?", "By scope and time. After the conversation you get a written proposal with stages and prices, and payment is in stages."],
    ["Do you offer support after delivery?", "Yes. After delivery there is a support and bug-fix period, and ongoing development if you need it."],
    ["Who owns the code and the project?", "The project and its source code belong to you after payment."],
];

export const PROCESS_EN: [string, string][] = [
    ["Talk", "We listen to your idea and goal. A call or a message is enough."],
    ["Proposal", "We give you scope, time and price in writing, clearly."],
    ["Design", "Before coding, we look at page mock-ups together."],
    ["Build", "Work goes forward in stages and you see and review each one."],
    ["Launch and support", "Release, training and support after delivery."],
];
