/**
 * Helper function to capture console logs during testing
 * This is used to verify that the Spotify Web Player is working correctly
 */
import { Page } from "@playwright/test";

export async function setupConsoleLogs(page: Page): Promise<void> {
  await page.addInitScript(() => {
    // Create an array to store logs
    window.console.logs = [];

    // Store original console methods
    const originalLog = window.console.log;
    const originalError = window.console.error;
    const originalWarn = window.console.warn;

    // Override console methods to capture logs
    window.console.log = function (...args) {
      // Call original method
      originalLog.apply(console, args);

      // Store log message
      window.console.logs.push(
        args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : String(arg)
          )
          .join(" ")
      );
    };

    window.console.error = function (...args) {
      // Call original method
      originalError.apply(console, args);

      // Store error message
      window.console.logs.push(
        "[ERROR] " +
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ")
      );
    };

    window.console.warn = function (...args) {
      // Call original method
      originalWarn.apply(console, args);

      // Store warning message
      window.console.logs.push(
        "[WARN] " +
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ")
      );
    };
  });

  // Add type definition for window.console.logs
  await page.addInitScript(() => {
    interface Console {
      logs: string[];
    }

    interface Window {
      console: Console;
    }
  });
}

// Helper to get console logs from the page
export async function getConsoleLogs(page: Page): Promise<string[]> {
  return page.evaluate(() => window.console.logs || []);
}

// Helper to filter console logs
export async function filterConsoleLogs(
  page: Page,
  filter: string
): Promise<string[]> {
  return page.evaluate((filterText) => {
    return (window.console.logs || []).filter((log) =>
      log.includes(filterText)
    );
  }, filter);
}

// Declare global types for TypeScript
declare global {
  interface Console {
    logs: string[];
  }

  interface Window {
    console: Console;
  }
}
