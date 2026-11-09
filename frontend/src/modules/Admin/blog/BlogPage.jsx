import { useEffect, useState } from "react";
import { Plus, Search, Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import { useBlogStore } from "./useBlogStore";
import BlogModal from "./components/BlogModal";
import DeleteBlogModal from "./components/DeleteBlogModal";

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

export default function BlogPage() {
  const {
    blogs,
    loading,
    fetchBlogs,
    toggleDisplay,
    openCreateModal,
    openEditModal,
    openDeleteModal,
  } = useBlogStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | published | draft

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const filtered = blogs.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.title?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.url?.toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "published" && b.isDisplay) ||
      (filter === "draft" && !b.isDisplay);
    return matchSearch && matchFilter;
  });

  const total = blogs.length;
  const published = blogs.filter((b) => b.isDisplay).length;
  const draft = total - published;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Blogs</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage blog posts</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Blog
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Blogs" value={total} icon={Eye} color="bg-slate-700" />
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
              placeholder="Search title or url…"
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
                <th className="px-4 py-3 text-left font-semibold text-slate-600 w-[30%]">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 w-[40%]">Description</th>
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
                    <Eye size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No blogs found</p>
                    {search && <p className="text-xs mt-1">Try adjusting your search</p>}
                  </td>
                </tr>
              ) : (
                filtered.map((blog) => (
                  <tr key={blog._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    {/* Title */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 line-clamp-2">{blog.title}</p>
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3">
                      <p className="text-slate-500 line-clamp-2">{blog.description || "—"}</p>
                    </td>

                    {/* Status toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleDisplay(blog._id, blog.isDisplay)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          blog.isDisplay
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {blog.isDisplay ? (
                          <><Eye size={11} /> Published</>
                        ) : (
                          <><EyeOff size={11} /> Draft</>
                        )}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(blog)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(blog)}
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
            Showing {filtered.length} of {total} blogs
          </div>
        )}
      </div>

      {/* Modals — self-contained, read state directly from useBlogStore */}
      <BlogModal />
      <DeleteBlogModal />
    </div>
  );
}