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
import { signUp } from "@/src/lib/auth/auth-helpers";

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  function validate() {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "At least 6 characters";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    try {
      setIsLoading(true);
      await signUp(email, password);
      Alert.alert(
        "Account Created 🎉",
        "Check your email to confirm your account, then log in.",
        [{ text: "Log In", onPress: () => router.replace("/(unauthenticated)/login") }]
      );
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error?.message ?? "Something went wrong.");
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
          {/* ── Brand ─────────────────────────────────────── */}
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
              Create account
            </Text>
            <Text
              className="text-zinc-500 text-xs uppercase tracking-widest"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Start tracking your gains
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
              hint="At least 6 characters"
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors((e) => ({ ...e, confirmPassword: undefined }));
              }}
              isPassword
              error={errors.confirmPassword}
            />
          </View>

          <Button
            label="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
          />

          {/* ── Login Link ────────────────────────────────── */}
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

          <View className="flex-row justify-center items-center gap-2">
            <Text
              className="text-zinc-500 text-xs"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Have an account?
            </Text>
            <Button
              label="Log in"
              variant="ghost"
              fullWidth={false}
              onPress={() => router.replace("/(unauthenticated)/login")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}