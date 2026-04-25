import { Session } from "@supabase/supabase-js";

// ─── Auth ────────────────────────────────────────────────────────────────────

export type AuthStore = {
  session: Session | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setIsLoading: (isLoading: boolean) => void;
};

// ─── Workout Templates ────────────────────────────────────────────────────────

export type WorkoutTemplate = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  exercises?: TemplateExercise[];
};

export type TemplateExercise = {
  id: string;
  template_id: string;
  name: string;
  target_sets: number;
  target_reps: number;
  order_index: number;
};

// ─── Workout Sessions ─────────────────────────────────────────────────────────

export type WorkoutSession = {
  id: string;
  user_id: string;
  template_id?: string;
  started_at: string;
  finished_at?: string;
  notes?: string;
  exercises?: SessionExercise[];
};

export type SessionExercise = {
  id: string;
  session_id: string;
  name: string;
  order_index: number;
  sets?: WorkoutSet[];
};

export type WorkoutSet = {
  id: string;
  session_exercise_id: string;
  set_number: number;
  weight_kg?: number;
  reps?: number;
  completed: boolean;
  logged_at: string;
};

// ─── Active Session (Zustand) ─────────────────────────────────────────────────

export type ActiveSet = {
  setNumber: number;
  weight: string;
  reps: string;
  completed: boolean;
};

export type ActiveExercise = {
  id: string;
  name: string;
  sets: ActiveSet[];
};

export type ActiveSessionStore = {
  sessionId: string | null;
  templateName: string;
  exercises: ActiveExercise[];
  startSession: (
    sessionId: string,
    templateName: string,
    exercises: ActiveExercise[]
  ) => void;
  updateSet: (
    exerciseId: string,
    setIndex: number,
    field: "weight" | "reps",
    value: string
  ) => void;
  completeSet: (exerciseId: string, setIndex: number) => void;
  endSession: () => void;
};