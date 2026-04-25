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
import { Button } from "@/src/components/atoms/button";
import { Input } from "@/src/components/atoms/input";
import { signIn } from "@/src/lib/auth/auth-helpers";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate() {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleLogin() {
    if (!validate()) return;

    try {
      setIsLoading(true);
      await signIn(email, password);
      // _layout.tsx auth gate will automatically redirect to (authenticated)
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error?.message ?? "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-12"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mb-10">
            <Text className="text-4xl font-bold text-text mb-2">
              Welcome Back 👋
            </Text>
            <Text className="text-text-muted text-base">
              Log in to continue your training
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
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

            {/* Login Button */}
            <View className="mt-2">
              <Button
                label="Log In"
                onPress={handleLogin}
                isLoading={isLoading}
              />
            </View>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-text-subtle text-sm mx-4">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Go to Register */}
          <View className="flex-row justify-center items-center gap-1">
            <Text className="text-text-muted">Don't have an account?</Text>
            <Button
              label="Sign Up"
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