import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/src/hooks/use-auth";
import {
  getWorkoutTemplates,
  deleteWorkoutTemplate,
} from "@/src/lib/supabase/supabase-db/workouts";
import { WorkoutTemplate } from "@/src/types";

export function useWorkouts() {
  const { userId } = useAuth();

  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch all templates ────────────────────────────────────────────────────
  const fetchTemplates = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await getWorkoutTemplates(userId);
      setTemplates(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load workouts");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // ── Delete a template ──────────────────────────────────────────────────────
  const deleteTemplate = useCallback(async (id: string) => {
    try {
      await deleteWorkoutTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete workout");
    }
  }, []);

  return {
    templates,
    isLoading,
    error,
    refetch: fetchTemplates,
    deleteTemplate,
  };
}