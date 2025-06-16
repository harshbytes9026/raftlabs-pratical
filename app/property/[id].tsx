import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { DatePickerModal } from "../../components/DatePickerModal";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { api } from "../../services/api";
import { useBookingStore } from "../../store/bookingStore";
import { useUserStore } from "../../store/userStore";
import { Booking } from "../../types";

const { width } = Dimensions.get("window");

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const { addBooking } = useBookingStore();
  const { user } = useUserStore();

  const {
    data: property,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: () => api.getProperty(id!),
    enabled: !!id,
  });

  // Fetch existing bookings for this property
  const { data: existingBookings = [] } = useQuery({
    queryKey: ["property-bookings", id],
    queryFn: () => api.getPropertyBookings(id!),
    enabled: !!id,
  });

  const bookingMutation = useMutation({
    mutationFn: api.createBooking,
    onSuccess: (newBooking) => {
      addBooking(newBooking);
      Alert.alert(
        "Booking Confirmed!",
        "Your booking has been confirmed. Check your bookings tab for details.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    },
    onError: () => {
      Alert.alert("Error", "Failed to create booking. Please try again.");
    },
  });

  const handleBookNow = () => {
    if (!user) {
      Alert.alert("Login Required", "Please log in to make a booking.");
      return;
    }

    if (!property) return;

    setIsDatePickerVisible(true);
  };

  const handleDateConfirm = (checkIn: string, checkOut: string) => {
    if (!property || !user) return;

    // Check for booking conflicts
    const hasConflict = existingBookings.some((booking: Booking) => {
      const bookingStart = new Date(booking.checkIn);
      const bookingEnd = new Date(booking.checkOut);
      const newStart = new Date(checkIn);
      const newEnd = new Date(checkOut);

      return (
        (newStart >= bookingStart && newStart <= bookingEnd) ||
        (newEnd >= bookingStart && newEnd <= bookingEnd) ||
        (newStart <= bookingStart && newEnd >= bookingEnd)
      );
    });

    if (hasConflict) {
      Alert.alert(
        "Booking Conflict",
        "This property is already booked for the selected dates. Please choose different dates."
      );
      return;
    }

    // Calculate total price based on number of days
    const days = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const totalPrice = property.price * days;

    Alert.alert(
      "Confirm Booking",
      `Book ${property.title} for $${totalPrice} (${days} days)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Book Now",
          onPress: () => {
            bookingMutation.mutate({
              propertyId: property.id,
              userId: user.id,
              checkIn,
              checkOut,
              guests: 2,
              totalPrice,
              status: "confirmed" as const,
            });
          },
        },
      ]
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !property) {
    return (
      <ErrorMessage
        message="Failed to load property details"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      mode={Platform.OS === "ios" ? "padding" : "margin"}
      style={tw`flex-1 bg-white`}
    >
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={tw`relative`}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.floor(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentImageIndex(index);
            }}
          >
            {property.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={[tw`h-64`, { width }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Image Indicator */}
          <View
            style={tw`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex-row`}
          >
            {property.images.map((_, index) => (
              <View
                key={index}
                style={[
                  tw`w-2 h-2 rounded-full mx-1`,
                  index === currentImageIndex
                    ? tw`bg-white`
                    : tw`bg-white opacity-50`,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Property Info */}
        <View style={tw`p-4`}>
          <View style={tw`flex-row justify-between items-start mb-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
                {property.title}
              </Text>
              <View style={tw`flex-row items-center mb-2`}>
                <Ionicons
                  name="location"
                  size={16}
                  color={theme.colors.grey666}
                />
                <Text style={tw`text-gray-600 ml-1`}>
                  {property.location.address}, {property.location.city},{" "}
                  {property.location.state}
                </Text>
              </View>
            </View>
            <Text style={tw`text-2xl font-bold text-blue-600`}>
              ${property.price}/mo
            </Text>
          </View>

          {/* Property Details */}
          <View
            style={tw`flex-row justify-between items-center py-4 border-t border-b border-gray-200`}
          >
            <View style={tw`items-center`}>
              <Ionicons name="bed" size={24} color={theme.colors.primary} />
              <Text style={tw`text-gray-800 font-semibold mt-1`}>
                {property.bedrooms}
              </Text>
              <Text style={tw`text-gray-600 text-sm`}>Bedrooms</Text>
            </View>
            <View style={tw`items-center`}>
              <Ionicons name="water" size={24} color={theme.colors.primary} />
              <Text style={tw`text-gray-800 font-semibold mt-1`}>
                {property.bathrooms}
              </Text>
              <Text style={tw`text-gray-600 text-sm`}>Bathrooms</Text>
            </View>
            <View style={tw`items-center`}>
              <Ionicons name="resize" size={24} color={theme.colors.primary} />
              <Text style={tw`text-gray-800 font-semibold mt-1`}>
                {property.area}
              </Text>
              <Text style={tw`text-gray-600 text-sm`}>Sq Ft</Text>
            </View>
            <View style={tw`items-center`}>
              <Ionicons
                name="star"
                size={24}
                color={theme.colors.warningFFD700}
              />
              <Text style={tw`text-gray-800 font-semibold mt-1`}>
                {property.rating}
              </Text>
              <Text style={tw`text-gray-600 text-sm`}>
                ({property.reviews})
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={tw`py-4`}>
            <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>
              Description
            </Text>
            <Text style={tw`text-gray-600 leading-6`}>
              {property.description}
            </Text>
          </View>

          {/* Features */}
          <View style={tw`py-4`}>
            <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>
              Features
            </Text>
            <View style={tw`flex-row flex-wrap`}>
              {property.features.map((feature, index) => (
                <View
                  key={index}
                  style={tw`bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2`}
                >
                  <Text style={tw`text-gray-600`}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Map */}
          <View style={tw`py-4`}>
            <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>
              Location
            </Text>
            <View style={tw`h-48 rounded-lg overflow-hidden`}>
              <MapView
                style={tw`flex-1`}
                initialRegion={{
                  latitude: property.location.coordinates.latitude,
                  longitude: property.location.coordinates.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: property.location.coordinates.latitude,
                    longitude: property.location.coordinates.longitude,
                  }}
                  title={property.title}
                />
              </MapView>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={tw`p-4 bg-white border-t border-gray-200`}>
        <TouchableOpacity
          style={tw`bg-blue-600 py-4 rounded-lg`}
          onPress={handleBookNow}
        >
          <Text style={tw`text-white text-center font-semibold text-lg`}>
            Book Now
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onConfirm={handleDateConfirm}
        existingBookings={existingBookings}
      />
    </SafeAreaView>
  );
}
