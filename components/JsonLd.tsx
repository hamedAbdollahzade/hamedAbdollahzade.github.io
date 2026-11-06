/** Renders schema.org JSON-LD. "<" is escaped so the data can't close the script tag. */
export default function JsonLd({data}: {data: unknown}) {
    return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, "\\u003c")}}/>;
}
