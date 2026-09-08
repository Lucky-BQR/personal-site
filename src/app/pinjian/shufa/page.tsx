import CollectionPage, { appreciationTabs } from '@/components/content/CollectionPage';
export default function Page() { return <CollectionPage title="书法赏析" description="读古帖，观笔意，记录自己的理解。" parent={{ href: '/pinjian', label: '品鉴' }} empty="还没有公开的赏析记录。" tabs={appreciationTabs} active="/pinjian/shufa" />; }
