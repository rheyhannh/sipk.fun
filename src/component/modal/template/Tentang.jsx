// #region NEXT DEPEDENCY
import Link from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useUser from '@/hooks/swr/useUser';
// #endregion

// #region COMPONENT DEPEDENCY
import { ModalContext } from '@/component/modal/provider';
import { Logo } from '@/component/Main';
import { Backdrop, Layout, Head, Inner } from '@/component/modal/components';
// #endregion

// #region ICON DEPEDENCY
import { FaExclamation, FaCodeBranch } from 'react-icons/fa';
import {
	FaPlus,
	FaCircleInfo,
	FaArrowUpRightFromSquare,
	FaQ,
	FaRegRectangleList
} from 'react-icons/fa6';
import { AiFillStar } from 'react-icons/ai';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css';
// #endregion

const FEEDBACK_FORM_URL = 'https://form.jotform.com/250052728882460';

const Tentang = () => {
	const { data } = useUser({ revalidateOnMount: false });

	const getFeedbackFormUrl = () => {
		try {
			if (data && Array.isArray(data) && data[0]) {
				const { id, fullname, email, university } = data[0];
				const url = new URL(FEEDBACK_FORM_URL);

				// Actually we can add 'g_browser' and 'g_os' in jotform to describe browser and os that used,
				// only after we can figured out how to get an UA (user-agent) from client-side because it can be
				// parsed with ua-parser-js https://uaparser.dev/
				url.search = new URLSearchParams({
					fullname,
					email,
					universitas: university,
					g_uid: id
				}).toString();

				return url.toString();
			}

			return FEEDBACK_FORM_URL;
		} catch (error) {
			console.error(error);
			return FEEDBACK_FORM_URL;
		}
	};

	return (
		<ModalContext.Consumer>
			{
				/** @param {import('@/types/context').ModalContext<any>} context */ (
					context
				) => {
					const handleRatingModal = () => {
						// Rating modal still without users rating data.
						context.setData(null);
						context.setPrevModal('tentang');
						context.setModal('rating');
					};

					return (
						<Backdrop>
							<Layout className={`${styles.tentang}`} onEsc={true}>
								<Head title='Tentang' />

								<Inner>
									<div className={styles.content}>
										<Logo
											containerProps={{
												className: styles.content__logo
											}}
											image={{
												src: '/logo_fill.png',
												width: 128,
												height: 128,
												imageProps: {
													priority: true
												}
											}}
										/>

										<div className={styles.content__section}>
											<Section title={'Info'}>
												<Card
													icon={{ primary: <FaCodeBranch /> }}
													title={'Version'}
													description={
														process.env.NEXT_PUBLIC_APP_VERSION ?? '-'
													}
												/>
												{/* <Card
                                                useNextLink={true}
                                                href={'https://l.loggify.app/sipk/changes'}
                                                target={'_blank'}
                                                prefetch={false}
                                                clickable={true}
                                                useActionIcon={true}
                                                icon={{ primary: <FaRegRectangleList /> }}
                                                title={'Release Notes'}
                                                description={'Lihat di sini untuk melihat catatan rilis, apa yang baru dan yang berubah di versi ini'}
                                            /> */}
											</Section>
											<Section title={'Support Us'}>
												<Card
													onClick={handleRatingModal}
													onKeyDown={(event) => {
														if (event.key === 'Enter') handleRatingModal();
													}}
													clickable={true}
													useActionIcon={true}
													icon={{
														primary: <AiFillStar />,
														secondary: <FaPlus />
													}}
													title={'Rating'}
													description={
														'Penilaianmu sangat berarti untuk aplikasi ini'
													}
												/>
												<Card
													useNextLink={true}
													href={getFeedbackFormUrl()}
													target={'_blank'}
													prefetch={false}
													clickable={true}
													useActionIcon={true}
													icon={{ primary: <FaExclamation /> }}
													title={'Feedback'}
													description={
														'Laporin disini kalau kamu mengalami masalah tertentu terkait aplikasi ini'
													}
												/>
											</Section>
											<Section title={'Help & Social'}>
												<Card
													title={'FAQ'}
													description={
														'Pertanyaan yang sering ditanyain dan mungkin bisa menjawab kebinggungan kamu'
													}
													icon={{ primary: <FaQ /> }}
													useNextLink={true}
													clickable={true}
													href={'/faq'}
													prefetch={true}
													onClick={(event) => {
														context.handleModalClose();
													}}
												/>
											</Section>
										</div>
									</div>
								</Inner>
							</Layout>
						</Backdrop>
					);
				}
			}
		</ModalContext.Consumer>
	);
};

