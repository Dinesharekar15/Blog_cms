"use client";

import { useState } from "react";
import TiptapEditor from "./components/TiptapEditor";
import axios from "axios";
import { headers } from "next/headers";
import { useRouter } from "next/navigation";
import ImageUploader from "./components/ImageUploader";

export default function PublishPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handlePublish = async () => {
    // Handle publish logic here
    try {
      if (!title.trim()) {
        alert("Please provide Title ");
        return;
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", content);

      if (image) {
        formData.append("image", image);
      }
      setLoading(true);
      setMessage("");
      setError(false);
      const res = await axios.post(`${backend_url}/blog/publish`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(image);
      setMessage("Post Created Successfully ");
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (error: any) {
      setError(true);
      console.log(error);
      if (error.response) {
        alert(error.response.data.message || "Post creation failed !");
      } else {
        alert("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Create New Post</h1>

          {/* Title Input */}
          <input
            type="text"
            placeholder="Enter your post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Editor */}
        <div className="mb-8">
          <TiptapEditor content={content} onChange={handleContentChange} />
        </div>
        {/* ImageUploader */}
        <ImageUploader image={image} setImage={setImage} />
        {/* Actions */}
        <div className=" mt-6 flex justify-between items-center">
          <button
            onClick={handlePublish}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-600  cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105"
            }`}
          >
            Publish Post
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center text-sm transition-all duration-300 ${
              error
                ? "bg-red-500/10 text-red-400 border border-red-500"
                : "bg-green-500/10 text-green-400 border border-green-500"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
