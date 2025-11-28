import { create } from 'zustand'
import api from './api'
const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    message: [],
    activeTap: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMassageLoading: false,
    isSoundEnabled: localStorage.getItem('sound') === 'true',

    toggleSound: () => {
        localStorage.setItem("sound", !get().isSoundEnabled)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },
    setActiveTap: (tab) => {
        set({ activeTap: tab })
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
    getMyChatPartenrs: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await api.get("/massage/chats")
            console.log(res.data)
            set({ chats: res.data, isUsersLoading: false })
        } catch (error) {
            console.log(error)
            set({ isUsersLoading: false })
        }
    }

}))

export { useChatStore }