import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/src/hooks/use-auth";
import { getWorkoutSessions } from "@/src/lib/supabase/supabase-db/sessions";
import { formatDate, formatDuration } from "@/src/utils/formatters";
import { WorkoutSession } from "@/src/types";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      if (!userId) return;
      try {
        const data = await getWorkoutSessions(userId);
        setSessions(data);
      } catch (error) {
        console.error("Failed to load sessions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSessions();
  }, [userId]);

  return (
    <View className="flex-1 bg-[#050507]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ───────────────────────────────────────── */}
        <View className="mb-8">
          <Text
            className="text-zinc-600 text-xs uppercase tracking-widest mb-1"
            style={{ fontFamily: "MartianMono_400Regular" }}
          >
            {sessions.length} session{sessions.length !== 1 ? "s" : ""} logged
          </Text>
          <Text
            className="text-zinc-50 text-2xl"
            style={{ fontFamily: "MartianMono_700Bold" }}
          >
            History
          </Text>
        </View>

        {/* ── Loading ───────────────────────────────────────── */}
        {isLoading && (
          <View className="items-center py-20">
            <Text
              className="text-zinc-600 text-xs uppercase tracking-widest"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Loading...
            </Text>
          </View>
        )}

        {/* ── Sessions ──────────────────────────────────────── */}
        {!isLoading && sessions.length > 0 && (
          <View className="gap-3">
            {sessions.map((session, index) => {
              const templateName =
                (session as any).template?.name ?? "Custom Workout";
              const duration = session.finished_at
                ? formatDuration(session.started_at, session.finished_at)
                : null;

              return (
                <Animated.View
                  key={session.id}
                  entering={FadeInDown.delay(index * 60).duration(400).springify()}
                >
                  <TouchableOpacity
                    onPress={() => router.push(`/(authenticated)/session/${session.id}`)}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3 flex-1">
                        <View className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-900 items-center justify-center">
                          <Ionicons name="barbell-outline" size={18} color="#f43f5e" />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-zinc-100 text-sm"
                            style={{ fontFamily: "MartianMono_600SemiBold" }}
                          >
                            {templateName}
                          </Text>
                          <Text
                            className="text-zinc-600 text-xs mt-0.5"
                            style={{ fontFamily: "MartianMono_400Regular" }}
                          >
                            {formatDate(session.started_at)}
                          </Text>
                        </View>
                      </View>

                      <View className="items-end gap-1">
                        {duration && (
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="time-outline" size={11} color="#52525b" />
                            <Text
                              className="text-zinc-500 text-xs"
                              style={{ fontFamily: "MartianMono_400Regular" }}
                            >
                              {duration}
                            </Text>
                          </View>
                        )}
                        <Ionicons name="chevron-forward" size={14} color="#3f3f46" />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        )
        }

        {/* ── Empty State ───────────────────────────────────── */}
        {!isLoading && sessions.length === 0 && (
          <View className="items-center py-20">
            <View className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 items-center justify-center mb-6">
              <Ionicons name="time-outline" size={36} color="#3f3f46" />
            </View>
            <Text
              className="text-zinc-100 text-base mb-2"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              No sessions yet
            </Text>
            <Text
              className="text-zinc-500 text-xs text-center leading-5"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Complete a workout{"\n"}to see it here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}