import BlogIndexView from "@/views/BlogIndexView";
import {blogMeta} from "@/views/meta";

export const metadata = blogMeta("en");

export default function BlogIndex() {
    return <BlogIndexView locale="en"/>;
}
