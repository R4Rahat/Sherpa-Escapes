import { useEffect, useState } from "react";
import { Plus, Search, MessageSquare, Eye, EyeOff, Trash2, Pencil, Star } from "lucide-react";
import { useTestimonialStore } from "./useTestimonialStore";
import TestimonialModal from "./components/TestimonialModal";
import DeleteTestimonialModal from "./components/DeleteTestimonialModal";

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

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={12}
        className={s <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
      />
    ))}
  </div>
);

const SkeletonRow = () => (
  <tr className="border-b border-slate-100">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
      </td>
    ))}
  </tr>
);

export default function TestimonialPage() {
  const { testimonials, loading, fetchTestimonials, toggleDisplay } = useTestimonialStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const filtered = testimonials.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.name?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.review?.toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "published" && t.isDisplay) ||
      (filter === "draft" && !t.isDisplay);
    return matchSearch && matchFilter;
  });

  const total = testimonials.length;
  const published = testimonials.filter((t) => t.isDisplay).length;
  const draft = total - published;
  const avgRating =
    total > 0
      ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / total).toFixed(1)
      : "—";

  const openCreate = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setModalOpen(true); };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage customer reviews & testimonials</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Testimonial
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total" value={total} icon={MessageSquare} color="bg-slate-700" />
        <StatCard title="Published" value={published} icon={Eye} color="bg-emerald-500" />
        <StatCard title="Draft" value={draft} icon={EyeOff} color="bg-amber-400" />
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-400">
            <Star size={22} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Avg Rating</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{avgRating}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email or review…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
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
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 w-[35%]">Review</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Rating</th>
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
                  <td colSpan={6} className="text-center py-16 text-slate-400">
                    <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No testimonials found</p>
                    {search && <p className="text-xs mt-1">Try adjusting your search</p>}
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    {/* Customer */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {t.image ? (
                          <img
                            src={t.image}
                            alt={t.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-sm font-semibold text-slate-600 ${t.image ? "hidden" : "flex"}`}
                        >
                          {t.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 leading-tight">{t.name}</p>
                          {t.email && (
                            <p className="text-xs text-slate-400 mt-0.5">{t.email}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Review */}
                    <td className="px-4 py-3">
                      <p className="text-slate-500 line-clamp-2">{t.review}</p>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3">
                      <StarRating rating={t.rating} />
                      <span className="text-xs text-slate-400 mt-0.5 block">{t.rating}/5</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleDisplay(t._id, t.isDisplay)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          t.isDisplay
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {t.isDisplay ? (
                          <><Eye size={11} /> Published</>
                        ) : (
                          <><EyeOff size={11} /> Draft</>
                        )}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(t)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(t)}
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

        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
            Showing {filtered.length} of {total} testimonials
          </div>
        )}
      </div>

      {/* Modals */}
      <TestimonialModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        testimonial={editItem}
      />
      <DeleteTestimonialModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        testimonial={deleteTarget}
      />
    </div>
  );
}

