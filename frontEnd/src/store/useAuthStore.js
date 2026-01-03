import { create } from "zustand";
import api from "./api.js";
import { io } from "socket.io-client"
import toast from "react-hot-toast"


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
            get().connectSocket();
        } catch (error) {
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
            toast.error(error.response?.data?.msg || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await api.post("/auth/login", data);
            set({ authUser: res.data.user });
            get().connectSocket()
        } catch (error) {
            toast.error(error.response?.data?.msg || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await api.post("/auth/logout");
            set({ authUser: null });
            get().disconnectSocket()
        } catch (error) {
            toast.error("Logout failed");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await api.put("/auth/updateProfile", data);
            set({ authUser: res.data.user });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Failed to update profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser, socket } = get()
        if (!authUser) return
        if (socket?.connected) return

        const newSocket = io(import.meta.env.VITE_SOCKET_URL, { 
            withCredentials: true 
        })

        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })
        
        set({ socket: newSocket })
    },
    disconnectSocket: () => {
        const { socket } = get()
        if (socket?.connected) {
            socket.disconnect()
        }
        set({ socket: null })
    }
}));