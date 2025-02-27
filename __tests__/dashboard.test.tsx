import { expect, test, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import DashboardPage from "../app/dashboard/page";
import { logout } from "../app/actions/auth";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock auth actions
vi.mock("../app/actions/auth", () => ({
  logout: vi.fn(),
}));

// Mock fetch for profile data
const mockProfile = {
  display_name: "Test User",
  email: "test@example.com",
  images: [{ url: "https://example.com/avatar.jpg" }],
};

beforeEach(() => {
  cleanup(); // Clean up before each test
  vi.clearAllMocks();
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockProfile),
  });
});

afterEach(() => {
  cleanup(); // Clean up after each test
});

test("renders loading state initially", () => {
  render(<DashboardPage />);
  expect(screen.getByText("Loading...")).toBeDefined();
  expect(screen.getByRole("status")).toBeDefined();
});

test("renders error state when fetch fails", async () => {
  global.fetch = vi.fn().mockRejectedValueOnce(new Error("Failed to fetch"));

  render(<DashboardPage />);

  await waitFor(() => {
    expect(screen.getByText("Error")).toBeDefined();
    expect(screen.getByText("Failed to fetch")).toBeDefined();
  });
});

test("renders profile data when fetch succeeds", async () => {
  render(<DashboardPage />);

  await waitFor(() => {
    expect(screen.getByText(mockProfile.display_name)).toBeDefined();
    expect(screen.getByText(mockProfile.email)).toBeDefined();
    expect(screen.getByAltText(mockProfile.display_name)).toBeDefined();
  });
});

test("handles logout click", async () => {
  const mockLogout = vi.mocked(logout);
  mockLogout.mockResolvedValueOnce();

  const { container } = render(<DashboardPage />);

  // Wait for the profile to load and show the logout button
  await waitFor(() => {
    const buttons = screen.getAllByRole("button", { name: /logout/i });
    expect(buttons.length).toBe(1);
  });

  const logoutButton = screen.getAllByRole("button", { name: /logout/i })[0];
  await fireEvent.click(logoutButton);

  await waitFor(() => {
    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});

test("redirects to login on 401 response", async () => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: false,
    status: 401,
  });

  render(<DashboardPage />);

  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith("/?error=session_expired");
  });
});
