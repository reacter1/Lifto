import { create } from "zustand";
import { ActiveSessionStore } from "@/src/types";

export const useActiveSessionStore = create<ActiveSessionStore>((set) => ({
  sessionId: null,
  templateName: "",
  exercises: [],

  startSession: (sessionId, templateName, exercises) =>
    set({ sessionId, templateName, exercises }),

  updateSet: (exerciseId, setIndex, field, value) =>
    set((state) => ({
      exercises: state.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s, i) =>
                i === setIndex ? { ...s, [field]: value } : s
              ),
            }
          : ex
      ),
    })),

  completeSet: (exerciseId, setIndex) =>
    set((state) => ({
      exercises: state.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s, i) =>
                i === setIndex ? { ...s, completed: true } : s
              ),
            }
          : ex
      ),
    })),

  endSession: () =>
    set({ sessionId: null, templateName: "", exercises: [] }),
}));