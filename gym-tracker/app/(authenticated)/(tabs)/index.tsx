import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/hooks/use-auth";
import { useWorkouts } from "@/src/hooks/use-workouts";
import { signOut } from "@/src/lib/auth/auth-helpers";
import { Button } from "@/src/components/atoms/button";

export default function HomeScreen() {
  const router = useRouter();
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
          paddingHorizontal: 22,
          paddingTop: 64,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text
              className="text-zinc-500 text-xs uppercase tracking-widest"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Welcome back
            </Text>
            <Text
              className="text-zinc-50 text-3xl mt-2 capitalize"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              {displayName}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3"
          >
            <Ionicons name="log-out-outline" size={22} color="#a1a1aa" />
          </TouchableOpacity>
        </View>

        <View className="bg-zinc-950 border border-zinc-800 rounded-[28px] p-6 mb-6">
          <View className="flex-row items-center justify-between mb-8">
            <View>
              <Text
                className="text-zinc-500 text-xs uppercase tracking-widest mb-2"
                style={{ fontFamily: "MartianMono_400Regular" }}
              >
                Next session
              </Text>
              <Text
                className="text-white text-3xl leading-10"
                style={{ fontFamily: "MartianMono_700Bold" }}
              >
                Train hard.{"\n"}Log clean.
              </Text>
            </View>

            <View className="h-16 w-16 rounded-2xl bg-rose-600 items-center justify-center">
              <Ionicons name="barbell" size={30} color="white" />
            </View>
          </View>

          <Button
            label="Start Workout"
            onPress={() => router.push("/(authenticated)/(tabs)/workouts")}
          />
        </View>

        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-zinc-950 border border-zinc-800 rounded-3xl p-5">
            <Text
              className="text-rose-500 text-4xl"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              {templates.length}
            </Text>
            <Text className="text-zinc-500 text-xs mt-2">
              Templates ready
            </Text>
          </View>

          <View className="flex-1 bg-zinc-950 border border-zinc-800 rounded-3xl p-5">
            <Text
              className="text-white text-4xl"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              0
            </Text>
            <Text className="text-zinc-500 text-xs mt-2">
              Sessions logged
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text
            className="text-zinc-100 text-lg"
            style={{ fontFamily: "MartianMono_700Bold" }}
          >
            Recent
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(authenticated)/(tabs)/workouts")}
          >
            <Text className="text-rose-500 text-sm">View all</Text>
          </TouchableOpacity>
        </View>

        {templates.length > 0 ? (
          <View className="gap-3">
            {templates.slice(0, 3).map((template) => (
              <TouchableOpacity
                key={template.id}
                onPress={() =>
                  router.push(`/(authenticated)/workout/${template.id}`)
                }
                className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="bg-rose-950 border border-rose-900 rounded-2xl p-3">
                    <Ionicons name="barbell-outline" size={20} color="#f43f5e" />
                  </View>

                  <View>
                    <Text className="text-zinc-100 font-semibold">
                      {template.name}
                    </Text>
                    <Text className="text-zinc-500 text-xs mt-1">
                      Tap to view workout
                    </Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#71717a" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="bg-zinc-950 border border-dashed border-zinc-800 rounded-3xl px-6 py-10 items-center">
            <View className="h-16 w-16 rounded-2xl bg-zinc-900 items-center justify-center mb-5">
              <Ionicons name="barbell-outline" size={32} color="#71717a" />
            </View>

            <Text
              className="text-zinc-100 text-lg mb-2"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              No workouts yet
            </Text>

            <Text className="text-zinc-500 text-center text-sm mb-6 leading-5">
              Build your first template and start logging real progress.
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