import { create } from "zustand";
import api from "./api.js";


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await api.get("/auth/is_auth");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in authCheck:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await api.post("/auth/signup", data);
            set({ authUser: res.data });

            get().connectSocket();
        } catch (error) {
            console.log("Error in signup:", error);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await api.post("/auth/login", data);
            set({ authUser: res.data });
            console.log(res.data);
        } catch (error) {
            console.log("Error in login:", error);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await api.post("/auth/logout");
            set({ authUser: null });
            console.log("Logout successful");
        } catch (error) {
            console.log("Logout error:", error);
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await api.put("/auth/update-profile", data);
            set({ authUser: res.data });
            console.log("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile:", error);
        }
    },
    
}));