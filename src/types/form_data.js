// #region TYPE DEPEDENCY
import * as Supabase from './supabase';
// #endregion

/**
 * @typedef {Supabase.MatkulData} MatkulFormDataServer
 */

/**
 * @typedef {Object} MatkulFormDataClient
 * @property {string} nama 
 * Nama matakuliah dengan kriteria
 * - min_length : `3`
 * - max_length : `50`
 * - Note : Diinput melalui form oleh user `client-side`
 * @property {number} semester 
 * Semester matakuliah dengan kriteria
 * - min : `0`
 * - max : `50`
 * - Note : Diinput melalui form oleh user `client-side`
 * @property {number} sks 
 * Sks matakuliah dengan kriteria
 * - min: `0`
 * - max : `50`
 * - Note : Diinput melalui form oleh user `client-side`
 * @property {Omit<Supabase.MatkulData['nilai'], 'bobot' | 'akhir'} nilai Object yang merepresentasikan nilai matakuliah
 * @property {boolean} dapat_diulang 
 * Boolean matakuliah dapat diulang atau tidak
 * - Note : Diinput melalui form oleh user `client-side`
 * @property {Omit<Supabase.MatkulData['target_nilai'], 'bobot'>} target_nilai Object yang merepresentasikan nilai target matakuliah
 */

export const FormDataTypes = {}