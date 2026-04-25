import { supabase } from "@/src/lib/supabase/supabase-client";
import { WorkoutSession, ActiveExercise } from "@/src/types";

// ─── Get all sessions for the logged-in user ──────────────────────────────────
export async function getWorkoutSessions(userId: string): Promise<WorkoutSession[]> {
  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`
      *,
      template: workout_templates (name)
    `)
    .eq("user_id", userId)
    .not("finished_at", "is", null)
    .order("started_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// ─── Get a single session with all exercises and sets ─────────────────────────
export async function getWorkoutSessionById(id: string): Promise<WorkoutSession | null> {
  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`
      *,
      exercises: session_exercises (
        *,
        sets (*)
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ─── Create a new session ─────────────────────────────────────────────────────
export async function createWorkoutSession(
  userId: string,
  templateId?: string
): Promise<WorkoutSession> {
  const { data, error } = await supabase
    .from("workout_sessions")
    .insert({
      user_id: userId,
      template_id: templateId ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Save all exercises + sets and mark session as finished ───────────────────
export async function finishWorkoutSession(
  sessionId: string,
  exercises: ActiveExercise[]
): Promise<void> {
  // 1. Insert all session exercises
  for (const exercise of exercises) {
    const { data: sessionExercise, error: exError } = await supabase
      .from("session_exercises")
      .insert({
        session_id: sessionId,
        name: exercise.name,
        order_index: exercises.indexOf(exercise),
      })
      .select()
      .single();

    if (exError) throw exError;

    // 2. Insert all completed sets for this exercise
    const completedSets = exercise.sets
      .filter((s) => s.completed)
      .map((s, index) => ({
        session_exercise_id: sessionExercise.id,
        set_number: index + 1,
        weight_kg: parseFloat(s.weight) || null,
        reps: parseInt(s.reps) || null,
        completed: true,
      }));

    if (completedSets.length > 0) {
      const { error: setsError } = await supabase
        .from("sets")
        .insert(completedSets);

      if (setsError) throw setsError;
    }
  }

  // 3. Mark session as finished
  const { error: finishError } = await supabase
    .from("workout_sessions")
    .update({ finished_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (finishError) throw finishError;
}

// ─── Delete a session ─────────────────────────────────────────────────────────
export async function deleteWorkoutSession(id: string): Promise<void> {
  const { error } = await supabase
    .from("workout_sessions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}