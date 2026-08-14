import { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
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
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={title}
        aria-pressed={isActive}
        className={`rounded p-1.5 transition-colors disabled:opacity-40 ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
    >
        {children}
    </button>
);

const Toolbar = ({ editor, disabled }: { editor: Editor; disabled?: boolean }) => (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50/70 px-2 py-1.5">
        <ToolbarButton
            title="Bold"
            disabled={disabled}
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
        ><Bold className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton
            title="Italic"
            disabled={disabled}
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
        ><Italic className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton
            title="Strikethrough"
            disabled={disabled}
            isActive={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
        ><Strikethrough className="h-4 w-4" /></ToolbarButton>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <ToolbarButton
            title="Heading"
            disabled={disabled}
            isActive={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        ><Heading2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton
            title="Subheading"
            disabled={disabled}
            isActive={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        ><Heading3 className="h-4 w-4" /></ToolbarButton>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <ToolbarButton
            title="Bullet list"
            disabled={disabled}
            isActive={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
        ><List className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton
            title="Numbered list"
            disabled={disabled}
            isActive={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
        ><ListOrdered className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton
            title="Quote"
            disabled={disabled}
            isActive={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
        ><Quote className="h-4 w-4" /></ToolbarButton>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <ToolbarButton
            title="Undo"
            disabled={disabled || !editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
        ><Undo2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton
            title="Redo"
            disabled={disabled || !editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
        ><Redo2 className="h-4 w-4" /></ToolbarButton>
    </div>
);

/**
 * Rich text editor for book summaries.
 *
 * Emits HTML, which is what gets stored in Book.summary (a LongText column).
 * The node set is deliberately small — headings, lists, quotes and basic marks
 * — both to keep summaries consistent and because the student portal has to
 * render whatever comes out of here.
 */
const RichTextEditor = ({ value, onChange, placeholder, disabled }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
                // No code blocks or horizontal rules — not useful in a summary
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
            attributes: {
                class: 'prose prose-sm max-w-none min-h-[160px] px-3 py-2 focus:outline-none',
            },
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
                {isEmptyHtml(editor.getHTML()) && (
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
