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
  View
} from "react-native";
import tw from "twrnc";
import { api } from "../services/api";
import { useUserStore } from "../store/userStore";
import { User } from "../types";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const { setUser, setLoading, setError } = useUserStore();

  const registerMutation = useMutation<
    User,
    Error,
    { name: string; email: string; password: string; phone: string }
  >({
    mutationFn: api.register,
    onSuccess: (user) => {
      setUser(user);
      setError(null);
      router.replace("/(tabs)");
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : "Registration failed");
      Alert.alert(
        "Registration Failed",
        "Please check your information and try again."
      );
    },
  });

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword || !phone) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    registerMutation.mutate({ name, email, password, phone });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1 px-4`}>
          {/* Header */}
          <View style={tw`items-center mt-8 mb-8`}>
            <Ionicons name="home" size={64} color={theme.colors.primary} />
            <Text style={tw`text-2xl font-bold text-gray-800`}>
              Create Account
            </Text>
            <Text style={tw`text-gray-600 text-center mt-2`}>
              Join PropertyApp to find your perfect home
            </Text>
          </View>

          {/* Form */}
          <View style={tw`flex-1`}>
            <View>
              <Text style={tw`text-gray-700 mb-2`}>Full Name</Text>
              <TextInput
                style={tw`bg-gray-100 px-4 py-3 rounded-lg text-gray-800`}
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View>
              <Text style={tw`text-gray-700 mb-2 mt-4`}>Email</Text>
              <TextInput
                style={tw`bg-gray-100 px-4 py-3 rounded-lg text-gray-800`}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text style={tw`text-gray-700 mb-2 mt-4`}>Phone Number</Text>
              <TextInput
                style={tw`bg-gray-100 px-4 py-3 rounded-lg text-gray-800`}
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View>
              <Text style={tw`text-gray-700 mb-2 mt-4`}>Password</Text>
              <TextInput
                style={tw`bg-gray-100 px-4 py-3 rounded-lg text-gray-800`}
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View>
              <Text style={tw`text-gray-700 mb-2 mt-4`}>Confirm Password</Text>
              <TextInput
                style={tw`bg-gray-100 px-4 py-3 rounded-lg text-gray-800`}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={tw`bg-blue-600 py-3 rounded-lg mt-8`}
              onPress={handleRegister}
              disabled={registerMutation.isPending}
            >
              <Text style={tw`text-white text-center font-semibold text-lg`}>
                {registerMutation.isPending
                  ? "Creating Account..."
                  : "Create Account"}
              </Text>
            </TouchableOpacity>

            <View style={tw`flex-row justify-center mt-4`}>
              <Text style={tw`text-gray-600`}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={tw`text-blue-600 font-semibold`}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
