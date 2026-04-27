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
    <View className="w-full gap-2">
      {label && (
        <Text
          className="text-zinc-500 text-xs uppercase tracking-widest ml-1"
          style={{ fontFamily: "MartianMono_400Regular" }}
        >
          {label}
        </Text>
      )}

      <View
        className={`
          flex-row items-center
          bg-zinc-900 border rounded-2xl px-4
          ${error ? "border-red-500" : "border-zinc-800"}
        `}
      >
        <TextInput
          className="flex-1 text-zinc-100 text-sm py-4"
          placeholderTextColor="#52525b"
          secureTextEntry={isPassword && !isPasswordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          style={{ fontFamily: "MartianMono_400Regular" }}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            className="pl-2"
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={18}
              color="#52525b"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          className="text-red-500 text-xs ml-1"
          style={{ fontFamily: "MartianMono_400Regular" }}
        >
          {error}
        </Text>
      )}

      {hint && !error && (
        <Text
          className="text-zinc-600 text-xs ml-1"
          style={{ fontFamily: "MartianMono_400Regular" }}
        >
          {hint}
        </Text>
      )}
    </View>
  );
}