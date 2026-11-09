import { useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Edit3,
  Trash2,
  Eye,
  MapPin,
  Clock,
  Sparkles,
  Package as PackageIcon,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Tag,
} from "lucide-react";
import { usePackageStore } from "./usePackageStore";
import PackageModal from "./components/PackageModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import PackageDetailsModal from "./components/PackageDetailsModal";

export default function PackagePage() {
  const {
    packages,
    loading,
    error,
    searchQuery,
    filterStatus,
    fetchPackages,
    setSearchQuery,
    setFilterStatus,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    openDetailsModal,
    toggleStatus,
  } = usePackageStore();

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Filtered packages by search query and status filter
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Status filter
      if (filterStatus === "active" && !pkg.isActive) return false;
      if (filterStatus === "inactive" && pkg.isActive) return false;
      if (filterStatus === "featured" && !pkg.featured) return false;

      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const titleMatch = pkg.title?.toLowerCase().includes(q);
        const locMatch = pkg.location?.toLowerCase().includes(q);
        const countryMatch = pkg.country?.toLowerCase().includes(q);
        const catMatch = pkg.category?.some((c) => c.toLowerCase().includes(q));
        if (!titleMatch && !locMatch && !countryMatch && !catMatch) return false;
      }

      return true;
    });
  }, [packages, filterStatus, searchQuery]);

  // Summary statistics
  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter((p) => p.isActive).length;
    const featured = packages.filter((p) => p.featured).length;
    const inactive = total - active;
    return { total, active, featured, inactive };
  }, [packages]);

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Package Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, organize and monitor tour and adventure packages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchPackages}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition shadow-xs cursor-pointer"
            title="Refresh packages"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-medium px-4 py-2.5 text-sm transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={16} />
            <span>Add Package</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Total Packages
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {stats.total}
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 block">
            Active Packages
          </span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">
            {stats.active}
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 block">
            Featured
          </span>
          <span className="text-2xl font-bold text-amber-700 mt-1 block">
            {stats.featured}
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Inactive
          </span>
          <span className="text-2xl font-bold text-slate-500 mt-1 block">
            {stats.inactive}
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, country..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200/90 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search size={17} />
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All" },
            { id: "active", label: "Active" },
            { id: "featured", label: "Featured" },
            { id: "inactive", label: "Inactive" },
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

      {/* Main Table / List View */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {loading && packages.length === 0 ? (
          /* Loading Skeletons */
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : filteredPackages.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <PackageIcon size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No packages found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search criteria or filters."
                : "Get started by adding your first tour or trek package."}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 text-white text-xs font-semibold px-4 py-2 hover:bg-slate-800 transition shadow-xs cursor-pointer"
              >
                <Plus size={14} /> Add First Package
              </button>
            )}
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/60 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3.5 pl-6 pr-4">Package</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Duration & Difficulty</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPackages.map((pkg) => (
                  <tr
                    key={pkg._id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        {pkg.thumbnail ? (
                          <img
                            src={pkg.thumbnail}
                            alt={pkg.title}
                            className="h-11 w-14 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                        ) : (
                          <div className="h-11 w-14 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                            <PackageIcon size={18} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 truncate max-w-xs block text-sm">
                              {pkg.title}
                            </span>
                            {pkg.featured && (
                              <span
                                title="Featured Package"
                                className="inline-flex text-amber-500"
                              >
                                <Sparkles size={14} />
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 truncate block mt-0.5">
                            {pkg.category?.length
                              ? pkg.category.join(", ")
                              : "Standard Tour"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span>
                          {pkg.location}
                          {pkg.country ? `, ${pkg.country}` : ""}
                        </span>
                      </div>
                    </td>

                    {/* Duration & Difficulty */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                          <Clock size={13} className="text-slate-400 shrink-0" />
                          <span>{pkg.duration || "N/A"}</span>
                        </div>
                        {pkg.difficulty && (
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {pkg.difficulty}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-sm">
                        ${pkg.price || 0}
                      </div>
                      {pkg.discountPrice && (
                        <div className="text-xs text-slate-400 line-through">
                          ${pkg.discountPrice}
                        </div>
                      )}
                    </td>

                    {/* Active Status Badge / Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(pkg._id, pkg.isActive)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                          pkg.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200/80"
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            pkg.isActive ? "bg-emerald-600" : "bg-slate-400"
                          }`}
                        />
                        <span>{pkg.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pl-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => openDetailsModal(pkg)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => openEditModal(pkg)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                          title="Edit Package"
                        >
                          <Edit3 size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => openDeleteModal(pkg)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Delete / Deactivate"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <PackageModal />
      <DeleteConfirmModal />
      <PackageDetailsModal />
    </div>
  );
}
