import { create } from "zustand";
import { Booking } from "../types";

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  loading: false,
  error: null,
  setBookings: (bookings) => set({ bookings }),
  addBooking: (booking) => set({ bookings: [...get().bookings, booking] }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
