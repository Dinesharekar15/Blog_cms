"use client";

import { Editor } from '@tinymce/tinymce-react';
import React, { useState, useRef, useEffect } from 'react';

interface BlogEditorProps {
  initialValue?: string;
  onContentChange?: (content: string) => void;
  placeholder?: string;
}

export default function BlogEditor({ 
  initialValue = "", 
  onContentChange,
  placeholder = "Start writing your blog post..."
}: BlogEditorProps) {
  const [content, setContent] = useState(initialValue);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorChange = (newValue: string, editor: any) => {
    setContent(newValue);
    if (onContentChange) {
      onContentChange(newValue);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    if (onContentChange) {
      onContentChange(newValue);
    }
  };

  // Fallback to textarea if TinyMCE doesn't load within 10 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!editorLoaded) {
        setLoadError(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [editorLoaded]);

  if (loadError) {
    return (
      <div className="w-full" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
        <div className="mb-2 text-yellow-500 text-sm">
          TinyMCE failed to load. Using fallback editor.
        </div>
        <textarea
          value={content}
          onChange={handleTextareaChange}
          placeholder={placeholder}
          className="w-full h-96 p-4 bg-gray-800 text-white border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ direction: 'ltr', textAlign: 'left' }}
        />
      </div>
    );
  }

  return (
    <div className="w-full" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
      <Editor
        onInit={(evt, editor) => {
          editorRef.current = editor;
          setEditorLoaded(true);
        }}
        apiKey="sd8p5ujpftiy4kn7xfhan7wdz1z5u0k1t2qc703l3zl29lsc"
        initialValue={initialValue}
        onEditorChange={handleEditorChange}
        init={{
          height: 500,
          menubar: false,
          plugins: 'lists link image table code help wordcount',
          toolbar:
            'undo redo | formatselect | ' +
            'bold italic | alignleft aligncenter alignright | ' +
            'bullist numlist | link image | table | code',
          content_style: 
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; direction: ltr; text-align: left; color: #e5e5e5; background-color: #1f2937; }',
          skin: 'oxide-dark',
          content_css: 'dark',
          directionality: 'ltr'
        }}
      />
    </div>
  );
}