function Section({ children, title }) {
	return (
		<div className={styles.item}>
			<h3 className={styles.title}>{title ?? 'Lorem, ipsum.'}</h3>
			{children}
		</div>
	);
}

/**
 * @typedef {Object} CardProps
 * Props yang digunakan component {@link Card} pada modal {@link Tentang}
 * @property {string} [title]
 * Judul yang digunakan
 * - Default : `'Lorem, ipsum.'`
 * @property {string} description
 * Deskripsi yang digunakan
 * @property {Object} [icon]
 * Icon yang digunakan
 * @property {React.ReactNode} [icon.primary]
 * Icon utama yang mendeskripsikan keseluruhan konten card
 * - Default : `<FaCircleInfo />`
 * @property {React.ReactNode} [icon.secondary]
 * Icon sekunder sebagai `ActionIcon` dimana ini mendeskripsikan aksi apa yang user akan lakukan setelah mengklik element
 * - Default : `<FaArrowUpRightFromSquare />`
 * @property {boolean} [useActionIcon]
 * Boolean untuk menampilkan icon sekunder pada props `icon` atau tidak, ini akan mengatur grid layout yang digunakan
 * - Default : `false`
 * @property {boolean} [useNextLink]
 * Container element yang digunakan. Jika `true` maka akan menggunakan component `Link` pada NextJS,
 * jika tidak maka akan menggunakan plain `div`.
 *
 * Umumnya jika element membuka laman atau URL baru, props ini dapat diset `true`, jika element ini
 * mengeksekusi skrip tertentu atau bersifat statis sehingga tidak bisa diklik, props ini dapat diset
 * `false`
 * - Default : `false`
 * @property {boolean} [clickable]
 * Apakah element dapat diklik atau tidak. Jika `true` maka menggunakan beberapa atribut css tambahan
 * - Default : `false`
 */

/**
 * Card atau konten yang tampil pada `Section`
 * @param {React.HTMLProps<HTMLDivElement> & import('@/component/Link').LinkProps['routingOptions'] & CardProps} props Card props
 * @returns {React.ReactElement} Rendered component
 */
function Card({
	title = 'Lorem, ipsum.',
	description,
	icon = { primary: <FaCircleInfo />, secondary: <FaArrowUpRightFromSquare /> },
	useActionIcon = false,
	useNextLink = false,
	clickable = false,
	...props
}) {
	return (
		<CardContainer
			useNextLink={useNextLink}
			clickable={clickable}
			useActionIcon={useActionIcon}
			{...props}
		>
			<CardIcon icon={icon} />
			<CardText title={title} description={description} />
			<CardActionIcon useActionIcon={useActionIcon} icon={icon} />
		</CardContainer>
	);
}

function CardContainer({
	useNextLink,
	clickable,
	useActionIcon,
	children,
	...props
}) {
	return useNextLink ? (
		<Link
			{...props}
			className={`${styles.card} ${useActionIcon ? styles.explore : ''} ${clickable ? styles.clickable : ''}`}
			onClickCapture={(event) => {
				event.currentTarget.blur();
			}}
		>
			{children}
		</Link>
	) : (
		<div
			{...props}
			tabIndex={clickable ? '0' : '-1'}
			className={`${styles.card} ${useActionIcon ? styles.explore : ''} ${clickable ? styles.clickable : ''}`}
		>
			{children}
		</div>
	);
}

function CardIcon({ icon }) {
	return (
		<div className={styles.card_icon}>{icon.primary ?? <FaCircleInfo />}</div>
	);
}

function CardText({ title, description }) {
	return (
		<div className={styles.card_text}>
			<h3>{title}</h3>
			{description ? <small>{description}</small> : null}
		</div>
	);
}

function CardActionIcon({ useActionIcon, icon }) {
	return useActionIcon ? (
		<div className={styles.card_icon}>
			{icon.secondary ?? <FaArrowUpRightFromSquare />}
		</div>
	) : null;
}

export default Tentang;
