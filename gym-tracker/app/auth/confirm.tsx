import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/src/lib/supabase/supabase-client";

type ConfirmStatus = "loading" | "success" | "error";

export default function ConfirmScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<ConfirmStatus>("loading");
  const [message, setMessage] = useState("Confirming your account...");

  useEffect(() => {
    async function handleConfirmation() {
      try {
        // ── Grab token from URL hash (Supabase puts it there) ─────────────
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace("#", "?"));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        // ── Also check query params (PKCE flow) ───────────────────────────
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");

        if (code) {
          // PKCE flow — exchange code for session
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          setStatus("success");
          setMessage("Account confirmed! Redirecting...");
          setTimeout(() => router.replace("/(authenticated)/(tabs)"), 1500);
          return;
        }

        if (accessToken && refreshToken) {
          // Implicit flow — set session directly
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;

          if (type === "signup") {
            setStatus("success");
            setMessage("Account confirmed! Redirecting...");
            setTimeout(() => router.replace("/(authenticated)/(tabs)"), 1500);
          } else if (type === "recovery") {
            setStatus("success");
            setMessage("Password reset confirmed! Redirecting...");
            setTimeout(() => router.replace("/(authenticated)/(tabs)"), 1500);
          } else {
            setStatus("success");
            setMessage("Confirmed! Redirecting...");
            setTimeout(() => router.replace("/(authenticated)/(tabs)"), 1500);
          }
          return;
        }

        throw new Error("No token found in URL.");
      } catch (err: any) {
        setStatus("error");
        setMessage(err?.message ?? "Something went wrong. Please try again.");
      }
    }

    handleConfirmation();
  }, []);

  return (
    <View className="flex-1 bg-[#050507] items-center justify-center px-8">
      {/* Logo */}
      <View className="w-16 h-16 rounded-2xl bg-rose-600 items-center justify-center mb-8">
        <Text
          className="text-white text-3xl"
          style={{ fontFamily: "MartianMono_700Bold" }}
        >
          G
        </Text>
      </View>

      {/* Status Icon */}
      <Text className="text-4xl mb-6">
        {status === "loading"}
        {status === "success"}
        {status === "error"}
      </Text>

      {/* Message */}
      <Text
        className="text-zinc-100 text-lg text-center mb-3"
        style={{ fontFamily: "MartianMono_700Bold" }}
      >
        {status === "loading" && "Confirming account"}
        {status === "success" && "You're in!"}
        {status === "error" && "Something went wrong"}
      </Text>

      <Text
        className="text-zinc-500 text-sm text-center leading-6"
        style={{ fontFamily: "MartianMono_400Regular" }}
      >
        {message}
      </Text>

      {/* Error — link back to login */}
      {status === "error" && (
        <View className="mt-8">
          <Text
            className="text-rose-500 text-sm text-center cursor-pointer"
            style={{ fontFamily: "MartianMono_400Regular" }}
            onPress={() => router.replace("/(unauthenticated)/login")}
          >
            Back to Login →
          </Text>
        </View>
      )}
    </View>
  );
}