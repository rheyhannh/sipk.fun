const {
	BugsnagSourceMapUploaderPlugin,
	BugsnagBuildReporterPlugin
} = require('webpack-bugsnag-plugins');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
});

const nextConfig = /** @type {import('next').NextConfig} */ ({
	async headers() {
		return [
			{
				source: '/api/:path*',
				headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }]
			}
		];
	},
	experimental: {
		serverActions: true
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'storage.googleapis.com',
				pathname: '/sipk_assets/**'
			}
		]
	},
	compiler: {
		styledComponents: true
	},
	env: {
		NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version
	},
	productionBrowserSourceMaps: true,
	webpack(config, { buildId, webpack }) {
		// Report build and upload source maps to Bugsnag ONLY when,
		// - NEXT_PUBLIC_BUGSNAG_SITEKEY exist
		// - BUGSNAG_PURGE equal to 'true'
		// - NODE_ENV equal to 'production'
		// This behaviour exist because we want to make sure build report and source maps that uploaded
		// on Bugsnag match to each appVersion (process.env.npm_package_version). So each error events in
		// Bugsnag match to its correct build report and source maps.
		// See more at : https://docs.bugsnag.com/build-integrations/webpack/
		if (
			process.env.NEXT_PUBLIC_BUGSNAG_SITEKEY &&
			process.env.BUGSNAG_PURGE === 'true' &&
			process.env.NODE_ENV === 'production'
		) {
			config.plugins.push(
				// Define build reporter plugin, other configuration and opts can be seen at
				// https://docs.bugsnag.com/build-integrations/webpack/#configuration
				new BugsnagBuildReporterPlugin(
					{
						apiKey: process.env.NEXT_PUBLIC_BUGSNAG_SITEKEY,
						appVersion: process.env.npm_package_version,
						releaseStage: process.env.NODE_ENV
					},
					{ logLevel: 'debug' }
				),
				// Define source maps uploader plugin, other opts can be seen at
				// https://docs.bugsnag.com/build-integrations/webpack/#source-map-uploader
				new BugsnagSourceMapUploaderPlugin({
					apiKey: process.env.NEXT_PUBLIC_BUGSNAG_SITEKEY,
					appVersion: process.env.npm_package_version,
					publicPath: process.env.NEXT_PUBLIC_SIPK_URL + '/_next/'
				})
			);
		}

		return config;
	}
});

module.exports = withBundleAnalyzer(nextConfig);
