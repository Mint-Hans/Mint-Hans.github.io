import type { ProfileConfig } from "@/types/config";
import { withUserConfig } from "@/utils/config-overlay.ts";

/**
 * 博主资料：头像 / 名称 / 简介 / 社交链接（侧栏 Profile 卡片、页脚、RSS 作者等消费）。
 * 类型见 src/types/config.ts。
 */
export const profileConfig: ProfileConfig = withUserConfig("profile", {
	avatar: "/images/avatar.png", // 用户提供的原始头像。
	name: "Mint",
	bio: "软件工程学生，正在通往游戏开发者的路上。",
	links: [{ name: "GitHub", icon: "fa6-brands:github", url: "https://github.com/Mint-Hans" }, { name: "RSS", icon: "material-symbols:rss-feed-rounded", url: "/rss.xml" }],
});
