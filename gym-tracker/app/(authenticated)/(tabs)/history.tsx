import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWorkouts } from "@/src/hooks/use-workouts";
import { Button } from "@/src/components/atoms/button";

export default function WorkoutsScreen() {
  const router = useRouter();
  const { templates, isLoading, deleteTemplate, refetch } = useWorkouts();

  // ── Delete confirmation ────────────────────────────────────────────────────
  function confirmDelete(id: string, name: string) {
    Alert.alert(
      `Delete "${name}"?`,
      "This will permanently delete this workout template.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTemplate(id),
        },
      ]
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-16 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-text text-2xl font-bold">My Workouts</Text>
          <TouchableOpacity
            onPress={() => router.push("/(authenticated)/workout/create")}
            className="bg-primary rounded-xl p-2.5"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View className="items-center py-20">
            <Text className="text-text-muted">Loading workouts...</Text>
          </View>
        )}

        {/* Templates List */}
        {!isLoading && templates.length > 0 && (
          <View className="gap-4">
            {templates.map((template) => (
              <View
                key={template.id}
                className="bg-background-card border border-border rounded-2xl overflow-hidden"
              >
                {/* Template Info */}
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/(authenticated)/workout/${template.id}`)
                  }
                  className="p-4 flex-row items-center justify-between"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="bg-primary/10 rounded-xl p-3">
                      <Ionicons name="barbell" size={22} color="#E11D48" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-text font-semibold text-base">
                        {template.name}
                      </Text>
                      <Text className="text-text-muted text-xs mt-0.5">
                        Tap to view or edit
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#a1a1aa" />
                </TouchableOpacity>

                {/* Action Bar */}
                <View className="flex-row border-t border-border">
                  <TouchableOpacity
                    onPress={() =>
                      router.push(`/(authenticated)/workout/${template.id}`)
                    }
                    className="flex-1 flex-row items-center justify-center gap-2 py-3"
                  >
                    <Ionicons name="play" size={16} color="#E11D48" />
                    <Text className="text-primary font-medium text-sm">
                      Start
                    </Text>
                  </TouchableOpacity>

                  <View className="w-px bg-border" />

                  <TouchableOpacity
                    onPress={() => confirmDelete(template.id, template.name)}
                    className="flex-1 flex-row items-center justify-center gap-2 py-3"
                  >
                    <Ionicons name="trash-outline" size={16} color="#a1a1aa" />
                    <Text className="text-text-muted font-medium text-sm">
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!isLoading && templates.length === 0 && (
          <View className="items-center py-20">
            <Ionicons name="barbell-outline" size={56} color="#52525b" />
            <Text className="text-text font-semibold text-lg mt-6">
              No Workouts Yet
            </Text>
            <Text className="text-text-muted text-sm text-center mt-2 mb-8">
              Create a workout template to start tracking your training
            </Text>
            <Button
              label="Create Your First Workout"
              fullWidth={false}
              onPress={() => router.push("/(authenticated)/workout/create")}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}