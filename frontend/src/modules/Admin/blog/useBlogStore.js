import { create } from "zustand";
import { toast } from "sonner";

export const useBlogStore = create((set, get) => ({
  blogs: [],
  loading: false,
  submitting: false,
  error: null,

  // Filters & Search
  searchQuery: "",
  filterDisplay: "all", // "all" | "published" | "draft"

  // Modals state
  isModalOpen: false,
  modalMode: "create", // "create" | "edit"
  selectedBlog: null,

  // Setters
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterDisplay: (status) => set({ filterDisplay: status }),

  // Modal controls
  openCreateModal: () =>
    set({
      isModalOpen: true,
      modalMode: "create",
      selectedBlog: null,
    }),

  openEditModal: (blog) =>
    set({
      isModalOpen: true,
      modalMode: "edit",
      selectedBlog: blog,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      selectedBlog: null,
    }),

  // Fetch all blogs (admin endpoint)
  fetchBlogs: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/v1/blogs", {
        method: "GET",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to load blogs");
      }

      set({
        blogs: Array.isArray(result.data) ? result.data : [],
        loading: false,
      });
    } catch (err) {
      console.error("Fetch blogs error:", err);
      set({
        error: err.message || "Failed to load blogs",
        loading: false,
      });
      toast.error(err.message || "Failed to load blogs");
    }
  },

  // Create blog
  createBlog: async (formData) => {
    try {
      set({ submitting: true });
      const res = await fetch("/api/v1/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create blog");
      }

      const created = result.data;

      set((state) => ({
        blogs: [created, ...state.blogs],
        isModalOpen: false,
        submitting: false,
      }));

      toast.success("Blog created successfully!");
      return { success: true, data: created };
    } catch (err) {
      console.error("Create blog error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to create blog");
      return { success: false, message: err.message };
    }
  },

  // Update blog
  updateBlog: async (id, formData) => {
    try {
      set({ submitting: true });
      const res = await fetch(`/api/v1/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update blog");
      }

      const updated = result.data;

      set((state) => ({
        blogs: state.blogs.map((f) => (f._id === id ? updated : f)),
        isModalOpen: false,
        selectedBlog: null,
        submitting: false,
      }));

      toast.success("Blog updated successfully!");
      return { success: true, data: updated };
    } catch (err) {
      console.error("Update blog error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to update blog");
      return { success: false, message: err.message };
    }
  },

  // Toggle publish status
  toggleDisplay: async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/v1/blogs/${id}`, {
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
        blogs: state.blogs.map((f) =>
          f._id === id ? { ...f, isDisplay: !currentStatus } : f
        ),
      }));

      toast.success(
        `Blog is now ${!currentStatus ? "Published (Visible)" : "Draft (Hidden)"}`
      );
    } catch (err) {
      console.error("Toggle display error:", err);
      toast.error(err.message || "Failed to update display status");
    }
  },

  // Delete blog
  deleteBlog: async (id) => {
    try {
      set({ submitting: true });
      const res = await fetch(`/api/v1/blogs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete blog");
      }

      set((state) => ({
        blogs: state.blogs.filter((f) => f._id !== id),
        isDeleteModalOpen: false,
        submitting: false,
      }));

      toast.success("Blog deleted successfully!");
      return { success: true };
    } catch (err) {
      console.error("Delete blog error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to delete blog");
      return { success: false, message: err.message };
    }
  },
}));