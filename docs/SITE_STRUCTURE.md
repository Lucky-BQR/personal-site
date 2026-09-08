# 竹青小筑页面与内容说明

顶部导航固定为「项目 / 笔记 / 生活 / 关于」，点击站名回到首页。

| 主栏目 | 子页面 | 返回位置 |
| --- | --- | --- |
| 项目 | 项目列表、项目详情 | 项目 |
| 笔记 | 技术、阅读、生活感悟、哲学、中医 | 笔记 |
| 笔记 | 主题索引、知识网络 | 笔记 |
| 生活 | 品鉴、自己的书法、宠物、灵感 | 生活 |
| 品鉴 | 书法赏析、诗歌、音乐 | 品鉴 |
| 关于 | 时间线、友链 | 关于 |

旧路径继续兼容：中医仍使用 /guanwo/zhongyi，哲学使用 /guanwo/yishu，自己的书法使用 /guanwo/shufa。网址兼容不改变栏目归属。旧博客入口展示笔记，旧文章链接转向对应笔记。

## 内容来源

- 公开文章：content/garden/*.mdx。category 支持 technology、reading、reflection；status: published 才公开。分类筛选从网址读取，支持刷新与前进后退。
- 项目：content/projects/*.mdx。列表与详情共用同一份内容；详细设计可展开阅读。
- 关于：content/creator/story.mdx。
- 时间线：content/timeline/*.mdx。保留原有锚点。
- 哲学已有条目保留，未提供正文时明确显示“待整理”。
- 书法、宠物、品鉴、友链尚无真实内容，显示空状态，不发布设计稿里的示例。
- 中医：当前浏览器 IndexedDB，保留书籍、笔记、原图、导入导出与备份功能。
- 灵感：沿用既有 localStorage 存储键，不迁移或清空旧记录。
- 中医和灵感不会随 Git 推送公开，也不会自动跨设备同步。

## 本地预览与部署

使用 Node.js 22 或更新的兼容 LTS。安装依赖 npm ci，开发 npm run dev。
生产预览先构建 npm run build，再 npm run preview，默认端口 3100。
GitHub Pages 构建时设 GITHUB_PAGES=true，预览地址使用 /personal-site/ 前缀。
推送 main 会通过 GitHub Actions 构建并发布；其他分支不部署。

## 设计原则

保留现有米白、竹青与字号。详情页居中，去掉普通文章的重复推荐模块；不添加装饰竹叶和深绿页尾。
所有子页标明返回位置，导航高亮所属栏目。无内容时保持自然留白。
