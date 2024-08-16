// #region TYPE DEPEDENCY
import * as Supabase from './supabase';
// #endregion

/**
 * @typedef {Pick<Supabase.MatkulData, 'nama' | 'semester' | 'sks' | 'dapat_diulang'> & {nilai:Pick<Supabase.MatkulData['nilai'], 'indeks'>} & {target_nilai:Pick<Supabase.MatkulData['target_nilai'], 'indeks'>}} MatkulFormData
 */

/**
 * @typedef {Pick<Supabase.UserData, 'fullname' | 'nickname' | 'jurusan' | 'sks_target' | 'matkul_target' | 'ipk_target' | 'preferences'>} UserFormData
 */

export const FormDataTypes = {}