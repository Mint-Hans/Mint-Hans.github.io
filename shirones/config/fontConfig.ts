import type { FontConfig } from "@/types/fontConfig";
import { resolveFontOptions as resolve } from "@/utils/font-options.ts";
export const fontConfig: FontConfig = {
  mode: "system",
  fontFamilies: [],
  subsetting: { enable: false, includeContent: false, includeI18n: false, includeConfig: false, includeCommon: false, allowRemoteText: false },
  budget: { maxTotalBytes: 6 * 1024 * 1024, maxFamilyBytes: 4 * 1024 * 1024 },
};
export const resolvedFontOptions = resolve(fontConfig);
export const resolveFontOptions = resolve;
