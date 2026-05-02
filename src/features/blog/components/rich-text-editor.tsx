// features/blog/components/rich-text-editor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useUploadThing } from "@/lib/uploadthing-client";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Link as LinkIcon,
  ImageIcon,
  Undo,
  Redo,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const { startUpload } = useUploadThing("galleryUploader");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[400px] px-5 py-4 focus:outline-none text-white/80 text-sm leading-relaxed",
      },
    },
  });

  if (!editor) return null;

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const results = await startUpload([file]);
      if (results?.[0]) {
        editor.chain().focus().setImage({ src: results[0].ufsUrl }).run();
      }
    };
    input.click();
  };

  const setLink = () => {
    const url = window.prompt("URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const tools = [
    {
      icon: <Undo className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().undo().run(),
      label: "Undo",
    },
    {
      icon: <Redo className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().redo().run(),
      label: "Redo",
    },
    { separator: true },
    {
      icon: <Heading2 className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      label: "H2",
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      label: "H3",
      active: editor.isActive("heading", { level: 3 }),
    },
    { separator: true },
    {
      icon: <Bold className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().toggleBold().run(),
      label: "Bold",
      active: editor.isActive("bold"),
    },
    {
      icon: <Italic className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().toggleItalic().run(),
      label: "Italic",
      active: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().toggleStrike().run(),
      label: "Strike",
      active: editor.isActive("strike"),
    },
    { separator: true },
    {
      icon: <List className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      label: "Bullet list",
      active: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      label: "Ordered list",
      active: editor.isActive("orderedList"),
    },
    {
      icon: <Quote className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      label: "Quote",
      active: editor.isActive("blockquote"),
    },
    {
      icon: <Minus className="w-3.5 h-3.5" />,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      label: "Divider",
    },
    { separator: true },
    {
      icon: <LinkIcon className="w-3.5 h-3.5" />,
      action: setLink,
      label: "Link",
      active: editor.isActive("link"),
    },
    {
      icon: <ImageIcon className="w-3.5 h-3.5" />,
      action: handleImageUpload,
      label: "Image",
    },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/3 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-0.5 border-b border-white/8 px-3 py-2">
        {tools.map((tool, i) =>
          "separator" in tool ? (
            <div key={i} className="w-px h-4 bg-white/10 mx-1" />
          ) : (
            <button
              key={i}
              type="button"
              onClick={tool.action}
              title={tool.label}
              className={cn(
                "rounded-lg p-1.5 transition-all duration-150",
                tool.active
                  ? "bg-white/15 text-white"
                  : "text-white/35 hover:text-white hover:bg-white/8",
              )}
            >
              {tool.icon}
            </button>
          ),
        )}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(255,255,255,0.2);
          pointer-events: none;
          height: 0;
        }
        .ProseMirror img { max-width: 100%; border-radius: 8px; margin: 1rem 0; }
        .ProseMirror blockquote { border-left: 3px solid rgba(255,255,255,0.2); padding-left: 1rem; color: rgba(255,255,255,0.5); }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: 800; color: white; margin: 1.5rem 0 0.5rem; }
        .ProseMirror h3 { font-size: 1.2rem; font-weight: 700; color: white; margin: 1.25rem 0 0.5rem; }
        .ProseMirror ul { list-style: disc; padding-left: 1.5rem; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.5rem; }
        .ProseMirror a { color: var(--color-accent-red); text-decoration: underline; }
        .ProseMirror hr { border-color: rgba(255,255,255,0.1); margin: 1.5rem 0; }
      `}</style>
    </div>
  );
}
