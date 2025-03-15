# Product Requirements Document (PRD)

## Project Overview
**Project Name:** Meal Logging & Challenges Web App (Personal Edition)
**Created By:** Nick
**Date:** May 18, 2023

## Executive Summary
A personal web app to track meals out, store restaurant details, rate each dish (and certain aspects such as price-value, taste, vibe), and see progress toward manually defined challenges.

## Target Audience
Single user (personal application) with potential for future expansion.

## Objectives
1. **Simplified Meal Tracking:** Provide a straightforward, single-user interface to log places, dishes, and ratings.
2. **Dish Ratings & Properties:** Allow rating of each dish along with important attributes (price-value, taste, vibe).
3. **Challenges & Gamification (Manually Defined):** Implement a simple mechanism for "challenges" (e.g., trying multiple cuisines), and show progress.
4. **Google Maps Integration (Search):** Quickly select restaurant details via Google Maps/Places search (no embedded map needed).
5. **Minimal & Functional Design:** Adopt a lightweight UI inspired by Airbnb's design language, focusing on clarity and ease of use.

## User Stories
1. As the sole user, I want to see my recent meal entries on a home page, so I can recall where I ate last.
2. As the sole user, I want to add a new entry by searching for the restaurant using Google Places, so I don't have to manually type details.
3. As the sole user, I want to rate a dish in several categories (overall, price-value, taste, vibe) so that I can remember my impression more comprehensively.
4. As the sole user, I want to see how each new entry contributes to my manually defined challenges so that I stay motivated to try new cuisines or achieve certain goals.
5. As the sole user, I want a minimalist yet visually appealing interface that resembles Airbnb's style language for an enjoyable logging experience.

## Functional Requirements
### Core Features (MVP)
1. **Single-User Setup (No Auth Required)**
   - Since you will be the only user, no sign-in or sign-out functionality is needed for the initial version.

2. **Home Page (Dashboard)**
   - Recent Meals: Display a list of your most recent meal entries, including restaurant name and date.
   - Challenges Overview: Show each defined challenge and a progress indicator (e.g., "3/10 cuisines tried").
   - Add New Entry: Prominent button to create a new log entry.

3. **Add New Entry Flow**
   1. **Select a Place (Google Maps Search):**
      - Use Google Places autocomplete to find a restaurant.
      - Store and link relevant info (place name, address, Google Maps URL).
   2. **Add Dishes:**
      - For each dish, you can enter:
        - Dish name (text)
        - Photo (image upload; stored directly in the database for simplicity)
        - Overall rating (0–10)
        - Price-value rating (0–10)
        - Taste rating (0–10)
        - Vibe rating (0–10)
        - Optional comment/description (text)
   3. **Submit Entry:**
      - All dish data is saved to the database, associated with the selected place.

4. **Challenges Tracking**
   - A simple backend function checks whether the new entry impacts any of the manually defined challenges (e.g., increments a cuisine count if it matches the challenge criteria).
   - Updated challenge progress is displayed on the home page.

5. **Data Management**
   - Database: Since there is only one user, a simple relational or NoSQL database table/collection for storing entries.
   - Image Storage: Store images directly in the database for now (e.g., as base64 blobs).
   - No Additional Exports/Imports: No CSV or external data imports needed.

### Detailed Functional Requirements
1. **Google Maps/Places Autocomplete:**
   - Provide a text field that auto-completes restaurant names/addresses.
   - After selection, store the place name, place ID, address, and URL if available.

2. **Dish Logging:**
   - Allow uploading multiple dishes per entry, each with:
     - Dish name
     - Photo
     - Ratings: overall (0–10), price-value (0–10), taste (0–10), vibe (0–10)
     - Optional description
   - Store dish data under a single "entry" object in the database.

3. **Challenges Tracking:**
   - Maintain a set of manually defined challenges (e.g., "Try 10 different cuisines," "Visit top 5 Chinese restaurants").
   - Each challenge has criteria (e.g., a list of cuisines or specific place IDs).
   - When a new entry is saved, the system checks if it matches any challenge criteria (e.g., cuisine type, place ID) and updates progress accordingly.

