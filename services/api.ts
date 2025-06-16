import { Booking, Property, User } from "@/types";

const API_BASE_URL = "http://localhost:3001";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export const api = {
  // Properties
  getProperties: async (): Promise<Property[]> => {
    const response = await fetch(`${API_BASE_URL}/properties`);
    if (!response.ok) throw new Error("Failed to fetch properties");
    return response.json();
  },

  getProperty: async (id: string): Promise<Property> => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    if (!response.ok) throw new Error("Failed to fetch property");
    return response.json();
  },

  searchProperties: async (query: string): Promise<Property[]> => {
    const response = await fetch(`${API_BASE_URL}/properties?q=${query}`);
    if (!response.ok) throw new Error("Failed to search properties");
    return response.json();
  },

  // Bookings
  getBookings: async (userId: string): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch bookings");
    return response.json();
  },

  getPropertyBookings: async (propertyId: string): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings?propertyId=${propertyId}`);
    if (!response.ok) throw new Error("Failed to fetch property bookings");
    return response.json();
  },

  createBooking: async (
    booking: Omit<Booking, "id" | "createdAt">
  ): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...booking,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) throw new Error("Failed to create booking");
    return response.json();
  },

  // Users
  getUser: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },

  // Authentication
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users?email=${credentials.email}`);
    if (!response.ok) {
      throw new Error("Invalid email or password");
    }
    const users = await response.json();
    const user = users[0];
    if (!user || user.password !== credentials.password) {
      throw new Error("Invalid email or password");
    }
    return user;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    // Check if email already exists
    const response = await fetch(`${API_BASE_URL}/users?email=${credentials.email}`);
    if (!response.ok) {
      throw new Error("Registration failed");
    }
    const existingUsers = await response.json();
    if (existingUsers.length > 0) {
      throw new Error("Email already registered");
    }

    // Create new user
    const newUser = {
      id: `user${Date.now()}`,
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      phone: credentials.phone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.name)}&background=random`,
      createdAt: new Date().toISOString(),
    };

    const createResponse = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!createResponse.ok) {
      throw new Error("Failed to create account");
    }

    return newUser;
  },
};
