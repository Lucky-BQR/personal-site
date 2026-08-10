import { siteConfig } from '@/data/site';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || siteConfig.url;
export function absoluteUrl(pathname = '/') { return `${siteUrl}/${pathname.replace(/^\//, '')}`; }