4. **Database & Data Structures:**
   - Entries Table/Collection could include:
     - Entry ID (auto-generated)
     - Restaurant info (name, address, Google Maps link)
     - List of dishes (with above attributes)
     - Creation date/time (for sorting)
   - Challenges Table/Collection (manually curated, updated in code if necessary).

5. **UI/UX Requirements:**
   - Minimal Design: Clean layout resembling Airbnb's neutral color palette, typography, and spacing.
   - Recent Entries: Display them in a simple list or grid with thumbnail images.
   - Challenges Overview: Could be displayed as badges, progress bars, or counters.
   - Smooth Flow: Simple navigation from home page → "Add Entry" → "Submit" → back to home.

## Non-Functional Requirements
1. **Performance:**
   - Adding an entry with multiple dishes should be quick (aim < 2 seconds total).
   - Image uploads stored directly in the database (initially fine for a single user).

2. **Security:**
   - Currently not required. The app can run on a private environment or behind a simple password if desired.

3. **Usability:**
   - Focus on minimal clicks: Auto-complete for restaurant selection, straightforward dish input.
   - Clear fields for the ratings to avoid confusion.

4. **Compatibility:**
   - Modern web browsers (Chrome, Firefox, Safari, Edge)

5. **Reliability:**
   - Handle any Google Places errors gracefully (e.g., no results found).
   - If the Google Places API is unavailable, allow manual text input as fallback.

6. **Maintainability:**
   - Code structure should enable easy updates to challenges, rating categories, or additional fields in the future.

## Technical Requirements
- **Frontend:** Next.js 14 App Router, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **APIs:** Google Maps/Places API
- **Authentication:** None required for MVP (single user)
- **Database:** Firebase Firestore for data storage and simple image storage

## User Interface
1. **Home Page/Dashboard:**
   - Recent meals list/grid
   - Challenge progress indicators
   - Add new entry button

2. **Add Entry Page:**
   - Restaurant search with Google Places autocomplete
   - Dish entry form with photo upload and rating inputs
   - Submit button

3. **Entry Detail Page (optional):**
   - Display restaurant details
   - List of all dishes with ratings and photos
   - Link back to home

## Data Models
1. **Entry**
   - id: string
   - restaurantName: string
   - restaurantAddress: string
   - googlePlaceId: string (optional)
   - googleMapsUrl: string (optional)
   - dateVisited: timestamp
   - dishes: Array of Dish objects

2. **Dish**
   - id: string
   - name: string
   - photo: string (base64 encoded)
   - overallRating: number (0-10)
   - priceValueRating: number (0-10)
   - tasteRating: number (0-10)
   - vibeRating: number (0-10)
   - comments: string (optional)

3. **Challenge**
   - id: string
   - name: string
   - description: string
   - type: string (e.g., "cuisine", "restaurant")
   - criteria: Array (e.g., cuisines to try or restaurant IDs)
   - progress: number
   - goal: number
   - completed: boolean

## Project Timeline
1. **Week 1:** Setup project structure, implement Google Places integration
2. **Week 2:** Build entry creation flow and database structure
3. **Week 3:** Implement challenge tracking system
4. **Week 4:** Design and implement UI, testing and refinement

## Success Metrics
Since this is a personal tool, success can be judged by:
1. **Frequency of Use:** How consistently you log your meals.
2. **Challenge Completion:** Are the manually defined challenges motivating you?
3. **Simplicity of Flow:** How quickly can you log new entries without friction?

## Potential Future Enhancements
1. **User Authentication & Multi-User Expansion:** If you decide to let others join, add sign-up/log-in.
2. **Additional Rating Categories:** For example, "presentation," "service," etc.
3. **Social Features:** Share entries or challenge achievements with friends.
4. **Analytics & Visualization:** Generate charts of favorite restaurants, average ratings over time, etc.
5. **Custom Challenge Creation UI:** Add a simple form to create new challenges without editing the code.
6. **Advanced Image Handling:** Use cloud storage (S3, Cloudinary) for large or numerous images.

## Final Notes
- This PRD is tailored for a single-user MVP.
- The Google Places integration should be set up in a limited capacity (autocomplete only).
- Rating categories (overall, price-value, taste, vibe) are each on a 0–10 scale.
- Minimal design approach: streamlined interface with Airbnb-style color palette and typography, focusing on ease of logging rather than detailed aesthetics. 
