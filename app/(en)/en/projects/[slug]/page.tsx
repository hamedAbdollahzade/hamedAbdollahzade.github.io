import {PROJECTS} from "@/data/projects";
import ProjectView from "@/views/ProjectView";
import {projectMeta} from "@/views/meta";

type Params = {slug: string};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
    return PROJECTS.map((p) => ({slug: p.slug}));
}

export async function generateMetadata({params}: {params: Promise<Params>}) {
    return projectMeta("en", (await params).slug);
}

export default async function ProjectPage({params}: {params: Promise<Params>}) {
    return <ProjectView locale="en" slug={(await params).slug}/>;
}
