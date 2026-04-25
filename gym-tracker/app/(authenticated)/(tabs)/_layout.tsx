import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: {
  name: string;
  title: string;
  icon: IoniconName;
  activeIcon: IoniconName;
}[] = [
  { name: "index", title: "Home", icon: "home-outline", activeIcon: "home" },
  { name: "workouts", title: "Workouts", icon: "barbell-outline", activeIcon: "barbell" },
  { name: "history", title: "History", icon: "time-outline", activeIcon: "time" },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 18,
          height: 68,
          backgroundColor: "#09090b",
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "#27272a",
          borderRadius: 24,
          paddingTop: 8,
          paddingBottom: 10,
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 18,
          elevation: 10,
        },
        tabBarActiveTintColor: "#f43f5e",
        tabBarInactiveTintColor: "#71717a",
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "MartianMono_700Bold",
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
                size={focused ? 24 : 22}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}