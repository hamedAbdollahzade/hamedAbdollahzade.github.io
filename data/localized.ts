/* Locale-aware accessors: Persian data lives in the base modules, English copy in data/en/. */

import type {Locale} from "@/lib/locale";
import {COURSES, courseOf} from "./courses";
import type {Course} from "./courses";
import {COURSES_EN} from "./en/courses";
import {DEVELOPER_EN, SKILL_TITLES_EN, TIMELINE_EN} from "./en/developers";
import {PROJECTS_EN} from "./en/projects";
import {BRAND_EN, FAQ_EN, PROCESS_EN, SERVICES_EN} from "./en/services";
import {SLIDES_EN} from "./en/slides";
import {DEVELOPERS} from "./developers";
import type {Developer} from "./developers";
import {PROJECTS} from "./projects";
import type {Project} from "./projects";
import {BRAND, FAQ, PROCESS, SERVICES} from "./services";
import type {Service} from "./services";
import {SLIDES} from "./slides";
import type {Slide} from "./slides";

/** Services in the given language. */
export function getServices(locale: Locale): Service[] {
    return locale === "en" ? SERVICES_EN : SERVICES;
}

/** FAQ list in the given language. */
export function getFaq(locale: Locale): [string, string][] {
    return locale === "en" ? FAQ_EN : FAQ;
}

/** Work-process steps in the given language. */
export function getProcess(locale: Locale): [string, string][] {
    return locale === "en" ? PROCESS_EN : PROCESS;
}

/** Brand data with the tagline and city of the given language. */
export function getBrand(locale: Locale) {
    return locale === "en" ? {...BRAND, ...BRAND_EN} : BRAND;
}

/** Projects with titles, descriptions, stories and captions in the given language. */
export function getProjects(locale: Locale): Project[] {
    if (locale === "fa") return PROJECTS;
    return PROJECTS.map((project) => {
        const copy = PROJECTS_EN[project.slug];
        if (!copy) return project;
        return {
            ...project,
            title: copy.title,
            description: copy.description,
            learned: copy.learned,
            story: copy.story ?? project.story,
            links: project.links.map((link, i) => ({...link, label: copy.linkLabels[i] ?? link.label})),
            images: project.images?.map((image, i) => ({...image, caption: copy.imageCaptions?.[i] ?? image.caption})),
            gallery: project.gallery?.map((image, i) => ({...image, caption: copy.galleryCaptions?.[i] ?? image.caption})),
        };
    });
}

/** Developers with bio, role, mentors, skill titles and timeline in the given language. */
export function getDevelopers(locale: Locale): Developer[] {
    if (locale === "fa") return DEVELOPERS;
    return DEVELOPERS.map((dev) => {
        const copy = DEVELOPER_EN[dev.slug];
        if (!copy) return dev;
        return {
            ...dev,
            name: dev.nameEn,
            role: copy.role,
            bio: copy.bio,
            mentors: dev.mentors?.map((m, i) => ({...m, ...copy.mentors[i]})),
            skillGroups: dev.skillGroups?.map((g) => ({...g, title: SKILL_TITLES_EN[g.title] ?? g.title})),
            timeline: dev.timeline?.map((entry, i) => ({...entry, ...TIMELINE_EN[i]})),
        };
    });
}

/** Hero slides with texts in the given language. */
export function getSlides(locale: Locale): Slide[] {
    if (locale === "fa") return SLIDES;
    return SLIDES.map((slide) => {
        const copy = SLIDES_EN[slide.id];
        if (!copy) return slide;
        const {ctaLabel, ...rest} = copy;
        return {...slide, ...rest, cta: {...slide.cta, label: ctaLabel}};
    });
}

/** Course (blog category) title and description in the given language. */
export function getCourseCopy(category: string, locale: Locale): {title: string; description: string} {
    if (locale === "en" && COURSES_EN[category]) return COURSES_EN[category];
    const course = courseOf(category);
    return {title: course?.title ?? category, description: course?.description ?? ""};
}

/** All courses (Persian category keys) for listing pages. */
export function getCourses(): Course[] {
    return COURSES;
}
