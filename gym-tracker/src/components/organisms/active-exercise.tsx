import { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { SetRow } from "@/src/components/molecules/set-row";
import { ActiveExercise as ActiveExerciseType } from "@/src/types";

type ActiveExerciseProps = {
  exercise: ActiveExerciseType;
  onUpdateSet: (
    exerciseId: string,
    setIndex: number,
    field: "weight" | "reps",
    value: string
  ) => void;
  onCompleteSet: (exerciseId: string, setIndex: number) => void;
};

export function ActiveExercise({
  exercise,
  onUpdateSet,
  onCompleteSet,
}: ActiveExerciseProps) {
  const completedSets = exercise.sets.filter((s) => s.completed).length;
  const totalSets = exercise.sets.length;
  const allDone = completedSets === totalSets;

  // ── Border color transition when exercise is fully done ───────────────────
  const doneProgress = useSharedValue(allDone ? 1 : 0);

  useEffect(() => {
    doneProgress.value = withTiming(allDone ? 1 : 0, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });
  }, [allDone]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      doneProgress.value,
      [0, 1],
      ["#27272a", "#14532d"] // zinc-800 → green-900
    ),
    borderWidth: 1,
  }));

  const iconBgAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      doneProgress.value,
      [0, 1],
      ["rgba(225,29,72,0.1)", "rgba(34,197,94,0.1)"] // rose/10 → green/10
    ),
  }));

  return (
    <Animated.View
      style={cardAnimatedStyle}
      className="bg-zinc-900 rounded-3xl mb-4 overflow-hidden"
    >
      {/* Exercise Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <View className="flex-row items-center gap-3 flex-1">
          <Animated.View
            style={iconBgAnimatedStyle}
            className="rounded-xl p-2.5"
          >
            <Ionicons
              name="barbell"
              size={18}
              color={allDone ? "#22c55e" : "#e11d48"}
            />
          </Animated.View>
          <View className="flex-1">
            <Text
              className="text-zinc-100 text-sm"
              style={{ fontFamily: "MartianMono_600SemiBold" }}
            >
              {exercise.name}
            </Text>
            <Text
              className="text-zinc-500 text-xs mt-0.5"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              {completedSets}/{totalSets} sets done
            </Text>
          </View>
        </View>

        {allDone && (
          <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
        )}
      </View>

      {/* Column Headers */}
      <View className="flex-row items-center gap-3 px-4 pb-2">
        <View className="w-8" />
        <Text
          className="flex-1 text-zinc-600 text-xs text-center"
          style={{ fontFamily: "MartianMono_400Regular" }}
        >
          KG
        </Text>
        <Text
          className="flex-1 text-zinc-600 text-xs text-center"
          style={{ fontFamily: "MartianMono_400Regular" }}
        >
          REPS
        </Text>
        <View className="w-10" />
      </View>

      {/* Sets */}
      <View className="px-4 pb-4">
        {exercise.sets.map((set, index) => (
          <SetRow
            key={index}
            set={set}
            exerciseId={exercise.id}
            setIndex={index}
            onUpdateSet={onUpdateSet}
            onCompleteSet={onCompleteSet}
          />
        ))}
      </View>
    </Animated.View>
  );
}