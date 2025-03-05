import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Playback from "../playback/page";

// Mock the useRouter and useSearchParams hooks
const mockPush = jest.fn();
const mockGet = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

describe("Playback Page", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mock the setTimeout function
    jest.useFakeTimers();
    // Mock the console.log and console.error
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore timers and console mocks
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("redirects to search page if no songId is provided", () => {
    // Mock the useSearchParams.get to return null
    mockGet.mockReturnValue(null);

    render(<Playback />);

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/search");
  });

  it("redirects to search page if songId is invalid", () => {
    // Mock the useSearchParams.get to return an invalid songId
    mockGet.mockReturnValue("999");

    render(<Playback />);

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/search");
  });

  it("shows loading state initially", () => {
    // Mock the useSearchParams.get to return a valid songId
    mockGet.mockReturnValue("1");

    render(<Playback />);

    // Check for loading state
    expect(
      screen.getByText("Finding the perfect replacement song...")
    ).toBeInTheDocument();
  });

  it("displays earworm and replacement song after loading", async () => {
    // Mock the useSearchParams.get to return a valid songId
    mockGet.mockReturnValue("1");

    render(<Playback />);

    // Fast-forward timer to skip loading
    jest.advanceTimersByTime(1500);

    // Check for playback page elements
    await waitFor(() => {
      expect(screen.getByText("Your Earworm Cure")).toBeInTheDocument();
      expect(screen.getByText("Your Earworm:")).toBeInTheDocument();
      expect(screen.getByText("Your Replacement Song:")).toBeInTheDocument();
      expect(
        screen.getByText(
          "I've found a super catchy song to replace your earworm!"
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Play Replacement Song")).toBeInTheDocument();
    });
  });

  it("shows playing state when play button is clicked", async () => {
    // Mock the useSearchParams.get to return a valid songId
    mockGet.mockReturnValue("1");

    render(<Playback />);

    // Fast-forward timer to skip loading
    jest.advanceTimersByTime(1500);

    // Wait for the play button to appear
    await waitFor(() => {
      expect(screen.getByText("Play Replacement Song")).toBeInTheDocument();
    });

    // Click the play button
    fireEvent.click(screen.getByText("Play Replacement Song"));

    // Check for playing state
    expect(
      screen.getByText("Playing your replacement song... Listen carefully!")
    ).toBeInTheDocument();
  });

  it("shows feedback options after playback completes", async () => {
    // Mock the useSearchParams.get to return a valid songId
    mockGet.mockReturnValue("1");

    render(<Playback />);

    // Fast-forward timer to skip loading
    jest.advanceTimersByTime(1500);

    // Wait for the play button to appear
    await waitFor(() => {
      expect(screen.getByText("Play Replacement Song")).toBeInTheDocument();
    });

    // Click the play button
    fireEvent.click(screen.getByText("Play Replacement Song"));

    // Fast-forward timer to complete playback
    jest.advanceTimersByTime(5000);

    // Check for feedback options
    await waitFor(() => {
      expect(screen.getByText("Did it work?")).toBeInTheDocument();
      expect(screen.getByText("Yes, it worked!")).toBeInTheDocument();
      expect(screen.getByText("No, try again")).toBeInTheDocument();
    });
  });

  it("redirects to search page after positive feedback", async () => {
    // Mock the useSearchParams.get to return a valid songId
    mockGet.mockReturnValue("1");

    render(<Playback />);

    // Fast-forward timer to skip loading
    jest.advanceTimersByTime(1500);

    // Wait for the play button to appear
    await waitFor(() => {
      expect(screen.getByText("Play Replacement Song")).toBeInTheDocument();
    });

    // Click the play button
    fireEvent.click(screen.getByText("Play Replacement Song"));

    // Fast-forward timer to complete playback
    jest.advanceTimersByTime(5000);

    // Wait for feedback options
    await waitFor(() => {
      expect(screen.getByText("Yes, it worked!")).toBeInTheDocument();
    });

    // Click the positive feedback button
    fireEvent.click(screen.getByText("Yes, it worked!"));

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/search");
  });

  it("redirects to search page after negative feedback", async () => {
    // Mock the useSearchParams.get to return a valid songId
    mockGet.mockReturnValue("1");

    render(<Playback />);

    // Fast-forward timer to skip loading
    jest.advanceTimersByTime(1500);

    // Wait for the play button to appear
    await waitFor(() => {
      expect(screen.getByText("Play Replacement Song")).toBeInTheDocument();
    });

    // Click the play button
    fireEvent.click(screen.getByText("Play Replacement Song"));

    // Fast-forward timer to complete playback
    jest.advanceTimersByTime(5000);

    // Wait for feedback options
    await waitFor(() => {
      expect(screen.getByText("No, try again")).toBeInTheDocument();
    });

    // Click the negative feedback button
    fireEvent.click(screen.getByText("No, try again"));

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/search");
  });
});
