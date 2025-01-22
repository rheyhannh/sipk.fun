'use client';

// #region NEXT DEPEDENCY
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useLocalTheme from '@/hooks/swr/useLocalTheme';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, AnimatePresence } from 'framer-motion';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@faq_page/faq.module.css';
// #endregion

// #region ICON DEPEDENCY
import { FaPlus } from 'react-icons/fa6';
// #endregion

const LOREM_TITLE = 'Lorem ipsum dolor?';
const LOREM_DESCRIPTION =
	'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!';

/**
 * @typedef {Object} TabItem
 * @property {string} title
 * Judul tab dengan format `lowercase` dan mengganti penggunaan spasi dengan tanda kurang `-` atau garis bawah `_`.
 *
 * Behaviour ini diperlukan karna property ini juga digunakan sebagai value dari URL query param `tab` pada halaman `/faq` dan juga digunakan sebagai `id` element terkait.
 * Selain itu kita ingin meminimalisir error yang dapat terjadi dengan penggunaan simbol.
 *
 * - Contoh : `fitur-rating`
 * @property {Parameters<typeof transformTabTitle>[1]} [type]
 * Tipe render yang digunakan untuk merender {@link TabItem.title judul tab} menggunakan method {@link transformTabTitle} dengan keterangan berikut,
 * - `normal` : Render dengan lowercase (default)
 * - `capitalize` : Render dengan Pascal Case
 * - `uppercase` : Render dengan uppercase
 *
 * Lihat contoh berikut untuk lebih jelasnya
 * ```js
 * const title = 'fitur-rating'
 * // normal = fitur rating
 * // capitalize = Fitur Rating
 * // uppercase = FITUR RATING
 * ```
 * @property {Array<ContentItem>} contents
 * Array yang berisikan content yang relevan dengan {@link TabItem.title judul tab} yang digunakan.
 *
 *
 * ```js
 * const default = [
 *      { title: default_title, description: default_description }
 * ]
 * ```
 *
 * Lihat default {@link LOREM_TITLE title} dan default {@link LOREM_DESCRIPTION description}
 */

/**
 * @typedef {Object} ContentItem
 * @property {string} [title]
 * Judul content
 *
 * - Default : Menggunakan {@link LOREM_TITLE variabel ini}
 * @property {React.ReactNode | (props:FaqProps) => React.ReactNode} [description]
 * Deskripsi konten dimana dapat berupa sebuah string atau custom component yang menerima {@link FaqProps} atau lainnnya yang dapat dirender `React`
 *
 * - Default : Menggunakan {@link LOREM_DESCRIPTION variabel ini}
 */

