import { create } from 'zustand'
import api from './api'
import { useAuthStore } from './useAuthStore'
import toast from 'react-hot-toast'

const notificationSound = new Audio('/sounds/notification.mp3');
const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMassageLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem('sound')),

    toggleSound: () => {
        localStorage.setItem("sound", !get().isSoundEnabled)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },
    setActiveTab: (tab) => {
        set({ activeTab: tab })
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },
    getAllContacts: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await api.get("/massage/AllContacts")
            set({ allContacts: res.data, isUsersLoading: false })
        } catch (error) {
            toast.error("Failed to load contacts")
            set({ isUsersLoading: false })
        }
    },
    getMyChatPartners: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await api.get("/massage/chats")
            set({ chats: res.data.partners, isUsersLoading: false })
        } catch (error) {
            toast.error("Failed to load chats")
            set({ isUsersLoading: false })
        }
    }
    ,
    getMessagesByUserId: async (userId) => {
        set({ isMassageLoading: true })
        try {
            const res = await api.get(`/massage/${userId}`)
            set({ messages: res.data.massages })
        } catch (error) {
            toast.error("Failed to load messages")
        } finally {
            set({ isMassageLoading: false })
        }
    },

    sendMessage: async (massageData) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState()
        const tempId = `temp-${Date.now()}`
        const tempMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: massageData.text,
            imageUrl: massageData.imageUrl,
            createdAt: new Date().toISOString(),
            isTemp: true
        }

        set({ messages: [...messages, tempMessage] })
        try {
            const res = await api.post(`/massage/sendMassage/${selectedUser._id}`, massageData)
            set({ messages: messages.filter(msg => msg._id !== tempId).concat(res.data.massage) })
        } catch (error) {
            set({ messages: messages.filter(msg => msg._id !== tempId) })
            console.error("Error sending message:", error);
        }
    },
    subscribeToMessages: () => {
        const { selectedUser, isSoundEnabled } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket?.on("newMassage", ({ newMassage }) => {
            const isMesssageSentFromSelectedUser = newMassage.senderId === selectedUser._id;
            if (!isMesssageSentFromSelectedUser) return;
            const currentMessages = get().messages;
            set({ messages: [...currentMessages, newMassage] });
            if (isSoundEnabled) {
                notificationSound.currentTime = 0;
                notificationSound.play()
                    .catch((error) => {
                        console.error("Error playing notification sound:", error);
                    });
            }
        });
        socket?.on("editMassage", ({ updatedMassage }) => {
            const currentMessages = get().messages;
            set({
                messages: currentMessages.map(msg =>
                    msg._id === updatedMassage._id ? updatedMassage : msg
                )
            });
        });

        socket?.on("deleteMassage", ({ massageId, massage }) => {
            const currentMessages = get().messages;
            set({
                messages: currentMessages.map(msg =>
                    msg._id === massageId ? massage : msg
                )
            });
        });


    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMassage");
        socket?.off("editMassage");
        socket?.off("deleteMassage");
    },
    editMassage: async (messageId, updatedData) => {
        const { messages } = get();
        set({
            messages: messages.map(msg =>
                msg._id === messageId ? { ...msg, ...updatedData } : msg
            )
        });
        try {
            const res = await api.patch(`/massage/editMassage/${messageId}`, updatedData);
            set({
                messages: messages.map(msg =>
                    msg._id === messageId ? res.data.massage : msg
                )
            });
        } catch (error) {
            toast.error("Failed to edit message");
        }
    },
    deleteMassage: async (messageId) => {
        const { messages } = get();
        try {
            await api.delete(`/massage/deleteMassage/${messageId}`);
            set({
                messages: messages.map(msg =>
                    msg._id === messageId ? { ...msg, isDeleted: true } : msg
                )
            });
        } catch (error) {
            toast.error("Failed to delete message");
        }
    }
}))

export { useChatStore }