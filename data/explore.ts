/* Explore posts: an Instagram-style feed. Every post gets its own page (/explore/<slug>/).
   To add a post, append an object to EXPLORE_POSTS. To replace a placeholder image, drop the
   file into public/assets/images/explore/ and change its path in `images`. */

import type {Locale} from "@/lib/locale";

export interface ExplorePost {
  slug: string;
  /** ISO date, shown on the post page. */
  date: string;
  /** Aparat video hash (the part after /v/ in the video URL). Shown inside an iframe. */
  aparat?: string;
  /** Up to any number of images; the first one is the tile in the grid. */
  images: {src: string; alt: {fa: string; en: string}}[];
  /** Contact number for buying. */
  phone: string;
  phoneDisplay: string;
  title: {fa: string; en: string};
  /** Caption copied from Aparat. Extend it later. */
  caption: {fa: string; en: string};
  tags: {fa: string[]; en: string[]};
}

export const EXPLORE_POSTS: ExplorePost[] = [
  {
    slug: "aura-vent-keratin-ventilation",
    date: "2026-11-11",
    aparat: "vfo4tzj",
    images: [
      {src: "assets/images/explore/aura-vent-1.jpg", alt: {fa: "دستگاه تهویه کراتین Aura Vent، تصویر ۱", en: "Aura Vent keratin ventilation unit, image 1"}},
      {src: "assets/images/explore/aura-vent-2.jpg", alt: {fa: "دستگاه تهویه کراتین Aura Vent، تصویر ۲", en: "Aura Vent keratin ventilation unit, image 2"}},
      {src: "assets/images/explore/aura-vent-3.jpg", alt: {fa: "دستگاه تهویه کراتین Aura Vent، تصویر ۳", en: "Aura Vent keratin ventilation unit, image 3"}},
    ],
    phone: "+989336341491",
    phoneDisplay: "۰۹۳۳ ۶۳۴ ۱۴۹۱",
    title: {fa: "دستگاه تهویه کراتین Aura Vent", en: "Aura Vent keratin ventilation unit"},
    caption: {
      fa: "دستگاه تهویه کراتین مخصوص سالن‌های زیبایی",
      en: "A keratin ventilation unit made for beauty salons.",
    },
    tags: {fa: ["سالن زیبایی", "تهویه هوا", "تهویه مطبوع"], en: ["Beauty salon", "Air ventilation", "HVAC"]},
  },
];

export const getExplorePost = (slug: string) => EXPLORE_POSTS.find((p) => p.slug === slug);

export const exploreText = (post: ExplorePost, locale: Locale) => ({
  title: post.title[locale],
  caption: post.caption[locale],
  tags: post.tags[locale],
});
