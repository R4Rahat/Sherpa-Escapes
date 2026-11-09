import { useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  Inbox,
  User,
  Mail,
  Phone,
  MessageSquare,
  Package as PackageIcon,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useEnquiryStore } from "./useEnquiryStore";
import EnquiryModal from "./components/EnquiryModal";
import EnquiryDetailsModal from "./components/EnquiryDetailsModal";
import DeleteEnquiryModal from "./components/DeleteEnquiryModal";

export default function EnquiryPage() {
  const {
    enquiries,
    loading,
    error,
    searchQuery,
    filterStatus,
    fetchEnquiries,
    fetchAvailablePackages,
    setSearchQuery,
    setFilterStatus,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    openDetailsModal,
    updateStatus,
  } = useEnquiryStore();

  useEffect(() => {
    fetchEnquiries();
    fetchAvailablePackages();
  }, [fetchEnquiries, fetchAvailablePackages]);

  // Filtered list
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      // Status filter
      if (filterStatus !== "all" && item.status !== filterStatus) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const nameMatch = item.name?.toLowerCase().includes(q);
        const emailMatch = item.email?.toLowerCase().includes(q);
        const phoneMatch = item.phone?.toLowerCase().includes(q);
        const subjectMatch = item.subject?.toLowerCase().includes(q);
        const messageMatch = item.message?.toLowerCase().includes(q);
        const pkgMatch =
          typeof item.package === "object"
            ? item.package?.title?.toLowerCase().includes(q)
            : false;

        if (
          !nameMatch &&
          !emailMatch &&
          !phoneMatch &&
          !subjectMatch &&
          !messageMatch &&
          !pkgMatch
        ) {
          return false;
        }
      }

      return true;
    });
  }, [enquiries, filterStatus, searchQuery]);

  // Summary counts
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => (e.status || "new") === "new").length;
    const contacted = enquiries.filter((e) => e.status === "contacted").length;
    const closed = enquiries.filter((e) => e.status === "closed").length;

    return { total, newCount, contacted, closed };
  }, [enquiries]);

  const statusBadgeColors = {
    new: "bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100",
    contacted: "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100",
    closed: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Enquiry Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track, respond to, and manage customer inquiries and messages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchEnquiries}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition shadow-xs cursor-pointer"
            title="Refresh enquiries"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-medium px-4 py-2.5 text-sm transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={16} />
            <span>Log Enquiry</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Total Enquiries
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {stats.total}
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 block">
            New Inquiries
          </span>
          <span className="text-2xl font-bold text-blue-700 mt-1 block">
            {stats.newCount}
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 block">
            Contacted
          </span>
          <span className="text-2xl font-bold text-amber-700 mt-1 block">
            {stats.contacted}
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 block">
            Closed
          </span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">
            {stats.closed}
          </span>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, subject, tour..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200/90 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search size={17} />
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All" },
            { id: "new", label: "New" },
            { id: "contacted", label: "Contacted" },
            { id: "closed", label: "Closed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterStatus === tab.id
                  ? "bg-slate-950 text-white shadow-2xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {loading && enquiries.length === 0 ? (
          /* Skeletons */
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : filteredEnquiries.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Inbox size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No enquiries found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search query or filter selection."
                : "Customer contact messages will appear here."}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 text-white text-xs font-semibold px-4 py-2 hover:bg-slate-800 transition shadow-xs cursor-pointer"
              >
                <Plus size={14} /> Log First Enquiry
              </button>
            )}
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/60 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3.5 pl-6 pr-4">Customer</th>
                  <th className="py-3.5 px-4">Subject & Message</th>
                  <th className="py-3.5 px-4">Related Tour</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Received</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredEnquiries.map((item) => {
                  const pkg =
                    typeof item.package === "object" ? item.package : null;
                  const dateStr = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Customer Info */}
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-sm">
                            {item.name}
                          </span>
                          <span className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">
                            {item.email} • {item.phone}
                          </span>
                        </div>
                      </td>

                      {/* Subject & Message snippet */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-xs sm:max-w-sm">
                          <span className="font-semibold text-slate-900 text-xs block truncate">
                            {item.subject || "No Subject"}
                          </span>
                          <span className="text-xs text-slate-500 truncate block mt-0.5">
                            {item.message || "No message body"}
                          </span>
                        </div>
                      </td>

                      {/* Related Tour */}
                      <td className="py-3.5 px-4">
                        {pkg?.title ? (
                          <div className="flex items-center gap-2 max-w-xs">
                            <PackageIcon
                              size={14}
                              className="text-slate-400 shrink-0"
                            />
                            <span className="text-xs font-medium text-slate-800 truncate">
                              {pkg.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status || "new"}
                          onChange={(e) =>
                            updateStatus(item._id, e.target.value)
                          }
                          className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer focus:outline-none ${
                            statusBadgeColors[item.status || "new"]
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      {/* Received Date */}
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pl-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick Mailto */}
                          <a
                            href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject || "Your Enquiry")}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                            title="Reply by Email"
                          >
                            <Mail size={16} />
                          </a>

                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => openDetailsModal(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="View Full Enquiry"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                            title="Edit Enquiry"
                          >
                            <Edit3 size={16} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => openDeleteModal(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete Enquiry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <EnquiryModal />
      <EnquiryDetailsModal />
      <DeleteEnquiryModal />
    </div>
  );
}

