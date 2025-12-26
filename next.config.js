/** @type {import('next').NextConfig} */
// ❌ 移除 next-intl 导入
// import createNextIntlPlugin from 'next-intl/plugin';
// const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    transpilePackages: ['antd-mobile'],

    // 🎯 静态导出配置
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    // 构建时忽略 ESLint 错误
    eslint: {
        ignoreDuringBuilds: true,
    },
    // 禁用预获取，解决 Capacitor 环境下的 RSC payload 错误
    // 这种错误是因为 Next.js 尝试预加载页面数据，但在 file:// 或 capacitor:// 协议下路径解析失败
    experimental: {
        turbo: {},
        workerThreads: false,
        cpus: 1,
    },
};

// ❌ 修改这里
// export default withNextIntl(nextConfig);
export default nextConfig;  // ✅ 直接导出