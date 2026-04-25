import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

type ButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: "bg-primary active:bg-primary-dark",
    text: "text-white font-semibold",
  },
  outline: {
    container: "border border-primary bg-transparent active:bg-primary/10",
    text: "text-primary font-semibold",
  },
  ghost: {
    container: "bg-transparent active:bg-white/10",
    text: "text-text-muted font-medium",
  },
  danger: {
    container: "bg-danger active:bg-red-700",
    text: "text-white font-semibold",
  },
};

export function Button({
  label,
  variant = "primary",
  isLoading = false,
  fullWidth = true,
  disabled,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      className={`
        ${styles.container}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-50" : ""}
        rounded-xl px-6 py-4 items-center justify-center flex-row gap-2
      `}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text className={`${styles.text} text-base`}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}