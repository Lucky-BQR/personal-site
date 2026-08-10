import Image from 'next/image';

export default function ImageFrame({ src, alt, caption, width = 1200, height = 675 }: { src: string; alt: string; caption?: string; width?: number; height?: number }) { return <figure className="my-8"><div className="overflow-hidden rounded-[var(--radius-xl)] border" style={{ borderColor: 'var(--color-border)' }}><Image src={src} alt={alt} width={width} height={height} className="block w-full h-auto" /></div>{caption && <figcaption className="card-meta mt-3">{caption}</figcaption>}</figure>; }
