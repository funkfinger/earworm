# DeWorm App Implementation Plan

Based on a review of the project documentation and reference implementation, this document outlines a comprehensive implementation plan for the DeWorm app - a charming mobile-first application that helps users cure earworms by playing replacement songs from a curated Spotify playlist, all guided by the mascot "QT".

## Architecture Overview

```mermaid
graph TD
    A[Frontend - Next.js] --> B[Spotify Auth API]
    A --> C[Song Search API]
    A --> D[Playback API]
    A --> E[User History API]
    B & C & D & E --> F[AWS Lambda Functions]
    F --> G[DynamoDB]
    A --> H[Spotify Web Playback SDK]
```

## Implementation Phases

### Phase 1: Core App Structure & UI

1. Set up Next.js project with proper configuration
2. Implement hand-drawn UI components following the reference implementation
3. Create responsive layouts for all screens in the user flow
4. Implement animations and transitions

### Phase 2: Spotify Integration

1. Set up Spotify developer account and application
2. Implement authentication flow with Spotify API
3. Integrate Spotify Web Playback SDK for song playback
4. Implement song search functionality

### Phase 3: Backend & Database

1. Set up AWS Amplify project
2. Configure DynamoDB tables for:
   - User records
   - Earworm history
   - Replacement song effectiveness
3. Implement API routes for data storage and retrieval
4. Set up serverless functions for business logic

### Phase 4: Testing & Refinement

1. Write Jest unit tests for components and functions
2. Create Playwright E2E tests for user flows
3. Implement error handling and edge cases
4. Add analytics tracking

### Phase 5: Deployment & Optimization

1. Configure CI/CD with GitHub Actions
2. Set up AWS Amplify hosting
3. Configure domain (deworm.us)
4. Performance optimization
5. Implement legal requirements (privacy policy, cookie consent)

## Technical Considerations

### Data Model

```mermaid
erDiagram
    Users {
        string user_id PK
        string spotify_id
        date created_at
        date last_login
    }
    EarwormHistory {
        string history_id PK
        string user_id FK
        string earworm_song_id
        string replacement_song_id
        boolean was_effective
        date created_at
    }
    SongEffectiveness {
        string song_id PK
        int times_used
        int times_effective
        float effectiveness_rate
    }
    Users ||--o{ EarwormHistory : has
    EarwormHistory }o--|| SongEffectiveness : tracks
```

### Spotify Integration Details

The app will use the Spotify Web Playback SDK as specified, avoiding the deprecated preview functionality. This requires:

1. Implementing proper authentication scopes:

   - `streaming`
   - `user-read-email`
   - `user-read-private`
   - `user-read-playback-state`
   - `user-modify-playback-state`

2. Creating a Web Playback instance when the user is authenticated
3. Managing playback transfers between devices

### Hand-drawn UI Implementation

The UI will use techniques from handdrawn.css with Tailwind utility classes to create:

- Squiggly borders
- Hand-written text styles
- Playful button and input styles
- Animated elements with bounce and wiggle effects

## User Flow

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Spotify
    participant Database

    User->>App: Opens app
    App->>User: Shows splash screen
    App->>User: Shows welcome screen
    User->>App: Clicks "Let's Go!"
    App->>User: Shows Spotify login screen
    User->>Spotify: Authenticates
    Spotify->>App: Returns auth token
    App->>User: Shows search screen
    User->>App: Searches for earworm song
    App->>Spotify: Queries song
    Spotify->>App: Returns search results
    App->>User: Displays search results
    User->>App: Selects earworm song
    App->>Spotify: Gets replacement song from playlist
    App->>User: Shows playback screen
    User->>App: Plays replacement song
    User->>App: Confirms listening
    App->>User: Shows confirmation screen
    User->>App: Provides feedback (worked/didn't work)
    App->>Database: Stores effectiveness data
    App->>User: Returns to search screen
```

## Component Structure

```mermaid
graph TD
    A[HomePage] --> B[SplashScreen]
    A --> C[WelcomeScreen]
    A --> D[SpotifyLoginScreen]
    A --> E[SearchScreen]
    A --> F[PlaybackScreen]
    A --> G[ConfirmationScreen]

    H[UI Components] --> I[Button]
    H --> J[Input]
    H --> K[ThoughtBubble]
    H --> L[HandWritten]
    H --> M[Worm/QT]

    N[Context] --> O[AppContext]

    E --> P[SpotifyAPI]
    F --> P
```

## Key Features to Implement

1. **Spotify Authentication**

   - Implement OAuth flow
   - Store tokens securely
   - Handle token refresh

2. **Song Search**

   - Real-time search with Spotify API
   - Display album art and artist information
   - Handle search errors gracefully

3. **Playback**

   - Initialize Spotify Web Playback SDK
   - Control playback (play, pause)
   - Display playback progress
   - Handle playback errors

4. **User History**

   - Track earworm and replacement songs
   - Store effectiveness data
   - Avoid repeating ineffective replacements

5. **Analytics**
   - Track most common earworms
   - Measure replacement effectiveness
   - Monitor user engagement

## Implementation Decisions

Based on project requirements and planning discussions, the following implementation decisions have been made:

### Song Selection

- Replacement songs will be played exclusively from the specified Spotify playlist: https://open.spotify.com/playlist/0E9WYGYWZBqfmp6eJ0Nl1t
- Any new earworm songs that users report will be added to this playlist for future use

### Effectiveness Tracking

- A simple yes/no response system will be used to track the effectiveness of replacement songs
- This data will be stored to improve future recommendations

### Database

- A simple database interface will be implemented using Amazon DynamoDB
- The database will track user history, earworm frequency, and replacement song effectiveness

### Authentication

- Spotify OAuth will be used exclusively for authentication (no separate user creation)
- The architecture will be designed to support Apple Music integration in the future

### User Interface

- The existing mascot SVG (public/images/mascot.svg) will be used throughout the app
- Standard cookie consent mechanisms will be implemented to comply with privacy regulations
- The UI will follow the hand-drawn aesthetic specified in the design requirements

### Technical Notes

- Ensure all code is compatible with Next.js 15.2.3
- Use the Spotify Web Playback SDK instead of the deprecated preview functionality
- Implement proper callback URLs for Spotify authentication
