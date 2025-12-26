import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 🎯 支持的语言列表
export const supportedLngs = ["zh", "en", "fr"];

// 🎯 默认语言
export const defaultLng = "zh";

// 🎯 静态应用的资源加载方式
const loadResources = async (lng: string) => {
  try {
    // 从 public/locales 目录加载
    const response = await fetch(`/locales/${lng}.json`);

    if (!response.ok) throw new Error(`无法加载语言: ${lng}`);

    return await response.json();
  } catch {
    return {};
  }
};

// 🎯 初始化 i18n
export const initI18n = async () => {
  // 从 localStorage 获取保存的语言
  const savedLang = localStorage.getItem("i18nextLng");
  const initialLang = supportedLngs.includes(savedLang || "")
    ? savedLang!
    : defaultLng;

  // 加载初始语言资源
  const initialResources = await loadResources(initialLang);

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      // 🎯 初始资源
      resources: {
        [initialLang]: {
          translation: initialResources,
        },
      },

      // 🎯 语言配置
      lng: initialLang,
      fallbackLng: defaultLng,
      supportedLngs,

      // 🎯 语言检测配置
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "i18nextLng",
      },

      // 🎯 性能优化
      ns: ["translation"],
      defaultNS: "translation",
      fallbackNS: "translation",

      // 🎯 开发配置
      debug: process.env.NODE_ENV === "development",

      // 🎯 插值配置
      interpolation: {
        escapeValue: false, // React 已经做了 XSS 防护
      },

      // 🎯 其他配置
      saveMissing: false,
      parseMissingKeyHandler: (key: string) => {
        return key;
      },
    });

  // 🎯 预加载其他语言（提升切换速度）
  supportedLngs.forEach(async (lng) => {
    if (lng !== initialLang) {
      try {
        const resources = await loadResources(lng);

        i18n.addResourceBundle(lng, "translation", resources);
      } catch {
        // 静默失败，等切换时再加载
      }
    }
  });

  return i18n;
};

export default i18n;
