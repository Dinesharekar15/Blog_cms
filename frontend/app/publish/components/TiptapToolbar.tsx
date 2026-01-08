'use client';

import { Editor } from '@tiptap/react';
import {Bold,Italic,Underline,Heading1,Heading2,Heading3} from "lucide-react"

interface TiptapToolbarProps {
  editor: Editor;
}

const TiptapToolbar = ({ editor }: TiptapToolbarProps) => {  
  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="toolbar  border-b border-gray-700 p-3 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
          title="Bold"
        >
          <Bold className='w-4 h-4'/>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
          title="Italic"
        >
          <Italic className='w-4 h-4'/>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
          title="Underline"
        >
          <Underline className='w-4 h-4'/>

        </button>

        

        <div className="toolbar-divider"></div>

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`toolbar-btn ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
          title="Heading 1"
        >
          <Heading1/>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
          title="Heading 2"
        >
          <Heading2/>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`toolbar-btn ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
          title="Heading 3"
        >
          <Heading3/>
        </button>

        <div className="toolbar-divider"></div>

       
      </div>

      
    </>
  );
};

export default TiptapToolbar;