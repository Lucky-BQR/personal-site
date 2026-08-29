import type { TcmBook, TcmNote } from '@/lib/tcm/database';

export const yinyangWuxingBook: TcmBook = {
  id: 'book-yinyang-wuxing-ren-yingqiu',
  name: '阴阳五行',
  description: '阴阳以较高层次观察整体关系、方向与转化；五行以更细颗粒度分类运动性质。二者共同构成一套古代的关系—运动模型。',
  createdAt: '2026-08-29T00:00:00.000+08:00',
  updatedAt: '2026-08-29T10:00:00.000+08:00',
};

const source = '任应秋编著《阴阳五行》，上海科学技术出版社，1960';
const tags = ['阴阳五行', '中医理论', '读书笔记', '任应秋'];
const disclaimer = '本文为传统理论与思想史学习笔记，不构成现代医学诊断或治疗建议。';

const entries = [
  {
    slug: 'from-phenomenon-to-abstraction',
    title: '从现象到抽象',
    image: 'yinyang-wuxing-01-discovery.png',
    alt: '从生活与自然现象逐步形成阴阳五行抽象模型',
    caption: '从具体观察、生活材料到时空秩序与性质抽象。',
    content: '阴阳五行并非从纯概念出发，而是从生活、生产和自然观察中逐步抽象形成。关键变化，是把静态现象放进时间与空间，观察它的方向、阶段和秩序。五行中的“火”是对运动性质的抽象；火焰可以属火，但五行之火不等于具体火焰。',
  },
  {
    slug: 'explanatory-authority',
    title: '谁在解释世界',
    image: 'yinyang-wuxing-02-explanatory-authority.png',
    alt: '从神权解释转向自然解释以及后世重新神秘化',
    caption: '理论本身与后世用法需要区分，解释框架也可能被权力重新占用。',
    content: '阴阳五行曾推动解释权从神意、人格化意志转向自然属性和关系，但任何理论都可能被后世重新神秘化。理论本身不等于它在社会中的使用方式；知识解释权同时涉及社会结构与权力。',
  },
  {
    slug: 'yin-yang-two-sides',
    title: '阴阳：一体两面',
    image: 'yinyang-wuxing-03-yin-yang-structure.png',
    alt: '阴阳作为统一关系系统中的对待与依存',
    caption: '有对待才有变化，有依存才成整体；调和不等于平均。',
    content: '阴阳不是两个孤立实体，而是同一关系系统中相互对待、相互依存的两面。阴阳调和也不等于机械的五五平均，而是与具体情境相适应的动态比例。',
  },
  {
    slug: 'motion-and-direction',
    title: '动静升降',
    image: 'yinyang-wuxing-04-motion.png',
    alt: '动静描述状态而升降描述方向',
    caption: '动静与升降是观察运动的两个维度，并非彼此隔绝的固定标签。',
    content: '动与静描述运动状态，升与降描述运动方向；它们会在条件变化中相互依赖和转化。阴阳因此不是给事物贴固定标签，而是观察事物怎样运动。',
  },
  {
    slug: 'continuity-and-reversal',
    title: '连续与反转',
    image: 'yinyang-wuxing-05-continuity-reversal.png',
    alt: '时间过程中的连续与方向反转',
    caption: '连续回答“是否断裂”，反转回答“是否换向”。',
    content: '“终始嗣续”关注过程是否连续，“两极反复”关注趋势和主导方向是否反转。连续不代表状态完全不变，反转也不必然意味着事物本质已经改变；二者讨论的是不同问题。',
  },
  {
    slug: 'normal-regulation',
    title: '五行的正常调节',
    image: 'yinyang-wuxing-06-normal-regulation.png',
    alt: '五行相生与承制共同维持正常秩序',
    caption: '有生而不失其制，有制而不妨其生。',
    content: '五行用木、火、土、金、水表示不同运动倾向。“生治”表现支持、滋养与阶段性主导，“承制”表现正常制约。相克不是消灭，而是避免某一方向无限扩张；相生与相制共同维持秩序。',
  },
  {
    slug: 'abnormal-imbalance',
    title: '五行的异常失衡',
    image: 'yinyang-wuxing-07-abnormal-imbalance.png',
    alt: '亢乘与胜侮表示顺向过度和逆向反制',
    caption: '先看正常克制方向，再判断是过度制约还是逆向反制。',
    content: '亢乘是沿正常相克方向发生的过度制约；胜侮是弱者或受制者逆正常方向产生反制。乘是顺向过度，侮是逆向反制。异常关系不是凭空生成的新关系，而是原有关系失去尺度。',
  },
  {
    slug: 'medical-application',
    title: '医学中的系统运用',
    image: 'yinyang-wuxing-08-medical-application.png',
    alt: '阴阳五行在传统医学中从生理到摄生的系统运用',
    caption: '传统理论把生理、病变、诊断、治疗与摄生组织为连续系统。',
    content: '本书把医学运用组织为五部分：生理是协调关系，病变是关系失衡，诊断是见象辨变，治疗是反向调节，摄生是顺时预防。这五项构成“人体—环境—时间”的连续系统。这里的脏腑更多是传统医学中的功能集合，不完全等同于现代解剖器官。',
  },
  {
    slug: 'diagnosis-and-adjustment',
    title: '从表象到病因',
    image: 'yinyang-wuxing-09-diagnosis-treatment.png',
    alt: '由外部表象辨识内部关系并确定调节方向',
    caption: '从外部表现到内部关系的推断，是传统辨证逻辑的一部分。',
    content: '表象的是症状，病变是内部阴阳偏盛偏衰或五行生克失序。望闻问切取得外部表现，再由表现反推内部关系；治疗则依据失衡的方向和程度进行调节。可压缩为：**见象—辨变—定向—调节**。\n\n本节只解释传统理论逻辑，不提供现实诊断、处方或自行治疗建议。',
  },
  {
    slug: 'whole-book-map-and-boundaries',
    title: '全书逻辑与理论边界',
    image: 'yinyang-wuxing-10-whole-book-map.png',
    alt: '阴阳五行全书逻辑及理论边界',
    caption: '从经验抽象到医学投射的全书结构，以及古代关系模型的理论边界。',
    content: '全书的核心链条是：\n\n**生活与自然观察 → 现象抽象为时空秩序 → 阴阳把握整体关系 → 五行细分运动性质 → 区分正常秩序与异常失衡 → 投射到生理、病变、诊断、治疗和摄生。**\n\n它最有价值的是关系思维、动态思维和系统思维；局限是类比映射较多、强弱阈值不明确，也缺少现代意义上的独立验证。河图洛书可以理解为象数组织，不应视为经验机制。更稳妥的定位是：阴阳五行是一套古代关系—运动模型，具有系统性和辩证倾向，但不等于现代因果科学。',
  },
] as const;

export const yinyangWuxingNotes: TcmNote[] = entries.map((entry, index) => ({
  id: `yinyang-wuxing-${String(index + 1).padStart(2, '0')}-${entry.slug}`,
  bookId: yinyangWuxingBook.id,
  title: entry.title,
  category: 'reading',
  tags,
  source,
  imageIds: [],
  createdAt: '2026-08-29T00:00:00.000+08:00',
  updatedAt: `2026-08-29T${String(10 - index).padStart(2, '0')}:00:00.000+08:00`,
  content: `> **读书定位**：以思想史和理论模型的方式理解阴阳五行，并区分传统理论与现代医学事实。

${entry.content}

![${entry.alt}](/images/tcm/yinyang-wuxing/${entry.image})

*图 ${index + 1}：${entry.caption}*

---

${disclaimer}`,
}));
