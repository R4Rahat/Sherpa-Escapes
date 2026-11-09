import { useEffect, useState } from "react";
import { X, Star } from "lucide-react";
import { useTestimonialStore } from "../useTestimonialStore";

const INITIAL = {
  name: "",
  email: "",
  image: "",
  review: "",
  rating: 5,
  isDisplay: false,
};

export default function TestimonialModal({ open, onClose, testimonial }) {
  const { createTestimonial, updateTestimonial } = useTestimonialStore();
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const isEdit = !!testimonial;

  useEffect(() => {
    if (testimonial) {
      setForm({
        name: testimonial.name || "",
        email: testimonial.email || "",
        image: testimonial.image || "",
        review: testimonial.review || "",
        rating: testimonial.rating || 5,
        isDisplay: testimonial.isDisplay || false,
      });
    } else {
      setForm(INITIAL);
    }
  }, [testimonial, open]);

  if (!open) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const ok = isEdit
      ? await updateTestimonial(testimonial._id, form)
      : await createTestimonial(form);
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-base font-semibold text-slate-900">
            {isEdit ? "Edit Testimonial" : "Add Testimonial"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="john@example.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Photo URL</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-2 w-14 h-14 rounded-full object-cover border border-slate-200"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => set("rating", star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={28}
                    className={
                      star <= form.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200"
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-slate-500 self-center">{form.rating}/5</span>
            </div>
          </div>

          {/* Review */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Review <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={form.review}
              onChange={(e) => set("review", e.target.value)}
              placeholder="Write the customer review here…"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
            />
          </div>

          {/* isDisplay */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-sm font-medium text-slate-800">Publish Testimonial</p>
              <p className="text-xs text-slate-500">Make visible on the website</p>
            </div>
            <button
              type="button"
              onClick={() => set("isDisplay", !form.isDisplay)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.isDisplay ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.isDisplay ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Footer */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 text-white text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Testimonial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

