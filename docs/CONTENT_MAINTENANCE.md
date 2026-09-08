# 内容与首页维护

## 本次内容

- 网站案例：`content/projects/zhuqing-studio.mdx`
- 开发复盘：`content/garden/building-zhuqing-studio.mdx`
- 两篇内容通过 `relations` 关联，并由现有公开内容加载器读取。

## 首页三种信息

- 此刻：在 `src/data/now.ts` 维护正在创造、正在学习及实际更新时间。日期代表内容更新时间，不应自动取当天日期；思考文案沿用 `src/i18n/translations.ts` 的 `now_thought`，修改时同步更新快照日期。
- 精选项目：由项目 MDX 的 `featured: true` 标记决定。
- 最新记录：从已发布笔记按 `date` 降序取第一篇，与精选标记无关。

## 添加项目

AI 助手案例保留专用图解。其他项目使用自己的 Users、Principles、Architecture、Workflow 和 Reflection 章节，空列表不会显示。Overview、Challenge 和 Status 用于顶部概述。

## 内容边界

只写能够核实的实现、决策和结果。线上部署、跨设备同步、效率提升与读者反馈需有独立证据。本机生活记录目前仍需手动整理成公开 MDX；草稿转换与发布流程留待后续迭代。

## 验证

运行 lint，并用 `GITHUB_PAGES=true` 构建后执行 `npm run site:verify`。检查覆盖新页面链接、首页快照，以及网站案例与 AI 助手案例的内容隔离。
