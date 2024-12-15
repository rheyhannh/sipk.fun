import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import React from 'react';

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