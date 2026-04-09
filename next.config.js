import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const nextConfig = {
    async rewrites() {
        return [
            {
                // :path* 是 Next.js 的通配符，表示匹配后面所有的路由
                source: '/api/:path*',

                // 目标服务器的完整地址
                // 如果后端接口本身包含 /admin-api，则一起拼在后面
                destination: 'https://dev.bbdbuy1.com/api/:path*',

                // 因为你配置了 basePath: '/m'，而前端请求是向根目录的 /api 发送的，所以必须禁用 basePath 匹配
                basePath: false,
            },
            // 如果还有上面的本地代理注释掉的开发环境需求，可以判断一下环境变量：
            // process.env.NODE_ENV !== 'production'
        ]
    },
    transpilePackages: ['antd-mobile'], basePath: '/m', assetPrefix: '/m', experimental: {
        turbo: {}, // 👈 禁用 turbopack！
    },
};
export default withNextIntl(nextConfig);