const TABS = /** @type {Array<TabItem>} */ ([
	{
		title: 'sipk',
		type: 'uppercase',
		contents: [
			{
				title: 'Apa itu SIPK?',
				description: (
					<>
						<span>
							SIPK adalah aplikasi yang mirip dengan portal akademik kampus
							kamu. Bedanya, SIPK nggak cuma menyimpan data matakuliah tapi juga
							membantu kamu menghitung perolehan IPK berdasarkan matakuliah yang
							kamu tambah secara dinamis💫
						</span>
					</>
				)
			},
			{
				title: 'Kenapa SIPK ada?',
				description: (
					<>
						<span>
							SIPK dibuat untuk mendukung kamu dalam{' '}
							<strong>merencanakan</strong> dan <strong>melacak</strong>{' '}
							perjalanan akademikmu:
						</span>
						<ul
							style={{
								marginLeft: '0.5rem',
								marginTop: '0.65rem',
								marginBottom: '0.65rem',
								listStyle: 'circle inside',
								padding: 0
							}}
						>
							<li style={{ marginBottom: '0.5rem' }}>
								<strong>Perencanaan</strong>: SIPK membantu kamu menyusun
								rencana akademik, termasuk menghitung IPK sedini mungkin.
							</li>
							<li style={{ marginBottom: '0.5rem' }}>
								<strong>Pelacakan</strong>: SIPK membantu kamu memantau
								perkembangan IPK dari awal hingga lulus, supaya target
								akademikmu tercapai dengan lebih terarah.
							</li>
						</ul>
						<span>
							Jadi alasan kamu pakai SIPK bukan untuk{' '}
							<strong>mengubah nilai asli</strong> yang sudah kamu peroleh di
							portal akademik kampus kamu yaa❗
						</span>
					</>
				)
			},
			{
				title: 'Apakah SIPK hanya untuk mahasiswa tingkat awal?',
				description: (
					<>
						<span>
							Enggak sama sekali! SIPK cocok untuk semua mahasiswa, baik tingkat
							awal maupun tingkat akhir.
						</span>
						<ul
							style={{
								marginLeft: '0.5rem',
								marginTop: '0.5rem',
								listStyle: 'circle inside',
								padding: 0
							}}
						>
							<li style={{ marginBottom: '0.5rem' }}>
								<strong>Mahasiswa tingkat awal</strong>: Bisa menyusun rencana
								akademik sedini mungkin dengan perhitungan IPK yang akurat.
							</li>
							<li style={{ marginBottom: '0.5rem' }}>
								<strong>Mahasiswa tingkat akhir</strong>: Bisa mengubah nilai
								matakuliah tertentu untuk mengetahui perubahan IPK. Ini berguna
								banget disaat kamu mau mengulang atau memperbaiki matakuliah.
							</li>
						</ul>
					</>
				)
			},
			{
				title:
					'Apakah ada batasan jurusan atau jenjang pendidikan untuk menggunakan SIPK?',
				description: (
					<>
						<span>
							Enggak ada batasan sama sekali! Selama kamu berasal dari
							universitas yang sudah didukung SIPK, kamu bebas menggunakannya,
							apa pun jurusan atau jenjang pendidikanmu💃
						</span>
					</>
				)
			},
			{
				title: 'Apakah SIPK cuma bisa diakses lewat Laptop? ',
				description: (
					<>
						<span>
							SIPK bisa diakses melalui smartphone maupun laptop kamu, yang
							gabisa itu akses kenangan terindah bareng mantan😔
						</span>
					</>
				)
			},
			{
				title: 'Apakah SIPK berbayar?',
				description: (
					<>
						<span>Graatiss🤑</span>
					</>
				)
			}
		]
	},
	{
		title: 'universitas',
		type: 'capitalize',
		contents: [
			{
				title: 'Universitas apa aja yang didukung SIPK?',
				description: ({ universitas }) => (
					<>
						<span>
							Saat ini, SIPK masih dalam tahap akses awal dan baru dapat
							mendukung <strong>{universitas.length} universitas</strong>🚀
						</span>
						<ul
							style={{
								marginLeft: '0.5rem',
								marginTop: '0.65rem',
								marginBottom: '0.65rem',
								listStyle: 'numeric inside',
								padding: 0
							}}
						>
							{universitas.map((item, index) => (
								<li key={index} style={{ marginBottom: '0.5rem' }}>
									<strong>{item.nama}</strong>
								</li>
							))}
						</ul>
						<span>
							Tapi, jangan khawatir! SIPK terus berupaya untuk menambahkan lebih
							banyak universitas, ditunggu yaa⌚
						</span>
					</>
				)
			}
		]
	},
	{
		title: 'privasi',
		type: 'capitalize',
		contents: [
			{
				title: 'Kenapa SIPK membutuhkan data kalian?',
				description: (
					<>
						<span>
							SIPK membutuhkan beberapa data kalian seperti email, nama lengkap
							dan universitas untuk kebutuhan fungsional aplikasi dan tidak
							lebih. Data yang kalian berikan memungkinkan SIPK untuk:
						</span>
						<ul
							style={{
								marginLeft: '0.5rem',
								marginTop: '0.5rem',
								listStyle: 'inside',
								padding: 0
							}}
						>
							<li style={{ marginBottom: '0.5rem' }}>
								Memverifikasi dan mengonfirmasi email kalian saat pendaftaran.
							</li>
							<li style={{ marginBottom: '0.5rem' }}>
								Memberikan akses ke fitur aplikasi.
							</li>
							<li style={{ marginBottom: '0.5rem' }}>
								Memastikan keamanan data kalian melalui penggunaan cookies
								autentikasi.
							</li>
						</ul>
					</>
				)
			},
			{
				title: 'Apakah data yang dimasukkan di SIPK aman?',
				description: (
					<>
						<span>
							SIPK sangat menghargai privasi kalian dan berkomitmen untuk
							melindungi semua informasi pribadi kalian, maka dari itu:
						</span>
						<ul
							style={{
								marginLeft: '0.5rem',
								marginTop: '0.5rem',
								listStyle: 'inside',
								padding: 0
							}}
						>
							<li style={{ marginBottom: '0.5rem' }}>
								SIPK membatasi akses data hanya kepada pihak yang berwenang dan
								hanya digunakan untuk pengembangan atau pemeliharaan aplikasi.
							</li>
							<li style={{ marginBottom: '0.5rem' }}>
								SIPK menggunakan protokol keamanan yang kuat untuk menyimpan
								data kalian.
							</li>
							<li style={{ marginBottom: '0.5rem' }}>
								SIPK secara rutin memantau sistem untuk mencegah pelanggaran
								keamanan.
							</li>
						</ul>
					</>
				)
			},
			{
				title: 'Bagaimana caranya menghapus akun di SIPK?',
				description: (
					<>
						<span>
							Untuk saat ini proses penghapusan akun di SIPK masih secara manual
							sehingga kalian perlu mengajukannya dengan mengirim email ke{' '}
							<strong>
								<a href='mailto:support@mail.sipk.fun'>support@mail.sipk.fun</a>
							</strong>
						</span>
					</>
				)
			}
		]
	},
	{
		title: 'lainnya',
		type: 'capitalize',
		contents: [
			{
				title: 'Ada pertanyaan kamu yang belum terjawab?',
				description: (
					<>
						<span>
							Kalau kamu masih binggung dan ada yang ingin ditanyakan lebih
							jauh, kamu dapat mengirim pertanyaan melalui email ke{' '}
							<strong>
								<a href='mailto:hayyan@mail.sipk.fun'>hayyan@mail.sipk.fun</a>
							</strong>
						</span>
					</>
				)
			}
		]
	}
]);

