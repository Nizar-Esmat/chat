import { create } from 'zustand'
import api from './api'
import { useAuthStore } from './useAuthStore'
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
            console.log(res.data)
            set({ allContacts: res.data, isUsersLoading: false })
        } catch (error) {
            console.log(error)
            set({ isUsersLoading: false })
        }
    },
    getMyChatPartners: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await api.get("/massage/chats")
            console.log(res.data)
            set({ chats: res.data.partners, isUsersLoading: false })
        } catch (error) {
            console.log(error)
            set({ isUsersLoading: false })
        }
    }
    ,
    getMessagesByUserId: async (userId) => {
        set({ isMassageLoading: true })
        try {
            const res = api.get(`/massage/${userId}`)
            console.log(res.data)
            set({ messages: res.data })
        } catch (error) {
            console.log(error)
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
            image: massageData.image,
            createdAt: new Date().toISOString(),
            isTemp: true
        }
        set({ messages: messages.concat(tempMessage) })
        try {
            const res = await api.post(`/massage/sendMassage/${selectedUser._id}`, massageData)
            console.log(res.data)
            set({ messages: messages.concat(res.data) })
        } catch (error) {
            set({ messages: messages })
            console.error("Error sending message:", error);
        }
    }

}))

export { useChatStore }