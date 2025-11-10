import React from "react";

export function DeletePostModel({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Do you want to delete this post?
        </h2>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
          > 
            Yes, delete it
          </button>

          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border bg-green-400 text-white border-gray-400 hover:bg-green-500 transition-all"
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
}
