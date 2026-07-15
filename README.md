# 学习日志 Hexo Blog

这是一个基于 Hexo 的静态博客，用来记录学习路线、游戏开发实践、计算机基础补课和 AI 工具使用经验。

## 本地使用

```powershell
cd C:\Users\27186\Desktop\整理学习\study-blog
npm.cmd install
npm.cmd run server
```

本地预览地址通常是 <http://localhost:4000>。

## 写新文章

```powershell
npm.cmd run new -- "文章标题"
```

生成的文章在 `source/_posts/` 目录下。

## 发布到 GitHub Pages

1. 在 GitHub 创建仓库：`YOUR_GITHUB_USERNAME.github.io`。
2. 把 `_config.yml` 里的 `url` 和 `deploy.repo` 改成你的 GitHub 用户名。
3. 初始化 git 并推送源码仓库到 GitHub 的 `main` 分支。
4. 在 GitHub 仓库的 Settings -> Pages 里，把 Source 设为 GitHub Actions。
5. 之后每次 push 到 `main`，`.github/workflows/pages.yml` 会自动构建并发布 `public/`。

也可以手动发布：

```powershell
npm.cmd run deploy
```
