export interface Skill {
  name: string;
  level: number; // 1-5
  category: 'frontend' | 'backend' | 'design' | 'tools' | 'other';
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  tech?: string[];
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  startYear: string;
  endYear: string;
}

export interface Profile {
  name: string;
  nickname: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  avatar: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
}

export const profile: Profile = {
  name: '白清如',
  nickname: '竹青',
  title: '技术探索者 · 生活记录者 · 哲学爱好者',
  tagline: '在技术与生活之间，寻找平衡与创新。',
  bio: `热爱技术，关注创新，也热爱生活本身。
喜欢用代码解决问题，也喜欢在哲学思考中寻找答案。
工作之余研习中国哲学、中医与书法，相信技术的尽头是人文，创新的源泉是生活。
代码可以是诗，产品可以是艺术，而生活本身就是一件不断迭代的作品。`,
  location: '中国',
  avatar: '/images/avatar.jpg',
  skills: [
    { name: 'TypeScript', level: 4, category: 'frontend' },
    { name: 'React', level: 4, category: 'frontend' },
    { name: 'Next.js', level: 3, category: 'frontend' },
    { name: 'Vue', level: 3, category: 'frontend' },
    { name: 'Tailwind CSS', level: 4, category: 'frontend' },
    { name: 'Figma', level: 3, category: 'design' },
    { name: 'Node.js', level: 3, category: 'backend' },
    { name: 'Python', level: 2, category: 'backend' },
    { name: 'Git', level: 4, category: 'tools' },
  ],
  experience: [
    {
      company: '某科技公司',
      role: '技术探索者',
      startDate: '2023-01',
      description: '用技术解决实际问题，关注产品设计与工程效率，持续学习新技术与新理念。',
      tech: ['React', 'TypeScript', 'Next.js'],
    },
  ],
  education: [
    {
      school: '某大学',
      degree: '本科',
      major: '计算机科学与技术',
      startYear: '2019',
      endYear: '2023',
    },
  ],
};

export const skillCategories: Record<Skill['category'], string> = {
  frontend: '前端',
  backend: '后端',
  design: '设计',
  tools: '工具',
  other: '其他',
};
