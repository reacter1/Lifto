import { View, Text, TouchableOpacity } from "react-native";
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
  return (
    <View
      className={`
        flex-row items-center gap-3 py-3 px-4 rounded-xl mb-2
        ${set.completed ? "bg-success/10 border border-success/20" : "bg-background-input"}
      `}
    >
      {/* Set Number */}
      <View className="w-8 items-center">
        <Text className="text-text-muted text-sm font-semibold">
          {set.setNumber}
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
          ${set.completed ? "bg-success" : "bg-background-card border border-border"}
        `}
      >
        <Ionicons
          name="checkmark"
          size={18}
          color={set.completed ? "white" : "#52525b"}
        />
      </TouchableOpacity>
    </View>
  );
}