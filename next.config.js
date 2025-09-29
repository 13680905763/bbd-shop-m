/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const nextConfig = {
    transpilePackages: ['antd-mobile'], basePath: '/m', assetPrefix: '/m', experimental: {
        turbo: {}, // 👈 禁用 turbopack！
    },
};
export default withNextIntl(nextConfig);
