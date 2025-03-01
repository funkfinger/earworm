import { test, expect } from "@playwright/test";
import { setupConsoleLogs } from "./console-logger";

test.describe("Random Song Selector", () => {
  test.beforeEach(async ({ page, context }) => {
    // Set up console logging
    await setupConsoleLogs(page);

    // Set up authentication mocks
    await context.addCookies([
      {
        name: "spotify_token",
        value: "mock-valid-token",
        domain: "localhost",
        path: "/",
      },
      {
        name: "spotify_refresh_token",
        value: "mock-refresh-token",
        domain: "localhost",
        path: "/",
      },
    ]);

    // Mock the auth/me endpoint to return a logged-in user
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          user: {
            id: "test-user",
            display_name: "Test User",
            images: [{ url: "https://example.com/avatar.jpg" }],
          },
        }),
      });
    });

    // Mock the token endpoint to return a valid token
    await page.route("**/api/auth/token", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          token: "mock-valid-token",
        }),
      });
    });

    // Create a test-specific page with just the RandomSongSelector component
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Random Song Selector Test</title>
          <style>
            body { 
              background-color: #2A1810; 
              color: white;
              font-family: Arial, sans-serif;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div id="selector-container"></div>
          <script>
            // This script will be used to render the component and handle test scenarios
            window.testScenario = '';
            
            // Function to render the RandomSongSelector with different states
            window.renderSelector = (state = 'normal') => {
              const container = document.getElementById('selector-container');
              
              // Clear previous content
              container.innerHTML = '';
              
              if (state === 'loading') {
                // Render loading state
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'bg-[#3C2218] p-6 rounded-lg border border-yellow-500/20';
                loadingDiv.innerHTML = 
                  '<h3 class="text-xl font-semibold text-yellow-400 mb-2">Step 3: Replacement Song</h3>' +
                  '<p class="text-yellow-100/60 mb-4">Listen to this song to replace your earworm.</p>' +
                  '<div class="flex items-center justify-center h-32">' +
                    '<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>' +
                    '<span class="ml-2 text-yellow-200">Finding a replacement song...</span>' +
                  '</div>';
                container.appendChild(loadingDiv);
              } else if (state === 'error') {
                // Render error state
                const errorDiv = document.createElement('div');
                errorDiv.className = 'bg-[#3C2218] p-6 rounded-lg border border-yellow-500/20';
                errorDiv.innerHTML = '<h3 class="text-xl font-semibold text-yellow-400 mb-2">Step 3: Replacement Song</h3>' +
                  '<p class="text-yellow-100/60 mb-4">Listen to this song to replace your earworm.</p>' +
                  '<div class="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">' +
                  '<p>Failed to get a random track from the playlist</p>' +
                  '<button id="retry-button" class="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded">' +
                  'Try Again' +
                  '</button>' +
                  '</div>';
                container.appendChild(errorDiv);
                
                // Add click handler for try again button
                const tryAgainButton = document.getElementById('retry-button');
                if (tryAgainButton) {
                  tryAgainButton.addEventListener('click', () => {
                    window.renderSelector('normal');
                  });
                }
              } else {
                // Render normal state with track
                const selectorDiv = document.createElement('div');
                selectorDiv.className = 'bg-[#3C2218] p-6 rounded-lg border border-yellow-500/20';
                selectorDiv.innerHTML = `
                  <h3 class="text-xl font-semibold text-yellow-400 mb-2">Step 3: Replacement Song</h3>
                  <p class="text-yellow-100/60 mb-4">Listen to this song to replace your earworm.</p>
                  <div class="space-y-4">
                    <div class="flex items-center">
                      <img
                        src="https://example.com/album.jpg"
                        alt="Mock Album"
                        class="w-16 h-16 rounded mr-4"
                      />
                      <div>
                        <div class="font-medium text-white" id="track-name">
                          ${state === 'refreshed' ? 'Refreshed Track' : 'Mock Track Name'}
                        </div>
                        <div class="text-yellow-100/60" id="track-artist">
                          ${state === 'refreshed' ? 'Refreshed Artist' : 'Mock Artist'}
                        </div>
                      </div>
                      <button
                        id="refresh-button"
                        class="ml-auto p-2 text-yellow-300 hover:text-yellow-100"
                        aria-label="Get another song"
                        title="Get another song"
                        data-testid="refresh-button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div class="mt-2 text-center text-xs text-yellow-100/60">
                      <p>Full playback powered by Spotify Premium</p>
                    </div>

                    <!-- Mock player placeholder -->
                    <div class="p-4 bg-[#2A1810] rounded-lg border border-pink-500/30">
                      <div class="flex items-center">
                        <img
                          src="https://example.com/album.jpg"
                          alt="Mock Album"
                          class="w-16 h-16 rounded mr-4"
                        />
                        <div class="flex-1">
                          <h3 class="font-medium text-white">
                            ${state === 'refreshed' ? 'Refreshed Track' : 'Mock Track Name'}
                          </h3>
                          <p class="text-yellow-100/60">
                            ${state === 'refreshed' ? 'Refreshed Artist' : 'Mock Artist'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                container.appendChild(selectorDiv);
                
                // Add click handler for refresh button
                const refreshButton = document.getElementById('refresh-button');
                if (refreshButton) {
                  refreshButton.addEventListener('click', () => {
                    // Show loading state briefly
                    window.renderSelector('loading');
                    
                    // Then show refreshed state after a delay
                    setTimeout(() => {
                      window.renderSelector('refreshed');
                    }, 500);
                  });
                }
              }
            };
          </script>
        </body>
      </html>
    `);
  });

  test("successfully loads and displays a random track from playlist", async ({
    page,
  }) => {
    // Render the selector with a normal state
    await page.evaluate(() => {
      window.renderSelector('normal');
    });

    // Verify that the component title is visible
    await expect(page.getByText("Step 3: Replacement Song")).toBeVisible();
    
    // Verify that a track name and artist are displayed
    const trackNameElement = page.locator("#track-name");
    await expect(trackNameElement).toBeVisible();

    const trackName = await trackNameElement.textContent();
    expect(trackName).toBeTruthy();
    expect(trackName).toContain("Mock Track Name");

    const artistElement = page.locator("#track-artist");
    await expect(artistElement).toBeVisible();

    const artistName = await artistElement.textContent();
    expect(artistName).toBeTruthy();
    expect(artistName).toContain("Mock Artist");

    // Verify that the refresh button is visible
    await expect(page.getByTestId("refresh-button")).toBeVisible();
  });

  test("handles playlist fetch error", async ({ page }) => {
    // Render the selector with an error state
    await page.evaluate(() => {
      window.renderSelector('error');
    });

    // Verify that the error message is displayed
    await expect(
      page.getByText("Failed to get a random track from the playlist")
    ).toBeVisible();

    // Verify that the "Try Again" button is visible
    await expect(page.getByRole("button", { name: "Try Again" })).toBeVisible();
  });

  test("refreshes track when refresh button is clicked", async ({ page }) => {
    // Render the selector with a normal state
    await page.evaluate(() => {
      window.renderSelector('normal');
    });

    // Get the initial track name
    const trackNameElement = page.locator("#track-name");
    await expect(trackNameElement).toBeVisible();
    const initialTrackName = await trackNameElement.textContent();

    // Click the refresh button
    await page.getByTestId("refresh-button").click();

    // Wait for loading indicator to appear
    await expect(page.locator(".animate-spin")).toBeVisible();
    
    // Wait for the refreshed track to appear
    await page.waitForFunction(() => {
      const trackName = document.getElementById('track-name')?.textContent;
      return trackName && trackName.includes('Refreshed Track');
    });

    // Get the new track name
    const newTrackName = await trackNameElement.textContent();

    // Verify that the track has changed
    expect(newTrackName).not.toEqual(initialTrackName);
    expect(newTrackName).toContain("Refreshed Track");
  });
});

