export const primaryNavigation = [
  { href: '/projects', label: 'projects', roots: ['/projects'] },
  { href: '/garden', label: 'notes', roots: ['/garden', '/blog', '/topics', '/knowledge', '/guanwo/zhongyi', '/guanwo/yishu'] },
  { href: '/write', label: 'write', roots: ['/write', '/life/drafts', '/life/review', '/inspiration'] },
  { href: '/life', label: 'life', roots: ['/life', '/pinjian', '/guanwo/shufa', '/pets'] },
  { href: '/about', label: 'about', roots: ['/about', '/timeline', '/friends'] },
] as const;

export function belongsToSection(pathname: string, roots: readonly string[]) {
  if (roots.includes('/life') && ['/life/drafts', '/life/review'].some(root => pathname === root || pathname.startsWith(root + '/'))) return false;
  return roots.some((root) => pathname === root || pathname.startsWith(`${root}/`));
}
