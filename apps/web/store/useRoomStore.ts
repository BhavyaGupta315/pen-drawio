import { create } from "zustand";

const roomStore = (set) => ({
    joinedRooms : [],
    currentRoom : null,
    joinRoom : (room) => {
        set((state) => ({
            joinedRooms : [room, ...state.joinedRooms],
        })),
    },
    setCurrent
})
