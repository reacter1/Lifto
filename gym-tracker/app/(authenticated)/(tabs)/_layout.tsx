import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

type Tab = {
  name: string;
  title: string;
  icon: IoniconName;
  activeIcon: IoniconName;
};

const TABS: Tab[] = [
  { name: "index", title: "Home", icon: "home-outline", activeIcon: "home" },
  { name: "workouts", title: "Workouts", icon: "barbell-outline", activeIcon: "barbell" },
  { name: "history", title: "History", icon: "time-outline", activeIcon: "time" },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#050507" },
        tabBarStyle: {
          backgroundColor: "#0a0a0b",
          borderTopColor: "#18181b",
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#e11d48",
        tabBarInactiveTintColor: "#52525b",
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "MartianMono_400Regular",
          letterSpacing: 0.5,
          marginTop: 2,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? tab.activeIcon : tab.icon}
                size={22}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}