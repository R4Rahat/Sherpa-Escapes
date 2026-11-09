import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { useTestimonialStore } from "../useTestimonialStore";

export default function DeleteTestimonialModal({ open, onClose, testimonial }) {
  const { deleteTestimonial } = useTestimonialStore();
  const [loading, setLoading] = useState(false);

  if (!open || !testimonial) return null;

  const handleDelete = async () => {
    setLoading(true);
    const ok = await deleteTestimonial(testimonial._id);
    setLoading(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
          <Trash2 size={22} className="text-red-600" />
        </div>

        <h2 className="text-base font-semibold text-slate-900 mb-1">Delete Testimonial</h2>
        <p className="text-sm text-slate-500 mb-1">
          Are you sure you want to delete the testimonial by{" "}
          <span className="font-medium text-slate-700">"{testimonial.name}"</span>?
        </p>
        <p className="text-xs text-red-500 mb-5">This action cannot be undone.</p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

