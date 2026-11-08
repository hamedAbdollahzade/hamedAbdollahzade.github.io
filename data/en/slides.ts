import type {Slide} from "../slides";

/** English text for the hero slides (same ids and images as data/slides.ts). */
export const SLIDES_EN: Record<string, Pick<Slide, "badge" | "title" | "text" | "imageAlt" | "caption"> & {ctaLabel: string}> = {
    ai: {
        badge: "Artificial intelligence",
        title: "Turn your idea into a product with AI",
        text: "Websites, panels and apps with AI features: chatbots, smart assistants and automation. The first consultation is free.",
        ctaLabel: "Request a project",
        imageAlt: "Sales flow dashboard in the Link CRM platform",
        caption: "Project: Link CRM",
    },
    panel: {
        badge: "Smart panels",
        title: "Admin panels with an AI assistant",
        text: "Dashboards, invoices and live reports that AI can summarise and analyse, built on the experience of a real CRM/ERP.",
        ctaLabel: "About panels",
        imageAlt: "Unified message inbox in the Link CRM platform",
        caption: "Project: Link CRM",
    },
    app: {
        badge: "Apps",
        title: "Smart apps and PWAs, even offline",
        text: "Installable apps with offline support and optional AI, like the WikiQ online exam platform.",
        ctaLabel: "About apps",
        imageAlt: "WikiQ online exam app",
        caption: "Project: WikiQ",
    },
    device: {
        badge: "Smart devices",
        title: "Interfaces for vending machines and hardware",
        text: "Light offline apps on ESP32 and Orange Pi, in sync with the online panel and ready to connect to AI.",
        ctaLabel: "About device interfaces",
        imageAlt: "Robot Market admin panel",
        caption: "Project: Robot Market",
    },
};
