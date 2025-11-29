import { create } from "zustand";
import api from "./api.js";


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const res = await api.get("/auth/is_auth");
            set({ authUser: res.data.user });
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
            set({ authUser: res.data.user });
            console.log(res.data.user);
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
        set({ isUpdatingProfile: true });
        try {
            const res = await api.put("/auth/updateProfile", data);
            set({ authUser: res.data.user });
            console.log("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile:", error);
        }finally {
            set({ isUpdatingProfile: false });
        }
    },  
    
}));