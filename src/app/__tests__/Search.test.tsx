import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Search from "../search/page";

// Mock the useRouter hook
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Search Page", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mock the setTimeout function
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore timers
    jest.useRealTimers();
  });

  it("renders the search page correctly", () => {
    render(<Search />);

    // Check for page elements
    expect(screen.getByText("What's stuck in your head?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Tell me what song is stuck in your head, and I'll help you replace it!"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search for a song or artist...")
    ).toBeInTheDocument();
    expect(screen.getByText("Find My Earworm")).toBeInTheDocument();
    expect(screen.getByText("← Back to Spotify login")).toBeInTheDocument();
  });

  it("disables the search button when input is empty", () => {
    render(<Search />);

    // Check if the button is disabled
    const searchButton = screen.getByText("Find My Earworm");
    expect(searchButton).toHaveStyle("opacity: 0.7");

    // Type in the search input
    const searchInput = screen.getByPlaceholderText(
      "Search for a song or artist..."
    );
    fireEvent.change(searchInput, { target: { value: "Shape of You" } });

    // Check if the button is enabled
    expect(searchButton).toHaveStyle("opacity: 1");
  });

  it("shows search results when searching for a song", async () => {
    render(<Search />);

    // Type in the search input
    const searchInput = screen.getByPlaceholderText(
      "Search for a song or artist..."
    );
    fireEvent.change(searchInput, { target: { value: "Shape" } });

    // Submit the search form
    const searchButton = screen.getByText("Find My Earworm");
    fireEvent.click(searchButton);

    // Check for loading state
    expect(screen.getByText("Searching...")).toBeInTheDocument();

    // Fast-forward timer
    jest.advanceTimersByTime(1000);

    // Check for search results
    await waitFor(() => {
      expect(screen.getByText("Search Results:")).toBeInTheDocument();
      expect(screen.getByText("Shape of You")).toBeInTheDocument();
      expect(screen.getByText("Ed Sheeran")).toBeInTheDocument();
    });
  });

  it("shows no results message when no songs match the search", async () => {
    render(<Search />);

    // Type in the search input
    const searchInput = screen.getByPlaceholderText(
      "Search for a song or artist..."
    );
    fireEvent.change(searchInput, { target: { value: "NonExistentSong" } });

    // Submit the search form
    const searchButton = screen.getByText("Find My Earworm");
    fireEvent.click(searchButton);

    // Fast-forward timer
    jest.advanceTimersByTime(1000);

    // Check for no results message
    await waitFor(() => {
      expect(
        screen.getByText("No songs found. Try a different search term.")
      ).toBeInTheDocument();
    });
  });

  it("navigates to playback page when a song is selected", async () => {
    render(<Search />);

    // Type in the search input
    const searchInput = screen.getByPlaceholderText(
      "Search for a song or artist..."
    );
    fireEvent.change(searchInput, { target: { value: "Shape" } });

    // Submit the search form
    const searchButton = screen.getByText("Find My Earworm");
    fireEvent.click(searchButton);

    // Fast-forward timer
    jest.advanceTimersByTime(1000);

    // Wait for search results
    await waitFor(() => {
      expect(screen.getByText("Shape of You")).toBeInTheDocument();
    });

    // Click on the song
    fireEvent.click(screen.getByText("Shape of You"));

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/playback?songId=1");
  });
});
