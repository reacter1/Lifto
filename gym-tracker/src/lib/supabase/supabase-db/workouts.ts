import { supabase } from "@/src/lib/supabase/supabase-client";
import { WorkoutTemplate, TemplateExercise } from "@/src/types";

// ─── Get all templates for the logged-in user ─────────────────────────────────
export async function getWorkoutTemplates(userId: string): Promise<WorkoutTemplate[]> {
  const { data, error } = await supabase
    .from("workout_templates")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// ─── Get a single template with its exercises ─────────────────────────────────
export async function getWorkoutTemplateById(id: string): Promise<WorkoutTemplate | null> {
  const { data, error } = await supabase
    .from("workout_templates")
    .select(`
      *,
      exercises: template_exercises (*)
    `)
    .eq("id", id)
    .order("order_index", { referencedTable: "template_exercises", ascending: true })
    .single();

  if (error) throw error;
  return data;
}

// ─── Create a new template ────────────────────────────────────────────────────
export async function createWorkoutTemplate(
  userId: string,
  name: string
): Promise<WorkoutTemplate> {
  const { data, error } = await supabase
    .from("workout_templates")
    .insert({ user_id: userId, name })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Delete a template ────────────────────────────────────────────────────────
export async function deleteWorkoutTemplate(id: string): Promise<void> {
  const { error } = await supabase
    .from("workout_templates")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// ─── Add an exercise to a template ───────────────────────────────────────────
export async function addTemplateExercise(
  templateId: string,
  name: string,
  targetSets: number,
  targetReps: number,
  orderIndex: number
): Promise<TemplateExercise> {
  const { data, error } = await supabase
    .from("template_exercises")
    .insert({
      template_id: templateId,
      name,
      target_sets: targetSets,
      target_reps: targetReps,
      order_index: orderIndex,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Delete an exercise from a template ──────────────────────────────────────
export async function deleteTemplateExercise(id: string): Promise<void> {
  const { error } = await supabase
    .from("template_exercises")
    .delete()
    .eq("id", id);

  if (error) throw error;
}