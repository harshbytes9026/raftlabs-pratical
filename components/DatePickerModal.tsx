import { theme } from "@/theme";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import tw from "twrnc";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (checkIn: string, checkOut: string) => void;
  existingBookings?: { checkIn: string; checkOut: string }[];
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
  existingBookings = [],
}) => {
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");

  // Convert existing bookings to marked dates format
  const markedDates = existingBookings.reduce((acc, booking) => {
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      acc[dateStr] = { marked: true, dotColor: "red" };
    }
    return acc;
  }, {} as Record<string, { marked: boolean; dotColor: string }>);

  // Add selected dates to marked dates
  if (checkIn) {
    markedDates[checkIn] = {
      ...markedDates[checkIn],
      selected: true,
      selectedColor: theme.colors.primary,
    };
  }
  if (checkOut) {
    markedDates[checkOut] = {
      ...markedDates[checkOut],
      selected: true,
      selectedColor: theme.colors.primary,
    };
  }

  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = new Date(day.dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return; // Can't select past dates
    }

    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      setCheckIn(day.dateString);
      setCheckOut("");
    } else {
      // Complete selection
      const startDate = new Date(checkIn);
      if (selectedDate < startDate) {
        setCheckIn(day.dateString);
        setCheckOut("");
      } else {
        setCheckOut(day.dateString);
      }
    }
  };

  const handleConfirm = () => {
    if (checkIn && checkOut) {
      onConfirm(checkIn, checkOut);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-end bg-black/50`}>
        <View style={tw`bg-white rounded-t-3xl p-6`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>
              Select Dates
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={tw`text-blue-600 font-semibold`}>Close</Text>
            </TouchableOpacity>
          </View>

          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            minDate={new Date().toISOString().split("T")[0]}
            markingType="period"
            theme={{
              selectedDayTextColor: theme.colors.primary,
            }}
          />

          <View style={tw`mt-4 flex-row justify-between items-center`}>
            <View>
              <Text style={tw`text-gray-600`}>Check-in</Text>
              <Text style={tw`text-lg font-semibold`}>
                {checkIn
                  ? new Date(checkIn).toLocaleDateString()
                  : "Select date"}
              </Text>
            </View>
            <View>
              <Text style={tw`text-gray-600`}>Check-out</Text>
              <Text style={tw`text-lg font-semibold`}>
                {checkOut
                  ? new Date(checkOut).toLocaleDateString()
                  : "Select date"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={tw`mt-6 bg-blue-600 py-4 rounded-lg ${
              !checkIn || !checkOut ? "opacity-50" : ""
            }`}
            onPress={handleConfirm}
            disabled={!checkIn || !checkOut}
          >
            <Text style={tw`text-white text-center font-semibold text-lg`}>
              Confirm Dates
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
