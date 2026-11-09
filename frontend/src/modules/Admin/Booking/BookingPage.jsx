import { useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  CalendarCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useBookingStore } from "./useBookingStore";
import BookingModal from "./components/BookingModal";
import BookingDetailsModal from "./components/BookingDetailsModal";
import DeleteBookingModal from "./components/DeleteBookingModal";

export default function BookingPage() {
  const {
    bookings,
    loading,
    error,
    searchQuery,
    filterBookingStatus,
    filterPaymentStatus,
    fetchBookings,
    fetchAvailablePackages,
    setSearchQuery,
    setFilterBookingStatus,
    setFilterPaymentStatus,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    openDetailsModal,
    updateBookingStatus,
    updatePaymentStatus,
  } = useBookingStore();

  useEffect(() => {
    fetchBookings();
    fetchAvailablePackages();
  }, [fetchBookings, fetchAvailablePackages]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Booking Status filter
      if (
        filterBookingStatus !== "all" &&
        b.bookingStatus !== filterBookingStatus
      ) {
        return false;
      }

      // Payment Status filter
      if (
        filterPaymentStatus !== "all" &&
        b.paymentStatus !== filterPaymentStatus
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const nameMatch = b.name?.toLowerCase().includes(q);
        const emailMatch = b.email?.toLowerCase().includes(q);
        const phoneMatch = String(b.phoneNumber).includes(q);
        const pkgMatch =
          typeof b.package === "object"
            ? b.package?.title?.toLowerCase().includes(q)
            : false;

        if (!nameMatch && !emailMatch && !phoneMatch && !pkgMatch) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, filterBookingStatus, filterPaymentStatus, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.bookingStatus === "confirmed").length;
    const pending = bookings.filter((b) => b.bookingStatus === "pending").length;
    const cancelled = bookings.filter((b) => b.bookingStatus === "cancelled").length;
    const paid = bookings.filter((b) => b.paymentStatus === "paid").length;

    return { total, confirmed, pending, cancelled, paid };
  }, [bookings]);

  const bookingBadgeColors = {
    pending: "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100",
    cancelled: "bg-red-50 text-red-600 border-red-200/80 hover:bg-red-100",
  };

  const paymentBadgeColors = {
    pending: "bg-amber-50 text-amber-700 border-amber-200/80",
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    failed: "bg-red-50 text-red-600 border-red-200/80",
    refunded: "bg-purple-50 text-purple-700 border-purple-200/80",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Booking Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor, confirm and organize customer tour reservations and payments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchBookings}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition shadow-xs cursor-pointer"
            title="Refresh bookings"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-medium px-4 py-2.5 text-sm transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={16} />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Total Bookings
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {stats.total}
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 block">
            Confirmed
          </span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">
            {stats.confirmed}
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 block">
            Pending
          </span>
          <span className="text-2xl font-bold text-amber-700 mt-1 block">
            {stats.pending}
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-red-500 block">
            Cancelled
          </span>
          <span className="text-2xl font-bold text-red-600 mt-1 block">
            {stats.cancelled}
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 block">
            Paid Bookings
          </span>
          <span className="text-2xl font-bold text-indigo-700 mt-1 block">
            {stats.paid}
          </span>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, email, phone, or tour..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200/90 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search size={17} />
          </span>
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Booking Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl">
            {[
              { id: "all", label: "All" },
              { id: "confirmed", label: "Confirmed" },
              { id: "pending", label: "Pending" },
              { id: "cancelled", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterBookingStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  filterBookingStatus === tab.id
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Payment Status Dropdown Filter */}
          <select
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Payment Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {loading && bookings.length === 0 ? (
          /* Skeletons */
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <CalendarCheck size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No bookings found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery ||
              filterBookingStatus !== "all" ||
              filterPaymentStatus !== "all"
                ? "Try adjusting your search criteria or filters."
                : "New customer reservations will show up here."}
            </p>
            {!searchQuery &&
              filterBookingStatus === "all" &&
              filterPaymentStatus === "all" && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 text-white text-xs font-semibold px-4 py-2 hover:bg-slate-800 transition shadow-xs cursor-pointer"
                >
                  <Plus size={14} /> Add First Booking
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
                  <th className="py-3.5 px-4">Tour Package</th>
                  <th className="py-3.5 px-4">Travelers</th>
                  <th className="py-3.5 px-4">Booking Status</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBookings.map((b) => {
                  const pkg = typeof b.package === "object" ? b.package : null;
                  const dateStr = b.createdAt
                    ? new Date(b.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <tr
                      key={b._id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Customer Info */}
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-sm">
                            {b.name}
                          </span>
                          <span className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">
                            {b.email} • {b.phoneNumber}
                          </span>
                        </div>
                      </td>

                      {/* Package Info */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-0 max-w-xs">
                          <span className="font-medium text-slate-900 text-xs block truncate">
                            {pkg?.title || "Custom Package"}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {pkg?.price ? `$${pkg.price} / person` : "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Travelers */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-xs text-slate-800 font-medium">
                          <Users size={14} className="text-slate-400 shrink-0" />
                          <span>
                            {b.numberOfPerson || 1} Person
                            {(b.numberOfPerson || 1) > 1 ? "s" : ""}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {b.numberOfAdult || 1}A, {b.numberOfChildren || 0}C
                        </span>
                      </td>

                      {/* Booking Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={b.bookingStatus}
                          onChange={(e) =>
                            updateBookingStatus(b._id, e.target.value)
                          }
                          className={`rounded-lg border px-2 py-1 text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer focus:outline-none ${
                            bookingBadgeColors[b.bookingStatus] ||
                            "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Payment Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={b.paymentStatus}
                          onChange={(e) =>
                            updatePaymentStatus(b._id, e.target.value)
                          }
                          className={`rounded-lg border px-2 py-1 text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer focus:outline-none ${
                            paymentBadgeColors[b.paymentStatus] ||
                            "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pl-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openDetailsModal(b)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="View Full Booking"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(b)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                            title="Edit Booking"
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(b)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete Booking"
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
      <BookingModal />
      <BookingDetailsModal />
      <DeleteBookingModal />
    </div>
  );
}
