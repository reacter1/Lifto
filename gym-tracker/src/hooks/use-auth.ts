import { useAuthStore } from "@/src/stores/auth-store";

export function useAuth() {
  const { session, isLoading, setSession } = useAuthStore();

  const user = session?.user ?? null;
  const userId = user?.id ?? null;
  const userEmail = user?.email ?? null;
  const isAuthenticated = !!session;

  return {
    session,
    user,
    userId,
    userEmail,
    isAuthenticated,
    isLoading,
    setSession,
  };
}