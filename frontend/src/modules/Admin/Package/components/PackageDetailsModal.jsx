import {
  X,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Tag,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { usePackageStore } from "../usePackageStore";

export default function PackageDetailsModal() {
  const { isDetailsModalOpen, packageToView, closeDetailsModal } =
    usePackageStore();

  if (!isDetailsModalOpen || !packageToView) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                packageToView.isActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {packageToView.isActive ? "Active" : "Inactive"}
            </span>

            {packageToView.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles size={12} />
                Featured
              </span>
            )}
          </div>

          <button
            onClick={closeDetailsModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Main Title & Thumbnail Banner */}
          <div className="flex flex-col md:flex-row gap-6">
            {packageToView.thumbnail ? (
              <img
                src={packageToView.thumbnail}
                alt={packageToView.title}
                className="w-full md:w-56 h-44 object-cover rounded-xl border border-slate-200 shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-full md:w-56 h-44 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs shrink-0 font-medium">
                No Thumbnail
              </div>
            )}

            <div className="flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  {packageToView.title}
                </h2>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-1.5">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <span>
                    {packageToView.location}
                    {packageToView.state ? `, ${packageToView.state}` : ""}
                    {packageToView.country ? `, ${packageToView.country}` : ""}
                  </span>
                </div>

                {packageToView.shortDescription && (
                  <p className="text-sm text-slate-600 mt-3 line-clamp-3">
                    {packageToView.shortDescription}
                  </p>
                )}
              </div>

              {/* Price Tags */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-slate-900">
                  ${packageToView.price || 0}
                </span>
                {packageToView.discountPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ${packageToView.discountPrice}
                  </span>
                )}
                <span className="text-xs text-slate-500 font-medium">
                  per person
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Duration
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-sm text-slate-900">
                <Clock size={15} className="text-slate-500" />
                <span>{packageToView.duration || "N/A"}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Difficulty
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-sm text-slate-900">
                <Tag size={15} className="text-slate-500" />
                <span>{packageToView.difficulty || "Moderate"}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Max People
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-sm text-slate-900">
                <Users size={15} className="text-slate-500" />
                <span>{packageToView.maxPeople || "Unlimited"}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Categories
              </span>
              <div className="mt-1 font-semibold text-xs text-slate-900 truncate">
                {packageToView.category?.length
                  ? packageToView.category.join(", ")
                  : "General"}
              </div>
            </div>
          </div>

          {/* Full Description */}
          {packageToView.description && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400 mb-2">
                Overview & Description
              </h3>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-200/70">
                {packageToView.description}
              </p>
            </div>
          )}

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Included */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Package Included
              </h4>
              {packageToView.packageIncluded?.length ? (
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {packageToView.packageIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">None specified</p>
              )}
            </div>

            {/* Excluded */}
            <div className="p-4 rounded-xl border border-red-100 bg-red-50/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-3 flex items-center gap-1.5">
                <XCircle size={16} className="text-red-600" />
                Package Excluded
              </h4>
              {packageToView.packageExcluded?.length ? (
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {packageToView.packageExcluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">None specified</p>
              )}
            </div>
          </div>

          {/* Itinerary */}
          {packageToView.itinerary?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Calendar size={16} />
                Detailed Itinerary
              </h3>
              <div className="space-y-3">
                {packageToView.itinerary.map((dayItem, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-xs font-bold">
                        Day {dayItem.day || idx + 1}
                      </span>
                      <h5 className="font-semibold text-sm text-slate-900">
                        {dayItem.title || `Day ${idx + 1}`}
                      </h5>
                    </div>
                    {dayItem.description && (
                      <p className="text-xs text-slate-600 mt-2 pl-1 leading-relaxed">
                        {dayItem.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200/80 bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={closeDetailsModal}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

