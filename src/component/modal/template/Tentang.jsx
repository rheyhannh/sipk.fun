// #region NEXT DEPEDENCY
import Link from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { ModalContext } from '@/component/modal/provider';
import { Logo } from '@/component/Main';
import { Backdrop, Layout, Head, Inner } from '@/component/modal/components';
// #endregion

// #region ICON DEPEDENCY
import { FaExclamation, FaBook, FaTelegramPlane, FaCoffee, FaCodeBranch, FaRegUser, FaRegCalendarCheck } from 'react-icons/fa'
import { FaPlus, FaCircleInfo, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { AiFillStar } from 'react-icons/ai';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css'
// #endregion

const Tentang = () => (
    <ModalContext.Consumer>
        {/** @param {import('@/types/context').ModalContext<any>} context */ context => {
            const handleRatingModal = () => {
                // Rating modal still without users rating data.
                context.setData(null);
                context.setPrevModal('tentang');
                context.setModal('rating');
            }

            return (
                <Backdrop>
                    <Layout className={`${styles.tentang}`} onEsc={true}>
                        <Head title='Tentang' />

                        <Inner>
                            <div className={styles.content}>
                                <Logo
                                    containerProps={{
                                        className: styles.content__logo,
                                    }}
                                    image={{
                                        src: '/logo_fill.png',
                                        width: 128,
                                        height: 128,
                                        imageProps: {
                                            priority: true,
                                        }
                                    }}
                                />

                                <div className={styles.content__section}>
                                    <Section title={'Info'}>
                                        <Card icon={{ primary: <FaCodeBranch /> }} title={'Version'} description={process.env.NEXT_PUBLIC_APP_VERSION ?? '-'} />
                                        <Card icon={{ primary: <FaRegCalendarCheck /> }} title={'Release'} description={'19 Oktober 2024'} />
                                        <Card useNextLink={true} href={'https://whoishayyan.cyclic.cloud/'} target={'_blank'} prefetch={false} clickable={true} useActionIcon={true} icon={{ primary: <FaRegUser /> }} title={'Developer'} description={'Reyhan Naufal Hayyan'} />
                                    </Section>
                                    <Section title={'Support Us'}>
                                        <Card
                                            onClick={handleRatingModal}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') handleRatingModal();
                                            }}
                                            clickable={true}
                                            useActionIcon={true}
                                            icon={{ primary: <AiFillStar />, secondary: <FaPlus /> }}
                                            title={'Rating'}
                                            description={'Penilaianmu sangat berarti untuk aplikasi ini'}
                                        />
                                        {/* Target link (href) belum sesuai. */}
                                        <Card useNextLink={true} href={'https://sociabuzz.com/rheyhannh'} target={'_blank'} prefetch={false} clickable={true} useActionIcon={true} icon={{ primary: <FaCoffee /> }} title={'Traktir Developer'} description={'Segelas americano akan mengubah kehidupan pengembang aplikasi'} />
                                        <Card useNextLink={true} href={'https://docs.google.com/forms'} target={'_blank'} prefetch={false} clickable={true} useActionIcon={true} icon={{ primary: <FaExclamation /> }} title={'Feedback'} description={'Laporin disini kalau kamu mengalami masalah tertentu terkait aplikasi ini'} />
                                    </Section>
                                    <Section title={'Help & Social'}>
                                        {/* Target link (href) belum sesuai. */}
                                        <Card useNextLink={true} href={'/panduan'} clickable={true} icon={{ primary: <FaBook /> }} title={'Panduan'} description={'Panduan lengkap yang mungkin menjawab pertanyaan atau kebingungan kamu'} />
                                        <Card useNextLink={true} href={'https://web.telegram.org/k/'} target={'_blank'} prefetch={false} clickable={true} useActionIcon={true} icon={{ primary: <FaTelegramPlane /> }} title={'Telegram'} description={'Gabung grup telegram untuk memperoleh informasi terbaru'} />
                                    </Section>
                                </div>
                            </div>
                        </Inner>
                    </Layout>
                </Backdrop>
            )
        }}
    </ModalContext.Consumer>
)

function Section({ children, title }) {
    return (
        <div className={styles.item}>
            <h3 className={styles.title}>{title ?? 'Lorem, ipsum.'}</h3>
            {children}
        </div>
    )
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
function Card(
    {
        title = 'Lorem, ipsum.',
        description,
        icon = { primary: <FaCircleInfo />, secondary: <FaArrowUpRightFromSquare /> },
        useActionIcon = false,
        useNextLink = false,
        clickable = false,
        ...props
    }
) {
    return (
        <CardContainer useNextLink={useNextLink} clickable={clickable} useActionIcon={useActionIcon} {...props}>
            <CardIcon icon={icon} />
            <CardText title={title} description={description} />
            <CardActionIcon useActionIcon={useActionIcon} icon={icon} />
        </CardContainer>
    )
}

function CardContainer({ useNextLink, clickable, useActionIcon, children, ...props }) {
    return useNextLink ?
        <Link {...props} className={`${styles.card} ${useActionIcon ? styles.explore : ''} ${clickable ? styles.clickable : ''}`}>
            {children}
        </Link>
        :
        <div {...props} tabIndex={clickable ? '0' : '-1'} className={`${styles.card} ${useActionIcon ? styles.explore : ''} ${clickable ? styles.clickable : ''}`}>
            {children}
        </div>
}

function CardIcon({ icon }) {
    return (
        <div className={styles.card_icon}>
            {icon.primary ?? <FaCircleInfo />}
        </div>
    )
}

function CardText({ title, description }) {
    return (
        <div className={styles.card_text}>
            <h3>{title}</h3>
            {description ? <small>{description}</small> : null}
        </div>
    )
}

function CardActionIcon({ useActionIcon, icon }) {
    return useActionIcon ? (
        <div className={styles.card_icon}>
            {icon.secondary ?? <FaArrowUpRightFromSquare />}
        </div>
    ) : null
}

export default Tentang;