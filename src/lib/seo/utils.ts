export const siteUrl = 'https://your-site.vercel.app';
export function absoluteUrl(pathname = '/') { return new URL(pathname, siteUrl).toString(); }
export function cleanText(value: string) { return value.replace(/\s+/g, ' ').trim(); }
