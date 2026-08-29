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
  title: '数字空间实践者',
  tagline: '在代码、知识与东方智慧之间，构建属于未来的数字空间。',
  bio: `白清如（Selene Bai）长期关注软件工程、人工智能与数字产品的设计和实践。
她也持续探索东方思想，思考技术、知识与东方智慧之间的连接，并以此构建面向未来的数字空间。`,
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
