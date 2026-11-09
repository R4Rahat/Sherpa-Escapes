import { useState, useEffect } from "react";
import { X, Loader2, HelpCircle } from "lucide-react";
import { useFaqStore } from "../useFaqStore";

const initialFormState = {
  question: "",
  answer: "",
  isDisplay: false,
};

export default function FaqModal() {
  const {
    isModalOpen,
    modalMode,
    selectedFaq,
    closeModal,
    createFaq,
    updateFaq,
    submitting,
  } = useFaqStore();

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isModalOpen) {
      if (modalMode === "edit" && selectedFaq) {
        setFormData({
          question: selectedFaq.question || "",
          answer: selectedFaq.answer || "",
          isDisplay: Boolean(selectedFaq.isDisplay),
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isModalOpen, modalMode, selectedFaq]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === "edit" && selectedFaq) {
      await updateFaq(selectedFaq._id, formData);
    } else {
      await createFaq(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 my-6 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {modalMode === "create" ? "Add New FAQ" : "Edit FAQ"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {modalMode === "create"
                ? "Create a new question and answer for the FAQ section."
                : "Update the question, answer or visibility settings."}
            </p>
          </div>
          <button
            onClick={closeModal}
            disabled={submitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Question */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Question <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-3 left-0 flex items-start pl-3.5 text-slate-400">
                  <HelpCircle size={16} />
                </span>
                <textarea
                  rows={2}
                  name="question"
                  required
                  value={formData.question}
                  onChange={handleChange}
                  placeholder="e.g. What is the best time to visit Nepal for trekking?"
                  className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition resize-none"
                />
              </div>
            </div>

            {/* Answer */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Answer
              </label>
              <textarea
                rows={6}
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Write a comprehensive answer to the question above..."
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
              />
            </div>

            {/* isDisplay toggle */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDisplay"
                  checked={formData.isDisplay}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-900 block">
                    Publish to Public FAQ
                  </span>
                  <span className="text-xs text-slate-500">
                    When enabled, this FAQ will be visible on the public website.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={closeModal}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{modalMode === "create" ? "Create FAQ" : "Save Changes"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

