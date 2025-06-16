import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { api } from "../services/api";
import { useUserStore } from "../store/userStore";
import { User } from "../types";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setLoading, setError } = useUserStore();

  const loginMutation = useMutation<
    User,
    Error,
    { email: string; password: string }
  >({
    mutationFn: api.login,
    onSuccess: (user) => {
      setUser(user);
      setError(null);
      router.replace("/(tabs)");
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : "Login failed");
      Alert.alert(
        "Login Failed",
        "Invalid email or password. Please try again."
      );
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    loginMutation.mutate({ email, password });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1 px-6 justify-center`}>
          {/* Header */}
          <View style={tw`items-center mb-12`}>
            <Ionicons name="home" size={64} color={theme.colors.primary} />
            <Text style={tw`text-3xl font-bold text-gray-800 mt-4`}>
              Welcome Back
            </Text>
            <Text style={tw`text-gray-600 mt-2 text-center`}>
              Sign in to access your account and manage your bookings
            </Text>
          </View>

          {/* Login Form */}
          <View style={tw`space-y-4`}>
            <View>
              <Text style={tw`text-gray-700 mb-2`}>Email</Text>
              <TextInput
                style={tw`bg-gray-100 px-4 py-3 rounded-lg text-gray-800`}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View>
              <Text style={tw`text-gray-700 mb-2 mt-4`}>Password</Text>
              <TextInput
                style={tw`bg-gray-100 px-4 py-3 rounded-lg text-gray-800`}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            <TouchableOpacity
              style={tw`bg-blue-600 py-4 rounded-lg mt-6`}
              onPress={handleLogin}
              disabled={loginMutation.isPending}
            >
              <Text style={tw`text-white text-center font-semibold text-lg`}>
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`mt-4`}
              onPress={() => router.push("/register" as any)}
            >
              <Text style={tw`text-blue-600 text-center`}>
                Don&apos;t have an account? Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
