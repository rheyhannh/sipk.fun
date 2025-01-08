// #region NEXT DEPEDENCY
import { useRouter } from 'next/navigation';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useRating from '@/hooks/swr/useRating';
import { mutate } from 'swr';
import { useCookies } from 'next-client-cookies';
// #endregion

// #region COMPONENT DEPEDENCY
import toast from 'react-hot-toast';
import { Spinner } from '@/component/loader/Loading';
import { ModalContext } from '@/component/modal/provider';
import { Backdrop, Layout, Head, Inner, Button } from '@/component/modal/components';
// #endregion

// #region UTIL DEPEDENCY
import { getLoadingMessage, fetchWithAuth } from '@/utils/client_side';
import { handleApiResponseError } from '@/component/modal/utils';
// #endregion

// #region ICON DEPEDENCY
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css'
// #endregion

const placeholderByStars = [
    'Berapa bintang yang kamu kasih untuk SIPK',
    'Mohon maaf atas pengalamanmu yang sangat kurang di SIPK, Boleh cerita apa yang perlu SIPK perbaiki?',
    'Mohon maaf atas pengalamanmu yang kurang di SIPK, Boleh cerita apa yang kurang di SIPK?',
    'Menurut kamu, apa yang SIPK perlu benahin',
    'Bintangnya engga lengkap, kaya mimin tanpa dia. Yuk ceritain kenapa kamu suka pakai SIPK. Dan jangan lupa rekomendasiin SIPK keteman kamu ya.',
    'Yuhuu, bintangnya lengkap. Yuk spill kenapa kamu suka pakai SIPK. Dan jangan lupa rekomendasiin SIPK keteman kamu ya.'
]

