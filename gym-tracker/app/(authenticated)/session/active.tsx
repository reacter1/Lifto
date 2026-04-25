import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  AppState,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/src/components/atoms/button";
import { ActiveExercise } from "@/src/components/organisms/active-exercise";
import { useActiveSession } from "@/src/hooks/use-active-session";

export default function ActiveSessionScreen() {
  const router = useRouter();
  const {
    sessionId,
    templateName,
    exercises,
    updateSet,
    completeSet,
    finishSession,
    endSession,
  } = useActiveSession();

  // ── Timer ──────────────────────────────────────────────────────────────────
  const [elapsed, setElapsed] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Format Timer ───────────────────────────────────────────────────────────
  function formatElapsed(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  // ── Guard: Redirect if no active session ──────────────────────────────────
  useEffect(() => {
    if (!sessionId) {
      router.replace("/(authenticated)/(tabs)");
    }
  }, [sessionId]);

  // ── Progress ───────────────────────────────────────────────────────────────
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const progressPercent = totalSets > 0 ? completedSets / totalSets : 0;

  // ── Finish Workout ─────────────────────────────────────────────────────────
  async function handleFinish() {
    const hasAnySetsCompleted = exercises.some((ex) =>
      ex.sets.some((s) => s.completed)
    );

    if (!hasAnySetsCompleted) {
      Alert.alert(
        "No Sets Logged",
        "Complete at least one set before finishing.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Finish Workout?",
      `You've completed ${completedSets} of ${totalSets} sets.`,
      [
        { text: "Keep Going", style: "cancel" },
        {
          text: "Finish 💪",
          onPress: async () => {
            try {
              setIsSaving(true);
              if (timerRef.current) clearInterval(timerRef.current);
              await finishSession();
              router.replace("/(authenticated)/(tabs)/history");
            } catch (error: any) {
              Alert.alert("Error", error?.message ?? "Failed to save session.");
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  }

  // ── Cancel Workout ─────────────────────────────────────────────────────────
  function handleCancel() {
    Alert.alert(
      "Cancel Workout?",
      "All your progress will be lost.",
      [
        { text: "Keep Going", style: "cancel" },
        {
          text: "Cancel Workout",
          style: "destructive",
          onPress: () => {
            if (timerRef.current) clearInterval(timerRef.current);
            endSession();
            router.replace("/(authenticated)/(tabs)");
          },
        },
      ]
    );
  }

  if (!sessionId) return null;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-background">
      {/* Sticky Header */}
      <View className="px-6 pt-16 pb-4 bg-background border-b border-border">
        <View className="flex-row items-center justify-between mb-3">
          {/* Cancel */}
          <TouchableOpacity
            onPress={handleCancel}
            className="bg-background-card border border-border rounded-xl px-3 py-2"
          >
            <Text className="text-text-muted font-medium text-sm">Cancel</Text>
          </TouchableOpacity>

          {/* Timer */}
          <View className="items-center">
            <Text className="text-text text-2xl font-bold tabular-nums">
              {formatElapsed(elapsed)}
            </Text>
            <Text className="text-text-muted text-xs">{templateName}</Text>
          </View>

          {/* Sets Badge */}
          <View className="bg-primary/10 border border-primary/20 rounded-xl px-3 py-2">
            <Text className="text-primary font-semibold text-sm">
              {completedSets}/{totalSets}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="h-1.5 bg-background-input rounded-full overflow-hidden">
          <View
            className="h-full bg-primary rounded-full"
            style={{ width: `${progressPercent * 100}%` }}
          />
        </View>
      </View>

      {/* Exercises */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-6 pb-36"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {exercises.map((exercise) => (
          <ActiveExercise
            key={exercise.id}
            exercise={exercise}
            onUpdateSet={updateSet}
            onCompleteSet={completeSet}
          />
        ))}
      </ScrollView>

      {/* Finish Button — Floating */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-4 bg-background border-t border-border">
        <Button
          label={isSaving ? "Saving..." : "Finish Workout 💪"}
          onPress={handleFinish}
          isLoading={isSaving}
        />
      </View>
    </View>
  );
}