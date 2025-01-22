import { jest, expect, test, describe } from '@jest/globals';
import { getUserIpk } from './stats';

jest.mock('./stats', () => {
	const originalModule = jest.requireActual('./stats');

	return {
		__esModule: true,
		...originalModule,
		getUserSks: jest.fn()
	};
});

const getUserSks = require('./stats').getUserSks;

describe('getUserIpk', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should return -1 if input is not an array', () => {
		expect(getUserIpk(null)).toBe(-1);
		expect(getUserIpk(undefined)).toBe(-1);
		expect(getUserIpk('string')).toBe(-1);
		expect(getUserIpk({})).toBe(-1);
	});

	test('should return -1 if input array is empty', () => {
		expect(getUserIpk([])).toBe(-1);
	});

	test('should calculate the IPK correctly', () => {
		const matkul =
			/** @type {Array<import('@/types/supabase').MatkulData>} */ ([
				{ nilai: { indeks: 'A', akhir: 12 }, sks: 3 },
				{ nilai: { indeks: 'B', akhir: 6 }, sks: 2 }
			]);

		getUserSks.mockReturnValueOnce(5); // Total SKS = 5
		expect(getUserIpk(matkul)).toBe('3.60'); // (12 + 6) / (3 + 2) = 3.60
	});

	test('should handle array with one course', () => {
		const matkul =
			/** @type {Array<import('@/types/supabase').MatkulData>} */ ([
				{ nilai: { indeks: 'B', akhir: 6 }, sks: 2 }
			]);

		getUserSks.mockReturnValueOnce(2); // Total SKS = 2
		expect(getUserIpk(matkul)).toBe('3.00'); // 6 / 2 = 3.00
	});
});
