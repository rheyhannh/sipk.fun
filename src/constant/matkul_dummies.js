/**
 * Props MatkulDummies
 * @typedef {Object} MatkulDummiesProps
 * @property {string} id
 * Id matakuliah dummies dalam bentuk `UUID`
 * - Contoh : `'a86bfd11-9f8c-40f1-9f57-511f7a3daa6d'`
 * @property {'tambah'|'hapus'} type
 * Tipe matakuliah dummies
 * @property {string} nama
 * Nama matakuliah dummies dalam bentuk pascal case
 * - Contoh : `'Bahasa Indonesia'`
 * @property {string} date
 * Tanggal matakuliah dummies
 * - Contoh : `Mon Dec 08 2014 15:16:51 GMT+0700 (Waktu Indonesia Barat)`
 * @property {string} nilai
 * Indeks nilai matakuliah dummies dimana menggunakan sistem indeks {@link MatkulDummiesNilai berikut} atau sama dengan yang digunakan Universitas Indonesia
 * @property {number} sks
 * Sks matakuliah dummies
 * @property {number} semester
 * Semester matakuliah dummies
 */

/**
 * Nilai matakuliah dalam string yang digunakan MatkulDummies
 * @typedef {'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'E'} MatkulDummiesNilai
 */

/**
 * @constant
 * Array dengan length `100` yang berisikan matkul dummies atau matakuliah palsu
 */
