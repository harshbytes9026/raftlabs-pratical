import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Property } from "../types";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };

  return (
    <TouchableOpacity
      style={[
        tw`bg-white rounded-lg mb-4 mx-4 overflow-hidden`,
        {
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4, // For Android
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: property.images[0] }}
        style={tw`w-full h-48`}
        resizeMode="cover"
      />

      <View style={tw`p-4 bg-gray-100`}>
        <View style={tw`flex-row justify-between items-start mb-2`}>
          <Text
            style={tw`text-lg font-bold text-gray-800 flex-1`}
            numberOfLines={1}
          >
            {property.title}
          </Text>
          <Text style={tw`text-lg font-bold text-blue-600 ml-2`}>
            ${property.price}/mo
          </Text>
        </View>

        <View style={tw`flex-row items-center mb-2`}>
          <Ionicons
            name="location-outline"
            size={16}
            color={theme.colors.grey666}
          />
          <Text style={tw`text-gray-600 ml-1 flex-1`} numberOfLines={1}>
            {property.location.address}, {property.location.city}
          </Text>
        </View>

        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`flex-row items-center mr-4`}>
              <Ionicons
                name="bed-outline"
                size={16}
                color={theme.colors.grey666}
              />
              <Text style={tw`text-gray-600 ml-1`}>{property.bedrooms}</Text>
            </View>
            <View style={tw`flex-row items-center mr-4`}>
              <Ionicons
                name="water-outline"
                size={16}
                color={theme.colors.grey666}
              />
              <Text style={tw`text-gray-600 ml-1`}>{property.bathrooms}</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Ionicons
                name="resize-outline"
                size={16}
                color={theme.colors.grey666}
              />
              <Text style={tw`text-gray-600 ml-1`}>{property.area} sqft</Text>
            </View>
          </View>

          <View style={tw`flex-row items-center`}>
            <Ionicons
              name="star"
              size={16}
              color={theme.colors.warningFFD700}
            />
            <Text style={tw`text-gray-600 ml-1`}>
              {property.rating} ({property.reviews})
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
