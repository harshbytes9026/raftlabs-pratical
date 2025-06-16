import { theme } from "@/theme";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import tw from "twrnc";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { PropertyCard } from "../../components/PropertyCard";
import { SearchBar } from "../../components/SearchBar";
import { api } from "../../services/api";
import { usePropertyStore } from "../../store/propertyStore";
import { Property } from "../../types";

export default function HomeScreen() {
  const { searchQuery, setLoading, setError } = usePropertyStore();

  const {
    data: properties = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: api.getProperties,
    onError: (err: Error) => setError(err.message),
    onSuccess: () => setError(null),
  });

  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;

    return properties.filter(
      (property: Property) =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.city
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        property.location.address
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        property.features.some((feature) =>
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [properties, searchQuery]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  if (isLoading && !isRefetching) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load properties. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  const renderEmptyComponent = () => (
    <View style={tw`flex-1 justify-center items-center py-12`}>
      <Text style={tw`text-lg font-semibold text-gray-600 mb-2`}>
        {searchQuery ? "No properties found" : "No properties available"}
      </Text>
      <Text style={tw`text-gray-500 text-center px-8`}>
        {searchQuery
          ? "Try adjusting your search terms"
          : "Check back later for new listings"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`bg-white py-4`}>
        <Text style={tw`text-2xl font-bold text-gray-800 px-4 mb-4`}>
          Find Your Perfect Place
        </Text>
        <SearchBar />
      </View>

      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-4`}
      />
    </SafeAreaView>
  );
}
