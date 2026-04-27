import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// ── Your app store / waitlist link ────────────────────────────────────────────
const APP_LINK = "";

// ── Feature list ──────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "barbell-outline" as const,
    title: "Build Templates",
    description:
      "Create reusable workout templates with custom exercises, sets, and rep targets.",
  },
  {
    icon: "play-circle-outline" as const,
    title: "Start Any Workout",
    description:
      "Pick a template and go. Log sets in real time with a single tap to mark complete.",
  },
  {
    icon: "checkmark-circle-outline" as const,
    title: "Log Every Set",
    description:
      "Record weight and reps for every single set. No fluff, just data that matters.",
  },
  {
    icon: "time-outline" as const,
    title: "Track Your History",
    description:
      "Every session is saved to the cloud. See exactly what you lifted, when.",
  },
  {
    icon: "cloud-outline" as const,
    title: "Synced Across Devices",
    description:
      "Your data lives in the cloud. Switch phones without losing a single rep.",
  },
  {
    icon: "lock-closed-outline" as const,
    title: "Private & Secure",
    description:
      "Row-level security means only you can ever see your workout data. Full stop.",
  },
];

// ── How it works steps ────────────────────────────────────────────────────────
const STEPS = [
  {
    step: "01",
    title: "Create your workout",
    description: "Name it, add your exercises, set your targets.",
  },
  {
    step: "02",
    title: "Start the session",
    description: "Hit start and the timer begins. Work through your exercises.",
  },
  {
    step: "03",
    title: "Log each set",
    description: "Enter weight and reps, tap the checkmark. That's it.",
  },
  {
    step: "04",
    title: "Review your progress",
    description: "Check your history anytime. See your gains stack up over time.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <View className="flex-1 bg-[#050507]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >

        {/* ── NAV ──────────────────────────────────────────────────────────── */}
        <View
          className="flex-row items-center justify-between px-8 py-6 border-b border-zinc-900"
          style={{ maxWidth: 1100, alignSelf: "center", width: "100%" }}
        >
          {/* Logo */}
          <View className="flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-xl bg-rose-600 items-center justify-center">
              <Text
                className="text-white text-sm"
                style={{ fontFamily: "MartianMono_700Bold" }}
              >
                G
              </Text>
            </View>
            <Text
              className="text-zinc-100 text-base"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              Lifto-Gym-Tracker
            </Text>
          </View>

          {/* Nav Links */}
          {isWide && (
            <View className="flex-row items-center gap-8">
              {["Features", "How it works"].map((item) => (
                <Text
                  key={item}
                  className="text-zinc-400 text-xs uppercase tracking-widest cursor-pointer hover:text-zinc-100"
                  style={{ fontFamily: "MartianMono_400Regular" }}
                >
                  {item}
                </Text>
              ))}
            </View>
          )}

          {/* CTA */}
          <TouchableOpacity
            onPress={() => Linking.openURL(APP_LINK)}
            className="bg-rose-600 rounded-xl px-4 py-2.5"
            activeOpacity={0.8}
          >
            <Text
              className="text-white text-xs uppercase tracking-widest"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              Get the App
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <View
          className="items-center px-6 pt-24 pb-20"
          style={{ maxWidth: 900, alignSelf: "center", width: "100%" }}
        >
          {/* Badge */}
          <View className="bg-rose-950 border border-rose-900 rounded-full px-4 py-1.5 mb-8">
            <Text
              className="text-rose-400 text-xs uppercase tracking-widest"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Now available on iOS & Android
            </Text>
          </View>

          {/* Headline */}
          <Text
            className="text-zinc-50 text-center mb-6"
            style={{
              fontFamily: "MartianMono_700Bold",
              fontSize: isWide ? 64 : 36,
              lineHeight: isWide ? 76 : 46,
            }}
          >
            Train hard.{"\n"}Log clean.{"\n"}
            <Text className="text-rose-500">Get stronger.</Text>
          </Text>

          {/* Sub */}
          <Text
            className="text-zinc-500 text-center mb-12"
            style={{
              fontFamily: "MartianMono_400Regular",
              fontSize: isWide ? 16 : 13,
              lineHeight: isWide ? 28 : 22,
              maxWidth: 540,
            }}
          >
            The no-nonsense gym tracker built for lifters who care more about
            results than flashy features. Create workouts, log every set, review
            your history.
          </Text>
        </View>

        {/* ── DIVIDER ───────────────────────────────────────────────────────── */}
        <View
          className="flex-row items-center gap-6 px-8 py-6 border-y border-zinc-900 flex-wrap justify-center"
          style={{ maxWidth: 1100, alignSelf: "center", width: "100%" }}
        >
          {["No subscription", "Cloud sync", "iOS & Android", "Private by default"].map(
            (tag) => (
              <View key={tag} className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                <Text
                  className="text-zinc-400 text-xs uppercase tracking-widest"
                  style={{ fontFamily: "MartianMono_400Regular" }}
                >
                  {tag}
                </Text>
              </View>
            )
          )}
        </View>

        {/* ── FEATURES ──────────────────────────────────────────────────────── */}
        <View
          className="px-6 py-24"
          style={{ maxWidth: 1100, alignSelf: "center", width: "100%" }}
        >
          <Text
            className="text-zinc-600 text-xs uppercase tracking-widest text-center mb-4"
            style={{ fontFamily: "MartianMono_400Regular" }}
          >
            Everything you need
          </Text>
          <Text
            className="text-zinc-50 text-center mb-16"
            style={{
              fontFamily: "MartianMono_700Bold",
              fontSize: isWide ? 40 : 28,
              lineHeight: isWide ? 52 : 38,
            }}
          >
            Built for the gym.{"\n"}Nothing else.
          </Text>

          {/* Feature Grid */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            {FEATURES.map((feature) => (
              <View
                key={feature.title}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
                style={{ width: isWide ? "30%" : "100%", minWidth: 260 }}
              >
                <View className="w-11 h-11 rounded-2xl bg-rose-950 border border-rose-900 items-center justify-center mb-5">
                  <Ionicons name={feature.icon} size={20} color="#f43f5e" />
                </View>
                <Text
                  className="text-zinc-100 text-sm mb-3"
                  style={{ fontFamily: "MartianMono_700Bold" }}
                >
                  {feature.title}
                </Text>
                <Text
                  className="text-zinc-500 text-xs leading-5"
                  style={{ fontFamily: "MartianMono_400Regular" }}
                >
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <View
          className="px-6 py-24 border-t border-zinc-900"
          style={{ maxWidth: 1100, alignSelf: "center", width: "100%" }}
        >
          <Text
            className="text-zinc-600 text-xs uppercase tracking-widest text-center mb-4"
            style={{ fontFamily: "MartianMono_400Regular" }}
          >
            Simple by design
          </Text>
          <Text
            className="text-zinc-50 text-center mb-16"
            style={{
              fontFamily: "MartianMono_700Bold",
              fontSize: isWide ? 40 : 28,
              lineHeight: isWide ? 52 : 38,
            }}
          >
            Four steps.{"\n"}Zero friction.
          </Text>

          <View
            style={{
              flexDirection: isWide ? "row" : "column",
              gap: 2,
            }}
          >
            {STEPS.map((step, index) => (
              <View
                key={step.step}
                className="flex-1 bg-zinc-900 border border-zinc-800 p-6"
                style={{
                  borderRadius: 0,
                  borderTopLeftRadius: index === 0 ? 24 : 0,
                  borderBottomLeftRadius:
                    isWide ? (index === 0 ? 24 : 0) : 0,
                  borderTopRightRadius:
                    isWide
                      ? index === STEPS.length - 1 ? 24 : 0
                      : index === 0
                      ? 24
                      : 0,
                  borderBottomRightRadius:
                    index === STEPS.length - 1 ? 24 : 0,
                }}
              >
                <Text
                  className="text-rose-600 text-xs mb-4"
                  style={{ fontFamily: "MartianMono_700Bold" }}
                >
                  {step.step}
                </Text>
                <Text
                  className="text-zinc-100 text-sm mb-2"
                  style={{ fontFamily: "MartianMono_700Bold" }}
                >
                  {step.title}
                </Text>
                <Text
                  className="text-zinc-500 text-xs leading-5"
                  style={{ fontFamily: "MartianMono_400Regular" }}
                >
                  {step.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── CTA SECTION ───────────────────────────────────────────────────── */}
        <View
          className="px-6 py-24 mx-6 bg-zinc-900 border border-zinc-800 rounded-3xl items-center"
          style={{ maxWidth: 1100, alignSelf: "center", width: "90%" }}
        >
          <View className="w-14 h-14 rounded-2xl bg-rose-600 items-center justify-center mb-8">
            <Ionicons name="barbell" size={26} color="white" />
          </View>

          <Text
            className="text-zinc-50 text-center mb-4"
            style={{
              fontFamily: "MartianMono_700Bold",
              fontSize: isWide ? 44 : 28,
              lineHeight: isWide ? 56 : 38,
            }}
          >
            Ready to start{"\n"}tracking?
          </Text>

          <Text
            className="text-zinc-500 text-xs text-center mb-10 leading-6"
            style={{
              fontFamily: "MartianMono_400Regular",
              maxWidth: 400,
            }}
          >
            Free to download. No subscription. Just you, the bar, and your data.
          </Text>

          <TouchableOpacity
            onPress={() => Linking.openURL(APP_LINK)}
            className="bg-rose-600 rounded-2xl px-10 py-5"
            activeOpacity={0.8}
          >
            <Text
              className="text-white text-sm uppercase tracking-widest"
              style={{ fontFamily: "MartianMono_700Bold" }}
            >
              Download Free
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <View
          className="flex-row items-center justify-between px-8 py-8 border-t border-zinc-900 mt-16 flex-wrap gap-4"
          style={{ maxWidth: 1100, alignSelf: "center", width: "100%" }}
        >
          <View className="flex-row items-center gap-3">
            <View className="w-7 h-7 rounded-lg bg-rose-600 items-center justify-center">
              <Text
                className="text-white text-xs"
                style={{ fontFamily: "MartianMono_700Bold" }}
              >
                G
              </Text>
            </View>
            <Text
              className="text-zinc-600 text-xs"
              style={{ fontFamily: "MartianMono_400Regular" }}
            >
              Lifto-Gym-Tracker © {new Date().getFullYear()}
            </Text>
          </View>

          <View className="flex-row gap-6">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <Text
                key={link}
                className="text-zinc-600 text-xs uppercase tracking-widest cursor-pointer"
                style={{ fontFamily: "MartianMono_400Regular" }}
              >
                {link}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}