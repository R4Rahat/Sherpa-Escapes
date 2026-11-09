import { create } from "zustand";
import { toast } from "sonner";

export const useEnquiryStore = create((set, get) => ({
  enquiries: [],
  availablePackages: [],
  loading: false,
  submitting: false,
  error: null,

  // Filters & Search
  searchQuery: "",
  filterStatus: "all", // "all" | "new" | "contacted" | "closed"

  // Modals state
  isModalOpen: false,
  modalMode: "create", // "create" | "edit"
  selectedEnquiry: null,
  isDeleteModalOpen: false,
  enquiryToDelete: null,
  isDetailsModalOpen: false,
  enquiryToView: null,

  // Setters
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),

  // Modal controls
  openCreateModal: () =>
    set({
      isModalOpen: true,
      modalMode: "create",
      selectedEnquiry: null,
    }),

  openEditModal: (enquiry) =>
    set({
      isModalOpen: true,
      modalMode: "edit",
      selectedEnquiry: enquiry,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      selectedEnquiry: null,
    }),

  openDeleteModal: (enquiry) =>
    set({
      isDeleteModalOpen: true,
      enquiryToDelete: enquiry,
    }),

  closeDeleteModal: () =>
    set({
      isDeleteModalOpen: false,
      enquiryToDelete: null,
    }),

  openDetailsModal: (enquiry) =>
    set({
      isDetailsModalOpen: true,
      enquiryToView: enquiry,
    }),

  closeDetailsModal: () =>
    set({
      isDetailsModalOpen: false,
      enquiryToView: null,
    }),

  // Fetch all enquiries
  fetchEnquiries: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/v1/enquires", {
        method: "GET",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to load enquiries");
      }

      set({
        enquiries: Array.isArray(result.data) ? result.data : [],
        loading: false,
      });
    } catch (err) {
      console.error("Fetch enquiries error:", err);
      set({
        error: err.message || "Failed to load enquiries",
        loading: false,
      });
      toast.error(err.message || "Failed to load enquiries");
    }
  },

  // Fetch available packages for optional package association
  fetchAvailablePackages: async () => {
    try {
      const res = await fetch("/api/v1/packages/admin", {
        method: "GET",
        credentials: "include",
      });

      const result = await res.json();
      if (res.ok && Array.isArray(result.data)) {
        set({ availablePackages: result.data });
      }
    } catch (err) {
      console.error("Fetch packages error:", err);
    }
  },

  // Create new enquiry
  createEnquiry: async (formData) => {
    try {
      set({ submitting: true });
      const res = await fetch("/api/v1/enquires", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create enquiry");
      }

      await get().fetchEnquiries();

      set({
        isModalOpen: false,
        submitting: false,
      });

      toast.success("Enquiry logged successfully!");
      return { success: true, data: result.data };
    } catch (err) {
      console.error("Create enquiry error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to create enquiry");
      return { success: false, message: err.message };
    }
  },

  // Update enquiry
  updateEnquiry: async (id, formData) => {
    try {
      set({ submitting: true });
      const res = await fetch(`/api/v1/enquires/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update enquiry");
      }

      const updated = result.data;

      set((state) => ({
        enquiries: state.enquiries.map((e) => (e._id === id ? updated : e)),
        isModalOpen: false,
        selectedEnquiry: null,
        submitting: false,
        enquiryToView:
          state.enquiryToView?._id === id ? updated : state.enquiryToView,
      }));

      toast.success("Enquiry updated successfully!");
      return { success: true, data: updated };
    } catch (err) {
      console.error("Update enquiry error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to update enquiry");
      return { success: false, message: err.message };
    }
  },

  // Quick update status (e.g. new -> contacted -> closed)
  updateStatus: async (id, status) => {
    try {
      const res = await fetch(`/api/v1/enquires/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update status");
      }

      const updated = result.data;

      set((state) => ({
        enquiries: state.enquiries.map((e) => (e._id === id ? updated : e)),
        enquiryToView:
          state.enquiryToView?._id === id ? updated : state.enquiryToView,
      }));

      toast.success(`Enquiry marked as ${status}`);
    } catch (err) {
      console.error("Update status error:", err);
      toast.error(err.message || "Failed to update status");
    }
  },

  // Delete enquiry
  deleteEnquiry: async (id) => {
    try {
      set({ submitting: true });
      const res = await fetch(`/api/v1/enquires/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete enquiry");
      }

      set((state) => ({
        enquiries: state.enquiries.filter((e) => e._id !== id),
        isDeleteModalOpen: false,
        enquiryToDelete: null,
        submitting: false,
        isDetailsModalOpen:
          state.enquiryToView?._id === id ? false : state.isDetailsModalOpen,
      }));

      toast.success("Enquiry deleted successfully!");
      return { success: true };
    } catch (err) {
      console.error("Delete enquiry error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to delete enquiry");
      return { success: false, message: err.message };
    }
  },
}));

