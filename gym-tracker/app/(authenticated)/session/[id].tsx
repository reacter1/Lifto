import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getWorkoutSessionById, deleteWorkoutSession } from "@/src/lib/supabase/supabase-db/sessions";
import { formatDate, formatDuration, formatWeight } from "@/src/utils/formatters";
import { WorkoutSession } from "@/src/types";

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch Session ──────────────────────────────────────────────────────────
  const fetchSession = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await getWorkoutSessionById(id);
      setSession(data);
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Failed to load session.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // ── Delete Session ─────────────────────────────────────────────────────────
  function confirmDelete() {
    Alert.alert(
      "Delete Session?",
      "This will permanently delete this workout session.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteWorkoutSession(id!);
              router.replace("/(authenticated)/(tabs)/history");
            } catch (error: any) {
              Alert.alert("Error", error?.message ?? "Failed to delete.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-text-muted">Loading session...</Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-text font-semibold">Session not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const duration =
    session.finished_at
      ? formatDuration(session.started_at, session.finished_at)
      : null;

  const totalSets =
    session.exercises?.reduce(
      (acc, ex) => acc + (ex.sets?.length ?? 0),
      0
    ) ?? 0;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-16 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center gap-4 mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-background-card border border-border rounded-xl p-2.5"
          >
            <Ionicons name="arrow-back" size={22} color="#a1a1aa" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-text text-xl font-bold" numberOfLines={1}>
              {formatDate(session.started_at)}
            </Text>
            <Text className="text-text-muted text-sm">Workout Summary</Text>
          </View>
          <TouchableOpacity
            onPress={confirmDelete}
            disabled={isDeleting}
            className="bg-danger/10 border border-danger/20 rounded-xl p-2.5"
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-4 mb-8">
          {duration && (
            <View className="flex-1 bg-background-card border border-border rounded-2xl p-4 items-center">
              <Ionicons name="time-outline" size={20} color="#a1a1aa" />
              <Text className="text-text font-bold text-lg mt-1">{duration}</Text>
              <Text className="text-text-muted text-xs">Duration</Text>
            </View>
          )}
          <View className="flex-1 bg-background-card border border-border rounded-2xl p-4 items-center">
            <Ionicons name="barbell-outline" size={20} color="#a1a1aa" />
            <Text className="text-text font-bold text-lg mt-1">
              {session.exercises?.length ?? 0}
            </Text>
            <Text className="text-text-muted text-xs">Exercises</Text>
          </View>
          <View className="flex-1 bg-background-card border border-border rounded-2xl p-4 items-center">
            <Ionicons name="checkmark-circle-outline" size={20} color="#a1a1aa" />
            <Text className="text-text font-bold text-lg mt-1">{totalSets}</Text>
            <Text className="text-text-muted text-xs">Sets Done</Text>
          </View>
        </View>

        {/* Exercises & Sets */}
        <Text className="text-text font-semibold text-lg mb-4">Exercises</Text>

        <View className="gap-4">
          {session.exercises?.map((exercise, exIndex) => (
            <View
              key={exercise.id}
              className="bg-background-card border border-border rounded-2xl overflow-hidden"
            >
              {/* Exercise Header */}
              <View className="flex-row items-center gap-3 p-4 border-b border-border">
                <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center">
                  <Text className="text-primary font-bold text-sm">
                    {exIndex + 1}
                  </Text>
                </View>
                <Text className="text-text font-semibold">{exercise.name}</Text>
              </View>

              {/* Sets Table Header */}
              <View className="flex-row px-4 py-2 border-b border-border">
                <Text className="w-10 text-text-subtle text-xs font-medium">SET</Text>
                <Text className="flex-1 text-text-subtle text-xs font-medium">WEIGHT</Text>
                <Text className="flex-1 text-text-subtle text-xs font-medium">REPS</Text>
              </View>

              {/* Sets */}
              {exercise.sets?.map((set) => (
                <View
                  key={set.id}
                  className="flex-row items-center px-4 py-3 border-b border-border/50"
                >
                  <Text className="w-10 text-text-muted text-sm">
                    {set.set_number}
                  </Text>
                  <Text className="flex-1 text-text text-sm font-medium">
                    {formatWeight(set.weight_kg)}
                  </Text>
                  <Text className="flex-1 text-text text-sm font-medium">
                    {set.reps ?? "—"} reps
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}