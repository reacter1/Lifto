import { Stack } from "expo-router";

export default function AuthenticatedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#050507" },
        // Default for all screens in this stack
        animation: "ios_from_right",
      }}
    >
      {/* Tabs — no animation, they handle their own */}
      <Stack.Screen
        name="(tabs)"
        options={{ animation: "none" }}
      />

      {/* Create workout — slides up like a form modal */}
      <Stack.Screen
        name="workout/create"
        options={{ animation: "slide_from_bottom" }}
      />

      {/* Workout detail — drill down from list */}
      <Stack.Screen
        name="workout/[id]"
        options={{ animation: "ios_from_right" }}
      />

      {/* Active session — full screen modal takeover like Strong */}
      <Stack.Screen
        name="session/active"
        options={{
          animation: "slide_from_bottom",
          // Prevents swipe back dismissing mid-workout
          gestureEnabled: false,
        }}
      />

      {/* Past session detail — drill down from history */}
      <Stack.Screen
        name="session/[id]"
        options={{ animation: "ios_from_right" }}
      />
    </Stack>
  );
}