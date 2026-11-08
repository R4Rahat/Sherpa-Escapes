import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthorized: false,
  loading: true,

  // Check auth on refresh or initial visit by calling /api/v1/auth/me
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await fetch("/api/v1/auth/me", {
        method: "GET",
        credentials: "include", // Transmit httpOnly cookie
      });

      if (res.ok) {
        const result = await res.json();
        set({
          user: result.data,
          isAuthorized: true,
          loading: false,
        });
        return true;
      } else {
        set({
          user: null,
          isAuthorized: false,
          loading: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      set({
        user: null,
        isAuthorized: false,
        loading: false,
      });
      return false;
    }
  },

  // Perform login with email & password
  login: async (email, password) => {
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Allow server to set httpOnly cookie
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Invalid credentials");
      }

      const adminUser = result.data?.admin || result.data || { email };

      // Maintain isAuthorized = true in Zustand store
      set({
        user: adminUser,
        isAuthorized: true,
        loading: false,
      });

      return { success: true, data: result.data };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to log in",
      };
    }
  },

  // Logout and clear state
  logout: async () => {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request error:", error);
    } finally {
      set({
        user: null,
        isAuthorized: false,
        loading: false,
      });
    }
  },
}));

