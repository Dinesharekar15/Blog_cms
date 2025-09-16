'use client';

import { Editor } from '@tiptap/react';
import { useState } from 'react';

interface TiptapToolbarProps {
  editor: Editor;
}

const TiptapToolbar = ({ editor }: TiptapToolbarProps) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setIsImageModalOpen(false);
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="toolbar bg-gray-800 border-b border-gray-700 p-3 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
          title="Bold"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.6 8.4c1.1-.6 1.8-1.8 1.8-3.1 0-2.1-1.7-3.8-3.8-3.8H4v15h7.2c2.4 0 4.3-1.9 4.3-4.3 0-1.7-1-3.2-2.9-3.8zm-2.1-4.4c.8 0 1.4.6 1.4 1.4s-.6 1.4-1.4 1.4H7.5V4h3zm.4 8.8H7.5v-3.2h3.4c.9 0 1.6.7 1.6 1.6s-.7 1.6-1.6 1.6z"/>
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
          title="Italic"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.5 2h7v2h-2.4l-3.2 12h2.4v2h-7v-2h2.4l3.2-12H8.5V2z"/>
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
          title="Underline"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 17h12v2H4v-2zm6-12c2.8 0 5 2.2 5 5v4h-2V10c0-1.7-1.3-3-3-3s-3 1.3-3 3v4H5V10c0-2.8 2.2-5 5-5z"/>
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`toolbar-btn ${editor.isActive('strike') ? 'active' : ''}`}
          title="Strikethrough"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 9h14v2H3V9zm7-6c1.9 0 3.5.8 4.5 2.2l-1.4 1.4C12.4 5.9 11.3 5.5 10 5.5c-1.7 0-2.5.8-2.5 1.8 0 .6.2 1 .6 1.3H6.4c-.7-.8-1.1-1.8-1.1-3.1C5.3 3.2 7.2 3 10 3zm0 14c-2.1 0-3.7-.9-4.7-2.4l1.4-1.4c.7.9 1.7 1.3 3.3 1.3 1.8 0 2.7-.8 2.7-1.9 0-.7-.3-1.2-.8-1.6h1.7c.6.8.9 1.8.9 3 0 2.3-1.8 3-4.5 3z"/>
          </svg>
        </button>

        <div className="toolbar-divider"></div>

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`toolbar-btn ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
          title="Heading 1"
        >
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
          title="Heading 2"
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`toolbar-btn ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
          title="Heading 3"
        >
          H3
        </button>

        <div className="toolbar-divider"></div>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 6h12v2H4V6zm0 5h12v2H4v-2zm0 5h12v2H4v-2zM2 6h1v2H2V6zm0 5h1v2H2v-2zm0 5h1v2H2v-2z"/>
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h1v1h1v1H3v1H2V4h1zm0 5h1v1h1v1H3v1H2V9h1zm0 5h1v1h1v1H3v1H2v-3h1zm4-8h10v2H7V6zm0 5h10v2H7v-2zm0 5h10v2H7v-2z"/>
          </svg>
        </button>

        <div className="toolbar-divider"></div>

        {/* Link */}
        <button
          onClick={setLink}
          className={`toolbar-btn ${editor.isActive('link') ? 'active' : ''}`}
          title="Add Link"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"/>
          </svg>
        </button>

        {/* Image */}
        <button
          onClick={() => setIsImageModalOpen(true)}
          className="toolbar-btn"
          title="Insert Image"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
          </svg>
        </button>

        <div className="toolbar-divider"></div>

        {/* Quote */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`toolbar-btn ${editor.isActive('blockquote') ? 'active' : ''}`}
          title="Quote"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
          </svg>
        </button>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4 text-white">Insert Image</h3>
            
            <input
              type="url"
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsImageModalOpen(false);
                  setImageUrl('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addImage}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TiptapToolbar;