import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import rateLimit from '@/utils/rateLimit';

const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
})

export async function GET(req) {
    const limitRequest = 20;
    const userAccessToken = req.cookies.get('sb-mbdyljoaqssmjfrumdad-auth-token');

    if (!userAccessToken) {
        return new NextResponse(null, {
            status: 401
        })
    }

    try {
        var currentUsage = await limiter.check(limitRequest, userAccessToken.value);
    } catch {
        return new NextResponse(null, {
            status: 429,
            headers: {
                'X-Ratelimit-Limit': limitRequest,
                'X-Ratelimit-Remaining': 0,
                'X-Powered-By': 'Next.js'
            }
        })
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value
                },
                set(name, value, options) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name, options) {
                    cookieStore.set({ name, value: '', ...options })
                },
            },
        }
    )

    let { data, error } = await supabase.from('user').select('*');

    if (error) {
        console.error(error);
        return new NextResponse(null, {
            status: 500,
            headers: {
                'X-Ratelimit-Limit': limitRequest,
                'X-Ratelimit-Remaining': limitRequest - currentUsage,
                'X-Powered-By': 'Next.js'
            }
        })
    }

    return NextResponse.json(data, {
        status: 200,
        headers: {
            'X-Ratelimit-Limit': limitRequest,
            'X-Ratelimit-Remaining': limitRequest - currentUsage,
            'X-Powered-By': 'Next.js'
        }
    });
}