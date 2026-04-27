import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/src/components/atoms/button";
import { Input } from "@/src/components/atoms/input";
import { signIn } from "@/src/lib/auth/auth-helpers";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "At least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert("Login Failed", error?.message ?? "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-[#050507]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Logo / Brand ──────────────────────────────── */}
          <View className="mb-12">
            <View className="w-14 h-14 rounded-2xl bg-rose-600 items-center justify-center mb-6">
              <Text
                className="text-white text-2xl"
                style={{ fontFamily: "MartianMono_700Bold" }}
              >
                G
              </Text>
            </View>
            <Text
              className="text-zinc-50 text-3xl mb-2"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              Welcome back
            </Text>
            <Text
              className="text-zinc-500 text-xs uppercase tracking-widest"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Log in to continue training
            </Text>
          </View>

          {/* ── Form ──────────────────────────────────────── */}
          <View className="gap-4 mb-6">
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
              }}
              keyboardType="email-address"
              error={errors.email}
            />
            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password)
                  setErrors((e) => ({ ...e, password: undefined }));
              }}
              isPassword
              error={errors.password}
            />
          </View>

          <Button label="Log In" onPress={handleLogin} isLoading={isLoading} />

          {/* ── Divider ───────────────────────────────────── */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-zinc-800" />
            <Text
              className="text-zinc-600 text-xs mx-4"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              or
            </Text>
            <View className="flex-1 h-px bg-zinc-800" />
          </View>

          {/* ── Register Link ─────────────────────────────── */}
          <View className="flex-row justify-center items-center gap-2">
            <Text
              className="text-zinc-500 text-xs"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              No account?
            </Text>
            <Button
              label="Sign up"
              variant="ghost"
              fullWidth={false}
              onPress={() => router.push("/(unauthenticated)/register")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}