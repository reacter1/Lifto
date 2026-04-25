import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@/src/components/atoms/input";
import { Button } from "@/src/components/atoms/button";
import { useAuth } from "@/src/hooks/use-auth";
import {
  createWorkoutTemplate,
  addTemplateExercise,
} from "@/src/lib/supabase/supabase-db/workouts";

// ─── Local type for building exercises before saving ──────────────────────────
type DraftExercise = {
  name: string;
  target_sets: string;
  target_reps: string;
};

const DEFAULT_EXERCISE: DraftExercise = {
  name: "",
  target_sets: "3",
  target_reps: "8",
};

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const { userId } = useAuth();

  const [templateName, setTemplateName] = useState("");
  const [exercises, setExercises] = useState<DraftExercise[]>([
    { ...DEFAULT_EXERCISE },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState<string | undefined>();

  // ── Exercise Helpers ───────────────────────────────────────────────────────
  function addExercise() {
    setExercises((prev) => [...prev, { ...DEFAULT_EXERCISE }]);
  }

  function removeExercise(index: number) {
    if (exercises.length === 1) {
      Alert.alert("Can't Remove", "A workout needs at least one exercise.");
      return;
    }
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  function updateExercise(
    index: number,
    field: keyof DraftExercise,
    value: string
  ) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate() {
    if (!templateName.trim()) {
      setNameError("Workout name is required");
      return false;
    }

    for (const ex of exercises) {
      if (!ex.name.trim()) {
        Alert.alert("Missing Exercise Name", "All exercises need a name.");
        return false;
      }
    }

    return true;
  }

  // ── Save Template ──────────────────────────────────────────────────────────
  async function handleSave() {
    if (!validate() || !userId) return;

    try {
      setIsLoading(true);

      // 1. Create the template
      const template = await createWorkoutTemplate(userId, templateName.trim());

      // 2. Add each exercise
      for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];
        await addTemplateExercise(
          template.id,
          ex.name.trim(),
          parseInt(ex.target_sets) || 3,
          parseInt(ex.target_reps) || 8,
          i
        );
      }

      router.replace(`/(authenticated)/workout/${template.id}`);
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Failed to save workout.");
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
          className="flex-1"
          contentContainerClassName="px-6 pt-16 pb-10"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="flex-row items-center gap-4 mb-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-background-card border border-border rounded-xl p-2.5"
            >
              <Ionicons name="arrow-back" size={22} color="#a1a1aa" />
            </TouchableOpacity>
            <Text className="text-text text-2xl font-bold">New Workout</Text>
          </View>

          {/* Workout Name */}
          <View className="mb-8">
            <Input
              label="Workout Name"
              placeholder="e.g. Push Day, Leg Day..."
              value={templateName}
              onChangeText={(text) => {
                setTemplateName(text);
                if (nameError) setNameError(undefined);
              }}
              error={nameError}
            />
          </View>

          {/* Exercises */}
          <View className="mb-4">
            <Text className="text-text font-semibold text-lg mb-4">
              Exercises
            </Text>

            <View className="gap-4">
              {exercises.map((exercise, index) => (
                <View
                  key={index}
                  className="bg-background-card border border-border rounded-2xl p-4"
                >
                  {/* Exercise Header */}
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-text-muted text-sm font-semibold">
                      Exercise {index + 1}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeExercise(index)}
                      className="bg-danger/10 rounded-lg p-1.5"
                    >
                      <Ionicons name="close" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Exercise Name */}
                  <View className="mb-3">
                    <Input
                      label="Exercise Name"
                      placeholder="e.g. Bench Press"
                      value={exercise.name}
                      onChangeText={(val) => updateExercise(index, "name", val)}
                    />
                  </View>

                  {/* Sets and Reps */}
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <Input
                        label="Sets"
                        placeholder="3"
                        value={exercise.target_sets}
                        onChangeText={(val) =>
                          updateExercise(index, "target_sets", val)
                        }
                        keyboardType="number-pad"
                      />
                    </View>
                    <View className="flex-1">
                      <Input
                        label="Reps"
                        placeholder="8"
                        value={exercise.target_reps}
                        onChangeText={(val) =>
                          updateExercise(index, "target_reps", val)
                        }
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Add Exercise Button */}
          <TouchableOpacity
            onPress={addExercise}
            className="border-2 border-dashed border-border rounded-2xl py-4 items-center justify-center flex-row gap-2 mb-8"
          >
            <Ionicons name="add-circle-outline" size={22} color="#a1a1aa" />
            <Text className="text-text-muted font-medium">Add Exercise</Text>
          </TouchableOpacity>

          {/* Save Button */}
          <Button
            label="Save Workout"
            onPress={handleSave}
            isLoading={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}