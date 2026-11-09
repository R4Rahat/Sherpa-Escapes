import { useState, useEffect } from "react";
import {
  X,
  Loader2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Package as PackageIcon,
} from "lucide-react";
import { useEnquiryStore } from "../useEnquiryStore";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  package: "",
  status: "new",
};

export default function EnquiryModal() {
  const {
    isModalOpen,
    modalMode,
    selectedEnquiry,
    availablePackages,
    fetchAvailablePackages,
    closeModal,
    createEnquiry,
    updateEnquiry,
    submitting,
  } = useEnquiryStore();

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isModalOpen) {
      if (availablePackages.length === 0) {
        fetchAvailablePackages();
      }

      if (modalMode === "edit" && selectedEnquiry) {
        const pkgId =
          typeof selectedEnquiry.package === "object"
            ? selectedEnquiry.package?._id
            : selectedEnquiry.package;

        setFormData({
          name: selectedEnquiry.name || "",
          email: selectedEnquiry.email || "",
          phone: selectedEnquiry.phone || "",
          subject: selectedEnquiry.subject || "",
          message: selectedEnquiry.message || "",
          package: pkgId || "",
          status: selectedEnquiry.status || "new",
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [
    isModalOpen,
    modalMode,
    selectedEnquiry,
    availablePackages,
    fetchAvailablePackages,
  ]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      package: formData.package ? formData.package : null,
    };

    if (modalMode === "edit" && selectedEnquiry) {
      await updateEnquiry(selectedEnquiry._id, payload);
    } else {
      await createEnquiry(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 my-6 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {modalMode === "create" ? "Record New Enquiry" : "Edit Enquiry"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter inquiry details, inquiry message and customer contact.
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
            {/* Customer Name */}
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
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Email <span className="text-red-500">*</span>
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
                    placeholder="john@example.com"
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+977 9800000000"
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                  />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Inquiring about Annapurna Trek dates"
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
              />
            </div>

            {/* Optional Package Association */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Related Package (Optional)
              </label>
              <select
                name="package"
                value={formData.package}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 transition cursor-pointer"
              >
                <option value="">-- No specific package linked --</option>
                {availablePackages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Message Content
              </label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write the customer's query or notes..."
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
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
                  {modalMode === "create" ? "Save Enquiry" : "Save Changes"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

