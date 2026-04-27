import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { supabase } from "@/src/lib/supabase/supabase-client";

type ConfirmStatus = "loading" | "success" | "error";

export default function ConfirmScreen() {
  const [status, setStatus] = useState<ConfirmStatus>("loading");
  const [message, setMessage] = useState("Confirming your account...");

  useEffect(() => {
    async function handleConfirmation() {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");

        const hash = window.location.hash;
        const hashParams = new URLSearchParams(hash.replace("#", "?"));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else {
          throw new Error("No confirmation token found.");
        }

        await supabase.auth.signOut();

        setStatus("success");
        setMessage("Email confirmed. Open Lifto on your phone and log in.");
      } catch (err: any) {
        setStatus("error");
        setMessage(err?.message ?? "Something went wrong. Please try again.");
      }
    }

    handleConfirmation();
  }, []);

  return (
    <View className="flex-1 bg-[#050507] items-center justify-center px-8">
      <View className="w-16 h-16 rounded-2xl bg-rose-600 items-center justify-center mb-8">
        <Text
          className="text-white text-3xl"
          style={{ fontFamily: "MartianMono_700Bold" }}
        >
          L
        </Text>
      </View>

      <Text
        className="text-zinc-100 text-lg text-center mb-3"
        style={{ fontFamily: "MartianMono_700Bold" }}
      >
        {status === "loading" && "Confirming account"}
        {status === "success" && "Email confirmed"}
        {status === "error" && "Confirmation failed"}
      </Text>

      <Text
        className="text-zinc-500 text-sm text-center leading-6"
        style={{ fontFamily: "MartianMono_400Regular" }}
      >
        {message}
      </Text>
    </View>
  );
}