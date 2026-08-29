<!-- markdownlint-disable first-line-heading -->

# 竹青小筑（Zhu Qing 小筑）

一个面向长期成长的中文个人数字花园，聚焦技术创造、持续学习与东方思考。

本项目基于 [Next.js](https://nextjs.org) App Router 构建，面向个人网站、内容输出和项目展示场景。

Phase 5 知识智能化的对接说明见：[docs/PHASE5_FULLSTACK.md](docs/PHASE5_FULLSTACK.md)。

---

## 核心目标

1. 记录真实的技术实践与项目创作过程
2. 建立可持续更新的学习与知识沉淀系统
3. 用“技术 + 东方文化 + 个人思考”构建稳定的数字花园

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量（可选）

复制 `.env.example` 为 `.env.local`，按需配置公开变量：

```bash
cp .env.example .env.local
```

可配置项：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

说明：文档仅建议公开变量，构建后的静态页面会注入这些值。

### 3. 启动开发环境

```bash
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

### 4. 其他脚本

- `npm run build`：构建站点（项目采用 `output: "export"`）
- `npm run start`：启动生产服务（适用于 Node 服务器场景）
- `npm run lint`：运行 ESLint 检查
- `npm run knowledge:sync`：同步知识图谱/学习数据
- `npm run phase5:verify`：Phase 5 校验脚本

---

## 项目结构（重点）

```text
src/
├─ app/                # 页面与路由（App Router）
├─ components/         # UI 组件（布局/主题/内容块）
├─ content/            # 纯内容源（博客/项目/花园/古文/音乐等）
├─ data/               # 静态数据配置
├─ lib/                # 数据解析、内容加载、工具方法
├─ types/              # 类型定义
└─ i18n/               # 国际化配置

scripts/                # 维护脚本（如知识同步）
content/                # 本地内容备份/素材目录（与项目内容系统配套）
public/                 # 静态资源
```

---

## 关键入口文件

- 全局布局：`src/app/layout.tsx`
- 首页：`src/app/page.tsx`
- 全局样式：`src/app/globals.css`
- Next 配置：`next.config.ts`（包含 GitHub Pages 导出配置）
- 路由入口目录：`src/app`

---

## 部署说明

项目默认兼容静态导出，适配 GitHub Pages 场景：

- 本地：`npm run dev`
- 构建：`npm run build`
- 输出目录由 Next.js 导出到默认静态产物
- 启用 GitHub Pages 时，可通过环境变量 `GITHUB_PAGES=true` 配合 `basePath/assetPrefix` 发布

---

## 说明

- 路由与内容均由源码内约定驱动，建议优先在 `src/content` 中维护内容文件，再通过对应 `lib/content/*` 的解析逻辑读取。
- 提交时可直接更新内容文件与组件，不必反复改动核心框架配置。
- 首次开发优先理解：`src/app`、`src/components`、`src/lib/content`。

