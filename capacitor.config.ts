import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bbd123.app",
  appName: "bbd123",
  webDir: "out",
  server: {
    url: "http://localhost:3000", // ⭐️ 关键：指向开发服务器
    cleartext: true, // 允许 HTTP 明文通信（仅开发需要）
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 200,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
  // bundledWebRuntime: false,
  ios: {
    scheme: "App",
    preferredContentMode: "mobile",
    // contentInset: "always",
  },
};

export default config;
