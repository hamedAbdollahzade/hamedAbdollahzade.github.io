import Image from "next/image";

/** Profile photo, or the first letter of the name on a soft circle when there is no photo yet. */
export default function Avatar({name, photo, size, priority}: {name: string; photo?: string; size: number; priority?: boolean}) {
    if (photo) return <Image className="avatar" src={`/${photo}`} alt={name} width={size} height={size} priority={priority}/>;
    return <span className="avatar avatar--letter" style={{width: size, height: size, fontSize: size * 0.42}} aria-hidden="true">{[...name][0]}</span>;
}
