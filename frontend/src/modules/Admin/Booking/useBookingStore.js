import { create } from "zustand";
import { toast } from "sonner";

export const useBookingStore = create((set, get) => ({
  bookings: [],
  availablePackages: [],
  loading: false,
  submitting: false,
  error: null,

  // Filters & Search
  searchQuery: "",
  filterBookingStatus: "all", // "all" | "pending" | "confirmed" | "cancelled"
  filterPaymentStatus: "all", // "all" | "pending" | "paid" | "failed" | "refunded"

  // Modals state
  isModalOpen: false,
  modalMode: "create", // "create" | "edit"
  selectedBooking: null,
  isDeleteModalOpen: false,
  bookingToDelete: null,
  isDetailsModalOpen: false,
  bookingToView: null,

  // Setters
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterBookingStatus: (status) => set({ filterBookingStatus: status }),
  setFilterPaymentStatus: (status) => set({ filterPaymentStatus: status }),

  // Modal controls
  openCreateModal: () =>
    set({
      isModalOpen: true,
      modalMode: "create",
      selectedBooking: null,
    }),

  openEditModal: (booking) =>
    set({
      isModalOpen: true,
      modalMode: "edit",
      selectedBooking: booking,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      selectedBooking: null,
    }),

  openDeleteModal: (booking) =>
    set({
      isDeleteModalOpen: true,
      bookingToDelete: booking,
    }),

  closeDeleteModal: () =>
    set({
      isDeleteModalOpen: false,
      bookingToDelete: null,
    }),

  openDetailsModal: (booking) =>
    set({
      isDetailsModalOpen: true,
      bookingToView: booking,
    }),

  closeDetailsModal: () =>
    set({
      isDetailsModalOpen: false,
      bookingToView: null,
    }),

  // Fetch all bookings
  fetchBookings: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/v1/bookings", {
        method: "GET",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to load bookings");
      }

      set({
        bookings: Array.isArray(result.data) ? result.data : [],
        loading: false,
      });
    } catch (err) {
      console.error("Fetch bookings error:", err);
      set({
        error: err.message || "Failed to load bookings",
        loading: false,
      });
      toast.error(err.message || "Failed to load bookings");
    }
  },

  // Fetch available packages for dropdown
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
      console.error("Fetch packages for booking dropdown error:", err);
    }
  },

  // Create booking
  createBooking: async (formData) => {
    try {
      set({ submitting: true });
      const res = await fetch("/api/v1/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create booking");
      }

      // Re-fetch to get populated package
      await get().fetchBookings();

      set({
        isModalOpen: false,
        submitting: false,
      });

      toast.success("Booking created successfully!");
      return { success: true, data: result.data };
    } catch (err) {
      console.error("Create booking error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to create booking");
      return { success: false, message: err.message };
    }
  },

  // Update booking
  updateBooking: async (id, formData) => {
    try {
      set({ submitting: true });
      const res = await fetch(`/api/v1/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update booking");
      }

      const updated = result.data;

      set((state) => ({
        bookings: state.bookings.map((b) => (b._id === id ? updated : b)),
        isModalOpen: false,
        selectedBooking: null,
        submitting: false,
        // Also update viewed booking if open
        bookingToView:
          state.bookingToView?._id === id ? updated : state.bookingToView,
      }));

      toast.success("Booking updated successfully!");
      return { success: true, data: updated };
    } catch (err) {
      console.error("Update booking error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to update booking");
      return { success: false, message: err.message };
    }
  },

  // Update single status (e.g. quick change bookingStatus)
  updateBookingStatus: async (id, bookingStatus) => {
    try {
      const res = await fetch(`/api/v1/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ bookingStatus }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update status");
      }

      const updated = result.data;

      set((state) => ({
        bookings: state.bookings.map((b) => (b._id === id ? updated : b)),
        bookingToView:
          state.bookingToView?._id === id ? updated : state.bookingToView,
      }));

      toast.success(`Booking status changed to ${bookingStatus}`);
    } catch (err) {
      console.error("Update status error:", err);
      toast.error(err.message || "Failed to update status");
    }
  },

  // Update single payment status (e.g. quick change paymentStatus)
  updatePaymentStatus: async (id, paymentStatus) => {
    try {
      const res = await fetch(`/api/v1/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ paymentStatus }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update payment status");
      }

      const updated = result.data;

      set((state) => ({
        bookings: state.bookings.map((b) => (b._id === id ? updated : b)),
        bookingToView:
          state.bookingToView?._id === id ? updated : state.bookingToView,
      }));

      toast.success(`Payment status changed to ${paymentStatus}`);
    } catch (err) {
      console.error("Update payment status error:", err);
      toast.error(err.message || "Failed to update payment status");
    }
  },

  // Delete booking
  deleteBooking: async (id) => {
    try {
      set({ submitting: true });
      const res = await fetch(`/api/v1/bookings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete booking");
      }

      set((state) => ({
        bookings: state.bookings.filter((b) => b._id !== id),
        isDeleteModalOpen: false,
        bookingToDelete: null,
        submitting: false,
        isDetailsModalOpen:
          state.bookingToView?._id === id ? false : state.isDetailsModalOpen,
      }));

      toast.success("Booking record deleted successfully!");
      return { success: true };
    } catch (err) {
      console.error("Delete booking error:", err);
      set({ submitting: false });
      toast.error(err.message || "Failed to delete booking");
      return { success: false, message: err.message };
    }
  },
}));

