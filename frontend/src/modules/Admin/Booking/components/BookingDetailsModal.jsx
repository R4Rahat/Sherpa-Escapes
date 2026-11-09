import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CreditCard,
  Edit3,
  Trash2,
} from "lucide-react";
import { useBookingStore } from "../useBookingStore";

export default function BookingDetailsModal() {
  const {
    isDetailsModalOpen,
    bookingToView,
    closeDetailsModal,
    openEditModal,
    openDeleteModal,
    updateBookingStatus,
    updatePaymentStatus,
  } = useBookingStore();

  if (!isDetailsModalOpen || !bookingToView) return null;

  const pkg = bookingToView.package || {};
  const packagePrice = pkg.discountPrice || pkg.price || 0;
  const totalAmount = (bookingToView.numberOfPerson || 1) * packagePrice;

  const bookingStatusColors = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const paymentStatusColors = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    refunded: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const formattedDate = bookingToView.createdAt
    ? new Date(bookingToView.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 my-6 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                #{bookingToView._id.slice(-6).toUpperCase()}
              </span>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                Booking Details
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Booked on {formattedDate}
            </p>
          </div>

          <button
            onClick={closeDetailsModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Status Quick Control Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            {/* Booking Status Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Booking Status
              </label>
              <select
                value={bookingToView.bookingStatus}
                onChange={(e) =>
                  updateBookingStatus(bookingToView._id, e.target.value)
                }
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition cursor-pointer focus:outline-none ${
                  bookingStatusColors[bookingToView.bookingStatus] ||
                  "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Payment Status
              </label>
              <select
                value={bookingToView.paymentStatus}
                onChange={(e) =>
                  updatePaymentStatus(bookingToView._id, e.target.value)
                }
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition cursor-pointer focus:outline-none ${
                  paymentStatusColors[bookingToView.paymentStatus] ||
                  "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <User size={15} /> Customer Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Full Name
                </span>
                <span className="font-semibold text-sm text-slate-900 mt-1 block">
                  {bookingToView.name}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Email
                </span>
                <a
                  href={`mailto:${bookingToView.email}`}
                  className="font-medium text-xs text-indigo-600 hover:underline mt-1 block truncate"
                >
                  {bookingToView.email}
                </a>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Phone Number
                </span>
                <a
                  href={`tel:${bookingToView.phoneNumber}`}
                  className="font-medium text-xs text-slate-900 hover:text-indigo-600 mt-1 block truncate"
                >
                  {bookingToView.phoneNumber}
                </a>
              </div>
            </div>
          </div>

          {/* Package Information Card */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <MapPin size={15} /> Selected Tour Package
            </h3>

            {pkg.title ? (
              <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                {pkg.thumbnail ? (
                  <img
                    src={pkg.thumbnail}
                    alt={pkg.title}
                    className="w-full sm:w-28 h-20 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-full sm:w-28 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs shrink-0">
                    No Image
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base leading-snug">
                      {pkg.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      {pkg.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" />
                          {pkg.location}
                        </span>
                      )}
                      {pkg.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-slate-400" />
                          {pkg.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-slate-700 mt-2">
                    Unit Price: ${packagePrice} / person
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                Package ID: {typeof bookingToView.package === "string" ? bookingToView.package : "N/A"} (Details unavailable)
              </div>
            )}
          </div>

          {/* Travelers & Total Price Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Users size={15} /> Travelers & Billing Breakdown
            </h3>
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100">
                <span>Number of Adults</span>
                <span className="font-semibold text-slate-900">
                  {bookingToView.numberOfAdult || 1}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100">
                <span>Number of Children</span>
                <span className="font-semibold text-slate-900">
                  {bookingToView.numberOfChildren || 0}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100">
                <span>Total Persons</span>
                <span className="font-bold text-slate-900">
                  {bookingToView.numberOfPerson || 1}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-slate-900">
                  Estimated Total
                </span>
                <span className="text-xl font-extrabold text-slate-950">
                  ${totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              closeDetailsModal();
              openDeleteModal(bookingToView);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete Booking</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                closeDetailsModal();
                openEditModal(bookingToView);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Edit Details</span>
            </button>

            <button
              type="button"
              onClick={closeDetailsModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-950 text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

