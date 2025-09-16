'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

import TiptapToolbar from './TiptapToolbar';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your story...',
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-orange-400 hover:text-orange-300 underline',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-container bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      <TiptapToolbar editor={editor} />
      
      <div className="editor-content-wrapper">
        <EditorContent 
          editor={editor} 
          className="editor-content text-white"
        />
      </div>
      
      {/* Character Count */}
      <div className="px-6 py-2 bg-gray-800 border-t border-gray-700 text-sm text-gray-400">
        <div className="flex justify-between items-center">
          <span>
            {editor.storage.characterCount.characters()}/10000 characters
          </span>
          <span>
            {editor.storage.characterCount.words()} words
          </span>
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;