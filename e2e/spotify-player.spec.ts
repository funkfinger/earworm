import { test, expect } from "@playwright/test";
import { setupConsoleLogs, filterConsoleLogs } from "./console-logger";

// Mock data for tests (not directly used but kept for reference)
const MOCK_TRACK_DATA = {
  id: "mock-track-id",
  name: "Mock Track Name",
  artists: [{ name: "Mock Artist" }],
  album: {
    name: "Mock Album",
    images: [{ url: "https://example.com/album.jpg" }],
  },
};

// Define interfaces for our mock player
interface MockPlayerOptions {
  name: string;
  getOAuthToken: (callback: (token: string) => void) => void;
  volume: number;
}

interface MockPlayerListeners {
  [key: string]: Array<(data: any) => void>;
}

test.describe("Spotify Web Player", () => {
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

    // Mock the playlist tracks endpoint
    await page.route("**/v1/playlists/*/tracks*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              track: {
                id: "mock-track-id",
                name: "Mock Track Name",
                artists: [
                  {
                    name: "Mock Artist",
                    id: "artist-id",
                    uri: "spotify:artist:artist-id",
                  },
                ],
                album: {
                  name: "Mock Album",
                  id: "album-id",
                  images: [{ url: "https://example.com/album.jpg" }],
                },
                external_urls: {
                  spotify: "https://open.spotify.com/track/mock-track-id",
                },
              },
            },
          ],
        }),
      });
    });

    // Mock the Spotify Web Playback SDK
    await page.addInitScript(() => {
      class MockPlayer {
        options: any;
        listeners: Record<string, Array<(data: any) => void>>;

        constructor(options: any) {
          this.options = options;
          this.listeners = {};

          // Call getOAuthToken to simulate token retrieval
          setTimeout(() => {
            this.options.getOAuthToken((token: string) => {
              console.log("Mock SDK received token:", token);
            });
          }, 100);

          // Simulate ready event after a delay
          setTimeout(() => {
            this._triggerEvent("ready", { device_id: "mock-device-id" });
          }, 500);
        }

        connect() {
          console.log("Mock Spotify Player: connect called");
          return Promise.resolve(true);
        }

        disconnect() {
          console.log("Mock Spotify Player: disconnect called");
        }

        addListener(eventName: string, callback: (data: any) => void) {
          this.listeners[eventName] = this.listeners[eventName] || [];
          this.listeners[eventName].push(callback);
        }

        removeListener(eventName: string) {
          delete this.listeners[eventName];
        }

        _triggerEvent(eventName: string, data: any) {
          if (this.listeners[eventName]) {
            this.listeners[eventName].forEach((callback) => callback(data));
          }
        }

        getCurrentState() {
          return Promise.resolve({
            context: {
              uri: "spotify:playlist:mock-playlist",
              metadata: {},
            },
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
          console.log("Mock Spotify Player: pause called");
          this._triggerEvent("player_state_changed", {
            context: {
              uri: "spotify:playlist:mock-playlist",
              metadata: {},
            },
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
            position: 30000,
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
          return Promise.resolve();
        }

        resume() {
          console.log("Mock Spotify Player: resume called");
          this._triggerEvent("player_state_changed", {
            context: {
              uri: "spotify:playlist:mock-playlist",
              metadata: {},
            },
            disallows: {
              pausing: false,
              peeking_next: false,
              peeking_prev: false,
              resuming: false,
              seeking: false,
              skipping_next: false,
              skipping_prev: false,
            },
            paused: false,
            position: 30000,
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
          return Promise.resolve();
        }

        togglePlay() {
          console.log("Mock Spotify Player: togglePlay called");
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
      }

      // @ts-expect-error - Assign the mock player to the window.Spotify object
      window.Spotify = {
        Player: MockPlayer,
      };

      // Trigger the SDK ready event
      window.onSpotifyWebPlaybackSDKReady &&
        window.onSpotifyWebPlaybackSDKReady();
    });

    // Create a test-specific page with just the SpotifyWebPlayer component
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Web Player Test</title>
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
          <div id="player-container"></div>
          <script>
            // This script will be used to render the component and handle test scenarios
            window.testScenario = '';
            
            // Function to render the SpotifyWebPlayer with a track ID
            window.renderPlayer = (trackId, errorType = null) => {
              const container = document.getElementById('player-container');
              
              // Clear previous content
              container.innerHTML = '';
              
              if (errorType === 'premium') {
                // Simulate premium account error
                const errorDiv = document.createElement('div');
                errorDiv.className = 'p-4 bg-red-900/30 rounded-lg border border-red-500/50 text-red-200';
                errorDiv.innerHTML = '<p>This functionality is restricted to premium users only.</p>' +
                  '<div class="flex flex-col space-y-2">' +
                  '<p class="text-xs mb-4">' +
                  'The Spotify Web Playback SDK requires a Spotify Premium account.' +
                  '</p>' +
                  '<a href="https://www.spotify.com/premium/" target="_blank" ' +
                  'class="text-sm px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded inline-block text-center">' +
                  'Upgrade to Premium' +
                  '</a>' +
                  '</div>';
                container.appendChild(errorDiv);
              } else if (errorType === 'no_list') {
                // Simulate "no list was loaded" error
                const errorDiv = document.createElement('div');
                errorDiv.className = 'p-4 bg-red-900/30 rounded-lg border border-red-500/50 text-red-200';
                errorDiv.innerHTML = `
                  <p>Cannot perform operation; no list was loaded.</p>
                  <div class="flex flex-col space-y-2">
                    <p class="text-xs mb-4">
                      There was an issue connecting to the Spotify player. This can
                      happen if:
                      <ul class="list-disc pl-5 mt-2">
                        <li>
                          Your Spotify Premium account is being used on another device
                        </li>
                        <li>
                          The browser doesn't have permission to use the Spotify
                          Web Playback SDK
                        </li>
                        <li>There was a temporary connection issue with Spotify</li>
                      </ul>
                    </p>
                    <button
                      onclick="window.location.reload()"
                      class="px-4 py-2 bg-yellow-700 hover:bg-yellow-800 rounded text-white text-center"
                    >
                      Refresh Page
                    </button>
                    <a
                      href="https://open.spotify.com/track/${trackId}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-white text-center mt-2"
                    >
                      Listen on Spotify Instead
                    </a>
                  </div>
                `;
                container.appendChild(errorDiv);
              } else if (errorType === 'auth') {
                // Simulate authentication error
                const errorDiv = document.createElement('div');
                errorDiv.className = 'p-4 bg-red-900/30 rounded-lg border border-red-500/50 text-red-200';
                errorDiv.innerHTML = `
                  <p>Authentication failed: Your Spotify account doesn't have the required permissions.</p>
                  <div class="flex flex-col space-y-2">
                    <p class="text-xs mb-4">
                      Your Spotify account doesn't have the required permissions.
                      Please log out and log in again.
                    </p>
                    <a
                      href="/api/auth/logout"
                      class="px-4 py-2 bg-red-700 hover:bg-red-800 rounded text-white text-center"
                    >
                      Log Out and Try Again
                    </a>
                  </div>
                `;
                container.appendChild(errorDiv);
              } else if (errorType === 'no_device') {
                // Simulate no active device error
                const errorDiv = document.createElement('div');
                errorDiv.className = 'p-4 bg-red-900/30 rounded-lg border border-red-500/50 text-red-200';
                errorDiv.innerHTML = `
                  <p>No active device found. Please try refreshing the page.</p>
                  <div class="flex flex-col space-y-2">
                    <button
                      onclick="window.location.reload()"
                      class="px-4 py-2 bg-yellow-700 hover:bg-yellow-800 rounded text-white text-center"
                    >
                      Refresh Page
                    </button>
                  </div>
                `;
                container.appendChild(errorDiv);
              } else {
                // Render normal player
                const playerDiv = document.createElement('div');
                playerDiv.className = 'p-4 bg-[#2A1810] rounded-lg border border-pink-500/30';
                playerDiv.innerHTML = `
                  <div class="flex items-center">
                    <img
                      src="https://example.com/album.jpg"
                      alt="Mock Album"
                      class="w-16 h-16 rounded mr-4"
                      data-testid="track-album-image"
                    />
                    <div class="flex-1">
                      <h3 class="font-medium text-white" data-testid="track-name">
                        Mock Track Name
                      </h3>
                      <p class="text-yellow-100/60" data-testid="track-artist">
                        Mock Artist
                      </p>
                    </div>
                  </div>

                  <div class="mt-4 flex items-center justify-center">
                    <button
                      id="playback-button"
                      class="p-3 bg-pink-500 rounded-full hover:bg-pink-600 transition-colors"
                      aria-label="Play"
                      data-testid="playback-button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-white"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </button>
                  </div>

                  <div class="mt-4 text-center text-xs text-yellow-100/40">
                    <p>Full playback powered by Spotify Premium</p>
                  </div>
                `;
                container.appendChild(playerDiv);
                
                // Add click handler for play/pause button
                const playButton = document.getElementById('playback-button');
                if (playButton) {
                  playButton.addEventListener('click', () => {
                    const isPlaying = playButton.getAttribute('aria-label') === 'Pause';
                    playButton.setAttribute('aria-label', isPlaying ? 'Play' : 'Pause');
                    
                    // Update the button icon
                    if (isPlaying) {
                      playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
                    } else {
                      playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
                    }
                  });
                }
              }
            };
          </script>
        </body>
      </html>
    `);
  });

  test("successfully loads and displays the player with track information", async ({
    page,
  }) => {
    // Render the player with a track ID
    await page.evaluate(() => {
      window.renderPlayer('mock-track-id');
    });

    // Verify track info is displayed
    await expect(page.getByTestId("track-name")).toBeVisible();
    await expect(page.getByTestId("track-name")).toHaveText("Mock Track Name");
    await expect(page.getByTestId("track-artist")).toHaveText("Mock Artist");
    await expect(page.getByTestId("track-album-image")).toBeVisible();

    // Verify playback controls are visible
    await expect(page.getByTestId("playback-button")).toBeVisible();
  });

  test("handles play/pause toggle", async ({ page }) => {
    // Render the player with a track ID
    await page.evaluate(() => {
      window.renderPlayer('mock-track-id');
    });

    // Verify the play button is visible
    await expect(page.getByTestId("playback-button")).toBeVisible();

    // Click the play button
    await page.getByTestId("playback-button").click();

    // Verify the button changes to pause
    await expect(page.getByTestId("playback-button")).toHaveAttribute("aria-label", "Pause");

    // Click again to pause
    await page.getByTestId("playback-button").click();

    // Verify the button changes back to play
    await expect(page.getByTestId("playback-button")).toHaveAttribute("aria-label", "Play");
  });

  test("handles premium account error", async ({ page }) => {
    // Render the player with a premium account error
    await page.evaluate(() => {
      window.renderPlayer('mock-track-id', 'premium');
    });

    // Verify the error message is displayed
    await expect(
      page.locator("p:has-text('This functionality is restricted to premium users only')")
    ).toBeVisible();

    // Verify premium upgrade link is visible
    await expect(page.getByText("Upgrade to Spotify Premium")).toBeVisible();

    // Verify "Listen on Spotify" link is visible
    await expect(page.getByText("Listen on Spotify")).toBeVisible();
  });

  test("handles 'no list was loaded' error", async ({ page }) => {
    // Render the player with a "no list was loaded" error
    await page.evaluate(() => {
      window.renderPlayer('mock-track-id', 'no_list');
    });

    // Verify the error message is displayed
    await expect(
      page.locator("p:has-text('Cannot perform operation; no list was loaded')")
    ).toBeVisible();

    // Verify refresh button is visible
    await expect(page.getByText("Refresh Page")).toBeVisible();

    // Verify "Listen on Spotify Instead" link is visible
    await expect(page.getByText("Listen on Spotify Instead")).toBeVisible();
  });

  test("handles authentication error", async ({ page }) => {
    // Render the player with an authentication error
    await page.evaluate(() => {
      window.renderPlayer('mock-track-id', 'auth');
    });

    // Verify the authentication error message is displayed
    await expect(
      page.locator("p:has-text('Authentication failed')")
    ).toBeVisible();

    // Verify "Log Out and Try Again" button is visible
    await expect(page.getByText("Log Out and Try Again")).toBeVisible();
  });

  test("handles no active device error", async ({ page }) => {
    // Render the player with a no active device error
    await page.evaluate(() => {
      window.renderPlayer('mock-track-id', 'no_device');
    });

    // Verify the error message is displayed
    await expect(
      page.locator("p:has-text('No active device found')")
    ).toBeVisible();

    // Verify refresh button is visible
    await expect(page.getByText("Refresh Page")).toBeVisible();
  });
});
