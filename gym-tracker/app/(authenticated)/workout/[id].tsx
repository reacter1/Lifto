import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/src/components/atoms/button";
import { ExerciseCard } from "@/src/components/molecules/exercise-card";
import { getWorkoutTemplateById } from "@/src/lib/supabase/supabase-db/workouts";
import { useActiveSession } from "@/src/hooks/use-active-session";
import { WorkoutTemplate } from "@/src/types";

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { startSession } = useActiveSession();

  const [template, setTemplate] = useState<WorkoutTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  // ── Fetch Template ─────────────────────────────────────────────────────────
  const fetchTemplate = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await getWorkoutTemplateById(id);
      setTemplate(data);
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Failed to load workout.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  // ── Start Workout Session ──────────────────────────────────────────────────
  async function handleStartWorkout() {
    if (!template) return;

    if (!template.exercises || template.exercises.length === 0) {
      Alert.alert(
        "No Exercises",
        "Add at least one exercise to this workout before starting."
      );
      return;
    }

    try {
      setIsStarting(true);
      await startSession(template);
      router.push("/(authenticated)/session/active");
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Failed to start session.");
    } finally {
      setIsStarting(false);
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-text-muted">Loading workout...</Text>
      </View>
    );
  }

  // ── Not Found ──────────────────────────────────────────────────────────────
  if (!template) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={48} color="#52525b" />
        <Text className="text-text font-semibold mt-4">Workout not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const exercises = template.exercises ?? [];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-16 pb-36"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center gap-4 mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-background-card border border-border rounded-xl p-2.5"
          >
            <Ionicons name="arrow-back" size={22} color="#a1a1aa" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-text text-2xl font-bold" numberOfLines={1}>
              {template.name}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-4 mt-6 mb-8">
          <View className="flex-1 bg-background-card border border-border rounded-2xl p-4 items-center">
            <Text className="text-primary text-2xl font-bold">
              {exercises.length}
            </Text>
            <Text className="text-text-muted text-xs mt-1">Exercises</Text>
          </View>
          <View className="flex-1 bg-background-card border border-border rounded-2xl p-4 items-center">
            <Text className="text-primary text-2xl font-bold">
              {exercises.reduce((acc, ex) => acc + ex.target_sets, 0)}
            </Text>
            <Text className="text-text-muted text-xs mt-1">Total Sets</Text>
          </View>
        </View>

        {/* Exercise List */}
        <Text className="text-text font-semibold text-lg mb-4">Exercises</Text>

        {exercises.length === 0 ? (
          <View className="items-center py-12">
            <Ionicons name="barbell-outline" size={44} color="#52525b" />
            <Text className="text-text-muted mt-4 text-center">
              No exercises added yet
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {exercises.map((exercise, index) => (
              <Animated.View
                key={exercise.id}
                entering={FadeInDown.delay(index * 60).duration(400).springify()}
              >
                <ExerciseCard exercise={exercise} index={index} />
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Start Button — Floating at bottom */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-4 bg-background border-t border-border">
        <Button
          label="Start Workout"
          onPress={handleStartWorkout}
          isLoading={isStarting}
        />
      </View>
    </View>
  );
}