const MatkulDummies = /** @type {Array<MatkulDummiesProps>} */ ([
    {
        "id": "4a814014-940a-4144-bd26-b3f521c93ab6",
        "type": "tambah",
        "nama": "Bahasa Indonesia",
        "date": "Mon Dec 08 2014 15:16:51 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 3,
        "semester": 2
    },
    {
        "id": "4767d2f3-b90e-4926-b323-719e09ba820d",
        "type": "hapus",
        "nama": "Statistika",
        "date": "Mon Dec 26 2022 07:18:28 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 2,
        "semester": 5
    },
    {
        "id": "15839055-c89e-4a1d-bc3f-b768f13d93d2",
        "type": "tambah",
        "nama": "Kalkulus",
        "date": "Tue Mar 07 2023 21:33:39 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 3,
        "semester": 4
    },
    {
        "id": "f077db2c-256e-4718-ba5d-92516512b410",
        "type": "hapus",
        "nama": "Fisika Dasar",
        "date": "Wed Mar 17 2021 15:20:11 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 1,
        "semester": 4
    },
    {
        "id": "38c95e04-dfcc-4a02-853a-cea9856e2cab",
        "type": "tambah",
        "nama": "Kimia Dasar",
        "date": "Fri Jun 10 2016 06:42:10 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 3,
        "semester": 4
    },
    {
        "id": "32670d46-078d-495e-8a33-a04645123331",
        "type": "tambah",
        "nama": "Biologi Umum",
        "date": "Fri Feb 03 2017 02:50:55 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 2,
        "semester": 6
    },
    {
        "id": "bd53bfda-9649-401f-81b3-4eade68ccca1",
        "type": "tambah",
        "nama": "Sistem Informasi",
        "date": "Wed Jan 22 2020 13:09:09 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 1,
        "semester": 8
    },
    {
        "id": "2d4bdd1f-4ecc-421d-9285-4045ae52b183",
        "type": "tambah",
        "nama": "Algoritma dan Pemrograman",
        "date": "Sat Sep 23 2017 21:42:52 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 1,
        "semester": 8
    },
    {
        "id": "458453cd-85f8-4bfa-b816-1cf3852053ec",
        "type": "hapus",
        "nama": "Struktur Data",
        "date": "Fri Jan 15 2016 23:22:52 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 1,
        "semester": 4
    },
    {
        "id": "bfc0466b-ffef-4b09-afa0-b07188f787e1",
        "type": "tambah",
        "nama": "Jaringan Komputer",
        "date": "Wed Jun 01 2022 11:28:41 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 3,
        "semester": 6
    },
    {
        "id": "3061df3b-5b90-4fb3-a3aa-5237c13152c8",
        "type": "hapus",
        "nama": "Basis Data",
        "date": "Tue Oct 04 2022 01:15:44 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 1,
        "semester": 6
    },
    {
        "id": "04f1763d-bf03-404a-a504-900ac04c455a",
        "type": "hapus",
        "nama": "Pemrograman Web",
        "date": "Tue Oct 16 2018 14:39:31 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 4,
        "semester": 7
    },
    {
        "id": "3ae1afe7-e909-431e-9abd-9429ed05bb4f",
        "type": "tambah",
        "nama": "Keamanan Komputer",
        "date": "Wed Jan 24 2024 07:21:04 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 2,
        "semester": 3
    },
    {
        "id": "ba46006c-5b2a-4d78-9d12-bd6569283d3d",
        "type": "hapus",
        "nama": "Manajemen Proyek TI",
        "date": "Sat Aug 22 2020 21:11:21 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 1,
        "semester": 4
    },
    {
        "id": "af582336-02fd-4ee1-8cad-71ca9d4959fb",
        "type": "hapus",
        "nama": "Analisis Sistem",
        "date": "Sat Oct 21 2023 08:29:36 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 2,
        "semester": 1
    },
    {
        "id": "64084116-48c1-4443-a69d-5294351e39d9",
        "type": "tambah",
        "nama": "Desain Grafis",
        "date": "Wed Sep 11 2019 00:23:38 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 4,
        "semester": 2
    },
    {
        "id": "1214e273-0a65-4012-8c9e-03770019b19e",
        "type": "tambah",
        "nama": "Teknologi Multimedia",
        "date": "Fri Jun 26 2020 15:15:37 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4,
        "semester": 8
    },
    {
        "id": "0ed9c306-e96d-495f-b6a9-18b96f64ff3e",
        "type": "tambah",
        "nama": "Kewirausahaan",
        "date": "Sun Jun 16 2024 13:42:25 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 3,
        "semester": 2
    },
    {
        "id": "2d9641de-7ca4-432b-a9b4-79d01b002002",
        "type": "hapus",
        "nama": "Etika Profesi",
        "date": "Fri Jan 09 2015 14:49:45 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 1,
        "semester": 5
    },
    {
        "id": "92f54933-ad42-4fe6-b626-9a0509d43d58",
        "type": "tambah",
        "nama": "Manajemen Pemasaran",
        "date": "Thu Sep 09 2021 16:21:02 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 3,
        "semester": 7
    },
    {
        "id": "e276462e-6f74-4622-b4cf-8336dd0256ce",
        "type": "tambah",
        "nama": "Akuntansi Dasar",
        "date": "Sun Jan 05 2020 04:36:50 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 1,
        "semester": 5
    },
    {
        "id": "d06f3ada-2f25-486c-b6ef-32cb0648cf02",
        "type": "hapus",
        "nama": "Ekonomi Mikro",
        "date": "Fri Feb 12 2016 23:04:16 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 2,
        "semester": 8
    },
    {
        "id": "8e7fdaad-7403-4bc0-975b-c6900196460a",
        "type": "tambah",
        "nama": "Ekonomi Makro",
        "date": "Fri Apr 09 2021 16:26:31 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 3,
        "semester": 2
    },
    {
        "id": "5a1728dc-53b6-47ba-8258-c90ba2dbfc7d",
        "type": "hapus",
        "nama": "Hukum Bisnis",
        "date": "Tue Sep 02 2014 02:58:18 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 1,
        "semester": 6
    },
    {
        "id": "622f6852-73dc-4b74-a7a8-fbbeba3ce5ee",
        "type": "hapus",
        "nama": "Teori Organisasi",
        "date": "Sun Sep 12 2021 13:16:18 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 4,
        "semester": 4
    },
    {
        "id": "6d7a54bc-c9f5-4a92-8996-cf2313556e97",
        "type": "hapus",
        "nama": "Psikologi Industri",
        "date": "Fri Jul 14 2017 16:38:42 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 4,
        "semester": 1
    },
    {
        "id": "35c0d659-7669-4070-b8ad-523663a99481",
        "type": "hapus",
        "nama": "Psikologi Sosial",
        "date": "Sun May 31 2015 00:35:20 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 2,
        "semester": 5
    },
    {
        "id": "e1020025-f400-474d-91c3-ccd79bc10e95",
        "type": "tambah",
        "nama": "Psikologi Pendidikan",
        "date": "Thu May 04 2017 01:51:16 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 3,
        "semester": 6
    },
    {
        "id": "855d854d-1f75-4204-9218-7998585cdfef",
        "type": "hapus",
        "nama": "Psikologi Klinis",
        "date": "Sun Oct 20 2019 05:05:10 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 1,
        "semester": 8
    },
    {
        "id": "317a9e63-0834-4f65-8f4b-9e4ba0a679ca",
        "type": "hapus",
        "nama": "Sosiologi",
        "date": "Sat Jul 26 2014 13:36:39 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 3,
        "semester": 2
    },
    {
        "id": "5af35a0a-8b73-4b60-a2f2-9640997a754b",
        "type": "hapus",
        "nama": "Antropologi",
        "date": "Sun May 25 2014 15:20:31 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 2,
        "semester": 3
    },
    {
        "id": "d24eeb79-e378-4b1b-94b0-ea2b6b579804",
        "type": "tambah",
        "nama": "Ilmu Politik",
        "date": "Tue Jun 06 2017 17:57:17 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4,
        "semester": 8
    },
    {
        "id": "ff0b3b84-a470-4331-b1b8-ed5d12dd5eef",
        "type": "hapus",
        "nama": "Hubungan Internasional",
        "date": "Tue Aug 30 2022 00:13:29 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 4,
        "semester": 2
    },
    {
        "id": "3dcfab16-d882-45cc-9517-6ac8fc2fb4e9",
        "type": "tambah",
        "nama": "Metodologi Penelitian",
        "date": "Sat Apr 06 2024 22:16:46 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 2,
        "semester": 2
    },
    {
        "id": "900918a9-8c54-41df-a6dd-08acd0bfadc7",
        "type": "tambah",
        "nama": "Statistika Sosial",
        "date": "Tue Jul 28 2015 04:13:25 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 1,
        "semester": 8
    },
    {
        "id": "e54e493f-eb0d-4324-a3e3-34f53bcec613",
        "type": "hapus",
        "nama": "Metode Penelitian Kualitatif",
        "date": "Fri Jul 21 2017 05:09:15 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 3,
        "semester": 4
    },
    {
        "id": "2102068d-3532-4b20-ba3f-9ff2796a229e",
        "type": "hapus",
        "nama": "Metode Penelitian Kuantitatif",
        "date": "Sun Dec 07 2014 04:23:00 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 3,
        "semester": 2
    },
    {
        "id": "6dbb960b-5ceb-4780-aedc-cef6c34af49d",
        "type": "tambah",
        "nama": "Sejarah Indonesia",
        "date": "Tue Nov 03 2020 07:52:00 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 2,
        "semester": 8
    },
    {
        "id": "99b60139-7818-4192-bfe1-fdfe9506802d",
        "type": "hapus",
        "nama": "Sejarah Dunia",
        "date": "Thu Jun 20 2024 00:17:29 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 2,
        "semester": 5
    },
    {
        "id": "8293a4bc-7dff-4318-a597-3edbbf59267c",
        "type": "hapus",
        "nama": "Geografi",
        "date": "Thu Oct 31 2024 16:57:18 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 2,
        "semester": 3
    },
    {
        "id": "5311b691-769f-4aae-a8a9-a6da5994aaa0",
        "type": "tambah",
        "nama": "Geologi",
        "date": "Sun Nov 22 2015 21:50:36 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 2,
        "semester": 7
    },
    {
        "id": "9d4e0c71-c2c3-457a-8ef6-03b2d113f6e3",
        "type": "tambah",
        "nama": "Ekologi",
        "date": "Thu Jun 11 2015 07:10:50 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 1,
        "semester": 1
    },
    {
        "id": "ffcbb104-28ea-4898-b563-912c40c04cf9",
        "type": "hapus",
        "nama": "Manajemen Sumber Daya Alam",
        "date": "Fri May 10 2024 17:40:22 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 3,
        "semester": 4
    },
    {
        "id": "5873c3f9-00c3-49f9-9eea-80e5ed95230b",
        "type": "tambah",
        "nama": "Teknik Lingkungan",
        "date": "Tue Sep 01 2015 20:09:20 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 1,
        "semester": 8
    },
    {
        "id": "56e97cdc-13fc-4d8b-9e2c-13c84b0a87af",
        "type": "hapus",
        "nama": "Hukum Lingkungan",
        "date": "Mon Jan 31 2022 10:52:01 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 3,
        "semester": 8
    },
    {
        "id": "f7f0986c-ddb2-4442-b21b-56477b76a9a4",
        "type": "tambah",
        "nama": "Pengantar Ilmu Komunikasi",
        "date": "Wed Jan 28 2015 16:38:00 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 1,
        "semester": 2
    },
    {
        "id": "61dd538b-8cc2-4b01-9a26-9e2cf2877481",
        "type": "tambah",
        "nama": "Jurnalistik",
        "date": "Fri Jun 23 2017 15:12:18 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 3,
        "semester": 4
    },
    {
        "id": "6504f975-1677-46c4-ae91-e94f9c33c3d2",
        "type": "hapus",
        "nama": "Hubungan Masyarakat",
        "date": "Sun Aug 05 2018 18:37:42 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 3,
        "semester": 2
    },
    {
        "id": "2888715b-99fa-49e4-9b23-caac30cb6198",
        "type": "hapus",
        "nama": "Produksi Media",
        "date": "Sun Oct 25 2020 02:39:34 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 1,
        "semester": 1
    },
    {
        "id": "ede0d962-8228-414d-95cc-d3876e80a6e1",
        "type": "hapus",
        "nama": "Komunikasi Pemasaran",
        "date": "Mon Mar 08 2021 00:03:38 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 2,
        "semester": 8
    },
    {
        "id": "7ddf514f-4c13-4ee6-8bd2-636543d62e0e",
        "type": "tambah",
        "nama": "Ilmu Ekonomi",
        "date": "Mon Nov 20 2023 05:21:36 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 1,
        "semester": 2
    },
    {
        "id": "9f9aa815-2be0-4099-bac8-64f62e2f19f3",
        "type": "tambah",
        "nama": "Sistem Ekonomi",
        "date": "Fri Oct 03 2014 05:15:44 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 3,
        "semester": 6
    },
    {
        "id": "6855a8bc-ee05-4f20-b8d7-5dbe7ca1544f",
        "type": "tambah",
        "nama": "Pengantar Manajemen",
        "date": "Sat Sep 17 2022 04:30:01 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 1,
        "semester": 4
    },
    {
        "id": "3ec53978-05f0-4eab-9ad7-ed923054abd1",
        "type": "hapus",
        "nama": "Pengantar Akuntansi",
        "date": "Wed Feb 01 2023 14:03:07 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 3,
        "semester": 4
    },
    {
        "id": "24516e47-64b5-4e4f-be7e-9fff1a052ebf",
        "type": "hapus",
        "nama": "Hukum Perdata",
        "date": "Sat Jan 15 2022 16:30:33 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4,
        "semester": 5
    },
    {
        "id": "9245f819-fea6-4b3f-8228-45d5728d23e9",
        "type": "hapus",
        "nama": "Hukum Pidana",
        "date": "Sat Mar 17 2018 07:25:38 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 2,
        "semester": 3
    },
    {
        "id": "7a289ae8-0aa1-4168-8076-b08de29772e2",
        "type": "tambah",
        "nama": "Hukum Internasional",
        "date": "Thu Jun 12 2014 05:46:14 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 3,
        "semester": 7
    },
    {
        "id": "d9ae9ff1-2409-47ef-85d2-dfdb73f191e1",
        "type": "tambah",
        "nama": "Administrasi Publik",
        "date": "Wed Nov 16 2022 22:25:53 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 4,
        "semester": 4
    },
    {
        "id": "115b7c65-394c-4308-95e6-ad9e3e007969",
        "type": "tambah",
        "nama": "Administrasi Bisnis",
        "date": "Sun Dec 24 2023 18:12:46 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 3,
        "semester": 2
    },
    {
        "id": "916478b6-5cef-4cd8-b4f6-6ff7c8882d50",
        "type": "tambah",
        "nama": "Manajemen Keuangan",
        "date": "Fri Aug 09 2019 01:31:48 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 2,
        "semester": 6
    },
    {
        "id": "204ac55a-a1a9-4505-9ba0-2233eda7bc2d",
        "type": "hapus",
        "nama": "Manajemen Operasi",
        "date": "Thu Apr 21 2022 02:31:32 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 2,
        "semester": 5
    },
    {
        "id": "c4b80eed-97fd-4aec-b76c-c8391d90c45c",
        "type": "tambah",
        "nama": "Manajemen Strategis",
        "date": "Wed May 24 2023 00:12:47 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 1,
        "semester": 8
    },
    {
        "id": "8d765878-ac2b-469e-8386-cce53ffa73da",
        "type": "tambah",
        "nama": "Ilmu Kedokteran Dasar",
        "date": "Sun Jun 17 2018 23:14:05 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 4,
        "semester": 2
    },
    {
        "id": "d68bbc86-4e53-4b49-99f5-797df45d5916",
        "type": "hapus",
        "nama": "Farmakologi",
        "date": "Sat Sep 17 2016 19:52:11 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 2,
        "semester": 4
    },
    {
        "id": "3ffa42c6-793a-4545-bc12-acd1c9d498b9",
        "type": "tambah",
        "nama": "Patologi",
        "date": "Sun Nov 13 2016 06:15:05 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 4,
        "semester": 4
    },
    {
        "id": "d36e4a85-5628-4c0e-a393-89af6057e4b3",
        "type": "tambah",
        "nama": "Anatomi Manusia",
        "date": "Fri Apr 19 2024 07:50:04 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 3,
        "semester": 5
    },
    {
        "id": "71e77a5b-308c-41a4-9304-eaa35fe1e7f1",
        "type": "hapus",
        "nama": "Fisiologi Manusia",
        "date": "Wed Mar 11 2015 11:28:56 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 4,
        "semester": 2
    },
    {
        "id": "e9604103-3244-4111-84db-8367cd1c1a0f",
        "type": "tambah",
        "nama": "Mikrobiologi",
        "date": "Fri Jan 16 2015 01:58:30 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 2,
        "semester": 5
    },
    {
        "id": "996e77ee-b75e-4c60-85fe-cc7e24fa2a03",
        "type": "hapus",
        "nama": "Kesehatan Masyarakat",
        "date": "Thu Nov 29 2018 07:31:50 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 2,
        "semester": 8
    },
    {
        "id": "06137bf7-34f8-4a17-898b-8454d7725941",
        "type": "tambah",
        "nama": "Epidemiologi",
        "date": "Sat Jul 29 2017 18:39:14 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 3,
        "semester": 4
    },
    {
        "id": "0ebe56de-aaf6-4f4e-8e90-90ea3a9d060c",
        "type": "hapus",
        "nama": "Gizi Kesehatan",
        "date": "Tue Apr 21 2015 22:18:01 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 2,
        "semester": 2
    },
    {
        "id": "d8b31b4e-8179-48a9-9615-b61ddc257216",
        "type": "hapus",
        "nama": "Kepemimpinan dalam Kesehatan",
        "date": "Fri Dec 22 2017 06:19:38 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 4,
        "semester": 3
    },
    {
        "id": "317610f7-733a-4830-b1ef-1015be29010c",
        "type": "tambah",
        "nama": "Teknik Mesin",
        "date": "Thu Oct 28 2021 05:45:28 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 2,
        "semester": 4
    },
    {
        "id": "387f0dd5-6544-4814-9515-4d5f27292614",
        "type": "hapus",
        "nama": "Termodinamika",
        "date": "Mon Jun 12 2017 08:28:30 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 3,
        "semester": 5
    },
    {
        "id": "2c41217e-d1af-46c7-a974-da7fa005e251",
        "type": "hapus",
        "nama": "Mekanika Fluida",
        "date": "Sun Jun 16 2024 12:02:59 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4,
        "semester": 7
    },
    {
        "id": "9f9d4c5d-f1b8-4c05-a5ff-1f18a5bbde39",
        "type": "tambah",
        "nama": "Desain Mekanik",
        "date": "Thu Mar 12 2015 09:54:13 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 2,
        "semester": 6
    },
    {
        "id": "011eeb69-9bd4-4a14-864d-87d625b49629",
        "type": "hapus",
        "nama": "Teknik Material",
        "date": "Mon Mar 27 2017 21:17:45 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 1,
        "semester": 6
    },
    {
        "id": "93eca9a1-e632-489c-9e19-b48a51bb0871",
        "type": "hapus",
        "nama": "Proses Manufaktur",
        "date": "Tue Jan 12 2016 08:40:13 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 3,
        "semester": 6
    },
    {
        "id": "9689b697-bb38-430d-b130-266a334802a2",
        "type": "hapus",
        "nama": "Rekayasa Sistem",
        "date": "Thu Feb 23 2017 20:47:57 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 3,
        "semester": 5
    },
    {
        "id": "28bfbb91-5807-4ad0-98c1-73d8386cedce",
        "type": "tambah",
        "nama": "Teknik Elektro",
        "date": "Sat Jul 23 2022 09:35:31 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 1,
        "semester": 1
    },
    {
        "id": "790fdfc3-613e-4b3c-892d-6d5f97973bde",
        "type": "tambah",
        "nama": "Elektronika Dasar",
        "date": "Sat Aug 08 2015 13:52:58 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 2,
        "semester": 7
    },
    {
        "id": "035ed5f8-ca89-409f-944a-1f14f1af4829",
        "type": "hapus",
        "nama": "Sistem Tenaga Listrik",
        "date": "Tue Apr 05 2022 16:38:42 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 1,
        "semester": 1
    },
    {
        "id": "b16dfceb-7330-4612-81b4-2322f2da418c",
        "type": "tambah",
        "nama": "Instrumentasi",
        "date": "Sat Sep 23 2023 11:32:16 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 2,
        "semester": 7
    },
    {
        "id": "f6939c81-77e1-433a-b5b9-29cb15f02c02",
        "type": "tambah",
        "nama": "Kontrol Otomatis",
        "date": "Wed Aug 17 2016 01:13:00 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 2,
        "semester": 2
    },
    {
        "id": "35ca34bf-1e63-4017-902a-49bc34a89254",
        "type": "hapus",
        "nama": "Telekomunikasi",
        "date": "Sat Dec 07 2019 00:17:18 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 4,
        "semester": 4
    },
    {
        "id": "351b0bd9-b04f-4cb6-8653-ea41e560e4f4",
        "type": "hapus",
        "nama": "Robotika",
        "date": "Sat Dec 26 2015 04:23:31 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 2,
        "semester": 8
    },
    {
        "id": "6b164bd4-8972-4fbf-bcfb-c7dd68dfb06e",
        "type": "tambah",
        "nama": "Seni Musik",
        "date": "Mon Apr 27 2015 06:57:32 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4,
        "semester": 4
    },
    {
        "id": "5ca41fb9-7655-43ae-81be-d8509ea3135c",
        "type": "hapus",
        "nama": "Seni Tari",
        "date": "Sat Aug 17 2024 06:05:07 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 1,
        "semester": 3
    },
    {
        "id": "0330dcb9-c0c9-4e6f-88a1-8d02a9a069ae",
        "type": "tambah",
        "nama": "Seni Rupa",
        "date": "Wed Jun 27 2018 20:15:27 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 4,
        "semester": 4
    },
    {
        "id": "8a2d7a81-47e9-41eb-a5e1-e521c50fe772",
        "type": "tambah",
        "nama": "Desain Interior",
        "date": "Sun Aug 30 2015 03:31:15 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 3,
        "semester": 3
    },
    {
        "id": "db348cdf-93ff-41c7-9568-4b17efb22689",
        "type": "hapus",
        "nama": "Desain Produk",
        "date": "Wed Feb 03 2016 15:57:37 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 1,
        "semester": 1
    },
    {
        "id": "4c131540-d1a0-4257-b7b5-5dd917d64367",
        "type": "tambah",
        "nama": "Arsitektur",
        "date": "Sat Jul 06 2019 16:06:37 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 3,
        "semester": 5
    },
    {
        "id": "307484c1-8aec-4106-9c06-e6c1bb8cfa98",
        "type": "tambah",
        "nama": "Perencanaan Wilayah dan Kota",
        "date": "Wed Feb 27 2019 22:06:04 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 3,
        "semester": 1
    },
    {
        "id": "35de9614-3fb9-4dea-bcf7-3e28bad0b3a5",
        "type": "hapus",
        "nama": "Konstruksi Bangunan",
        "date": "Thu Oct 14 2021 10:30:45 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 2,
        "semester": 2
    },
    {
        "id": "3a200544-686e-451d-9ccc-34fbd5be89c8",
        "type": "tambah",
        "nama": "Hukum Tata Negara",
        "date": "Mon Feb 24 2014 22:15:04 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 3,
        "semester": 8
    },
    {
        "id": "c8b2481c-c24f-479f-bfd5-6d86d1e9cb46",
        "type": "tambah",
        "nama": "Hukum Agraria",
        "date": "Mon Feb 08 2021 04:06:35 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 1,
        "semester": 1
    },
    {
        "id": "89db902c-f933-4278-a285-f590833f5db7",
        "type": "hapus",
        "nama": "Pengantar Filsafat",
        "date": "Wed Jul 24 2024 01:28:39 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 1,
        "semester": 5
    },
    {
        "id": "2ae73688-3735-472c-89e6-258747ed56cf",
        "type": "hapus",
        "nama": "Logika",
        "date": "Sat Jan 18 2014 17:27:38 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 2,
        "semester": 4
    },
    {
        "id": "66468f73-dc98-4175-a070-f63bb7b994da",
        "type": "hapus",
        "nama": "Etika",
        "date": "Wed Dec 28 2022 20:49:40 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 2,
        "semester": 1
    },
    {
        "id": "7f321c35-21f6-4ec2-a892-95362523f5f2",
        "type": "tambah",
        "nama": "Sejarah Filsafat",
        "date": "Sun Jan 29 2023 20:39:29 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 2,
        "semester": 3
    }
])

