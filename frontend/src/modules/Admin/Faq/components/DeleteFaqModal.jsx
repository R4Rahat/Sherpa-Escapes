import { AlertTriangle, Loader2 } from "lucide-react";
import { useFaqStore } from "../useFaqStore";

export default function DeleteFaqModal() {
  const { isDeleteModalOpen, faqToDelete, closeDeleteModal, deleteFaq, submitting } =
    useFaqStore();

  if (!isDeleteModalOpen || !faqToDelete) return null;

  const handleConfirm = async () => {
    await deleteFaq(faqToDelete._id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/90 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              Delete FAQ
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Permanently remove this question and answer.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Are you sure you want to delete{" "}
          <strong className="text-slate-900 font-semibold">
            "{faqToDelete.question}"
          </strong>
          ? This will remove it from the public FAQ section.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={closeDeleteModal}
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition cursor-pointer shadow-xs"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete FAQ</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

