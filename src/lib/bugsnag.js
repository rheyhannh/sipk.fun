import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import React from 'react';

/**
 * Handle react component error pada `ErrorBoundary` dengan log error ke Bugsnag menggunakan template yang sudah ditentukan.
 * @param {import('@bugsnag/js').NotifiableError} error Error instance
 * @param {React.ErrorInfo} info Error info
 * @param {import('next-client-cookies')['useCookies']} [cookieResolver] Cookie resolver untuk resolve user id. Saat tidak tersedia Bugsnag akan menggunakan id {@link https://docs.bugsnag.com/platforms/javascript/react/configuration-options/#collectuserip anonymous} 
 * @param {string} [fallbackComponent] String nama fallback component yang digunakan
 * @example
 * ```jsx
 * import { useCookies } from 'next-client-cookies';
 * import { ErrorBoundary } from 'react-error-boundary';
 *  
 * const MyFallbackComponent = () => (...)
 * const MyComponent = () => {
 *      const cookieResolver = useCookies();
 *      return (
 *          <ErrorBoundary
 *              FallbackComponent={MyFallbackComponent}
 *              onError={(error, info) => {
 *                  handleReactErrorBoundary(
 *                      error, 
 *                      info, 
 *                      cookieResolver, 
 *                      'MyFallbackComponent'
 *                  );
 *              }}
 *          >
 *              ...
 *          </ErrorBoundary>
 *      )
 * } 
 * ```
 */
export function handleReactErrorBoundary(
    error,
    info,
    cookieResolver,
    fallbackComponent = '-',
) {
    Bugsnag.notify(error, event => {
        if (cookieResolver) {
            const userIdCookie = cookieResolver.get('s_user_id');
            if (userIdCookie) event.setUser(userIdCookie);
        }

        event.severity = 'error';
        event.unhandled = false;
        event.addMetadata('details', {
            type: 'react_error_boundary',
            reportedWith: 'handleReactErrorBoundary',
            fallbackComponent,
            ...info
        })
    })
}

export function startBugsnag() {
    // Next.js executes top-level code at build time, so use NEXT_PHASE to avoid Bugsnag.start being executed during the build phase
    if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return;

    // This code only run on node, for now we only need error reporting in browser/client side
    // if (typeof window === 'undefined') {
    //     Bugsnag.start({
    //         // apiKey should different when we want seperate Bugsnags projects e.g. a node and browser/client
    //         apiKey: process.env.NEXT_PUBLIC_BUGSNAG_SITEKEY,
    //         appType: 'node',
    //         appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
    //         metadata: {
    //             company: {
    //                 name: 'SIPK App',
    //             },
    //         },
    //         // @bugsnag/plugin-aws-lambda must only be imported on the server
    //         plugins: [require('@bugsnag/plugin-aws-lambda')],
    //     })
    // }

    // This code only run on browser/client side
    if (typeof window !== 'undefined') {
        Bugsnag.start({
            apiKey: process.env.NEXT_PUBLIC_BUGSNAG_SITEKEY,
            appType: 'browser',
            appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
            enabledBreadcrumbTypes: ['error', 'navigation', 'request', 'user'],
            maxBreadcrumbs: 25,
            maxEvents: 10,
            metadata: {
                company: {
                    name: 'SIPK App',
                },
            },
            plugins: [new BugsnagPluginReact()]
        })
    }
}

/**
 * This method required when we want error reporting in node or some of `/api` routes.
 * Example still use `pages` folder structure so its api only expose single `handler`. Also in example
 * use some of scenario because some scenario still failed to executed, see more above link.
 *
 * @see Bugsnag Next.js {@link https://github.com/bugsnag/bugsnag-js/tree/next/examples/js/nextjs example}
 * @example
 * `api/user/route.js`
 * ```js
 * import { startBugsnag, getServerlessHandler } from '@/lib/bugsnag';
 *
 * startBugsnag();
 * const serverlessHandler = getServerlessHandler();
 *
 * const doSomethingErrorOne = () => Promise.reject(new Error('Error Scenario 1'));
 * // doSomethingErrorOne();
 *
 * function doSomethingErrorTwo() {
 *      throw new Error('Error Scenario 2');
 * }
 * // doSomethingErrorTwo();
 *
 * function doSomethingErrorThree() {
 *      throw new Error('Error Scenario 3');
 * }
 *
 * async function handler(req, res) {
 *      // doSomethingErrorThree();
 *
 *      // try {
 *          // throw new Error('Error Scenario 4');
 *      // } catch (error) {
 *          // Bugsnag.notify(error);
 *          // // Flushing before returning is necessary if deploying to Vercel, see
 *          // // https://vercel.com/docs/platform/limits#streaming-responses
 *          // await require('@bugsnag/in-flight').flush(2000);
 *      // }
 *
 *      res.status(200).json({ name: 'John Doe' })
 * }
 *
 * export default serverlessHandler(handler);
 * ```
*/
// export function getServerlessHandler() {
//     return Bugsnag.getPlugin('awsLambda').createHandler();
// }