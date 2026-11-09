import {
  X,
  User,
  Mail,
  Phone,
  MessageSquare,
  Package as PackageIcon,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Trash2,
  Edit3,
  ExternalLink,
} from "lucide-react";
import { useEnquiryStore } from "../useEnquiryStore";

export default function EnquiryDetailsModal() {
  const {
    isDetailsModalOpen,
    enquiryToView,
    closeDetailsModal,
    openEditModal,
    openDeleteModal,
    updateStatus,
  } = useEnquiryStore();

  if (!isDetailsModalOpen || !enquiryToView) return null;

  const pkg = typeof enquiryToView.package === "object" ? enquiryToView.package : null;

  const statusColors = {
    new: "bg-blue-50 text-blue-700 border-blue-200/80",
    contacted: "bg-amber-50 text-amber-700 border-amber-200/80",
    closed: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  };

  const formattedDate = enquiryToView.createdAt
    ? new Date(enquiryToView.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
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
                #{enquiryToView._id.slice(-6).toUpperCase()}
              </span>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                Enquiry Details
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Received on {formattedDate}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80 gap-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Current Status
              </span>
              <span className="text-xs font-medium text-slate-600 mt-0.5 block">
                Update customer interaction status
              </span>
            </div>

            <select
              value={enquiryToView.status || "new"}
              onChange={(e) => updateStatus(enquiryToView._id, e.target.value)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition cursor-pointer focus:outline-none ${
                statusColors[enquiryToView.status || "new"]
              }`}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Customer Information Cards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <User size={15} /> Customer Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Name
                </span>
                <span className="font-semibold text-sm text-slate-900 mt-1 block">
                  {enquiryToView.name}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Email
                </span>
                <a
                  href={`mailto:${enquiryToView.email}`}
                  className="font-medium text-xs text-indigo-600 hover:underline mt-1 block truncate"
                >
                  {enquiryToView.email}
                </a>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Phone
                </span>
                <a
                  href={`tel:${enquiryToView.phone}`}
                  className="font-medium text-xs text-slate-900 hover:text-indigo-600 mt-1 block truncate"
                >
                  {enquiryToView.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Subject & Message Box */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <MessageSquare size={15} /> Enquiry Message
            </h3>
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">
                {enquiryToView.subject || "No subject provided"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {enquiryToView.message || "No message body provided."}
              </p>
            </div>
          </div>

          {/* Associated Tour Package (if applicable) */}
          {pkg && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <PackageIcon size={15} /> Related Tour Package
              </h3>
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                {pkg.thumbnail ? (
                  <img
                    src={pkg.thumbnail}
                    alt={pkg.title}
                    className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs shrink-0">
                    <PackageIcon size={16} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-900 text-sm truncate">
                    {pkg.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    {pkg.location && <span>{pkg.location}</span>}
                    {pkg.price && <span>• ${pkg.price}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              closeDetailsModal();
              openDeleteModal(enquiryToView);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${enquiryToView.email}?subject=Re: ${encodeURIComponent(enquiryToView.subject || "Your Enquiry")}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition cursor-pointer shadow-xs"
            >
              <Mail size={14} />
              <span>Reply by Email</span>
            </a>

            <button
              type="button"
              onClick={() => {
                closeDetailsModal();
                openEditModal(enquiryToView);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Edit</span>
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

