# Food Logger Application

A Next.js application for logging restaurant visits, rating dishes, and completing food-related challenges.

## Features

- Search for restaurants using Google Places API
- Log restaurant visits with multiple dishes
- Rate dishes on taste, price value, and overall experience
- Track progress on food-related challenges
- View history of restaurant visits

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Firebase account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Google Places API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Set up Authentication (optional)
4. Update the Firebase security rules to allow read/write operations:
   - Go to Firestore Database > Rules
   - Copy the contents of `firebase.rules` from this project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Routes

The application uses the following API routes:

- `/api/entries/add` - Add a new restaurant visit entry
- `/api/entries/recent` - Get recent restaurant visit entries
- `/api/challenges` - Get all challenges
- `/api/challenges/update` - Update challenges based on a new entry
- `/api/places/search` - Search for restaurants using Google Places API
- `/api/places/details` - Get details for a specific restaurant

## Troubleshooting

### "Failed to save the entry" Error

If you encounter this error when trying to save a restaurant visit:

1. Check that your Firebase configuration is correct in `.env.local`
2. Verify that your Firebase security rules allow write operations
3. Check the browser console for more detailed error messages
4. Ensure that the Firestore database has been created in your Firebase project

## License

MIT
This project is licensed under the MIT License.