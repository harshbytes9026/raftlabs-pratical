import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <View style={tw`flex-1 justify-center items-center p-4`}>
      <Ionicons
        name="alert-circle-outline"
        size={64}
        color={theme.colors.error}
      />
      <Text
        style={tw`text-lg font-semibold text-gray-800 mt-4 mb-2 text-center`}
      >
        Oops! Something went wrong
      </Text>
      <Text style={tw`text-gray-600 text-center mb-6`}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={tw`bg-blue-600 px-6 py-3 rounded-lg`}
          onPress={onRetry}
        >
          <Text style={tw`text-white font-semibold`}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
