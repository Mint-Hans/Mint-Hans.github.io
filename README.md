# 学习日志

基于 [Shirone](https://github.com/LyraVoid/Shirone) 的 Astro 静态博客，记录游戏开发、计算机基础与 AI 工具实践。

线上地址：https://Mint-Hans.github.io/

## 本地使用

需要 Node.js 22.12 或更新版本。Windows PowerShell 使用 `npm.cmd`。

```powershell
npm.cmd ci
npm.cmd run dev
```

打开 http://localhost:4321/。正式构建与预览：

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd run preview
```

生成的静态网站在 `dist/`。搜索索引随正式构建生成，请在 `preview` 中验证搜索。

## 写文章

```powershell
npm.cmd run new -- "文章标题"
```

新文章保存在 `shirones/content/posts/`，默认 `draft: true`。写完后改为 `false` 才会公开显示。也可以直接创建 Markdown：

```yaml
---
title: 我的文章
published: 2026-09-30
publishedAt: 2026-09-30T20:00:00+08:00
description: 简短摘要。
category: 学习记录
tags: [Unity, 游戏开发]
permalink: /posts/2026/09/30/my-post/
lang: zh_CN
draft: false
---
```

文章图片可以放在 `public/images/` 并引用 `/images/example.webp`，也可以放在文章旁边用相对路径引用。

## 常用设置

| 内容 | 文件 |
| --- | --- |
| 网站标题、中文语言、主题色、首页横幅 | `shirones/config/siteConfig.ts` |
| 名字、头像、个人简介、社交链接 | `shirones/config/profileConfig.ts` |
| 顶部导航 | `shirones/config/navBarConfig.ts` |
| 侧栏、公告 | `shirones/config/sidebarConfig.ts`、`announcementConfig.ts` |
| Giscus 评论 | `shirones/config/commentConfig.ts` |
| 关于页正文 | `shirones/content/spec/about.md` |
| 首页横幅图片 | `public/images/banner.webp`、`banner-mobile.webp` |

首页横幅暂用 Shirone 自带示例图，可直接替换为自己的图片。头像和浏览器图标使用 `public/images/avatar.png`，主题色取自头像发饰的蓝色 `#82A2EF`。默认关闭没有个人内容的番剧、相册、音乐、项目等展示页；填好对应数据后再开启。文章版权授权沿用原站，不自动添加主题示例的 Creative Commons 授权。

## 发布到 GitHub Pages

将当前项目提交并推送到原来的 `Mint-Hans/Mint-Hans.github.io` 仓库的 `main` 分支，`.github/workflows/pages.yml` 会自动构建和发布。仓库 **Settings → Pages → Source** 应使用 **GitHub Actions**。也可在 Actions 中手动运行部署流程。

构建使用 `npm ci`、`npm run check`、`npm run build`，上传目录为 `dist/`。站点根路径与域名保持原样。

## 从 Hexo 迁移

- 迁入原来的 5 篇文章与关于页，正文保留原样。
- `publishedAt` 保留原来的 Asia/Shanghai 发布时间。
- 每篇文章的 `permalink` 保留原 Hexo 地址，Giscus 继续使用 `pathname` 映射。
- Hexo 多级分类以 `学习记录 / C++` 这样的完整分类名保留；标签保留原样。
- 旧 `/archives/`、按年/月的归档地址和旧分类、标签地址通过静态跳转兼容。
- `migration-manifest.json` 记录旧文章与保留地址。
- 迁移前的源文件备份在上一级 `hexo-backup-2026-09-30/`；原 Git 提交历史也保留。

主题固定为 `shirones@0.1.5`，通过 `package-lock.json` 锁定依赖。更新主题时先在本地验证：

```powershell
npm.cmd install shirones@latest
npm.cmd run check
npm.cmd run build
```
