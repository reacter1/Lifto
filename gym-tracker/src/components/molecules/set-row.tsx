import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@/src/components/atoms/input";
import { ActiveSet } from "@/src/types";

type SetRowProps = {
  set: ActiveSet;
  exerciseId: string;
  setIndex: number;
  onUpdateSet: (
    exerciseId: string,
    setIndex: number,
    field: "weight" | "reps",
    value: string
  ) => void;
  onCompleteSet: (exerciseId: string, setIndex: number) => void;
};

export function SetRow({
  set,
  exerciseId,
  setIndex,
  onUpdateSet,
  onCompleteSet,
}: SetRowProps) {
  // ── Animations ─────────────────────────────────────────────────────────────
  const completedProgress = useSharedValue(set.completed ? 1 : 0);
  const checkScale = useSharedValue(set.completed ? 1 : 0);
  const rowScale = useSharedValue(1);

  useEffect(() => {
    if (set.completed) {
      // Row bounces slightly when completed
      rowScale.value = withSpring(1.02, { damping: 8 }, () => {
        rowScale.value = withSpring(1, { damping: 12 });
      });
      // Background fades to green
      completedProgress.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
      // Checkmark pops in
      checkScale.value = withSpring(1, { damping: 10, stiffness: 200 });
    }
  }, [set.completed]);

  const rowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rowScale.value }],
    backgroundColor: interpolateColor(
      completedProgress.value,
      [0, 1],
      ["#18181b", "#052e16"] // zinc-900 → green-950
    ),
    borderColor: interpolateColor(
      completedProgress.value,
      [0, 1],
      ["#27272a", "#14532d"] // zinc-800 → green-900
    ),
    borderWidth: 1,
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <Animated.View
      style={rowAnimatedStyle}
      className="flex-row items-center gap-3 py-3 px-4 rounded-2xl mb-2"
    >
      {/* Set Number */}
      <View className="w-8 items-center">
        <Text
          className="text-zinc-500 text-xs"
          style={{ fontFamily: "MartianMono_700Bold" }}
        >
          {String(set.setNumber).padStart(2, "0")}
        </Text>
      </View>

      {/* Weight Input */}
      <View className="flex-1">
        <Input
          placeholder="kg"
          value={set.weight}
          onChangeText={(val) => onUpdateSet(exerciseId, setIndex, "weight", val)}
          keyboardType="decimal-pad"
          editable={!set.completed}
        />
      </View>

      {/* Reps Input */}
      <View className="flex-1">
        <Input
          placeholder="reps"
          value={set.reps}
          onChangeText={(val) => onUpdateSet(exerciseId, setIndex, "reps", val)}
          keyboardType="number-pad"
          editable={!set.completed}
        />
      </View>

      {/* Complete Button */}
      <TouchableOpacity
        onPress={() => onCompleteSet(exerciseId, setIndex)}
        disabled={set.completed}
        className={`
          w-10 h-10 rounded-xl items-center justify-center
          ${set.completed ? "bg-green-600" : "bg-zinc-800 border border-zinc-700"}
        `}
        activeOpacity={0.8}
      >
        <Animated.View style={checkAnimatedStyle}>
          <Ionicons
            name="checkmark"
            size={18}
            color={set.completed ? "white" : "#52525b"}
          />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}