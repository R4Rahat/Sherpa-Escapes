import { create } from "zustand";
import { toast } from "sonner";

const BASE = "/api/v1/testimonials";

export const useTestimonialStore = create((set, get) => ({
  testimonials: [],
  loading: false,

  fetchTestimonials: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${BASE}/admin`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch testimonials");
      set({ testimonials: data.data || [] });
    } catch (err) {
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },

  createTestimonial: async (payload) => {
    try {
      const res = await fetch(`${BASE}/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create testimonial");
      set((s) => ({ testimonials: [data.data, ...s.testimonials] }));
      toast.success("Testimonial created successfully");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  },

  updateTestimonial: async (id, payload) => {
    try {
      const res = await fetch(`${BASE}/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update testimonial");
      set((s) => ({
        testimonials: s.testimonials.map((t) => (t._id === id ? data.data : t)),
      }));
      toast.success("Testimonial updated successfully");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  },

  toggleDisplay: async (id, currentIsDisplay) => {
    try {
      const res = await fetch(`${BASE}/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isDisplay: !currentIsDisplay }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      set((s) => ({
        testimonials: s.testimonials.map((t) => (t._id === id ? data.data : t)),
      }));
      toast.success(`Testimonial ${!currentIsDisplay ? "published" : "set to draft"}`);
    } catch (err) {
      toast.error(err.message);
    }
  },

  deleteTestimonial: async (id) => {
    try {
      const res = await fetch(`${BASE}/admin/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete testimonial");
      set((s) => ({ testimonials: s.testimonials.filter((t) => t._id !== id) }));
      toast.success("Testimonial deleted successfully");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  },
}));

