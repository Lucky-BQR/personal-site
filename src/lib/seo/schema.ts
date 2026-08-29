import { absoluteUrl } from './utils';

type SchemaListItem = {
  name: string;
  path: string;
};

export function personSchema() { return { '@context': 'https://schema.org', '@type': 'Person', name: '白清如', alternateName: 'Selene Bai', description: '数字花园实践与内容创作者', url: absoluteUrl('/about') }; }
export function websiteSchema() { return { '@context': 'https://schema.org', '@type': 'WebSite', name: 'ZhuQing Studio', url: absoluteUrl('/'), description: '个人数字花园：技术实践、学习与东方思考' }; }
export function articleSchema(title: string, description: string, datePublished: string, slug: string) { return { '@context': 'https://schema.org', '@type': 'Article', headline: title, description, datePublished, author: { '@type': 'Person', name: '白清如', url: absoluteUrl('/about') }, url: absoluteUrl(`/garden/${slug}`) }; }
export function projectSchema(name: string, description: string, slug: string) { return { '@context': 'https://schema.org', '@type': 'CreativeWork', name, description, creator: { '@type': 'Person', name: '白清如' }, url: absoluteUrl(`/projects/${slug}`) }; }
export function softwareSchema(name: string, description: string, slug: string) { return { ...projectSchema(name, description, slug), '@type': 'SoftwareApplication', applicationCategory: 'DeveloperApplication', author: { '@type': 'Person', name: '白清如' } }; }

export function breadcrumbSchema(items: SchemaListItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageSchema(name: string, description: string, path: string, items: SchemaListItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: item.name,
          url: absoluteUrl(item.path),
        },
      })),
    },
  };
}
