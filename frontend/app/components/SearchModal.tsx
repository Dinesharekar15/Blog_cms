'use client'

// SearchModal removed — static/mock search has been cleared.
// This file is kept as a placeholder. Implement real search when ready.

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl p-8 text-gray-400 text-center" onClick={e => e.stopPropagation()}>
        <p className="text-lg font-semibold text-white mb-2">Search</p>
        <p className="text-sm">Coming soon.</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}