import { create } from "zustand";
import api from "./api.js";
import { io } from "socket.io-client"


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

            get().connectSocket()
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
            get().disconnectSocket()
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
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser, socket } = get()
        if (!authUser) {
            console.log("Cannot connect socket: No authenticated user");
            return
        }
        
        if (socket?.connected) {
            console.log("Socket already connected");
            return
        }

        console.log("Connecting to socket...");
        const newSocket = io(import.meta.env.VITE_SOCKET_URL, { 
            withCredentials: true 
        })
        
        newSocket.on("connect", () => {
            console.log("Socket connected successfully");
        })
        
        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        })

        newSocket.on("getOnlineUsers", (userIds) => {
            console.log("Online users updated:", userIds);
            set({ onlineUsers: userIds });
        })
        
        set({ socket: newSocket })
    },
    disconnectSocket: () => {
        const { socket } = get()
        if (socket?.connected) {
            socket.disconnect()
            console.log("Socket disconnected");
        }
        set({ socket: null })
    }
}));