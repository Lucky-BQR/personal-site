export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  brand: {
    name: string;
    englishName: string;
    positioning: string;
    philosophy: string;
  };
  creator: {
    name: string;
    englishName: string;
    courtesyName: string;
    penName: string;
  };
  author: {
    name: string;
    email: string;
    github: string;
    nickname: string;
    avatar: string;
  };
  social: {
    github?: string;
    twitter?: string;
    email?: string;
    juejin?: string;
    zhihu?: string;
    bilibili?: string;
  };
  nav: NavItem[];
}

export interface NavItem {
  label: string;
  labelZh: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export const siteConfig: SiteConfig = {
  name: 'personal-site',
  title: '竹青小筑',
  description: '技术与生活交织的个人数字花园。关注创新、编程、古典文化与生活之美。',
  url: 'https://lucky-bqr.github.io/personal-site',
  brand: {
    name: '竹青小筑',
    englishName: 'ZhuQing Studio',
    positioning: '有思想的技术创造者',
    philosophy: '探索技术、知识与东方智慧之间的连接方式。',
  },
  creator: {
    name: '白清如',
    englishName: 'Selene Bai',
    courtesyName: '厚朴',
    penName: '苏木',
  },
  author: {
    name: '白清如',
    email: '',
    github: '',
    nickname: '竹青',
    avatar: '/images/avatar.jpg',
  },
  social: {
    github: '',
    email: '',
  },
  nav: [
    { label: 'home', labelZh: '首页', href: '/' },
    { label: 'about', labelZh: '关于我', href: '/about' },
    { label: 'projects', labelZh: '项目', href: '/projects' },
    { label: 'blog', labelZh: '博客', href: '/blog' },
    {
      label: 'guanwo',
      labelZh: '观我',
      href: '/guanwo',
      children: [
        { label: 'philosophy', labelZh: '哲学', href: '/guanwo/yishu' },
        { label: 'tcm', labelZh: '中医', href: '/guanwo/zhongyi' },
        { label: 'calligraphy', labelZh: '书法', href: '/guanwo/shufa' },
      ],
    },
    {
      label: 'pinjian',
      labelZh: '品鉴',
      href: '/pinjian',
      children: [
        { label: 'shufa', labelZh: '书法赏析', href: '/pinjian/shufa' },
        { label: 'poetry', labelZh: '诗歌文学', href: '/pinjian/poetry' },
        { label: 'music', labelZh: '歌曲戏曲', href: '/pinjian/music' },
      ],
    },
    { label: 'garden', labelZh: '笔记花园', href: '/garden' },
    { label: 'topics', labelZh: '主题', href: '/topics' },
    { label: 'pets', labelZh: '宠物', href: '/pets' },
    { label: 'inspiration', labelZh: '灵感速记', href: '/inspiration' },
    { label: 'timeline', labelZh: '时间线', href: '/timeline' },
    { label: 'friends', labelZh: '友链', href: '/friends' },
  ],
};
