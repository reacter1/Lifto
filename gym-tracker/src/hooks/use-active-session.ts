import { useCallback } from "react";
import { useActiveSessionStore } from "@/src/stores/active-session-store";
import { useAuth } from "@/src/hooks/use-auth";
import { createWorkoutSession } from "@/src/lib/supabase/supabase-db/sessions";
import { finishWorkoutSession } from "@/src/lib/supabase/supabase-db/sessions";
import { WorkoutTemplate, ActiveExercise } from "@/src/types";

export function useActiveSession() {
  const { userId } = useAuth();
  const store = useActiveSessionStore();

  // ── Start a session from a template ───────────────────────────────────────
  const startSession = useCallback(
    async (template: WorkoutTemplate) => {
      if (!userId) return;

      // Create session row in Supabase
      const session = await createWorkoutSession(userId, template.id);

      // Map template exercises → active exercises with empty sets
      const exercises: ActiveExercise[] = (template.exercises ?? []).map((ex) => ({
        id: ex.id,
        name: ex.name,
        sets: Array.from({ length: ex.target_sets }, (_, i) => ({
          setNumber: i + 1,
          weight: "",
          reps: "",
          completed: false,
        })),
      }));

      store.startSession(session.id, template.name, exercises);
    },
    [userId, store]
  );

  // ── Finish + save the session ──────────────────────────────────────────────
  const finishSession = useCallback(async () => {
    if (!store.sessionId) return;
    await finishWorkoutSession(store.sessionId, store.exercises);
    store.endSession();
  }, [store]);

  return {
    ...store,
    startSession,
    finishSession,
  };
}