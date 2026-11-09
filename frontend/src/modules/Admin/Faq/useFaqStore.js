import { create } from "zustand";
import { toast } from "sonner";

export const useFaqStore = create((set, get) => ({
  faqs: [],
  loading: false,
  submitting: false,
  error: null,

  // Filters & Search
  searchQuery: "",
  filterDisplay: "all", // "all" | "published" | "draft"

  // Modals state
  isModalOpen: false,
  modalMode: "create", // "create" | "edit"
  selectedFaq: null,
  isDeleteModalOpen: false,
  faqToDelete: null,

  // Setters
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterDisplay: (status) => set({ filterDisplay: status }),

  // Modal controls
  openCreateModal: () =>
    set({
      isModalOpen: true,
      modalMode: "create",
      selectedFaq: null,
    }),

  openEditModal: (faq) =>
    set({
      isModalOpen: true,
      modalMode: "edit",
      selectedFaq: faq,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      selectedFaq: null,
    }),

  openDeleteModal: (faq) =>
    set({
      isDeleteModalOpen: true,
      faqToDelete: faq,
    }),

  closeDeleteModal: () =>
    set({
      isDeleteModalOpen: false,
      faqToDelete: null,
    }),

  // Fetch all FAQs (admin endpoint)
  fetchFaqs: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/v1/faqs/admin", {
        method: "GET",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to load FAQs");
      }

      set({
        faqs: Array.isArray(result.data) ? result.data : [],
        loading: false,
      });
    } catch (err) {
      console.error("Fetch faqs error:", err);
      set({
        error: err.message || "Failed to load FAQs",
        loading: false,
      });
      toast.error(err.message || "Failed to load FAQs");
    }
  },

  // Create FAQ
  createFaq: async (formData) => {
    try {
      set({ submitting: true });
      const res = await fetch("/api/v1/faqs/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create FAQ");
      }

      const created = result.data;

      set((state) => ({
        faqs: [created, ...state.faqs],
        isModalOpen: false,
        submitting: false,
      }));

      toast.success("FAQ created successfully!");
      return { success: true, data: created };
    } catch (err) {
      console.error("Create faq error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to create FAQ");
      return { success: false, message: err.message };
    }
  },

  // Update FAQ
  updateFaq: async (id, formData) => {
    try {
      set({ submitting: true });
      const res = await fetch(`/api/v1/faqs/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update FAQ");
      }

      const updated = result.data;

      set((state) => ({
        faqs: state.faqs.map((f) => (f._id === id ? updated : f)),
        isModalOpen: false,
        selectedFaq: null,
        submitting: false,
      }));

      toast.success("FAQ updated successfully!");
      return { success: true, data: updated };
    } catch (err) {
      console.error("Update faq error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to update FAQ");
      return { success: false, message: err.message };
    }
  },

  // Quick toggle isDisplay (published on public site)
  toggleDisplay: async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/v1/faqs/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isDisplay: !currentStatus }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update display status");
      }

      set((state) => ({
        faqs: state.faqs.map((f) =>
          f._id === id ? { ...f, isDisplay: !currentStatus } : f
        ),
      }));

      toast.success(
        `FAQ is now ${!currentStatus ? "Published (Visible)" : "Draft (Hidden)"}`
      );
    } catch (err) {
      console.error("Toggle display error:", err);
      toast.error(err.message || "Failed to update display status");
    }
  },

  // Delete FAQ
  deleteFaq: async (id) => {
    try {
      set({ submitting: true });
      const res = await fetch(`/api/v1/faqs/admin/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete FAQ");
      }

      set((state) => ({
        faqs: state.faqs.filter((f) => f._id !== id),
        isDeleteModalOpen: false,
        faqToDelete: null,
        submitting: false,
      }));

      toast.success("FAQ deleted successfully!");
      return { success: true };
    } catch (err) {
      console.error("Delete faq error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to delete FAQ");
      return { success: false, message: err.message };
    }
  },
}));

