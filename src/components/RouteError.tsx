import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { RefreshCcw, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

/**
 * What the user sees instead of React Router's developer error screen.
 *
 * Two very different things end up here and deserve different words:
 *
 * A stale chunk means a new version was deployed while this tab was open. It
 * is not a failure, and reloading fixes it completely. lazyWithReload already
 * tries that once on its own; reaching this screen means the retry did not
 * settle it, so the button is the honest next step.
 *
 * Anything else is a real error, and pretending a reload will fix it just
 * sends people round in circles.
 */
const looksLikeStaleChunk = (error: unknown): boolean => {
    const message = error instanceof Error ? error.message : String(error ?? '');
    return /dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk \d+ failed/i
        .test(message);
};

const RouteError = () => {
    const error = useRouteError();
    const navigate = useNavigate();
    const stale = looksLikeStaleChunk(error);

    const status = isRouteErrorResponse(error) ? error.status : null;
    const detail = error instanceof Error
        ? error.message
        : isRouteErrorResponse(error)
            ? error.statusText
            : null;

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-6">
            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${stale ? 'bg-blue-50' : 'bg-amber-50'}`}>
                    {stale
                        ? <RefreshCcw className="h-7 w-7 text-blue-600" />
                        : <AlertTriangle className="h-7 w-7 text-amber-600" />}
                </div>

                <h1 className="mb-2 text-xl font-semibold text-gray-900">
                    {stale ? 'A new version is available' : 'Something went wrong'}
                </h1>

                <p className="mb-6 text-sm text-gray-600">
                    {stale
                        ? 'This page was updated while you had it open. Reload to pick up the latest version — nothing you have saved is affected.'
                        : status === 404
                            ? 'That page does not exist. It may have been moved or removed.'
                            : 'This page could not be loaded. Reloading usually helps; if it keeps happening, let us know what you were doing.'}
                </p>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reload page
                    </Button>
                    {!stale && (
                        <Button variant="outline" onClick={() => navigate('/')}>
                            Back to dashboard
                        </Button>
                    )}
                </div>

                {/* Kept for a bug report, but out of the way */}
                {detail && !stale ? (
                    <details className="mt-6 text-left">
                        <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600">
                            Technical details
                        </summary>
                        <pre className="mt-2 overflow-auto rounded bg-gray-50 p-3 text-[11px] text-gray-600">
                            {status ? `${status} ` : ''}{detail}
                        </pre>
                    </details>
                ) : null}
            </div>
        </div>
    );
};

export default RouteError;
