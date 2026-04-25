import { View, Text } from "react-native";
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

  return (
    <View
      className={`
        bg-background-card border rounded-2xl mb-4 overflow-hidden
        ${allDone ? "border-success/30" : "border-border"}
      `}
    >
      {/* Exercise Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <View className="flex-row items-center gap-3 flex-1">
          <View
            className={`
              rounded-xl p-2.5
              ${allDone ? "bg-success/10" : "bg-primary/10"}
            `}
          >
            <Ionicons
              name="barbell"
              size={18}
              color={allDone ? "#22c55e" : "#E11D48"}
            />
          </View>
          <View className="flex-1">
            <Text className="text-text font-semibold text-base">
              {exercise.name}
            </Text>
            <Text className="text-text-muted text-xs mt-0.5">
              {completedSets}/{totalSets} sets completed
            </Text>
          </View>
        </View>

        {allDone && (
          <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
        )}
      </View>

      {/* Set Headers */}
      <View className="flex-row items-center gap-3 px-4 pb-2">
        <View className="w-8" />
        <Text className="flex-1 text-text-subtle text-xs font-medium text-center">
          WEIGHT (kg)
        </Text>
        <Text className="flex-1 text-text-subtle text-xs font-medium text-center">
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
    </View>
  );
}