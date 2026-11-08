import {SERVICES} from "@/data/services";
import ServiceView from "@/views/ServiceView";
import {serviceMeta} from "@/views/meta";

type Params = {slug: string};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
    return SERVICES.map((s) => ({slug: s.slug}));
}

export async function generateMetadata({params}: {params: Promise<Params>}) {
    return serviceMeta("fa", (await params).slug);
}

export default async function ServicePage({params}: {params: Promise<Params>}) {
    return <ServiceView locale="fa" slug={(await params).slug}/>;
}
