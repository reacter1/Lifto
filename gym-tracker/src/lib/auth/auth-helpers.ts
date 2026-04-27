import { supabase } from "@/src/lib/supabase/supabase-client";
import { Platform } from "react-native";

function getRedirectUrl() {
  if (Platform.OS === "web") {
    // Uses current origin so it works on both localhost and production
    return `${window.location.origin}/auth/confirm`;
  }
  // Deep link for native
  return "gymtracker://auth/confirm";
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      emailRedirectTo: getRedirectUrl(),
    },
  });

  if (error) throw error;
  return data;
}

// ── Sign In ───────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;
  return data;
}

// ── Sign Out ──────────────────────────────────────────────────────────────────
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}