# DeWorm App - TODO List

## Authentication & User Management

- [x] Implement Spotify authentication
- [x] Limit Spotify permissions to only email and public playlist modification
- [ ] Add Apple Music authentication
- [ ] Create user profile management
- [ ] Implement user session persistence
- [ ] Add logout functionality
- [ ] Create user database schema

## Core Features

- [ ] Design and implement the landing page with QT mascot
- [ ] Create the earworm input interface
- [ ] Implement breathing/visualization exercise component
- [x] Build song search functionality
- [x] Develop playlist management for earworm replacements
- [x] Implement song playback functionality
  - [x] Create a RandomSongPlayer component for 30-second previews
  - [x] Add ability to play Spotify track previews
  - [x] Implement play/pause controls
  - [x] Add volume control
  - [x] Display track information during playback
  - [x] Handle cases where preview URLs are not available
  - [x] Create RandomSongSelector for fetching random tracks
- [ ] Create history tracking for user's earworms
- [ ] Build analytics for most common earworms

## Database & Backend

- [ ] Set up database for tracking songs
- [ ] Create API endpoints for song management
- [ ] Implement counter for earworm occurrences
- [ ] Build tracking system for replacement songs
- [ ] Create user history storage
- [ ] Implement recommendation algorithm for replacement songs

## UI/UX

- [ ] Design and implement QT mascot animations
- [x] Create responsive layouts for all device sizes
- [ ] Implement accessibility features
- [x] Add loading states and transitions
- [x] Design error handling UI components
- [ ] Create onboarding flow for new users

## Testing

- [x] Set up end-to-end testing with Playwright
- [x] Implement authentication flow tests
- [x] Create tests for song input functionality
- [x] Implement tests for DynamicSearch component
- [ ] Implement tests for exercise components
- [x] Add tests for song playback
- [ ] Create tests for user history features
- [ ] Implement comprehensive API tests

## DevOps & Infrastructure

- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables for production
- [ ] Implement error logging and monitoring
- [ ] Set up database backups
- [ ] Create deployment documentation
- [ ] Implement performance monitoring

## Documentation

- [ ] Complete API documentation
- [ ] Create user guide
- [ ] Document database schema
- [ ] Add setup instructions for local development
- [ ] Create contribution guidelines

## Future Enhancements

- [ ] Implement social sharing features
- [ ] Add public leaderboard for most common earworms
- [ ] Create personalized recommendations based on user history
- [ ] Implement premium features
- [ ] Add multi-language support
- [ ] Create mobile app versions

## Current Focus

1. ~~Complete Spotify authentication flow~~ ✅
2. ~~Implement basic earworm input interface~~ ✅
3. ~~Implement DynamicSearch component with tests~~ ✅
4. ~~Implement song playback functionality~~ ✅
5. Create the exercise component
6. Set up basic user history tracking

## Notes

- Prioritize core functionality over additional features
- Ensure comprehensive test coverage for all new features
- Maintain accessibility standards throughout development

## Error Handling

- [x] Implement comprehensive error handling throughout the application
  - [x] Create a reusable ErrorBoundary component for React components
  - [x] Standardize error UI components for consistent user experience
  - [ ] Improve error logging and monitoring
  - [ ] Add user-friendly error messages for common failure scenarios
  - [ ] Implement graceful degradation for API failures

## ErrorBoundary Component Documentation

The ErrorBoundary component has been implemented to catch JavaScript errors in the component tree and display a fallback UI instead of crashing the entire application. It provides the following features:

1. **Basic Usage**:

   ```jsx
   <ErrorBoundary>
     <YourComponent />
   </ErrorBoundary>
   ```

2. **Custom Fallback UI**:

   ```jsx
   <ErrorBoundary fallback={<div>Custom error message</div>}>
     <YourComponent />
   </ErrorBoundary>
   ```

3. **Function Fallback with Error Details**:

   ```jsx
   <ErrorBoundary
     fallback={(error, reset) => (
       <div>
         <p>Error: {error.message}</p>
         <button onClick={reset}>Try again</button>
       </div>
     )}
   >
     <YourComponent />
   </ErrorBoundary>
   ```

4. **Error Logging**:
   ```jsx
   <ErrorBoundary
     onError={(error, errorInfo) => {
       // Send to error tracking service
       console.log("Error:", error);
       console.log("Component stack:", errorInfo.componentStack);
     }}
   >
     <YourComponent />
   </ErrorBoundary>
   ```

The component is fully tested and includes comprehensive documentation. An example component (`ErrorBoundaryExample.tsx`) is available to demonstrate its usage.

### Integrated Components

The ErrorBoundary has been integrated with the following components:

1. **SpotifyLoginButton**: Provides a custom fallback UI when errors occur during the Spotify login process, allowing users to retry the login without refreshing the page.

2. **Dashboard**: Wraps the entire dashboard content with an ErrorBoundary that provides a user-friendly error message and options to retry or return to the home page when unexpected errors occur.
