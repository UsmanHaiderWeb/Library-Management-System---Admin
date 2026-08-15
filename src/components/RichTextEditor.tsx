import { useEffect } from 'react';
import { useEditor, useEditorState, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold, Italic, Strikethrough, List, ListOrdered,
    Heading2, Heading3, Quote, Undo2, Redo2,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

/** True when the document has no actual text, e.g. Tiptap's empty "<p></p>". */
export const isEmptyHtml = (html: string) =>
    !html || html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length === 0;

const ToolbarButton = ({
    onClick, isActive, disabled, title, children,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        // Keep focus in the document so the current selection survives the click
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={title}
        aria-pressed={isActive}
        className={`rounded p-1.5 transition-colors disabled:opacity-40 ${isActive
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
    >
        {children}
    </button>
);

const Toolbar = ({ editor, disabled }: { editor: Editor; disabled?: boolean }) => {
    /**
     * Tiptap v3 no longer re-renders the component on every transaction, so
     * reading editor.isActive() during render leaves the toolbar stale — the
     * highlight only updated by accident when something else re-rendered.
     * useEditorState subscribes to exactly the flags the toolbar draws.
     */
    const state = useEditorState({
        editor,
        selector: ({ editor }) => ({
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            strike: editor.isActive('strike'),
            h2: editor.isActive('heading', { level: 2 }),
            h3: editor.isActive('heading', { level: 3 }),
            bullet: editor.isActive('bulletList'),
            ordered: editor.isActive('orderedList'),
            quote: editor.isActive('blockquote'),
            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
        }),
    });

    return (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50/70 px-2 py-1.5">
            <ToolbarButton title="Bold" disabled={disabled} isActive={state.bold}
                onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Italic" disabled={disabled} isActive={state.italic}
                onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Strikethrough" disabled={disabled} isActive={state.strike}
                onClick={() => editor.chain().focus().toggleStrike().run()}>
                <Strikethrough className="h-4 w-4" />
            </ToolbarButton>

            <span className="mx-1 h-5 w-px bg-gray-200" />

            <ToolbarButton title="Heading" disabled={disabled} isActive={state.h2}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Subheading" disabled={disabled} isActive={state.h3}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                <Heading3 className="h-4 w-4" />
            </ToolbarButton>

            <span className="mx-1 h-5 w-px bg-gray-200" />

            <ToolbarButton title="Bullet list" disabled={disabled} isActive={state.bullet}
                onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Numbered list" disabled={disabled} isActive={state.ordered}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Quote" disabled={disabled} isActive={state.quote}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                <Quote className="h-4 w-4" />
            </ToolbarButton>

            <span className="mx-1 h-5 w-px bg-gray-200" />

            <ToolbarButton title="Undo" disabled={disabled || !state.canUndo}
                onClick={() => editor.chain().focus().undo().run()}>
                <Undo2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Redo" disabled={disabled || !state.canRedo}
                onClick={() => editor.chain().focus().redo().run()}>
                <Redo2 className="h-4 w-4" />
            </ToolbarButton>
        </div>
    );
};

/**
 * Styles for the editable document.
 *
 * These are spelled out rather than using `prose`, because the typography
 * plugin is not installed — `prose` was a no-op. Tailwind's preflight resets
 * headings to inherit and strips list markers, so headings, lists and quotes
 * were being applied to the document but rendered identical to plain text,
 * which looked exactly like the buttons doing nothing.
 *
 * Keep in step with the student portal's RichText component, which renders the
 * saved HTML.
 */
const CONTENT_CLASS = [
    'min-h-[160px] px-3 py-2 focus:outline-none text-sm text-gray-800',
    '[&_p]:mb-2 [&_p:last-child]:mb-0',
    '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1.5',
    '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-2.5 [&_h3]:mb-1',
    '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2',
    '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2',
    '[&_li]:mb-0.5 [&_li>p]:mb-0',
    '[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4',
    '[&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-2',
    '[&_strong]:font-semibold',
].join(' ');

const RichTextEditor = ({ value, onChange, placeholder, disabled }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
                // Not useful in a book summary
                codeBlock: false,
                horizontalRule: false,
            }),
        ],
        content: value || '',
        editable: !disabled,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            // Report genuinely empty content as '' so `required` validation trips
            onChange(isEmptyHtml(html) ? '' : html);
        },
        editorProps: {
            attributes: { class: CONTENT_CLASS },
        },
    });

    // Reflect programmatic changes (e.g. an edit form loading its book)
    useEffect(() => {
        if (!editor) return;
        const incoming = value || '';
        if (incoming !== editor.getHTML() && !editor.isFocused) {
            editor.commands.setContent(incoming, { emitUpdate: false });
        }
    }, [value, editor]);

    useEffect(() => {
        editor?.setEditable(!disabled);
    }, [disabled, editor]);

    if (!editor) return null;

    return (
        <div className={`overflow-hidden rounded-md border border-black/40 ${disabled ? 'opacity-60' : ''}`}>
            <Toolbar editor={editor} disabled={disabled} />
            <div className="relative bg-white">
                {isEmptyHtml(value) && (
                    <span className="pointer-events-none absolute left-3 top-2 text-sm text-gray-400">
                        {placeholder}
                    </span>
                )}
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default RichTextEditor;
