const {
    BugsnagSourceMapUploaderPlugin,
    BugsnagBuildReporterPlugin
} = require('webpack-bugsnag-plugins');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'no-store, must-revalidate' },
                ]
            },
        ]
    },
    experimental: {
        serverActions: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '/sipk_assets/**',
            },
        ],
    },
    compiler: {
        styledComponents: true
    },
    env: {
        NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
    },
}

module.exports = withBundleAnalyzer(nextConfig)
