export const primaryNavigation = [
  { href: '/projects', label: 'projects', roots: ['/projects'] },
  { href: '/garden', label: 'notes', roots: ['/garden', '/blog', '/topics', '/knowledge', '/guanwo/zhongyi', '/guanwo/yishu'] },
  { href: '/life', label: 'life', roots: ['/life', '/pinjian', '/guanwo/shufa', '/pets', '/inspiration'] },
  { href: '/about', label: 'about', roots: ['/about', '/timeline', '/friends'] },
] as const;

export function belongsToSection(pathname: string, roots: readonly string[]) {
  return roots.some((root) => pathname === root || pathname.startsWith(`${root}/`));
}
