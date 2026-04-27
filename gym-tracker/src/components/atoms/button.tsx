import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

type ButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: "bg-rose-600 active:bg-rose-700",
    text: "text-white",
  },
  outline: {
    container: "border border-rose-600 bg-transparent",
    text: "text-rose-500",
  },
  ghost: {
    container: "bg-transparent",
    text: "text-zinc-400",
  },
  danger: {
    container: "bg-red-600",
    text: "text-white",
  },
};

export function Button({
  label,
  variant = "primary",
  isLoading = false,
  fullWidth = true,
  disabled,
  onPress,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || isLoading;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }

  return (
    <Animated.View style={[animatedStyle, fullWidth && { width: "100%" }]}>
      <TouchableOpacity
        className={`
          ${styles.container}
          ${isDisabled ? "opacity-40" : ""}
          rounded-2xl px-6 py-4 items-center justify-center
        `}
        disabled={isDisabled}
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text
            className={`${styles.text} text-sm tracking-widest uppercase`}
            style={{ fontFamily: "MartianMono_700Bold" }}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}