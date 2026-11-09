import { create } from "zustand";
import { toast } from "sonner";

export const usePackageStore = create((set, get) => ({
  packages: [],
  loading: false,
  submitting: false,
  error: null,

  // Filters & Search
  searchQuery: "",
  filterStatus: "all", // "all" | "active" | "inactive" | "featured"

  // Modals state
  isModalOpen: false,
  modalMode: "create", // "create" | "edit"
  selectedPackage: null,
  isDeleteModalOpen: false,
  packageToDelete: null,
  isDetailsModalOpen: false,
  packageToView: null,

  // Setters for search and filter
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),

  // Modal controls
  openCreateModal: () =>
    set({
      isModalOpen: true,
      modalMode: "create",
      selectedPackage: null,
    }),

  openEditModal: (pkg) =>
    set({
      isModalOpen: true,
      modalMode: "edit",
      selectedPackage: pkg,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      selectedPackage: null,
    }),

  openDeleteModal: (pkg) =>
    set({
      isDeleteModalOpen: true,
      packageToDelete: pkg,
    }),

  closeDeleteModal: () =>
    set({
      isDeleteModalOpen: false,
      packageToDelete: null,
    }),

  openDetailsModal: (pkg) =>
    set({
      isDetailsModalOpen: true,
      packageToView: pkg,
    }),

  closeDetailsModal: () =>
    set({
      isDetailsModalOpen: false,
      packageToView: null,
    }),

  // Fetch all packages (admin endpoint)
  fetchPackages: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/v1/packages/admin", {
        method: "GET",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to load packages");
      }

      set({
        packages: Array.isArray(result.data) ? result.data : [],
        loading: false,
      });
    } catch (err) {
      console.error("Fetch packages error:", err);
      set({
        error: err.message || "Failed to load packages",
        loading: false,
      });
      toast.error(err.message || "Failed to load packages");
    }
  },

  // Create package
  createPackage: async (formData) => {
    try {
      set({ submitting: true });
      const res = await fetch("/api/v1/packages/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create package");
      }

      const createdItem = result.data;

      set((state) => ({
        packages: [createdItem, ...state.packages],
        isModalOpen: false,
        submitting: false,
      }));

      toast.success("Package created successfully!");
      return { success: true, data: createdItem };
    } catch (err) {
      console.error("Create package error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to create package");
      return { success: false, message: err.message };
    }
  },

  // Update package
  updatePackage: async (id, formData) => {
    try {
      set({ submitting: true });
      const res = await fetch(`/api/v1/packages/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update package");
      }

      const updatedItem = result.data;

      set((state) => ({
        packages: state.packages.map((pkg) =>
          pkg._id === id ? updatedItem : pkg
        ),
        isModalOpen: false,
        selectedPackage: null,
        submitting: false,
      }));

      toast.success("Package updated successfully!");
      return { success: true, data: updatedItem };
    } catch (err) {
      console.error("Update package error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to update package");
      return { success: false, message: err.message };
    }
  },

  // Delete package (soft delete in backend)
  deletePackage: async (id) => {
    try {
      set({ submitting: true });
      const res = await fetch(`/api/v1/packages/admin/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete package");
      }

      // Backend marks isActive: false
      const updatedItem = result.data;

      set((state) => ({
        packages: state.packages.map((pkg) =>
          pkg._id === id ? updatedItem || { ...pkg, isActive: false } : pkg
        ),
        isDeleteModalOpen: false,
        packageToDelete: null,
        submitting: false,
      }));

      toast.success("Package removed / marked inactive successfully!");
      return { success: true };
    } catch (err) {
      console.error("Delete package error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to delete package");
      return { success: false, message: err.message };
    }
  },

  // Toggle active/inactive status
  toggleStatus: async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/v1/packages/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to toggle status");
      }

      set((state) => ({
        packages: state.packages.map((pkg) =>
          pkg._id === id ? { ...pkg, isActive: !currentStatus } : pkg
        ),
      }));

      toast.success(
        `Package is now ${!currentStatus ? "Active" : "Inactive"}`
      );
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error(err.message || "Failed to toggle status");
    }
  },
}));

