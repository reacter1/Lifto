import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  isPassword?: boolean;
};

export function Input({
  label,
  error,
  hint,
  isPassword = false,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="w-full gap-1.5">
      {/* Label */}
      {label && (
        <Text className="text-text-muted text-sm font-medium ml-1">
          {label}
        </Text>
      )}

      {/* Input Row */}
      <View
        className={`
          flex-row items-center
          bg-background-input border rounded-xl px-4
          ${error ? "border-danger" : "border-border"}
        `}
      >
        <TextInput
          className="flex-1 text-text text-base py-4"
          placeholderTextColor="#52525b"
          secureTextEntry={isPassword && !isPasswordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />

        {/* Password toggle */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            className="pl-2"
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#a1a1aa"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error message */}
      {error && (
        <Text className="text-danger text-xs ml-1">{error}</Text>
      )}

      {/* Hint message */}
      {hint && !error && (
        <Text className="text-text-subtle text-xs ml-1">{hint}</Text>
      )}
    </View>
  );
}