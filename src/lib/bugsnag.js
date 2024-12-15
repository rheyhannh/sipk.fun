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
    if (process.env.NEXT_PHASE !== "phase-production-build") {
        Bugsnag.start({
            apiKey: process.env.NEXT_PUBLIC_BUGSNAG_SITEKEY,
            appType: 'browser',
            appVersion: process.env.NEXT_PUBLIC_SIPK_VERSION,
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

export default Bugsnag;