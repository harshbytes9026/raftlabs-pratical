import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { api } from "../../services/api";
import { useBookingStore } from "../../store/bookingStore";
import { useUserStore } from "../../store/userStore";
import { Booking, Property } from "../../types";

interface BookingWithProperty extends Booking {
  property?: Property;
}

export default function BookingsScreen() {
  const { bookings, setBookings, setLoading, setError } = useBookingStore();
  const { user } = useUserStore();
  const [isRefetching, setIsRefetching] = useState(false);
  console.log("user", user);

  const {
    data: fetchedBookings = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: () => api.getBookings(user?.id || ""),
    enabled: !!user?.id,
    onSuccess: setBookings,
    onError: (err: Error) => setError(err.message),
  });

  // Fetch property details for each booking
  const { data: properties = [] } = useQuery({
    queryKey: ["all-properties"],
    queryFn: api.getProperties,
  });

  const bookingsWithProperties: BookingWithProperty[] = bookings.map(
    (booking) => ({
      ...booking,
      property: properties.find((p) => p.id === booking.propertyId),
    })
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderBookingItem = ({ item }: { item: BookingWithProperty }) => (
    <View style={tw`bg-white rounded-lg shadow-md mx-4 mb-4 overflow-hidden`}>
      {item.property && (
        <Image
          source={{ uri: item.property.images[0] }}
          style={tw`w-full h-32`}
          resizeMode="cover"
        />
      )}

      <View style={tw`p-4 bg-gray-100`}>
        <View style={tw`flex-row justify-between items-start mb-3`}>
          <Text
            style={tw`text-lg font-bold text-gray-800 flex-1`}
            numberOfLines={1}
          >
            {item.property?.title || "Property Not Found"}
          </Text>
          <View
            style={tw`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}
          >
            <Text
              style={tw`text-xs font-medium ${
                getStatusColor(item.status).split(" ")[0]
              }`}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {item.property && (
          <View style={tw`flex-row items-center mb-2`}>
            <Ionicons
              name="location-outline"
              size={14}
              color={theme.colors.grey666}
            />
            <Text style={tw`text-gray-600 ml-1 text-sm`}>
              {item.property.location.city}, {item.property.location.state}
            </Text>
          </View>
        )}

        <View style={tw`flex-row justify-between items-center mb-3`}>
          <View>
            <Text style={tw`text-gray-600 text-sm`}>Check-in</Text>
            <Text style={tw`text-gray-800 font-semibold`}>
              {formatDate(item.checkIn)}
            </Text>
          </View>
          <View>
            <Text style={tw`text-gray-600 text-sm`}>Check-out</Text>
            <Text style={tw`text-gray-800 font-semibold`}>
              {formatDate(item.checkOut)}
            </Text>
          </View>
          <View>
            <Text style={tw`text-gray-600 text-sm`}>Guests</Text>
            <Text style={tw`text-gray-800 font-semibold`}>{item.guests}</Text>
          </View>
        </View>

        <View
          style={tw`flex-row justify-between items-center pt-3 border-t border-gray-200`}
        >
          <Text style={tw`text-lg font-bold text-blue-600`}>
            ${item.totalPrice.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={tw`flex-1 justify-center items-center py-12`}>
      <Ionicons name="calendar-outline" size={64} color={theme.colors.greyD1} />
      <Text style={tw`text-lg font-semibold text-gray-600 mt-4 mb-2`}>
        No bookings yet
      </Text>
      <Text style={tw`text-gray-500 text-center px-8`}>
        Your property bookings will appear here once you make a reservation.
      </Text>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView
        edges={["left", "right"]}
        mode={Platform.OS === "ios" ? "padding" : "margin"}
        style={tw`flex-1 bg-white`}
      >
        <View style={tw`flex-1 justify-center items-center p-4`}>
          <Ionicons
            name="person-outline"
            size={64}
            color={theme.colors.greyD1}
          />
          <Text style={tw`text-lg font-semibold text-gray-600 mt-4 mb-2`}>
            Login Required
          </Text>
          <Text style={tw`text-gray-500 text-center`}>
            Please log in to view your bookings.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load your bookings"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <SafeAreaView
      edges={["left", "right", "top"]}
      mode={Platform.OS === "ios" ? "padding" : "margin"}
      style={tw`flex-1 bg-white`}
    >
      <View style={tw`bg-white py-4 px-4`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>My Bookings</Text>
        <Text style={tw`text-gray-600 mt-1`}>
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
        </Text>
      </View>

      <FlatList
        data={bookingsWithProperties}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        keyExtractor={(item) => item.id}
        renderItem={renderBookingItem}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={async () => {
              setIsRefetching(true);
              await refetch();
              setLoading(false);
              setIsRefetching(false);
            }}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-4 pt-4`}
      />
    </SafeAreaView>
  );
}
