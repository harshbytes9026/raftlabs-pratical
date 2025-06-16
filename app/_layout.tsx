import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { queryClient } from "../services/queryClient";
import { useUserStore } from "../store/userStore";

export default function RootLayout() {
  const { user } = useUserStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const isLoginScreen = segments[0] === "login";
    const isRegisterScreen = segments[0] === "register";

    if (user && (isLoginScreen || isRegisterScreen)) {
      // Redirect to home if authenticated
      router.replace("/(tabs)");
    }
  }, [user, segments]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="property/[id]"
          options={{
            headerTitle: "Property Details",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
