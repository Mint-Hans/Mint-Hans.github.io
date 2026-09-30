import { defineConfig } from "astro/config";
import shirones from "shirones";

export default defineConfig({
  // Generate the search index with the Pagefind CLI after the static build;
  // the theme's built-in hook uses URL.pathname, which is invalid on Windows.
  integrations: [shirones({ pagefind: false })],
  redirects: {
  "/archives/": "/archive/",
  "/tags/Unity/": "/archive/?tag=Unity",
  "/tags/游戏开发/": "/archive/?tag=%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91",
  "/tags/计算机基础/": "/archive/?tag=%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80",
  "/tags/AI 工具/": "/archive/?tag=AI%20%E5%B7%A5%E5%85%B7",
  "/categories/学习路线/": "/archive/?category=%E5%AD%A6%E4%B9%A0%E8%B7%AF%E7%BA%BF",
  "/archives/2026/": "/archive/",
  "/archives/2026/07/": "/archive/",
  "/tags/AI/": "/archive/?tag=AI",
  "/tags/学习方法/": "/archive/?tag=%E5%AD%A6%E4%B9%A0%E6%96%B9%E6%B3%95",
  "/tags/效率工具/": "/archive/?tag=%E6%95%88%E7%8E%87%E5%B7%A5%E5%85%B7",
  "/tags/LLM/": "/archive/?tag=LLM",
  "/tags/内容分发/": "/archive/?tag=%E5%86%85%E5%AE%B9%E5%88%86%E5%8F%91",
  "/tags/推荐算法/": "/archive/?tag=%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95",
  "/categories/学习记录/": "/archive/?category=%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95",
  "/archives/2026/08/": "/archive/",
  "/tags/C++/": "/archive/?tag=C%2B%2B",
  "/tags/编程语言/": "/archive/?tag=%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80",
  "/tags/干货/": "/archive/?tag=%E5%B9%B2%E8%B4%A7",
  "/categories/学习记录/C++/": "/archive/?category=%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95%20%2F%20C%2B%2B",
  "/tags/Cinemachine/": "/archive/?tag=Cinemachine",
  "/tags/3C/": "/archive/?tag=3C"
}
});
