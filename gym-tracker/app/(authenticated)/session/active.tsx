import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  FadeInDown,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/src/components/atoms/button";
import { ActiveExercise } from "@/src/components/organisms/active-exercise";
import { useActiveSession } from "@/src/hooks/use-active-session";

export default function ActiveSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    sessionId,
    templateName,
    exercises,
    updateSet,
    completeSet,
    finishSession,
    endSession,
  } = useActiveSession();

  const [elapsed, setElapsed] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // ── Progress ───────────────────────────────────────────────────────────────
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const progressPercent = totalSets > 0 ? completedSets / totalSets : 0;

  // ── Animated progress bar ──────────────────────────────────────────────────
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(progressPercent, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
  }, [progressPercent]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function formatElapsed(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  // ── Guard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) router.replace("/(authenticated)/(tabs)");
  }, [sessionId]);

  // ── Finish ─────────────────────────────────────────────────────────────────
  async function handleFinish() {
    const hasAnySetsCompleted = exercises.some((ex) =>
      ex.sets.some((s) => s.completed)
    );

    if (!hasAnySetsCompleted) {
      Alert.alert("No Sets Logged", "Complete at least one set before finishing.");
      return;
    }

    Alert.alert(
      "Finish Workout?",
      `${completedSets} of ${totalSets} sets completed.`,
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

  // ── Cancel ─────────────────────────────────────────────────────────────────
  function handleCancel() {
    Alert.alert("Cancel Workout?", "All progress will be lost.", [
      { text: "Keep Going", style: "cancel" },
      {
        text: "Cancel",
        style: "destructive",
        onPress: () => {
          if (timerRef.current) clearInterval(timerRef.current);
          endSession();
          router.replace("/(authenticated)/(tabs)");
        },
      },
    ]);
  }

  if (!sessionId) return null;

  return (
    <View className="flex-1 bg-[#050507]">
      {/* ── Sticky Header ───────────────────────────────────── */}
      <View
        style={{ paddingTop: insets.top + 16 }}
        className="px-5 pb-4 bg-[#050507] border-b border-zinc-900"
      >
        <View className="flex-row items-center justify-between mb-4">
          {/* Cancel */}
          <TouchableOpacity
            onPress={handleCancel}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2"
          >
            <Text
              className="text-zinc-400 text-xs"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          {/* Timer */}
          <View className="items-center">
            <Text
              className="text-zinc-100 text-2xl tabular-nums"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              {formatElapsed(elapsed)}
            </Text>
            <Text
              className="text-zinc-500 text-xs mt-0.5 uppercase tracking-widest"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              {templateName}
            </Text>
          </View>

          {/* Sets count */}
          <View className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
            <Text
              className="text-zinc-100 text-xs"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              {completedSets}/{totalSets}
            </Text>
          </View>
        </View>

        {/* ── Animated Progress Bar ───────────────────────── */}
        <View className="h-1 bg-zinc-900 rounded-full overflow-hidden">
          <Animated.View
            style={[progressBarStyle, { height: "100%", borderRadius: 9999, backgroundColor: "#e11d48" }]}
          />
        </View>
      </View>

      {/* ── Exercise List ────────────────────────────────────── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {exercises.map((exercise, index) => (
          // ✅ Each exercise fades+slides up on mount, staggered by index
          <Animated.View
            key={exercise.id}
            entering={FadeInDown.delay(index * 80).duration(400).springify()}
          >
            <ActiveExercise
              exercise={exercise}
              onUpdateSet={updateSet}
              onCompleteSet={completeSet}
            />
          </Animated.View>
        ))}
      </ScrollView>

      {/* ── Finish Button ────────────────────────────────────── */}
      <View
        style={{ paddingBottom: insets.bottom + 16 }}
        className="px-5 pt-4 bg-[#050507] border-t border-zinc-900"
      >
        <Button
          label={isSaving ? "Saving..." : "Finish Workout 💪"}
          onPress={handleFinish}
          isLoading={isSaving}
        />
      </View>
    </View>
  );
}