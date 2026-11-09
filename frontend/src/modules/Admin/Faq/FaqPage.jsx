import { useEffect, useState } from "react";
import { Plus, Search, HelpCircle, Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import { useFaqStore } from "./useFaqStore";
import FaqModal from "./components/FaqModal";
import DeleteFaqModal from "./components/DeleteFaqModal";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const SkeletonRow = () => (
  <tr className="border-b border-slate-100">
    {[...Array(5)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
      </td>
    ))}
  </tr>
);

export default function FaqPage() {
  const {
    faqs,
    loading,
    fetchFaqs,
    toggleDisplay,
    openCreateModal,
    openEditModal,
    openDeleteModal,
  } = useFaqStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | published | draft

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  const filtered = faqs.filter((f) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      f.question?.toLowerCase().includes(q) ||
      f.answer?.toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "published" && f.isDisplay) ||
      (filter === "draft" && !f.isDisplay);
    return matchSearch && matchFilter;
  });

  const total = faqs.length;
  const published = faqs.filter((f) => f.isDisplay).length;
  const draft = total - published;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">FAQs</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage frequently asked questions</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total FAQs" value={total} icon={HelpCircle} color="bg-slate-700" />
        <StatCard title="Published" value={published} icon={Eye} color="bg-emerald-500" />
        <StatCard title="Draft" value={draft} icon={EyeOff} color="bg-amber-400" />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search question or answer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {["all", "published", "draft"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === tab
                    ? "bg-white shadow-xs text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-4 py-3 text-left font-semibold text-slate-600 w-[35%]">Question</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 w-[40%]">Answer</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400">
                    <HelpCircle size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No FAQs found</p>
                    {search && <p className="text-xs mt-1">Try adjusting your search</p>}
                  </td>
                </tr>
              ) : (
                filtered.map((faq) => (
                  <tr key={faq._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    {/* Question */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 line-clamp-2">{faq.question}</p>
                    </td>

                    {/* Answer */}
                    <td className="px-4 py-3">
                      <p className="text-slate-500 line-clamp-2">{faq.answer || "—"}</p>
                    </td>

                    {/* Status toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleDisplay(faq._id, faq.isDisplay)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          faq.isDisplay
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {faq.isDisplay ? (
                          <><Eye size={11} /> Published</>
                        ) : (
                          <><EyeOff size={11} /> Draft</>
                        )}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {faq.createdAt
                        ? new Date(faq.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(faq)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(faq)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
            Showing {filtered.length} of {total} FAQs
          </div>
        )}
      </div>

      {/* Modals — self-contained, read state directly from useFaqStore */}
      <FaqModal />
      <DeleteFaqModal />
    </div>
  );
}

