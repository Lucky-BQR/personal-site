import CollectionPage, { appreciationTabs } from '@/components/content/CollectionPage';
export default function Page() { return <CollectionPage title="诗歌" description="在诗词与文章之间，记录阅读时的回响。" parent={{ href: '/pinjian', label: '品鉴' }} empty="还没有公开的诗歌品读。" tabs={appreciationTabs} active="/pinjian/poetry" />; }
