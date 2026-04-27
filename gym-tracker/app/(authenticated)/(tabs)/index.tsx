import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/src/hooks/use-auth";
import { useWorkouts } from "@/src/hooks/use-workouts";
import { signOut } from "@/src/lib/auth/auth-helpers";
import { Button } from "@/src/components/atoms/button";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userEmail } = useAuth();
  const { templates } = useWorkouts();

  const displayName = userEmail?.split("@")[0] ?? "Athlete";

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

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
        {/* ── Header ────────────────────────────────── */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text
              className="text-zinc-600 text-xs uppercase tracking-widest mb-1"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Welcome back
            </Text>
            <Text
              className="text-zinc-50 text-2xl capitalize"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              {displayName}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3"
          >
            <Ionicons name="log-out-outline" size={20} color="#52525b" />
          </TouchableOpacity>
        </View>

        {/* ── Hero Card ─────────────────────────────── */}
        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-5">
          <View className="flex-row items-start justify-between mb-6">
            <View className="flex-1 pr-4">
              <Text
                className="text-zinc-500 text-xs uppercase tracking-widest mb-3"
                style={{ fontFamily: "MartianMono_400Regular" }}
              >
                Ready to lift?
              </Text>
              <Text
                className="text-white text-2xl leading-9"
                style={{ fontFamily: "MartianMono_700Bold" }}
              >
                Train hard.{"\n"}Log clean.
              </Text>
            </View>
            <View className="w-14 h-14 rounded-2xl bg-rose-600 items-center justify-center">
              <Ionicons name="barbell" size={26} color="white" />
            </View>
          </View>
          <Button
            label="Start Workout"
            onPress={() => router.push("/(authenticated)/(tabs)/workouts")}
          />
        </View>

        {/* ── Stats Row ─────────────────────────────── */}
        <View className="flex-row gap-3 mb-8">
          <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
            <Text
              className="text-rose-500 text-3xl mb-1"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              {templates.length}
            </Text>
            <Text
              className="text-zinc-500 text-xs uppercase tracking-widest"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Templates
            </Text>
          </View>

          <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
            <Text
              className="text-zinc-100 text-3xl mb-1"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              0
            </Text>
            <Text
              className="text-zinc-500 text-xs uppercase tracking-widest"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Sessions
            </Text>
          </View>
        </View>

        {/* ── Recent Workouts ───────────────────────── */}
        <View className="flex-row items-center justify-between mb-4">
          <Text
            className="text-zinc-100 text-sm uppercase tracking-widest"
            style={{ fontFamily: "MartianMono_700Bold" }}
          >
            Recent
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(authenticated)/(tabs)/workouts")}
          >
            <Text
              className="text-rose-500 text-xs"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              View all →
            </Text>
          </TouchableOpacity>
        </View>

        {templates.length > 0 ? (
          <View className="gap-2">
            {templates.slice(0, 3).map((template, index) => (
              <Animated.View
                key={template.id}
                entering={FadeInDown.delay(index * 80).duration(400).springify()}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/(authenticated)/workout/${template.id}`)}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex-row items-center justify-between"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-900 items-center justify-center">
                      <Ionicons name="barbell-outline" size={18} color="#f43f5e" />
                    </View>
                    <View>
                      <Text
                        className="text-zinc-100 text-sm"
                        style={{ fontFamily: "MartianMono_600SemiBold" }}
                      >
                        {template.name}
                      </Text>
                      <Text
                        className="text-zinc-600 text-xs mt-0.5"
                        style={{ fontFamily: "MartianMono_400Regular" }}
                      >
                        Tap to start
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#3f3f46" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        ) : (
          /* ── Empty State ──────────────────────────── */
          <View className="bg-zinc-900 border border-dashed border-zinc-800 rounded-3xl px-6 py-12 items-center">
            <View className="w-16 h-16 rounded-2xl bg-zinc-800 items-center justify-center mb-5">
              <Ionicons name="barbell-outline" size={30} color="#52525b" />
            </View>
            <Text
              className="text-zinc-100 text-base mb-2"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              No workouts yet
            </Text>
            <Text
              className="text-zinc-500 text-xs text-center mb-6 leading-5"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Build your first template{"\n"}and start logging real progress.
            </Text>
            <Button
              label="Create Workout"
              fullWidth={false}
              onPress={() => router.push("/(authenticated)/workout/create")}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}