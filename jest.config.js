/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
	dir: './'
});

const config = /** @type {import('jest').Config} */ ({
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
		'^@dashboard_page/(.*)$': '<rootDir>/src/page/dashboard/$1',
		'^@dashboard-matakuliah_page/(.*)$':
			'<rootDir>/src/page/dashboard/matakuliah/$1',
		'^@faq_page/(.*)$': '<rootDir>/src/page/faq/$1',
		'^@magiclink_page/(.*)$': '<rootDir>/src/page/magiclink/$1',
		'^@panduan_page/(.*)$': '<rootDir>/src/page/panduan/$1',
		'^@root_page/(.*)$': '<rootDir>/src/page/root/$1',
		'^@users_page/(.*)$': '<rootDir>/src/page/users/$1',
		'^@assets/(.*)$': '<rootDir>/public/$1'
	}
});

module.exports = createJestConfig(config);