const Rating = () => {
    const router = useRouter();
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    const { data: ratingData, error: ratingError, isLoading: ratingLoading, isValidating: ratingValidating } = useRating();
    const [stars, setStars] = React.useState(0);
    const [review, setReview] = React.useState('');
    const [author, setAuthor] = React.useState(0);
    const [editRating, setEditRating] = React.useState(false);
    const [info, setInfo] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [disableBorder, setDisableBorder] = React.useState(false);

    const handleReviewChange = (e) => {
        if (info) { setInfo(''); }
        const newReview = e.target.value;
        if (newReview.length <= 200) {
            setReview(newReview);
        }
    }

    const handleAuthorChange = (e) => {
        const newAuthor = e.target.value;
        if (['0', '1', '2'].includes(newAuthor)) {
            setAuthor(Number(newAuthor));
            if (newAuthor === '0') { setInfo('Rating tampil dengan nama lengkap kamu') }
            else if (newAuthor === '1') { setInfo('Rating tampil dengan nickname kamu') }
            else if (newAuthor === '2') { setInfo('Rating tampil sebagai anonim') }
            else { setInfo('') }
        }
    }

    const handleRetry = () => {
        mutate(['/api/rating', userIdCookie])
    }

    return (
        <ModalContext.Consumer>
            {/** @param {import('@/types/context').ModalContext<any>} context */ context => {
                const toggleEditRating = () => {
                    if (editRating) { setEditRating(false); setErrorMessage(''); if (info) { setInfo(''); }; }
                    else {
                        setStars(ratingData.length ? ratingData[0].rating : 0);
                        setReview(ratingData.length ? ratingData[0].review : '');
                        setAuthor(ratingData.length ? ratingData[0].details.authorType : 0);
                        setEditRating(true);
                    }
                }

                const validateForm = () => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            if (!accessToken) { throw new Error('Missing user access token'); }
                            if (!userIdCookie) { throw new Error('Missing user id'); }

                            const unallowedWords = ['http', 'https', 'www'];
                            const unallowedSymbols = ['<', '>', '&', '/', `'`, `"`];

                            // Validating & Sanitize 'Stars'
                            if (stars <= 0) { setErrorMessage('Kamu harus pilih bintang 1 - 5'); resolve(null); }
                            if (stars > 5) { setStars(5); }

                            // Validating & Sanitize 'Review'
                            if (review.length > 200) { setErrorMessage('Pesan maksimal 200 karakter'); resolve(null); }
                            if (unallowedWords.some(word => review.includes(word))) { setErrorMessage('Pesan tidak dapat mengandung URL'); resolve(null); }
                            if (unallowedSymbols.some(symbol => review.includes(symbol))) { setErrorMessage(`Pesan tidak dapat mengandung simbol > , < , & , ' , " dan /`); return false; }

                            resolve({
                                rating: stars,
                                review: review,
                                details: {
                                    authorType: author,
                                }
                            })
                        } catch (error) { reject(error); }
                    })
                }

                const handleTambahRating = async (e) => {
                    e.preventDefault();
                    // Validate Here, if ErrorValidate then setErrorMessage, if ErrorCookies then router.refresh()
                    try {
                        var validatedData = await validateForm();
                        if (!validatedData) { return }
                        context.handleModalClose();
                    } catch (error) {
                        context.handleModalClose();
                        console.error(error.message || 'Terjadi kesalahan');
                        toast.error('Terjadi kesalahan, silahkan coba lagi', { position: 'top-left', duration: 4000 });
                        router.refresh();
                        return;
                    }

                    const addRating = () => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                if (!accessToken || !userIdCookie) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }

                                const response = await fetchWithAuth('POST', 'rating', accessToken, validatedData);

                                if (!response.ok) {
                                    const { toastMessage, refresh, navigate } = await handleApiResponseError(response);
                                    if (refresh) { router.refresh() }
                                    if (navigate && navigate?.type === 'push' && navigate?.to) { router.push(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                    if (navigate && navigate?.type === 'replace' && navigate?.to) { router.replace(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                    throw new Error(toastMessage);
                                } else {
                                    try {
                                        /** @type {{rating:import('@/types/supabase').RatingData}} */
                                        const { rating } = await response.json();
                                        if (!rating) {
                                            throw new Error('Failed to update cache');
                                        }
                                        mutate(['/api/rating', userIdCookie], rating, {
                                            populateCache: (rating, current) => {
                                                return [rating]
                                            },
                                            revalidate: false,
                                        });
                                        resolve();
                                    } catch {
                                        mutate(['/api/rating', userIdCookie]);
                                        resolve();
                                    }
                                }
                            } catch (error) { reject(error); }
                        });
                    };

                    toast.promise(
                        addRating(),
                        {
                            loading: `${getLoadingMessage(false, 3)} rating`,
                            success: `Rating berhasil dibuat`,
                            error: (error) => `${error?.message ?? 'Terjadi kesalahan'}`
                        },
                        {
                            position: 'top-left',
                            duration: 4000,
                        }
                    )
                }

                const handleEditRating = async (e) => {
                    e.preventDefault();

                    // Validate Here, if ErrorValidate then setErrorMessage, if ErrorCookies then router.refresh()                    const validatedData = validateForm();
                    try {
                        var validatedData = await validateForm();
                        if (!validatedData) { return }
                        context.handleModalClose();
                    } catch (error) {
                        context.handleModalClose();
                        console.error(error.message || 'Terjadi kesalahan');
                        toast.error('Terjadi kesalahan, silahkan coba lagi', { position: 'top-left', duration: 4000 });
                        router.refresh();
                        return;
                    }

                    const editRating = () => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                const ratingId = ratingData[0]?.id;

                                if (
                                    !accessToken ||
                                    !userIdCookie ||
                                    !ratingId
                                ) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }

                                const response = await fetchWithAuth('PATCH', 'rating', accessToken, validatedData, { id: ratingId });

                                if (!response.ok) {
                                    const { toastMessage, refresh, navigate } = await handleApiResponseError(response);
                                    if (refresh) { router.refresh() }
                                    if (navigate && navigate?.type === 'push' && navigate?.to) { router.push(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                    if (navigate && navigate?.type === 'replace' && navigate?.to) { router.replace(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                    throw new Error(toastMessage);
                                } else {
                                    try {
                                        /** @type {{rating:import('@/types/supabase').RatingData}} */
                                        const { rating } = await response.json();
                                        if (!rating) {
                                            throw new Error('Failed to update cache');
                                        }
                                        mutate(['/api/rating', userIdCookie], rating, {
                                            populateCache: (rating, current) => {
                                                return [rating]
                                            },
                                            revalidate: false,
                                        });
                                        resolve();
                                    } catch {
                                        mutate(['/api/rating', userIdCookie]);
                                        resolve();
                                    }
                                }
                            } catch (error) { reject(error); }
                        });
                    };

                    toast.promise(
                        editRating(),
                        {
                            loading: `${getLoadingMessage(false, 4)} rating`,
                            success: `Rating berhasil diperbarui`,
                            error: (error) => `${error?.message ?? 'Terjadi kesalahan'}`
                        },
                        {
                            position: 'top-left',
                            duration: 4000,
                        }
                    )
                }

                return (
                    <Backdrop>
                        <Layout
                            as={'form'}
                            onSubmit={editRating ? handleEditRating : handleTambahRating}
                            onEsc={true}
                            className={`${styles.rating} ${ratingError ? styles.error : ratingLoading || ratingValidating ? styles.loading : ''}`}
                        >
                            <Head title={editRating ? 'Edit Rating' : 'Rating'} />

                            {
                                ratingError ?
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100%',
                                            height: '100%',
                                            color: 'var(--infoDark-color)'
                                        }}
                                    >
                                        <h5>Gagal mengambil data</h5>
                                        <h1 style={{ cursor: 'pointer' }} onClick={handleRetry}>&#x21bb;</h1>
                                    </div>
                                    : ratingLoading || ratingValidating ?
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        >
                                            <Spinner size={'32px'} color={'var(--logo-second-color)'} />
                                        </div>
                                        :
                                        <Inner>
                                            <div style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--danger-color)' }}>
                                                {errorMessage}
                                            </div>
                                            {
                                                ratingData.length ?
                                                    <>
                                                        <div className={styles.stars}>
                                                            {Array.from({ length: 5 }, (_, index) => (
                                                                <div
                                                                    key={index}
                                                                    tabIndex={editRating ? '0' : '-1'}
                                                                    className={`${styles.star} ${editRating ? stars >= index + 1 ? styles.filled : '' : ratingData[0].rating >= index + 1 ? styles.filled : ''} ${editRating ? '' : styles.disabled}`}
                                                                    onClick={editRating ? (event) => {
                                                                        event.currentTarget.blur();
                                                                        setStars(index + 1);
                                                                        setErrorMessage('');
                                                                    } : null}
                                                                    onKeyDown={editRating ? (event) => {
                                                                        if (event.key === 'Enter') {
                                                                            setStars(index + 1);
                                                                            setErrorMessage('');
                                                                        }
                                                                    } : null}
                                                                >
                                                                    {editRating ? stars >= index + 1 ? <AiFillStar size={'100%'} /> : <AiOutlineStar size={'100%'} /> : ratingData[0].rating >= index + 1 ? <AiFillStar size={'100%'} /> : <AiOutlineStar size={'100%'} />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <textarea
                                                            placeholder={editRating ? placeholderByStars[stars] : ''}
                                                            value={editRating ? review : ratingData[0].review}
                                                            onChange={editRating ? handleReviewChange : null}
                                                            onFocus={editRating ? () => { setErrorMessage(''); if (info) { setInfo(''); } } : null}
                                                            disabled={!editRating}
                                                        />
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: '1rem'
                                                        }}>
                                                            <div className={`${styles.review} ${editRating ? review.length >= 200 ? styles.max : '' : ratingData[0].review.length >= 200 ? styles.max : ''}`}>
                                                                {editRating ? info ? info : 200 - review.length + ' karakter tersisa' : ''}
                                                            </div>
                                                            <select
                                                                id="authorRating"
                                                                className={disableBorder ? styles.border_off : undefined}
                                                                value={editRating ? author : ratingData[0].details.authorType}
                                                                onChange={editRating ? handleAuthorChange : null}
                                                                onFocus={editRating ? () => {
                                                                    setDisableBorder(false);
                                                                    setErrorMessage('')
                                                                } : null}
                                                                onMouseLeave={(event) => {
                                                                    if (document.activeElement === event.currentTarget) {
                                                                        setDisableBorder(true);
                                                                    }
                                                                }}
                                                                disabled={!editRating}
                                                                style={editRating ? {} : { cursor: 'auto' }}
                                                            >
                                                                <option value={0}>Fullname</option>
                                                                <option value={1}>Nickname</option>
                                                                <option value={2}>Anonim</option>
                                                            </select>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div className={styles.stars}>
                                                            {Array.from({ length: 5 }, (_, index) => (
                                                                <div
                                                                    key={index}
                                                                    tabIndex={'0'}
                                                                    className={`${styles.star} ${stars >= index + 1 ? styles.filled : ''}`}
                                                                    onClick={(event) => {
                                                                        event.currentTarget.blur();
                                                                        setStars(index + 1);
                                                                        setErrorMessage('');
                                                                    }}
                                                                    onKeyDown={(event) => {
                                                                        if (event.key === 'Enter') {
                                                                            setStars(index + 1);
                                                                            setErrorMessage('');
                                                                        }
                                                                    }}
                                                                >
                                                                    {stars >= index + 1 ? <AiFillStar size={'100%'} /> : <AiOutlineStar size={'100%'} />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <textarea
                                                            maxLength={200}
                                                            placeholder={placeholderByStars[stars]}
                                                            value={review}
                                                            onChange={handleReviewChange}
                                                            onFocus={() => { setErrorMessage(''); if (info) { setInfo(''); } }}
                                                        />
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: '1rem'
                                                        }}>
                                                            <div className={`${styles.review} ${review.length >= 200 ? styles.max : ''}`}>
                                                                {info ? info : review.length > 0 ? 200 - review.length + ' karakter tersisa' : ''}
                                                                {editRating ? info ? info : 200 - review.length + ' karakter tersisa' : ''}
                                                            </div>
                                                            <select
                                                                id="authorRating"
                                                                className={disableBorder ? styles.border_off : undefined}
                                                                value={author}
                                                                onChange={handleAuthorChange}
                                                                onFocus={() => {
                                                                    setDisableBorder(false);
                                                                    setErrorMessage('');
                                                                }}
                                                                onMouseLeave={(event) => {
                                                                    if (document.activeElement === event.currentTarget) {
                                                                        setDisableBorder(true);
                                                                    }
                                                                }}
                                                            >
                                                                <option value={0}>Fullname</option>
                                                                <option value={1}>Nickname</option>
                                                                <option value={2}>Anonim</option>
                                                            </select>
                                                        </div>
                                                    </>
                                            }
                                        </Inner>
                            }

                            {
                                ratingLoading || ratingValidating || ratingError ?
                                    null
                                    :
                                    ratingData.length ?
                                        <>
                                            <div
                                                style={editRating ? {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(2,1fr)',
                                                    gap: '1rem'
                                                } : {}}
                                                className={styles.form__action}
                                            >
                                                {editRating ?
                                                    <>
                                                        <Button
                                                            title='Batalkan'
                                                            action={toggleEditRating}
                                                            className={`${styles.btn} ${styles.cancel}`}
                                                            style={{ marginTop: '0' }}
                                                        />
                                                        <button type='submit' className={styles.btn}>
                                                            <h3>Simpan</h3>
                                                        </button>
                                                    </>
                                                    :
                                                    <Button
                                                        title='Edit Rating'
                                                        action={toggleEditRating}
                                                        className={styles.btn}
                                                    />
                                                }
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div
                                                className={styles.form__action}
                                            >
                                                <button type='submit' className={styles.btn}>
                                                    <h3>Submit</h3>
                                                </button>
                                            </div>
                                        </>
                            }
                        </Layout>
                    </Backdrop>
                )
            }
            }
        </ModalContext.Consumer>
    )
}

export default Rating;