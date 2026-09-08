import CollectionPage, { appreciationTabs } from '@/components/content/CollectionPage';
export default function Page() { return <CollectionPage title="音乐" description="旋律、编曲、歌词与戏曲，留下听见的感受。" parent={{ href: '/pinjian', label: '品鉴' }} empty="还没有公开的聆听记录。" tabs={appreciationTabs} active="/pinjian/music" />; }
