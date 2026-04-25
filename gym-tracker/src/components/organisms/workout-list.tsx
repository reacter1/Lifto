import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutTemplate } from "@/src/types";

type WorkoutListProps = {
  templates: WorkoutTemplate[];
  onDelete: (id: string, name: string) => void;
};

export function WorkoutList({ templates, onDelete }: WorkoutListProps) {
  const router = useRouter();

  return (
    <View className="gap-4">
      {templates.map((template) => (
        <View
          key={template.id}
          className="bg-background-card border border-border rounded-2xl overflow-hidden"
        >
          <TouchableOpacity
            onPress={() =>
              router.push(`/(authenticated)/workout/${template.id}`)
            }
            className="p-4 flex-row items-center gap-3"
            activeOpacity={0.7}
          >
            <View className="bg-primary/10 rounded-xl p-3">
              <Ionicons name="barbell" size={22} color="#E11D48" />
            </View>
            <View className="flex-1">
              <Text className="text-text font-semibold">{template.name}</Text>
              <Text className="text-text-muted text-xs mt-0.5">
                Tap to view or start
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#a1a1aa" />
          </TouchableOpacity>

          <View className="flex-row border-t border-border">
            <TouchableOpacity
              onPress={() =>
                router.push(`/(authenticated)/workout/${template.id}`)
              }
              className="flex-1 flex-row items-center justify-center gap-2 py-3"
            >
              <Ionicons name="play" size={15} color="#E11D48" />
              <Text className="text-primary text-sm font-medium">Start</Text>
            </TouchableOpacity>

            <View className="w-px bg-border" />

            <TouchableOpacity
              onPress={() => onDelete(template.id, template.name)}
              className="flex-1 flex-row items-center justify-center gap-2 py-3"
            >
              <Ionicons name="trash-outline" size={15} color="#a1a1aa" />
              <Text className="text-text-muted text-sm font-medium">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}