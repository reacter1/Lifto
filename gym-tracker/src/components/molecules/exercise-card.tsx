import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TemplateExercise } from "@/src/types";

type ExerciseCardProps = {
  exercise: TemplateExercise;
  index: number;
};

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  return (
    <View className="bg-background-card border border-border rounded-2xl p-4 flex-row items-center gap-4">
      {/* Order Badge */}
      <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
        <Text className="text-primary font-bold text-sm">{index + 1}</Text>
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-text font-semibold">{exercise.name}</Text>
        <Text className="text-text-muted text-xs mt-0.5">
          {exercise.target_sets} sets × {exercise.target_reps} reps
        </Text>
      </View>

      <Ionicons name="reorder-two-outline" size={20} color="#52525b" />
    </View>
  );
}