import { supabase } from "@/src/lib/supabase/supabase-client";

// ─── Get all sets for a session exercise ──────────────────────────────────────
export async function getSetsForExercise(sessionExerciseId: string) {
  const { data, error } = await supabase
    .from("sets")
    .select("*")
    .eq("session_exercise_id", sessionExerciseId)
    .order("set_number", { ascending: true });

  if (error) throw error;
  return data ?? [];
}