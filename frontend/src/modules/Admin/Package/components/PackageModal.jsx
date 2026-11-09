import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  Tag,
  Calendar,
  Layers,
} from "lucide-react";
import { usePackageStore } from "../usePackageStore";

const initialFormState = {
  title: "",
  shortDescription: "",
  description: "",
  location: "",
  state: "",
  country: "",
  duration: "",
  price: "",
  discountPrice: "",
  difficulty: "Moderate",
  maxPeople: "",
  featured: false,
  thumbnail: "",
  images: [],
  category: "",
  packageIncluded: [""],
  packageExcluded: [""],
  itinerary: [{ day: 1, title: "", description: "" }],
  isActive: true,
};

export default function PackageModal() {
  const {
    isModalOpen,
    modalMode,
    selectedPackage,
    closeModal,
    createPackage,
    updatePackage,
    submitting,
  } = usePackageStore();

  const [formData, setFormData] = useState(initialFormState);
  const [activeTab, setActiveTab] = useState("general"); // "general" | "pricing" | "inclusions" | "itinerary"

  useEffect(() => {
    if (modalMode === "edit" && selectedPackage) {
      setFormData({
        title: selectedPackage.title || "",
        shortDescription: selectedPackage.shortDescription || "",
        description: selectedPackage.description || "",
        location: selectedPackage.location || "",
        state: selectedPackage.state || "",
        country: selectedPackage.country || "",
        duration: selectedPackage.duration || "",
        price: selectedPackage.price ?? "",
        discountPrice: selectedPackage.discountPrice ?? "",
        difficulty: selectedPackage.difficulty || "Moderate",
        maxPeople: selectedPackage.maxPeople ?? "",
        featured: Boolean(selectedPackage.featured),
        thumbnail: selectedPackage.thumbnail || "",
        images: selectedPackage.images || [],
        category: selectedPackage.category?.join(", ") || "",
        packageIncluded: selectedPackage.packageIncluded?.length
          ? selectedPackage.packageIncluded
          : [""],
        packageExcluded: selectedPackage.packageExcluded?.length
          ? selectedPackage.packageExcluded
          : [""],
        itinerary: selectedPackage.itinerary?.length
          ? selectedPackage.itinerary
          : [{ day: 1, title: "", description: "" }],
        isActive: selectedPackage.isActive ?? true,
      });
    } else {
      setFormData(initialFormState);
    }
    setActiveTab("general");
  }, [modalMode, selectedPackage, isModalOpen]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Inclusions handlers
  const handleInclusionChange = (index, value) => {
    const updated = [...formData.packageIncluded];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, packageIncluded: updated }));
  };

  const addInclusion = () => {
    setFormData((prev) => ({
      ...prev,
      packageIncluded: [...prev.packageIncluded, ""],
    }));
  };

  const removeInclusion = (index) => {
    setFormData((prev) => ({
      ...prev,
      packageIncluded: prev.packageIncluded.filter((_, i) => i !== index),
    }));
  };

  // Exclusions handlers
  const handleExclusionChange = (index, value) => {
    const updated = [...formData.packageExcluded];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, packageExcluded: updated }));
  };

  const addExclusion = () => {
    setFormData((prev) => ({
      ...prev,
      packageExcluded: [...prev.packageExcluded, ""],
    }));
  };

  const removeExclusion = (index) => {
    setFormData((prev) => ({
      ...prev,
      packageExcluded: prev.packageExcluded.filter((_, i) => i !== index),
    }));
  };

  // Itinerary handlers
  const handleItineraryChange = (index, field, value) => {
    const updated = [...formData.itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, itinerary: updated }));
  };

  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: "", description: "" },
      ],
    }));
  };

  const removeItineraryDay = (index) => {
    const filtered = formData.itinerary
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, day: idx + 1 }));
    setFormData((prev) => ({ ...prev, itinerary: filtered }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format categories, inclusions, exclusions
    const formattedData = {
      ...formData,
      price: formData.price ? Number(formData.price) : 0,
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      maxPeople: formData.maxPeople ? Number(formData.maxPeople) : null,
      category: formData.category
        ? formData.category.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
      packageIncluded: formData.packageIncluded.filter((i) => i.trim() !== ""),
      packageExcluded: formData.packageExcluded.filter((e) => e.trim() !== ""),
      itinerary: formData.itinerary.filter(
        (day) => day.title.trim() !== "" || day.description.trim() !== ""
      ),
    };

    if (modalMode === "edit" && selectedPackage) {
      await updatePackage(selectedPackage._id, formattedData);
    } else {
      await createPackage(formattedData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 my-6 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {modalMode === "create" ? "Create New Package" : "Edit Package"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the package information, pricing, inclusions and itinerary.
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200/70 px-6 gap-2 bg-white overflow-x-auto shrink-0">
          {[
            { id: "general", label: "General & Media" },
            { id: "pricing", label: "Pricing & Details" },
            { id: "inclusions", label: "Inclusions" },
            { id: "itinerary", label: "Itinerary" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "border-slate-950 text-slate-950 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {/* GENERAL TAB */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Package Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Everest Base Camp Trek"
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Solukhumbu"
                      className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      State / Region
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Koshi"
                      className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g. Nepal"
                      className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                  />
                  {formData.thumbnail && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={formData.thumbnail}
                        alt="Preview"
                        className="h-16 w-24 object-cover rounded-lg border border-slate-200"
                      />
                      <span className="text-xs text-slate-400">
                        Thumbnail Preview
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Short Summary
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    placeholder="Brief highlight of this adventure..."
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Comprehensive details, highlights, expectations..."
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Categories (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Trekking, Adventure, Mountaineering"
                    className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                  />
                </div>
              </div>
            )}

            {/* PRICING & LOGISTICS TAB */}
            {activeTab === "pricing" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="any"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="1200"
                      className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Discount Price ($) (Optional)
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      min="0"
                      step="any"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      placeholder="999"
                      className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g. 14 Days / 13 Nights"
                      className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition cursor-pointer"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Challenging">Challenging</option>
                      <option value="Hard">Hard / Extreme</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Max Group Size
                    </label>
                    <input
                      type="number"
                      name="maxPeople"
                      min="1"
                      value={formData.maxPeople}
                      onChange={handleChange}
                      placeholder="12"
                      className="w-full rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
                    />
                    <div>
                      <span className="text-sm font-semibold text-slate-900 block">
                        Featured Package
                      </span>
                      <span className="text-xs text-slate-500">
                        Highlight this package on the homepage showcase
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
                    />
                    <div>
                      <span className="text-sm font-semibold text-slate-900 block">
                        Active & Published
                      </span>
                      <span className="text-xs text-slate-500">
                        Allow customers to view and book this package
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* INCLUSIONS TAB */}
            {activeTab === "inclusions" && (
              <div className="space-y-6">
                {/* Package Included */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle size={15} className="text-emerald-600" />
                      What's Included
                    </label>
                    <button
                      type="button"
                      onClick={addInclusion}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.packageIncluded.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleInclusionChange(index, e.target.value)
                          }
                          placeholder="e.g. Airport pickups and transfers, Meals included"
                          className="flex-1 rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                        />
                        {formData.packageIncluded.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInclusion(index)}
                            className="p-2 text-slate-400 hover:text-red-600 transition cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Package Excluded */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                      <X size={15} className="text-red-600" />
                      What's Excluded
                    </label>
                    <button
                      type="button"
                      onClick={addExclusion}
                      className="text-xs font-semibold text-red-700 hover:text-red-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.packageExcluded.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleExclusionChange(index, e.target.value)
                          }
                          placeholder="e.g. International airfare, Personal travel insurance"
                          className="flex-1 rounded-xl bg-slate-50/70 border border-slate-200/90 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                        />
                        {formData.packageExcluded.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExclusion(index)}
                            className="p-2 text-slate-400 hover:text-red-600 transition cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ITINERARY TAB */}
            {activeTab === "itinerary" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Day-by-Day Itinerary
                    </h3>
                    <p className="text-xs text-slate-500">
                      Organize the journey milestones and daily plan.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addItineraryDay}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 text-white hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Plus size={14} /> Add Day
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.itinerary.map((dayItem, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-xs font-bold">
                            Day {dayItem.day}
                          </span>
                          <input
                            type="text"
                            value={dayItem.title}
                            onChange={(e) =>
                              handleItineraryChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Day Title (e.g. Arrival in Kathmandu)"
                            className="w-full sm:w-80 rounded-lg bg-white border border-slate-200/90 px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-400"
                          />
                        </div>

                        {formData.itinerary.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItineraryDay(index)}
                            className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                            title="Remove Day"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <textarea
                        rows={2}
                        value={dayItem.description}
                        onChange={(e) =>
                          handleItineraryChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Details of the day's trekking, altitude, accommodation..."
                        className="w-full rounded-lg bg-white border border-slate-200/90 px-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
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
                  {modalMode === "create" ? "Create Package" : "Save Changes"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

