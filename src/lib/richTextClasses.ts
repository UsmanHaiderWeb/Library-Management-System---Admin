/**
 * Typography for rich text book summaries.
 *
 * WYSIWYG only works if the editor and the page that renders the saved HTML
 * agree, so RICH_TEXT_METRICS below is duplicated verbatim in the student
 * portal (Student/src/lib/richTextClasses.ts). Change one, change both.
 *
 * Metrics (sizes, margins, line-height) are shared; colours are not, because
 * this portal is light-only while the student portal is themed.
 */
export const RICH_TEXT_METRICS = [
    'leading-relaxed',
    '[&_p]:mb-3 [&_p:last-child]:mb-0',
    '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2',
    '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5',
    '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3',
    '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3',
    '[&_li]:mb-1 [&_li>p]:mb-0',
    '[&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3',
    '[&_strong]:font-semibold',
    '[&_a]:underline',
].join(' ');

/** Admin-side colours plus the editor's own chrome (padding, min height). */
export const EDITOR_CONTENT_CLASS = [
    RICH_TEXT_METRICS,
    'min-h-[200px] px-4 py-3 focus:outline-none',
    // Base size, not text-sm — the student page renders at base, and a smaller
    // editor made every heading and gap look tighter than the real result.
    'text-base text-gray-800',
    '[&_blockquote]:border-gray-300 [&_blockquote]:text-gray-600',
    '[&_a]:text-blue-600',
].join(' ');
