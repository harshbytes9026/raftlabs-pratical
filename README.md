# Property Listing App

A React Native mobile application for browsing and booking properties. Built with Expo, TypeScript, and TanStack Query.

## Features

- Browse property listings with detailed information
- Search properties by location and features
- View property details including images, amenities, and pricing
- Calendar-based booking system
- User authentication (login/register)
- Profile management
- Booking history

### Detailed Feature Breakdown

1. **Property Browsing**
   - Grid and list view options
   - Filter by price range, amenities, and location
   - Sort by price, rating, or newest
   - Infinite scroll pagination

2. **Property Details**
   - High-quality image gallery
   - Detailed property information
   - Amenities list with icons
   - Location map integration
   - Similar properties suggestions

3. **Booking System**
   - Interactive calendar for date selection
   - Real-time availability checking
   - Price calculation based on duration
   - Guest count selection
   - Booking confirmation and history

4. **User Features**
   - Secure authentication
   - Profile customization
   - Booking management
   - Favorite properties
   - Search history

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Android Studio (for Android emulator)
- Expo CLI (`npm install -g expo-cli`)

### Required Android Studio Components
- Android SDK
- Android Virtual Device (AVD) Manager
- Android Emulator
- Platform Tools

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd property-listing-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Start the JSON Server (in a separate terminal):
```bash
npm run server
# or
yarn server
```

## Running on Android Emulator

1. Make sure you have Android Studio installed and an Android Virtual Device (AVD) set up.

2. Start your Android emulator from Android Studio:
   - Open Android Studio
   - Click on "Tools" > "Device Manager"
   - Click the play button next to your virtual device

3. In the terminal where you started the Expo development server:
   - Press 'a' to open the app in the Android emulator
   - Or scan the QR code with the Expo Go app on your physical device

### Troubleshooting Android Emulator
- If the emulator is slow, try enabling hardware acceleration
- Make sure you have enough RAM allocated to the emulator
- Try using a lower API level for better performance
- Clear the emulator's cache if you encounter issues

## Project Structure

```
property-listing-app/
├── app/                    # Main application code
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── home.tsx       # Home screen with property listings
│   │   ├── search.tsx     # Search and filter properties
│   │   ├── bookings.tsx   # User's booking history
│   │   └── profile.tsx    # User profile and settings
│   ├── components/        # Reusable components
│   │   ├── PropertyCard.tsx
│   │   ├── DatePickerModal.tsx
│   │   └── LoadingSpinner.tsx
│   └── services/          # API and other services
│       ├── api.ts         # API client and endpoints
│       └── queryClient.ts # React Query configuration
├── assets/                # Static assets
│   └── images/           # Image assets
├── types/                # TypeScript type definitions
│   └── index.ts         # Shared type definitions
└── store/               # State management
    ├── propertyStore.ts # Property-related state
    ├── bookingStore.ts  # Booking-related state
    └── userStore.ts     # User-related state
```

## Assumptions and Notes

1. **Authentication**:
   - The app uses a simple email/password authentication system
   - Passwords are stored in plain text (not recommended for production)
   - No password reset functionality implemented
   - Session management is handled through Zustand store

2. **Data Storage**:
   - Using JSON Server for mock backend
   - No real database integration
   - Data persistence is temporary
   - API endpoints follow RESTful conventions

3. **Booking System**:
   - Calendar-based booking with date validation
   - No payment processing
   - No booking cancellation functionality
   - Booking conflicts are prevented
   - Price calculation is based on nightly rates

4. **UI/UX**:
   - Designed for mobile screens
   - Basic error handling
   - Loading states for async operations
   - Responsive design using Tailwind CSS
   - Consistent color scheme and typography

## Development Notes

1. **API Base URL**:
   - The app uses a local JSON Server instance
   - Update `API_BASE_URL` in `services/api.ts` if needed
   - Default port is 3000
   - API endpoints are prefixed with `/api`

2. **TypeScript**:
   - Strict type checking enabled
   - Custom types defined in `types/index.ts`
   - Proper type inference for API responses
   - Type-safe navigation with expo-router

3. **State Management**:
   - Using Zustand for global state
   - TanStack Query for server state
   - Proper state persistence
   - Optimistic updates for better UX

## Testing the App

1. **Login Credentials**:
   - Email: harsh@yopmail.com
   - Password: Test@123

2. **Sample Properties**:
   - The app comes with sample property data
   - New properties can be added through the JSON Server
   - Properties include images, descriptions, and pricing
   - Sample bookings are included

3. **Testing Scenarios**:
   - User registration and login
   - Property search and filtering
   - Booking creation and management
   - Profile updates
   - Error handling

## Known Limitations

1. No offline support
2. No image upload functionality
3. No real-time updates
4. Limited error handling
5. No push notifications
6. No payment integration
7. No multi-language support
8. No dark mode
9. Limited accessibility features

## Future Improvements

1. Implement proper authentication with JWT
2. Add image upload for property listings
3. Implement push notifications for booking updates
4. Add payment processing
5. Implement offline support
6. Add property owner dashboard
7. Implement real-time chat between users
8. Add multi-language support
9. Implement dark mode
10. Add comprehensive accessibility features
11. Implement analytics and tracking
12. Add automated testing
13. Implement CI/CD pipeline
14. Add performance monitoring
15. Implement caching strategy
