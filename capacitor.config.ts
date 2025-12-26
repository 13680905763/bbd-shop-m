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
  },
  // bundledWebRuntime: false,
  ios: {
    scheme: "App",
    preferredContentMode: "mobile",
    // contentInset: "always",
  },
};

export default config;
