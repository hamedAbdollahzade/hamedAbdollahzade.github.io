/* English copy for the projects. Keyed by slug; non-text fields (images, tech, urls) come from data/projects.ts. */

export interface ProjectCopy {
  title: string;
  description: string;
  learned: string[];
  story?: {title: string; text: string}[];
  linkLabels: string[];
  imageCaptions?: string[];
  galleryCaptions?: string[];
}

export const PROJECTS_EN: Record<string, ProjectCopy> = {
  "robot-market": {
    title: "Frontend for the Robot Market vending ecosystem",
    description: "At Robot Market I work on a set of products connected to vending machines. The shared problem is giving people a usable way to manage and work with a machine, both online and offline. My role is frontend development for several parts of this set, from the interface on the device to the panels and the main website.",
    learned: [
      "Building interfaces that respect offline and hardware limits",
      "Implementing pricing, user and wallet management flows",
      "Working on several related products with different needs and runtime environments",
    ],
    story: [
      {title: "Connecting to devices: PWA and online panel", text: "I work on a PWA that connects automatically to offline vending machines, and on the online panel: two parts with different connection conditions that each need their own interface and flow."},
      {title: "Local management: React on ESP32", text: "Another part of my work is an offline React app for the ESP32 module. In it I work on pricing, adding users and the wallet of vending machines."},
      {title: "Next-generation vending: Orange Pi", text: "In the new devices project I work on an Orange Pi board and an offline React app so the device's user interface runs locally."},
      {title: "Product website: Next.js", text: "Next to device software and panels, frontend development of the main Robot Market website with Next.js is also part of my work."},
    ],
    linkLabels: ["Robot Market website"],
    imageCaptions: ["Robot Market admin panel"],
  },
  "link-crm": {
    title: "Link CRM / Link ERP",
    description: "Link is a CRM/ERP platform for managing customers, sales, messaging and finance, with the same experience on desktop and mobile. As a frontend developer in a professional team I worked on the main parts of the panel: sales flow, message inbox, contacts, finance, reports, reminders, form builder and landing page builder. My focus was reusable components, complex forms, dashboards and better UI/UX for real business workflows.",
    learned: [
      "Managing complex state at scale with Redux Toolkit",
      "Building reusable components, tables and multi-step forms",
      "Building responsive interfaces that work the same on desktop and mobile",
      "Integrating REST APIs with backend services and payment gateways",
      "Teamwork with coding standards and code review on a real project",
    ],
    story: [
      {title: "Flow: the sales funnel step by step", text: "In the flow section the sales process is shown with custom stages and types, and the user sees the funnel, follow-ups and the chance of purchase for each customer in one place. I built this interface, from the stage view to cards and filters, with reusable components."},
      {title: "Messenger: one inbox for all chats", text: "Chats from messengers and SMS come into one inbox and each conversation is linked to a related flow. Here I worked on the chat interface, the conversation list and connecting them to customers and workflows."},
      {title: "Contacts: a full file for every customer", text: "A profile for each customer with tags, categories, debt and credit, and a dashboard of where customers come from. I implemented the forms, contact tables, custom fields and bulk import in the interface."},
      {title: "Finance: invoices, payments and balances", text: "Issuing invoices and pro-forma invoices, confirming payments and tracking each customer's balance. I worked on invoice pages, calculation forms and finance tables so entering and reviewing financial data is smooth and low-error."},
      {title: "Reports: a live picture of the business", text: "Charts and reports of revenue trends, invoice payment status and best-selling items. I connected dashboards and charts to API data and optimised their display for different screen sizes."},
      {title: "Reminders, form builder and page builder", text: "One-time or recurring reminders with SMS, a form builder for sign-ups and surveys that sends answers straight to contacts, and a page builder for a quick business landing page. The interface for creating and managing these tools was part of my work."},
    ],
    linkLabels: ["Visit"],
    imageCaptions: ["Panel home page", "Sales flow and funnel stages", "Unified message inbox", "Contacts and customer file", "Finance, invoices and payments", "Revenue and sales reports", "Reminders", "Form builder", "Page builder"],
  },
  wikiq: {
    title: "WikiQ: admin panel of an online exam platform",
    description: "WikiQ is an online platform for exams and question banks that covers school levels up to PhD and recruitment exams, with Android and Windows apps. As a frontend developer I contributed to the platform's admin panel: a panel for managing content and internal workflows, with a clean, modern and scalable frontend architecture.",
    learned: [
      "Scalable frontend architecture with Vite and Context API",
      "Clean, fast UI design with Tailwind CSS",
      "Working with the product team to manage internal workflows",
    ],
    story: [
      {title: "What is the platform?", text: "WikiQ builds and runs online exams and test-question packs. Users can buy packs and exams from the website or the app, take exams and see their results."},
      {title: "Question bank and online exams", text: "The test bank is organised by level and field, from PhD and master's exams to Payame Noor, high school to university entrance, primary school, and general and specialised exams. Online exams are timed, with the number of questions, duration and capacity set for each."},
      {title: "Mobile and desktop app", text: "In the app users take exams online or offline, and afterwards see their total score, per-course results and a detailed answer key. More than 2,247 fields with search, suggested packs based on past purchases and monthly subscriptions per field are available."},
      {title: "Users create packs and exams", text: "Users can upload questions as Excel files, images, video or audio, create a test pack and earn part of its sales. They can also run their own online exams."},
      {title: "My role: the admin panel", text: "My contribution was the frontend of the platform's admin panel: an interface for managing content and internal workflows built with React, Vite, Tailwind CSS and Context API, connected to the platform's API. The images below are from the WikiQ app and show the product this panel supports."},
    ],
    linkLabels: ["WikiQ website", "WikiQ app"],
    galleryCaptions: ["App home: pack search and suggested packs", "Creating an online exam and answering questions", "Taking an online exam with a timer", "Exam result and score per course", "Detailed exam answer key", "Field and category list"],
  },
  "university-student-portal": {
    title: "Student portal",
    description: "A demo of a university portal with role-based sign-in for a student, a training clerk and an admin. The interface is fully right-to-left and Persian, and the demo data stays in the browser only.",
    learned: [
      "Designing sign-in and registration flows for several user roles",
      "A right-to-left interface with light and dark themes",
      "A server-free demo: data never leaves the browser",
    ],
    linkLabels: ["Open the demo"],
  },
  "personal-portfolio": {
    title: "Bilingual personal portfolio",
    description: "A demo resume website for a frontend developer with an animated background, a projects section, a career timeline, skills and contact, plus a Persian/English switch. The content is fictional and made only to show the work.",
    learned: [
      "An animated background and a glass-style interface",
      "A Persian and English language switch",
      "Resume structure: projects, journey, skills and contact",
    ],
    linkLabels: ["Open the demo"],
  },
  "tasksnap": {
    title: "TaskSnap: an Android planner",
    description: "An Android planner for capturing tasks and ideas quickly, setting reminders and following the daily plan. Tasks can be open, partial or completed, and the Persian and English interfaces support the Solar Hijri and Gregorian calendars. Version 0.9.1 was submitted to Myket and Cafe Bazaar for review.",
    learned: [
      "A Flutter interface with on-device storage in SQLite",
      "Reminders and the device calendar through Kotlin",
      "Portable backups with photos and audio, and duplicate-safe restore",
    ],
    linkLabels: [],
    galleryCaptions: ["Today view with progress and three task states", "Ideas", "Progress insights"],
  },
};
