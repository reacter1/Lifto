import "../global.css";
import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  MartianMono_400Regular,
  MartianMono_600SemiBold,
  MartianMono_700Bold,
} from "@expo-google-fonts/martian-mono";
import { supabase } from "@/src/lib/supabase/supabase-client";
import { useAuthStore } from "@/src/stores/auth-store";

export default function RootLayout() {
  const { session, isLoading, setSession, setIsLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    MartianMono_400Regular,
    MartianMono_600SemiBold,
    MartianMono_700Bold,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading || !fontsLoaded) return;

    const inAuthenticatedGroup = segments[0] === "(authenticated)";

    if (!session && inAuthenticatedGroup) {
      router.replace("/(unauthenticated)/login");
    } else if (session && !inAuthenticatedGroup) {
      router.replace("/(authenticated)/(tabs)");
    }
  }, [session, segments, isLoading, fontsLoaded]);

  if (!fontsLoaded || isLoading) {
    return <View className="flex-1 bg-[#050507]" />;
  }

  return (
    <SafeAreaProvider
      style={{ flex: 1, backgroundColor: "#050507" }}
    >
      <StatusBar style="light" />
      <Slot />
    </SafeAreaProvider>
  );
}