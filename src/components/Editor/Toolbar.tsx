'use client';

import { type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Table as TableIcon,
  Undo,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';

type ToolbarProps = {
  openAssetManager: () => void;
  editor: Editor | null;
};

export default function Toolbar({ openAssetManager, editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-b border-slate-200 p-2 flex gap-1 flex-wrap bg-slate-50 rounded-t-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-slate-200 ${
          editor.isActive('bold') ? 'bg-slate-200' : ''
        }`}
      >
        <Bold size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-slate-200 ${
          editor.isActive('italic') ? 'bg-slate-200' : ''
        }`}
      >
        <Italic size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-slate-200 ${
          editor.isActive('strike') ? 'bg-slate-200' : ''
        }`}
      >
        <Strikethrough size={20} />
      </button>
      <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-slate-200 ${
          editor.isActive('bulletList') ? 'bg-slate-200' : ''
        }`}
      >
        <List size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-slate-200 ${
          editor.isActive('orderedList') ? 'bg-slate-200' : ''
        }`}
      >
        <ListOrdered size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-slate-200 ${
          editor.isActive('blockquote') ? 'bg-slate-200' : ''
        }`}
      >
        <Quote size={20} />
      </button>
      <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
        className="p-2 rounded hover:bg-slate-200"
      >
        <TableIcon size={20} />
      </button>
      <button
        onClick={setLink}
        className={`p-2 rounded hover:bg-slate-200 ${
          editor.isActive('link') ? 'bg-slate-200' : ''
        }`}
      >
        <LinkIcon size={20} />
      </button>
      <button
        onClick={openAssetManager}
        className="p-2 rounded hover:bg-slate-200"
      >
        <ImageIcon size={20} />
      </button>
      <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-slate-200"
      >
        <Undo size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-slate-200"
      >
        <Redo size={20} />
      </button>
    </div>
  );
} 