/**
 * Props yang digunakan component `Faq`
 * @typedef {Object} FaqProps
 * @property {Array<import('@/types/supabase').FaktaData>} fakta
 * @property {Array<import('@/types/supabase').UniversitasData>} universitas
 */

/**
 * Render faq page `'/faq'`
 * @param {FaqProps} props Faq props
 * @returns {React.ReactElement} Rendered faq page
 */
export default function Faq({ fakta, universitas }) {
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = React.useState(-1);

	React.useEffect(() => {
		const tabQuery = searchParams.get('tab');
		if (tabQuery) {
			const tabQueryIndex = TABS.findIndex((item) => item.title === tabQuery);
			if (tabQueryIndex >= 0) {
				setActiveTab(tabQueryIndex);
				return;
			}
		}
		setActiveTab(0);
	}, [searchParams]);

	return (
		<Base>
			<Container>
				<Heading title={'FAQs'} />
				<Tabs>
					{TABS.map((item, index) => (
						<Tab
							key={index}
							tabId={item.title}
							title={transformTabTitle(item.title, item?.type)}
							isActive={activeTab === index}
						/>
					))}
				</Tabs>
				<AnimatePresence mode={'wait'}>
					{TABS.map(
						(item, index) =>
							activeTab === index && (
								<Accordion
									key={index}
									contents={item.contents}
									fakta={fakta}
									universitas={universitas}
								/>
							)
					)}
				</AnimatePresence>
			</Container>
		</Base>
	);
}

/**
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props Base props
 * @returns {React.ReactElement} Rendered component
 */
function Base({ children, ...props }) {
	const { data: theme } = useLocalTheme();

	return (
		<div
			className={`${styles.base} ${styles.colors} ${theme === 'dark' ? styles.dark_theme : ''}`}
			{...props}
		>
			{children}
		</div>
	);
}

/**
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props Container props
 * @returns {React.ReactElement} Rendered component
 */
function Container({ children, ...props }) {
	return (
		<div className={styles.container} {...props}>
			{children}
		</div>
	);
}

/**
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props Heading props
 * @returns {React.ReactElement} Rendered component
 */
function Heading({ title, ...props }) {
	return (
		<div className={styles.heading} {...props}>
			<h1 className={styles.title}>{title}</h1>
		</div>
	);
}

/**
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props Tabs props
 * @returns {React.ReactElement} Rendered component
 */
function Tabs({ children, ...props }) {
	return (
		<div className={styles.tabs} {...props}>
			{children}
		</div>
	);
}

/**
 * Props yang digunakan component `Tab`
 * @typedef {Object} TabProps
 * @property {string} tabId
 * Id element yang diperoleh dari {@link TabItem.title judul tab}
 * @property {string} title
 * {@link TabItem.title Judul tab} yang sudah ditransform menggunakan {@link transformTabTitle}
 * @property {boolean} isActive
 * Boolean yang mengindikasikan apakah tab aktif atau tidak
 */

/**
 * @param {Omit<Parameters<typeof Link>[0], 'id' | 'className' | 'onClickCapture' | 'href' | 'scroll' | 'shallow'> & TabProps} props Tab props
 * @returns {React.ReactElement} Rendered component
 */
