import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { supabase } from "@/src/lib/supabase/supabase-client";
import { useAuthStore } from "@/src/stores/auth-store";
import "../global.css";

export default function RootLayout() {
  const { session, isLoading, setSession, setIsLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // ── Listen for auth state changes from Supabase ──────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Redirect based on auth state ──────────────────────────────────────────
  useEffect(() => {
    if (isLoading) return;

    const inAuthenticatedGroup = segments[0] === "(authenticated)";

    if (!session && inAuthenticatedGroup) {
      router.replace("/(unauthenticated)/login");
    } else if (session && !inAuthenticatedGroup) {
      router.replace("/(authenticated)/(tabs)");
    }
  }, [session, segments, isLoading]);

  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  );
}