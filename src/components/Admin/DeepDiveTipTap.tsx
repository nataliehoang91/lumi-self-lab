"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold, Italic, UnderlineIcon, List, ListOrdered,
  Heading2, Heading3, Quote, Undo, Redo, Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const BTN = "rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30";
const ACTIVE = "bg-primary/10 text-primary";

export function DeepDiveTipTap({ content, onChange, placeholder, minHeight = "min-h-[180px]" }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none px-4 py-3",
          minHeight,
          "text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2",
          "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
          "[&_p]:leading-relaxed [&_p]:mb-2"
        ),
      },
    },
  });

  if (!editor) return null;

  const ToolBtn = ({
    onClick, active, disabled, children, title,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(BTN, active && ACTIVE)}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-2 py-1.5">
        <ToolBtn title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolBtn>

        <div className="mx-1.5 h-4 w-px bg-border" />

        <ToolBtn title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          <Heading2 className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
          <Heading3 className="h-3.5 w-3.5" />
        </ToolBtn>

        <div className="mx-1.5 h-4 w-px bg-border" />

        <ToolBtn title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          <Quote className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-3.5 w-3.5" />
        </ToolBtn>

        <div className="mx-1.5 h-4 w-px bg-border" />

        <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="h-3.5 w-3.5" />
        </ToolBtn>

        {placeholder && editor.isEmpty && (
          <span className="ml-auto text-[10px] text-muted-foreground/60 pr-1">{placeholder}</span>
        )}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
