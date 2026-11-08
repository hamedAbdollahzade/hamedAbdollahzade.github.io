import AboutView from "@/views/AboutView";
import {aboutMeta} from "@/views/meta";

export const metadata = aboutMeta("en");

export default function About() {
    return <AboutView locale="en"/>;
}
