import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { debounce } from "lodash";
import React, { useCallback, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { usePropertyStore } from "../store/propertyStore";

export const SearchBar: React.FC = () => {
  const [localQuery, setLocalQuery] = useState("");
  const { setSearchQuery } = usePropertyStore();

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    [setSearchQuery]
  );

  const handleSearch = (text: string) => {
    setLocalQuery(text);
    debouncedSearch(text);
  };

  const clearSearch = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <View
      style={tw`flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mx-4 mb-4`}
    >
      <Ionicons
        name="search"
        size={20}
        color={theme.colors.grey666}
        style={tw`mr-3`}
      />
      <TextInput
        style={tw`flex-1 text-base`}
        placeholder="Search properties..."
        value={localQuery}
        onChangeText={handleSearch}
        placeholderTextColor={theme.colors.grey666}
      />
      {localQuery.length > 0 && (
        <TouchableOpacity onPress={clearSearch}>
          <Ionicons
            name="close-circle"
            size={20}
            color={theme.colors.grey666}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
