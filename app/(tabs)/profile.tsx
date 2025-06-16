import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { api } from "../../services/api";
import { useUserStore } from "../../store/userStore";
import { User } from "../../types";

export default function ProfileScreen() {
  const { user, setUser, logout, setLoading, setError } = useUserStore();

  // Fetch user data
  const { data: userData, isLoading } = useQuery<User, Error>({
    queryKey: ["user", user?.id],
    queryFn: () => api.getUser(user?.id || ""),
    enabled: !!user?.id,
  });

  React.useEffect(() => {
    if (userData && user) {
      setUser(userData);
    }
  }, [userData, user, setUser]);

  const currentUser = user || userData;

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          setLoading(true);
          try {
            logout();
            setError(null);
          } catch (error) {
            setError(error instanceof Error ? error.message : "Logout failed");
          } finally {
            setLoading(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <View style={tw`flex-1 justify-center items-center p-4`}>
          <Ionicons
            name="person-circle-outline"
            size={120}
            color={theme.colors.greyD1}
          />
          <Text style={tw`text-2xl font-bold text-gray-800 mt-4 mb-2`}>
            Welcome to PropertyApp
          </Text>
          <Text style={tw`text-gray-600 text-center mb-8`}>
            Sign in to access your profile and manage your bookings
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-600 px-8 py-3 rounded-lg`}
            onPress={handleLogin}
          >
            <Text style={tw`text-white font-semibold text-lg`}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        <View style={tw`p-4`}>
          <View style={tw`items-center mb-6`}>
            {currentUser.avatar ? (
              <Image
                source={{ uri: currentUser.avatar }}
                style={tw`w-24 h-24 rounded-full mb-4`}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={120}
                color={theme.colors.greyD1}
              />
            )}
            <Text style={tw`text-2xl font-bold text-gray-800`}>
              {currentUser.name}
            </Text>
            <Text style={tw`text-gray-600`}>{currentUser.email}</Text>
            <Text style={tw`text-gray-600`}>{currentUser.phone}</Text>
          </View>

          <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
            <Text style={tw`text-lg font-semibold mb-4`}>Account Settings</Text>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Edit Profile", "Coming soon");
              }}
              style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}
            >
              <Text style={tw`text-gray-700`}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.grey6B} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Change Password", "Coming soon");
              }}
              style={tw`flex-row items-center justify-between py-3 border-b border-gray-100`}
            >
              <Text style={tw`text-gray-700`}>Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.grey6B} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Notification Settings", "Coming soon");
              }}
              style={tw`flex-row items-center justify-between py-3`}
            >
              <Text style={tw`text-gray-700`}>Notification Settings</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.grey6B} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={tw`bg-red-500 rounded-lg p-4 items-center`}
            onPress={handleLogout}
          >
            <Text style={tw`text-white font-semibold`}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
