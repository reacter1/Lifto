import { Platform } from "react-native";
import { Redirect } from "expo-router";
import MarketingPage from "./(marketing)/index";

export default function Index() {
  if (Platform.OS !== "web") {
    return <Redirect href="/(unauthenticated)/login" />;
  }

  return <MarketingPage />;
}