function Tab({ tabId, title, isActive, ...props }) {
	const pathname = usePathname();

	return (
		<Link
			id={`tablink-${tabId}`}
			className={`${styles.tab} ${isActive ? styles.active : ''}`}
			onClickCapture={(event) => {
				event.currentTarget.blur();
			}}
			href={pathname + '?' + 'tab=' + encodeURIComponent(tabId)}
			scroll={false}
			shallow={true}
			{...props}
		>
			{title}
		</Link>
	);
}

/**
 * @param {Omit<import('framer-motion').HTMLMotionProps<'div'>, 'transition' | 'initial' | 'animate' | 'exit' | 'className'> & FaqProps & {contents:TabItem['contents']}} props Accordion props
 * @returns {React.ReactElement} Rendered component
 */
function Accordion({
	contents = [{ title: LOREM_TITLE, description: LOREM_DESCRIPTION }],
	fakta,
	universitas,
	...props
}) {
	const searchParams = useSearchParams();
	const [activeIndex, setActiveIndex] = React.useState(
		/** @type {Array<number>} */ ([])
	);

	React.useEffect(() => {
		const contentQuery = searchParams.getAll('content');
		const newState = contentQuery
			.map((contentIndex) => (contentIndex ? Number(contentIndex) : 'null'))
			.filter((x) => !isNaN(x) && x < contents.length);

		if (newState.length) {
			setActiveIndex(newState);
		}
	}, []);

	const handleActivatingItem = (itemIndex) => {
		const isActive = activeIndex.includes(itemIndex);
		const clone = [...activeIndex];
		if (isActive) {
			setActiveIndex(clone.filter((val) => val !== itemIndex));
		} else {
			clone.push(itemIndex);
			setActiveIndex(clone);
		}
	};

	return (
		<motion.div
			className={styles.accordion}
			transition={{ duration: 0.75, type: 'spring', ease: 'backIn' }}
			initial={{ y: 30, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: 30, opacity: 0 }}
			{...props}
		>
			{contents.map((item, index) => (
				<div
					key={index}
					tabIndex={'0'}
					className={`${styles.item} ${activeIndex.includes(index) ? styles.active : ''}`}
					onClickCapture={(event) => {
						event.currentTarget.blur();
					}}
					onClick={() => {
						handleActivatingItem(index);
					}}
					onKeyDown={(event) => {
						if (event.key === 'Enter') handleActivatingItem(index);
					}}
				>
					<h2 className={styles.title}>
						<span>{item.title || LOREM_TITLE}</span>
						<FaPlus className={styles.icon} />
					</h2>

					<motion.div
						className={styles.description}
						transition={{ duration: 0.3, ease: 'easeInOut', bounce: 0 }}
						initial={{ height: 0, marginBottom: 0 }}
						animate={{
							height: activeIndex.includes(index) ? 'max-content' : 0,
							marginBottom: activeIndex.includes(index) ? '1.5rem' : 0
						}}
					>
						<div>
							{typeof item?.description === 'function'
								? item.description({ fakta, universitas })
								: item.description || LOREM_DESCRIPTION}
						</div>
					</motion.div>
				</div>
			))}
		</motion.div>
	);
}

/**
 * Transform `text` yang diberikan menjadi format spesifik tertentu
 * dengan mereplace setiap garis bawah `_` dan tanda kurang `-` yang ada menjadi spasi dan melakukan format dengan tipe transform yang digunakan.
 *
 * Untuk tipe format dapat dilihat sebagai berikut,
 * - `normal` : Format teks menggunakan lowercase
 * - `capitalize` : Format teks menggunakan Pascal Case
 * - `uppercase` : Format teks menggunakan uppercase
 *
 * @param {string} text Input teks, default `lorem_ipsum`
 * @param {'normal' | 'capitalize' | 'uppercase'} type Tipe transform yang digunakan, default `normal`
 * @returns {string} Teks sesuai dengan ketentuan pada deskripsi
 * @example
 * ```js
 * console.log(transformTabTitle('transform_me', 'capitalize')); // 'Transform Me'
 * console.log(transformTabTitle('transform_me', 'uppercase'));  // 'TRANSFORM ME'
 * console.log(transformTabTitle('transform-me', 'normal'));     // 'transform me'
 * console.log(transformTabTitle('transform-me', 'capitalize')); // 'Transform Me'
 * console.log(transformTabTitle('transformme', 'uppercase'));   // 'TRANSFORMME'
 * ```
 */
function transformTabTitle(text = 'lorem_ipsum', type = 'normal') {
	let words = text.replace(/[_-]/g, ' ').split(' ');

	if (type === 'capitalize') {
		return words
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}
	if (type === 'uppercase') {
		return words.join(' ').toUpperCase();
	}

	return words.join(' ').toLowerCase();
}
