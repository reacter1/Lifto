import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWorkouts } from "@/src/hooks/use-workouts";
import { Button } from "@/src/components/atoms/button";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function WorkoutsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { templates, isLoading, deleteTemplate } = useWorkouts();

  function confirmDelete(id: string, name: string) {
    Alert.alert(`Delete "${name}"?`, "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTemplate(id),
      },
    ]);
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
        {/* ── Header ───────────────────────────────────────── */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text
              className="text-zinc-600 text-xs uppercase tracking-widest mb-1"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Your library
            </Text>
            <Text
              className="text-zinc-50 text-2xl"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              Workouts
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(authenticated)/workout/create")}
            className="w-10 h-10 bg-rose-600 rounded-2xl items-center justify-center"
          >
            <Ionicons name="add" size={22} color="white" />
          </TouchableOpacity>
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

        {/* ── Templates ─────────────────────────────────────── */}
        {!isLoading && templates.length > 0 && (
          <View className="gap-3">
            {templates.map((template, index) => (
              <Animated.View
                key={template.id}
                entering={FadeInDown.delay(index * 60).duration(400).springify()}>
                <View className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                  {/* Top Row */}
                  <TouchableOpacity
                    onPress={() =>
                      router.push(`/(authenticated)/workout/${template.id}`)
                    }
                    className="p-4 flex-row items-center gap-4"
                    activeOpacity={0.7}
                  >
                    {/* Index Badge */}
                    <View className="w-10 h-10 rounded-xl bg-zinc-800 items-center justify-center">
                      <Text
                        className="text-zinc-400 text-sm"
                        style={{ fontFamily: "MartianMono_700Bold" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </Text>
                    </View>

                    <View className="flex-1">
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
                        Tap to view or edit
                      </Text>
                    </View>

                    <Ionicons name="chevron-forward" size={16} color="#3f3f46" />
                  </TouchableOpacity>

                  {/* Action Bar */}
                  <View className="flex-row border-t border-zinc-800">
                    <TouchableOpacity
                      onPress={() =>
                        router.push(`/(authenticated)/workout/${template.id}`)
                      }
                      className="flex-1 flex-row items-center justify-center gap-2 py-3"
                    >
                      <Ionicons name="play" size={14} color="#e11d48" />
                      <Text
                        className="text-rose-500 text-xs uppercase tracking-widest"
                        style={{ fontFamily: "MartianMono_600SemiBold" }}
                      >
                        Start
                      </Text>
                    </TouchableOpacity>

                    <View className="w-px bg-zinc-800" />

                    <TouchableOpacity
                      onPress={() => confirmDelete(template.id, template.name)}
                      className="flex-1 flex-row items-center justify-center gap-2 py-3"
                    >
                      <Ionicons name="trash-outline" size={14} color="#52525b" />
                      <Text
                        className="text-zinc-500 text-xs uppercase tracking-widest"
                        style={{ fontFamily: "MartianMono_400Regular" }}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        {/* ── Empty State ───────────────────────────────────── */}
        {!isLoading && templates.length === 0 && (
          <View className="items-center py-20">
            <View className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 items-center justify-center mb-6">
              <Ionicons name="barbell-outline" size={36} color="#3f3f46" />
            </View>
            <Text
              className="text-zinc-100 text-base mb-2"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              Empty library
            </Text>
            <Text
              className="text-zinc-500 text-xs text-center mb-8 leading-5"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Create a workout template{"\n"}to get started.
            </Text>
            <Button
              label="New Workout"
              fullWidth={false}
              onPress={() => router.push("/(authenticated)/workout/create")}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}