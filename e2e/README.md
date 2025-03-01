# End-to-End Testing Guide

This directory contains end-to-end tests for the Earworm application using Playwright.

## Test Structure

The tests are organized into several categories:

1. **Authentication Tests** (`auth.spec.ts`): Tests for login, logout, and authentication flows.
2. **Spotify Web Player Tests** (`spotify-player.spec.ts`, `spotify-player-basic.spec.ts`): Tests for the Spotify Web Player component.
3. **Random Song Selector Tests** (`random-song-selector.spec.ts`, `random-song-selector-basic.spec.ts`): Tests for the Random Song Selector component.

## Test Approaches

We use two different approaches for testing:

### 1. Full Application Tests

These tests interact with the entire application, navigating through pages and testing components in context. These tests are more comprehensive but can be more brittle due to their dependency on the full application state.

Files: `auth.spec.ts`, `spotify-player.spec.ts`, `random-song-selector.spec.ts`

### 2. Component-Specific Tests

These tests focus on testing individual components in isolation using static HTML test pages. This approach is more reliable for testing specific component behaviors without the complexity of the full application.

Files: `spotify-player-basic.spec.ts`, `random-song-selector-basic.spec.ts`

## Running Tests

To run all tests:

```bash
npm run test:e2e
```

To run specific test files:

```bash
npx playwright test e2e/spotify-player-basic.spec.ts
```

## Test Pages

The `test-pages` directory contains static HTML files that simulate different states of our components:

- `spotify-player.html`: Test page for the Spotify Web Player component
- `random-song-selector.html`: Test page for the Random Song Selector component

These pages are used by the component-specific tests to verify behavior in isolation.

## Common Issues and Troubleshooting

### 1. "Cannot perform operation; no list was loaded" Error

This error occurs when trying to perform operations on the Spotify player before a playlist or track is loaded. We've added specific error handling for this case in both components:

- In `SpotifyWebPlayer.tsx`, we added a global error handler for unhandled promise rejections.
- In `RandomSongSelector.tsx`, we added specific error handling in the `getRandomTrack` function.

### 2. Timing Issues

Many test failures are related to timing issues. We've addressed these by:

- Using appropriate wait conditions (`waitForSelector`, `waitForURL`, etc.)
- Setting reasonable timeouts
- Using the `{ waitUntil: 'networkidle' }` option for navigation

### 3. Selector Issues

When tests fail because they can't find elements, check:

- That the selectors match the actual DOM structure
- That the components have appropriate `data-testid` attributes
- That the elements are actually visible when the test tries to interact with them

## Best Practices

1. **Use data-testid attributes**: Add `data-testid` attributes to key elements in your components to make them easier to select in tests.
2. **Mock API responses**: Use Playwright's request interception to mock API responses for consistent test behavior.
3. **Test error states**: Create tests for error conditions and edge cases, not just the happy path.
4. **Isolate components**: When possible, test components in isolation to reduce test complexity and increase reliability.
5. **Keep tests independent**: Each test should be able to run independently of others.
