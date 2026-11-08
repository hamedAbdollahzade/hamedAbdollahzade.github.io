import {DEVELOPERS} from "@/data/developers";
import DeveloperView from "@/views/DeveloperView";
import {developerMeta} from "@/views/meta";

type Params = {slug: string};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
    return DEVELOPERS.map((d) => ({slug: d.slug}));
}

export async function generateMetadata({params}: {params: Promise<Params>}) {
    return developerMeta("en", (await params).slug);
}

export default async function DeveloperPage({params}: {params: Promise<Params>}) {
    return <DeveloperView locale="en" slug={(await params).slug}/>;
}