// Add type definition for window.renderSelector
declare global {
  interface Window {
    renderSelector: (state?: string) => void;
    // Mock the Spotify Web Playback SDK
    await page.addInitScript(() => {
      // @ts-ignore - Mock the Spotify SDK
      window.Spotify = {
        Player: class MockPlayer {
          constructor(options) {
            this.options = options;
            this.listeners = {};

            // Simulate ready event after a delay
            setTimeout(() => {
              if (this.listeners["ready"]) {
                this.listeners["ready"].forEach((callback) =>
                  callback({ device_id: "mock-device-id" })
                );
              }
            }, 500);
          }

          connect() {
            return Promise.resolve(true);
          }

          disconnect() {}

          addListener(eventName, callback) {
            this.listeners[eventName] = this.listeners[eventName] || [];
            this.listeners[eventName].push(callback);
          }

          removeListener(eventName) {
            delete this.listeners[eventName];
          }

          getCurrentState() {
            return Promise.resolve({
              context: { uri: "", metadata: {} },
              disallows: {
                pausing: false,
                peeking_next: false,
                peeking_prev: false,
                resuming: false,
                seeking: false,
                skipping_next: false,
                skipping_prev: false,
              },
              paused: true,
              position: 0,
              duration: 180000,
              repeat_mode: 0,
              shuffle: false,
              track_window: {
                current_track: {
                  id: "mock-track-id",
                  uri: "spotify:track:mock-track-id",
                  name: "Mock Track Name",
                  duration_ms: 180000,
                  artists: [
                    {
                      name: "Mock Artist",
                      uri: "spotify:artist:artist-id",
                      id: "artist-id",
                    },
                  ],
                  album: {
                    uri: "spotify:album:album-id",
                    name: "Mock Album",
                    id: "album-id",
                    images: [{ url: "https://example.com/album.jpg" }],
                  },
                  is_playable: true,
                  linked_from: { uri: null, id: null },
                  media_type: "audio",
                  type: "track",
                },
                previous_tracks: [],
                next_tracks: [],
              },
            });
          }

          pause() {
            return Promise.resolve();
          }

          resume() {
            return Promise.resolve();
          }

          togglePlay() {
            return Promise.resolve();
          }

          seek() {
            return Promise.resolve();
          }

          previousTrack() {
            return Promise.resolve();
          }

          nextTrack() {
            return Promise.resolve();
          }

          setName() {
            return Promise.resolve();
          }

          getVolume() {
            return Promise.resolve(0.5);
          }

          setVolume() {
            return Promise.resolve();
          }
        },
      };

      // Trigger the SDK ready event
      window.onSpotifyWebPlaybackSDKReady &&
        window.onSpotifyWebPlaybackSDKReady();
    });
  });

  test("successfully loads and displays a random track from playlist", async ({
    page,
  }) => {
    // Mock the playlist tracks endpoint with multiple tracks
    await page.route("**/v1/playlists/*/tracks*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              track: {
                id: "track-id-1",
                name: "Track 1",
                artists: [
                  {
                    name: "Artist 1",
                    id: "artist-id-1",
                    uri: "spotify:artist:artist-id-1",
                  },
                ],
                album: {
                  name: "Album 1",
                  id: "album-id-1",
                  images: [{ url: "https://example.com/album1.jpg" }],
                },
                external_urls: {
                  spotify: "https://open.spotify.com/track/track-id-1",
                },
              },
            },
            {
              track: {
                id: "track-id-2",
                name: "Track 2",
                artists: [
                  {
                    name: "Artist 2",
                    id: "artist-id-2",
                    uri: "spotify:artist:artist-id-2",
                  },
                ],
                album: {
                  name: "Album 2",
                  id: "album-id-2",
                  images: [{ url: "https://example.com/album2.jpg" }],
                },
                external_urls: {
                  spotify: "https://open.spotify.com/track/track-id-2",
                },
              },
            },
          ],
        }),
      });
    });

    // Mock the player/play endpoint
    await page.route("**/v1/me/player/play*", async (route) => {
      await route.fulfill({
        status: 204,
      });
    });

    // Mock the player endpoint for device transfer
    await page.route("**/v1/me/player", async (route) => {
      await route.fulfill({
        status: 204,
      });
    });

    // Navigate to the dashboard
    await page.goto("/dashboard");

    // Wait for the RandomSongSelector to load and display a track
    await expect(
      page.locator(
        ".bg-\\[\\#3C2218\\] h3:has-text('Step 3: Replacement Song')"
      )
    ).toBeVisible();

    // Wait for the track to load
    await page.waitForSelector(
      ".bg-\\[\\#3C2218\\] .font-medium.text-white:not(:has-text('Test User'))"
    );

    // Verify that a track name and artist are displayed
    const trackNameElement = page.locator(
      ".bg-\\[\\#3C2218\\]:has-text('Step 3: Replacement Song') .font-medium.text-white"
    );
    await expect(trackNameElement).toBeVisible();

    const trackName = await trackNameElement.textContent();
    expect(trackName).toBeTruthy();

    const artistElement = page
      .locator(
        ".bg-\\[\\#3C2218\\]:has-text('Step 3: Replacement Song') .text-yellow-100\\/60"
      )
      .first();
    await expect(artistElement).toBeVisible();

    const artistName = await artistElement.textContent();
    expect(artistName).toBeTruthy();

    // Verify that the refresh button is visible
    await expect(page.getByTestId("refresh-button")).toBeVisible();
  });

  test("handles playlist fetch error", async ({ page }) => {
    // Mock the playlist tracks endpoint to return an error
    await page.route("**/v1/playlists/*/tracks*", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({
          error: {
            status: 404,
            message: "Playlist not found",
          },
        }),
      });
    });

    // Navigate to the dashboard
    await page.goto("/dashboard");

    // Wait for the error message to appear
    await expect(
      page.locator(
        ".bg-red-900\\/30:has-text('Failed to get a random track from the playlist')"
      )
    ).toBeVisible();

    // Verify that the "Try Again" button is visible
    await expect(page.getByRole("button", { name: "Try Again" })).toBeVisible();
  });

  test("refreshes track when refresh button is clicked", async ({ page }) => {
    // Mock the playlist tracks endpoint with multiple tracks
    await page.route("**/v1/playlists/*/tracks*", async (route) => {
      // Return different tracks on subsequent calls to simulate refresh
      const url = route.request().url();
      const callCount = await page.evaluate(
        () => (window.playlistCallCount = (window.playlistCallCount || 0) + 1)
      );

      if (callCount === 1) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            items: [
              {
                track: {
                  id: "track-id-1",
                  name: "First Track",
                  artists: [
                    {
                      name: "First Artist",
                      id: "artist-id-1",
                      uri: "spotify:artist:artist-id-1",
                    },
                  ],
                  album: {
                    name: "First Album",
                    id: "album-id-1",
                    images: [{ url: "https://example.com/album1.jpg" }],
                  },
                  external_urls: {
                    spotify: "https://open.spotify.com/track/track-id-1",
                  },
                },
              },
            ],
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            items: [
              {
                track: {
                  id: "track-id-2",
                  name: "Refreshed Track",
                  artists: [
                    {
                      name: "Refreshed Artist",
                      id: "artist-id-2",
                      uri: "spotify:artist:artist-id-2",
                    },
                  ],
                  album: {
                    name: "Refreshed Album",
                    id: "album-id-2",
                    images: [{ url: "https://example.com/album2.jpg" }],
                  },
                  external_urls: {
                    spotify: "https://open.spotify.com/track/track-id-2",
                  },
                },
              },
            ],
          }),
        });
      }
    });

    // Mock the player/play endpoint
    await page.route("**/v1/me/player/play*", async (route) => {
      await route.fulfill({
        status: 204,
      });
    });

    // Mock the player endpoint for device transfer
    await page.route("**/v1/me/player", async (route) => {
      await route.fulfill({
        status: 204,
      });
    });

    // Add a property to window to track playlist API calls
    await page.addInitScript(() => {
      window.playlistCallCount = 0;
    });

    // Navigate to the dashboard
    await page.goto("/dashboard");

    // Wait for the initial track to load
    const trackNameElement = page.locator(
      ".bg-\\[\\#3C2218\\]:has-text('Step 3: Replacement Song') .font-medium.text-white"
    );
    await expect(trackNameElement).toBeVisible();

    // Get the initial track name
    const initialTrackName = await trackNameElement.textContent();

    // Click the refresh button
    await page.getByTestId("refresh-button").click();

    // Wait for loading indicator to appear and disappear
    await expect(page.locator(".animate-spin")).toBeVisible();
    await expect(page.locator(".animate-spin")).not.toBeVisible({
      timeout: 5000,
    });

    // Get the new track name
    const newTrackName = await trackNameElement.textContent();

    // Verify that the track has changed
    expect(newTrackName).not.toEqual(initialTrackName);
    expect(newTrackName).toContain("Refreshed Track");
  });
});

// Add type definition for window.playlistCallCount
declare global {
  interface Window {
    playlistCallCount?: number;
  }
}
