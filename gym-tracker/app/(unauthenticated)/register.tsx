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
import { signUp } from "@/src/lib/auth/auth-helpers";

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleRegister() {
    if (!validate()) return;

    try {
      setIsLoading(true);
      await signUp(email, password);
      Alert.alert(
        "Account Created! 🎉",
        "Check your email to confirm your account, then log in.",
        [{ text: "Go to Login", onPress: () => router.replace("/(unauthenticated)/login") }]
      );
    } catch (error: any) {
      Alert.alert(
        "Sign Up Failed",
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
              Create Account 🏋️
            </Text>
            <Text className="text-text-muted text-base">
              Start tracking your gains today
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

            {/* Register Button */}
            <View className="mt-2">
              <Button
                label="Create Account"
                onPress={handleRegister}
                isLoading={isLoading}
              />
            </View>
          </View>

          {/* Back to Login */}
          <View className="flex-row justify-center items-center mt-8 gap-1">
            <Text className="text-text-muted">Already have an account?</Text>
            <Button
              label="Log In"
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