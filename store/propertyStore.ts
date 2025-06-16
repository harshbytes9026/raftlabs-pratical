import { create } from "zustand";
import { Property } from "../types";

interface PropertyState {
  searchQuery: string;
  filteredProperties: Property[];
  selectedProperty: Property | null;
  loading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  setFilteredProperties: (properties: Property[]) => void;
  setSelectedProperty: (property: Property | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSearch: () => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  searchQuery: "",
  filteredProperties: [],
  selectedProperty: null,
  loading: false,
  error: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilteredProperties: (properties) =>
    set({ filteredProperties: properties }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearSearch: () => set({ searchQuery: "", filteredProperties: [] }),
}));