/**
 * @constant 
 * Object dengan key sebagai indeks nilai dengan value bobot nilai yang digunakan {@link MatkulDummies}
 * @example
 * ```js
 * console.log(MatkulDummiesNilaiBobot['A']) // 4
 * console.log(MatkulDummiesNilaiBobot['B']) // 3
 * console.log(MatkulDummiesNilaiBobot['D+']) // 1.75
 * console.log(MatkulDummiesNilaiBobot['E']) // 1
 * ```
 */
const MatkulDummiesNilaiBobot = {
    'A+': 4,
    'A': 3.75,
    'A-': 3.5,
    'B+': 3.25,
    'B': 3,
    'B-': 2.75,
    'C+': 2.5,
    'C': 2.25,
    'C-': 2,
    'D+': 1.75,
    'D': 1.5,
    'D-': 1.25,
    'E': 1,
}

/**
 * @constant 
 * Object dengan key sebagai indeks nilai dengan value color preset yang digunakan {@link MatkulDummies}
 * @example
 * ```js
 * console.log(MatkulDummiesNilaiColorPreset['A']) // 'success'
 * console.log(MatkulDummiesNilaiColorPreset['B']) // 'warning'
 * console.log(MatkulDummiesNilaiColorPreset['D+']) // 'danger'
 * console.log(MatkulDummiesNilaiColorPreset['D+']) // 'crimson'
 * ```
 */
const MatkulDummiesNilaiColorPreset = {
    'A+': 'success',
    'A': 'success',
    'A-': 'success',
    'B+': 'success',
    'B': 'warning',
    'B-': 'warning',
    'C+': 'warning',
    'C': 'warning',
    'C-': 'danger',
    'D+': 'danger',
    'D': 'danger',
    'D-': 'danger',
    'E': 'crimson',
}

export {
    MatkulDummies,
    MatkulDummiesNilaiBobot,
    MatkulDummiesNilaiColorPreset,
};