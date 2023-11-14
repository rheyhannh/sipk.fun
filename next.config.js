/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "http://localhost:3000" },
                    { key: 'Cache-Control', value: 'no-store, must-revalidate' },
                    { key: 'X-Powered-By', value: 'Next.js' }
                ]
            }
        ]
    },
    experimental: {
        serverActions: true,
    }
}

module.exports = nextConfig
