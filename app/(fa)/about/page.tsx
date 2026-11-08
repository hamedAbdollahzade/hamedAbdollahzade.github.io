import AboutView from "@/views/AboutView";
import {aboutMeta} from "@/views/meta";

export const metadata = aboutMeta("fa");

export default function About() {
    return <AboutView locale="fa"/>;
}
