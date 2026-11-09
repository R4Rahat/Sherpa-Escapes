import { useState, useEffect, useMemo } from "react";
import {
  X,
  Loader2,
  User,
  Mail,
  Phone,
  Package as PackageIcon,
  Users,
  DollarSign,
} from "lucide-react";
import { useBookingStore } from "../useBookingStore";

const initialFormState = {
  name: "",
  email: "",
  phoneNumber: "",
  package: "",
  numberOfPerson: 1,
  numberOfAdult: 1,
  numberOfChildren: 0,
  bookingStatus: "pending",
  paymentStatus: "pending",
};

export default function BookingModal() {
  const {
    isModalOpen,
    modalMode,
    selectedBooking,
    availablePackages,
    fetchAvailablePackages,
    closeModal,
    createBooking,
    updateBooking,
    submitting,
  } = useBookingStore();

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isModalOpen) {
      if (availablePackages.length === 0) {
        fetchAvailablePackages();
      }

      if (modalMode === "edit" && selectedBooking) {
        const pkgId =
          typeof selectedBooking.package === "object"
            ? selectedBooking.package?._id
            : selectedBooking.package;

        setFormData({
          name: selectedBooking.name || "",
          email: selectedBooking.email || "",
          phoneNumber: selectedBooking.phoneNumber || "",
          package: pkgId || "",
          numberOfPerson: selectedBooking.numberOfPerson || 1,
          numberOfAdult: selectedBooking.numberOfAdult || 1,
          numberOfChildren: selectedBooking.numberOfChildren || 0,
          bookingStatus: selectedBooking.bookingStatus || "pending",
          paymentStatus: selectedBooking.paymentStatus || "pending",
        });
      } else {
        setFormData({
          ...initialFormState,
          package: availablePackages[0]?._id || "",
        });
      }
    }
  }, [
    isModalOpen,
    modalMode,
    selectedBooking,
    availablePackages,
    fetchAvailablePackages,
  ]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      // Auto update total persons when adult or children changes
      if (name === "numberOfAdult" || name === "numberOfChildren") {
        const adults =
          name === "numberOfAdult" ? Number(value) || 0 : Number(prev.numberOfAdult) || 0;
        const children =
          name === "numberOfChildren" ? Number(value) || 0 : Number(prev.numberOfChildren) || 0;
        next.numberOfPerson = Math.max(1, adults + children);
      }

      return next;
    });
  };

  // Find currently selected package to compute estimate
  const selectedPkg = availablePackages.find((p) => p._id === formData.package);
  const pkgPrice = selectedPkg?.discountPrice || selectedPkg?.price || 0;
  const estimatedTotal = (Number(formData.numberOfPerson) || 1) * pkgPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      phoneNumber: Number(formData.phoneNumber),
      numberOfPerson: Number(formData.numberOfPerson),
      numberOfAdult: Number(formData.numberOfAdult),
      numberOfChildren: Number(formData.numberOfChildren),
    };

    if (modalMode === "edit" && selectedBooking) {
      await updateBooking(selectedBooking._id, payload);
    } else {
      await createBooking(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 my-6 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {modalMode === "create" ? "Add New Booking" : "Edit Booking Details"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter customer and reservation information.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Customer Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Customer Information
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="customer@example.com"
                      className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Phone size={16} />
                    </span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="9800000000"
                      className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Package Selection */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tour Package Selection
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Select Package <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="package"
                    required
                    value={formData.package}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition cursor-pointer"
                  >
                    <option value="" disabled>
                      -- Choose a Package --
                    </option>
                    {availablePackages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.title} - ${pkg.discountPrice || pkg.price || 0}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedPkg && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                  <span>Price per person:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ${pkgPrice}
                  </span>
                </div>
              )}
            </div>

            {/* Travelers Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Travelers
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Adults
                  </label>
                  <input
                    type="number"
                    name="numberOfAdult"
                    min="1"
                    required
                    value={formData.numberOfAdult}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Children
                  </label>
                  <input
                    type="number"
                    name="numberOfChildren"
                    min="0"
                    value={formData.numberOfChildren}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Total Persons
                  </label>
                  <input
                    type="number"
                    name="numberOfPerson"
                    min="1"
                    required
                    value={formData.numberOfPerson}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 font-bold"
                  />
                </div>
              </div>

              {selectedPkg && (
                <div className="p-3 rounded-xl bg-slate-950 text-white flex items-center justify-between text-xs">
                  <span>Estimated Total Amount:</span>
                  <span className="font-extrabold text-sm">
                    ${estimatedTotal}
                  </span>
                </div>
              )}
            </div>

            {/* Statuses */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Reservation Status
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Booking Status
                  </label>
                  <select
                    name="bookingStatus"
                    value={formData.bookingStatus}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
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
                <span>
                  {modalMode === "create" ? "Create Booking" : "Save Changes"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

