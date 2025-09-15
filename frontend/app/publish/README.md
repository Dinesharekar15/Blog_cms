# TinyMCE Blog Editor

A professional blog editor built with TinyMCE and Next.js, featuring a dark theme and comprehensive content management capabilities.

## Features

### 🎨 **Dark Theme Integration**
- Complete dark mode support with TinyMCE's `oxide-dark` skin
- Custom content styling for dark theme readability
- Consistent UI across all components

### ✍️ **Rich Text Editing**
- Full TinyMCE editor with advanced plugins
- Image upload and insertion
- Tables, lists, and formatting options
- Code blocks and syntax highlighting
- Link insertion and management

### 📊 **Real-time Statistics**
- Live word count tracking
- Character count display
- Reading time estimation
- Auto-save functionality (every 30 seconds)

### 🗂️ **Content Management**
- Post title and content editing
- Category selection
- Tag management with add/remove functionality
- Featured image support
- Excerpt editing
- Draft/Published status tracking

## Setup Instructions

### 1. Install TinyMCE
```bash
npm install @tinymce/tinymce-react
```

### 2. Get TinyMCE API Key
1. Visit [TinyMCE](https://www.tiny.cloud/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Replace `"your-api-key"` in `BlogEditor.tsx` with your actual key

### 3. Usage
Navigate to `/publish` to access the blog editor.

## File Structure

```
app/publish/
├── page.tsx                 # Main publish page with sidebar
├── components/
│   ├── BlogEditor.tsx       # TinyMCE editor component
│   └── EditorStats.tsx      # Statistics bar component
```

## Key Components

### BlogEditor.tsx
- **Dark Theme**: Uses `skin: 'oxide-dark'` and `content_css: 'dark'`
- **Plugins**: Lists, links, images, tables, code, media, wordcount
- **Toolbar**: Comprehensive formatting options
- **File Upload**: Built-in image upload functionality
- **Custom Styling**: Dark theme content area styles

### page.tsx
- **State Management**: Post data, save status, statistics
- **Auto-save**: Saves drafts every 30 seconds
- **Sidebar**: Category, tags, featured image, excerpt
- **Responsive**: Mobile-friendly layout

### EditorStats.tsx
- **Statistics**: Word count, character count, reading time
- **Save Status**: Real-time save indicator
- **Timestamps**: Last saved time display

## Configuration

The TinyMCE editor is configured with:

```javascript
{
  height: 600,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
    'emoticons', 'codesample', 'quickbars'
  ],
  toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image media | table | code | help',
  skin: 'oxide-dark',
  content_css: 'dark'
}
```

## API Integration

The editor is designed to integrate with your backend API. Update these functions in `page.tsx`:

- `handleSave()`: Save draft to database
- `handlePublish()`: Publish post to live site

## Customization

### Adding New Plugins
1. Add plugin name to the `plugins` array
2. Add corresponding toolbar buttons if needed
3. Configure plugin-specific settings in the `init` object

### Styling
- Modify `content_style` in `BlogEditor.tsx` for content area styling
- Update Tailwind classes in components for UI styling
- Customize the dark theme colors as needed

## Requirements

- Next.js 13+ with App Router
- React 18+
- TinyMCE API key (free tier available)
- Tailwind CSS for styling

## Notes

- The editor uses client-side rendering (`"use client"`)
- Image uploads use base64 encoding (implement server upload for production)
- Auto-save prevents data loss during editing
- All content is stored in component state (integrate with your database)