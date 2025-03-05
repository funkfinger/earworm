# Testing Documentation for De Worm

This document outlines the testing approach for the De Worm application, which helps users replace songs stuck in their heads with catchy alternatives.

## Testing Structure

The project uses a comprehensive testing approach with both unit tests and end-to-end (E2E) tests:

### Unit Tests

Unit tests are located in the `src/app/__tests__/` directory and focus on testing individual components in isolation:

- `Home.test.tsx`: Tests for the home page component
- `SpotifyLogin.test.tsx`: Tests for the Spotify login page
- `Search.test.tsx`: Tests for the search functionality
- `Playback.test.tsx`: Tests for the playback page and feedback mechanism

### Mocks

Mock data and services are located in `src/app/__tests__/mocks/`:

- `spotifyService.ts`: Provides mock implementations of the Spotify service functions

### End-to-End Tests

E2E tests are located in the `e2e/tests/` directory:

- `userJourney.spec.ts`: Tests the complete user journey through the application

## Running Tests

### Unit Tests

To run unit tests:

```bash
npm test -- --config=jest.config.js
```

To run a specific test file:

```bash
npm test -- --config=jest.config.js Home.test.tsx
```

To run tests in watch mode:

```bash
npm test -- --config=jest.config.js --watch
```

### End-to-End Tests

To run E2E tests:

```bash
# Start the development server in a separate terminal
npm run dev

# Run E2E tests
npx playwright test
```

To run E2E tests with a UI:

```bash
npx playwright test --ui
```

To run a specific E2E test file:

```bash
npx playwright test userJourney.spec.ts
```

## Test Coverage

To generate a test coverage report:

```bash
npm test -- --coverage
```

The coverage report will be available in the `coverage/` directory.

## Testing Philosophy

Our testing approach follows these principles:

1. **Unit Tests**: Test individual components in isolation, mocking dependencies
2. **E2E Tests**: Test the complete user journey to ensure all components work together
3. **Mock Services**: Use mock implementations of external services (like Spotify) for predictable testing
4. **Test User Interactions**: Focus on testing user interactions and the resulting UI changes
5. **Test Edge Cases**: Include tests for error states and edge cases

## Continuous Integration

Tests are automatically run in the CI pipeline on every pull request and push to the main branch.
