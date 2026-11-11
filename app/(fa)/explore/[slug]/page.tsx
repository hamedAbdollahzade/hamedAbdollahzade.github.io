import {EXPLORE_POSTS} from "@/data/explore";
import ExplorePostView from "@/views/ExplorePostView";
import {explorePostMeta} from "@/views/meta";

type Params = {slug: string};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
    return EXPLORE_POSTS.map((p) => ({slug: p.slug}));
}

export async function generateMetadata({params}: {params: Promise<Params>}) {
    return explorePostMeta("fa", (await params).slug);
}

export default async function ExplorePostPage({params}: {params: Promise<Params>}) {
    return <ExplorePostView locale="fa" slug={(await params).slug}/>;
}
