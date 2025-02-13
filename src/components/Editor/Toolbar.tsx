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
  Palette,
  Highlighter,
} from 'lucide-react';
import { useState, useRef, useEffect, ChangeEvent } from 'react';

type ToolbarProps = {
  openAssetManager: () => void;
  editor: Editor | null;
};

type ColorPickerProps = {
  onChange: (color: string) => void;
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  initialColor?: string;
};

const ColorPicker = ({ onChange, isOpen, onClose, buttonRef, initialColor = '#000000' }: ColorPickerProps) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [customColor, setCustomColor] = useState(initialColor);
  
  const commonColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'Gray', hex: '#666666' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Green', hex: '#008000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Brown', hex: '#8B4513' },
  ];

  const shades = [
    '#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', 
    '#ADB5BD', '#6C757D', '#495057', '#343A40', '#212529',
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleHexInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomColor(value);
    
    // Only update if it's a valid hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onChange(value);
    }
  };

  const handleColorSelect = (color: string) => {
    setCustomColor(color);
    onChange(color);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={pickerRef}
      className="absolute z-50 top-full mt-1 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-72"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Common Colors */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Common Colors</h3>
        <div className="grid grid-cols-5 gap-2">
          {commonColors.map(({ hex, name }) => (
            <button
              key={hex}
              className="group flex flex-col items-center"
              onClick={() => handleColorSelect(hex)}
            >
              <div
                className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer transition-transform group-hover:scale-110"
                style={{ backgroundColor: hex }}
                title={name}
              />
              <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100">
                {name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grayscale */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Shades</h3>
        <div className="grid grid-cols-10 gap-1">
          {shades.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-md border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Custom Color Input */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Custom Color</h3>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg border border-gray-200"
            style={{ backgroundColor: customColor }}
          />
          <input
            type="text"
            value={customColor}
            onChange={handleHexInput}
            placeholder="#000000"
            className="flex-1 px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter a hex color (e.g., #FF0000)
        </p>
      </div>
    </div>
  );
};

export default function Toolbar({ openAssetManager, editor }: ToolbarProps) {
  const [isTextColorPickerOpen, setIsTextColorPickerOpen] = useState(false);
  const [isHighlightColorPickerOpen, setIsHighlightColorPickerOpen] = useState(false);
  const textColorButtonRef = useRef<HTMLButtonElement>(null);
  const highlightColorButtonRef = useRef<HTMLButtonElement>(null);

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
      <div className="relative">
        <button
          ref={textColorButtonRef}
          onClick={() => setIsTextColorPickerOpen(!isTextColorPickerOpen)}
          className="p-2 rounded hover:bg-slate-200"
          title="Text Color"
        >
          <Palette size={20} />
        </button>
        <ColorPicker
          onChange={(color) => {
            editor.chain().focus().setColor(color).run();
          }}
          isOpen={isTextColorPickerOpen}
          onClose={() => setIsTextColorPickerOpen(false)}
          buttonRef={textColorButtonRef}
          initialColor={editor.getAttributes('textStyle').color || '#000000'}
        />
      </div>
      <div className="relative">
        <button
          ref={highlightColorButtonRef}
          onClick={() => setIsHighlightColorPickerOpen(!isHighlightColorPickerOpen)}
          className="p-2 rounded hover:bg-slate-200"
          title="Highlight Color"
        >
          <Highlighter size={20} />
        </button>
        <ColorPicker
          onChange={(color) => {
            editor.chain().focus().setHighlight({ color }).run();
          }}
          isOpen={isHighlightColorPickerOpen}
          onClose={() => setIsHighlightColorPickerOpen(false)}
          buttonRef={highlightColorButtonRef}
          initialColor={editor.getAttributes('highlight').color || '#FFFF00'}
        />
      </div>
    </div>
  );
} 