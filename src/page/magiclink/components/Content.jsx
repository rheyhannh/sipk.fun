'use client'

// #region NEXT DEPEDENCY
import dynamic from 'next/dynamic';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import { useRouter, useSearchParams } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
// #endregion

// #region COMPONENT DEPEDENCY
import toast from 'react-hot-toast';
import { MagiclinkContext } from '@magiclink_page/provider';
// #endregion

// #region UTIL DEPEDENCY
import isUUID from 'validator/lib/isUUID';
// #endregion

const Default = dynamic(() => import('@magiclink_page/components/Default'));
const Loading = dynamic(() => import('@magiclink_page/components/Loading'));
const Success = dynamic(() => import('@magiclink_page/components/Success'));
const Error = dynamic(() => import('@magiclink_page/components/Error'));

/**
 * Magiclink content dengan classname yang sudah ditentukan
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'> & {fakta:Array<import('@/types/supabase').FaktaData>}} props Content props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLDivElement>, 'className'>, HTMLDivElement>} Rendered content
 */
function Content({ fakta, ...props }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const guestIdCookie = useCookies().get('s_guest_id');
    const { isLogin, setStates, states } = React.useContext(MagiclinkContext);

    const handleFetch = async () => {
        const tokenHash = searchParams.get('token');

        try {
            if (!guestIdCookie || !isUUID(guestIdCookie)) {
                throw ({
                    shouldRefresh: true,
                    toast: { message: 'Terjadi kesalahan, silahkan coba lagi' },
                    newState: null
                })
            }

            if (!tokenHash) {
                throw ({
                    shouldRefresh: false,
                    toast: { message: 'Token magiclink dibutuhkan!' },
                    newState: null
                })
            }

            setStates({ loading: true, error: false, success: false })

            await new Promise(resolve => setTimeout(resolve, 4000));

            const response = await fetch(isLogin ?
                `/api/auth/confirm/login?token_hash=${tokenHash}&type=email`
                :
                `/api/auth/confirm/signup?token_hash=${tokenHash}&type=email`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (!response.ok) {
                if (response.status === 429) {
                    throw ({
                        shouldRefresh: false,
                        toast: false,
                        newState: { loading: false, error: true, success: false, code: '429' }
                    })
                } else if (response.status === 401) {
                    throw ({
                        shouldRefresh: false,
                        toast: false,
                        newState: { loading: false, error: true, success: false, code: '401' }
                    })
                } else {
                    throw ({
                        shouldRefresh: false,
                        toast: false,
                        newState: { loading: false, error: true, success: false }
                    })
                }
            } else {
                setStates({ loading: false, error: false, success: true })
            }

        } catch (error) {
            const toastOptions = { duration: 3000, position: 'top-center' };
            if (error.toast) { toast.error(error.toast.message, toastOptions); }
            if (error.shouldRefresh) { router.refresh() }
            if (error.newState) { setStates(error.newState) }
        }
    }

    if (states.loading) return <Loading fakta={fakta} {...props} />
    else if (states.success) return <Success {...props} />
    else if (states.error) return <Error {...props} />
    else return <Default handleFetch={handleFetch} {...props} />
}

export default Content;