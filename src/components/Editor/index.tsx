'use client';

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Toolbar from "./Toolbar";
import AssetManager from "./AssetManager";
import { useState } from "react";

export default function Editor() {
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: "<p>Edit this text, add images, links, and more!</p>",
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  const handleSelectImage = (src: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src }).run();
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-4">
      <div className="border border-slate-200 rounded-lg bg-white shadow-sm">
        <Toolbar openAssetManager={() => setIsAssetManagerOpen(true)} editor={editor} />
        <div className="min-h-[500px] p-4">
          <EditorContent editor={editor} />
        </div>
      </div>
      {isAssetManagerOpen && (
        <AssetManager
          onClose={() => setIsAssetManagerOpen(false)}
          onSelectImage={handleSelectImage}
        />
      )}
    </div>
  );
}
