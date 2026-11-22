import Image from "next/image";
import Link from "next/link";
import type {Project} from "@/data/projects";
import {localePath, type Locale} from "@/lib/locale";
import {summarize} from "@/lib/site";
import {UI} from "@/lib/ui";

export default function ProjectCard({project, locale}: {project: Project; locale: Locale}) {
    const t = UI[locale];

    return (
        <Link className="project-card" href={localePath(locale, `/projects/${project.slug}/`)}>
            <div className={`project-media${project.imgFit === "contain" ? " project-media--contain" : ""}`}>
                <Image src={`/${project.img}`} alt={project.title} width={720} height={540}/>
            </div>
            <h3>{project.title}</h3>
            <p>{summarize(project.description, 140)}</p>
            <span className="tile-more">{t.home.viewDetails} {t.arrow}</span>
        </Link>
    );
}
