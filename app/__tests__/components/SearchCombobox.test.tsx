import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchCombobox, SearchResult } from "@/components/ui/search-combobox";

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    albumArt: "https://example.com/bohemian.jpg",
  },
  {
    id: "2",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    albumArt: "https://example.com/stairway.jpg",
  },
];

describe("SearchCombobox", () => {
  const mockOnSearch = jest.fn();
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSearch.mockResolvedValue(mockResults);
  });

  it("renders with default props", () => {
    render(<SearchCombobox onSearch={mockOnSearch} onSelect={mockOnSelect} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Search songs...")).toBeInTheDocument();
  });

  it("shows loading state while searching", async () => {
    mockOnSearch.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockResults), 100))
    );

    render(<SearchCombobox onSearch={mockOnSearch} onSelect={mockOnSelect} />);

    // Open the combobox
    fireEvent.click(screen.getByRole("combobox"));

    // Type in the search
    await userEvent.type(screen.getByTestId("search-combobox-input"), "boh");

    // Check for loading state
    expect(await screen.findByTestId("search-loading")).toBeInTheDocument();

    // Wait for results
    await waitFor(() => {
      expect(screen.queryByTestId("search-loading")).not.toBeInTheDocument();
    });
  });

  it("displays search results", async () => {
    render(<SearchCombobox onSearch={mockOnSearch} onSelect={mockOnSelect} />);

    // Open the combobox
    fireEvent.click(screen.getByRole("combobox"));

    // Type in the search
    await userEvent.type(screen.getByTestId("search-combobox-input"), "boh");

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText("Bohemian Rhapsody")).toBeInTheDocument();
      expect(screen.getByText("Queen")).toBeInTheDocument();
    });
  });

  it("calls onSelect when a result is clicked", async () => {
    render(<SearchCombobox onSearch={mockOnSearch} onSelect={mockOnSelect} />);

    // Open the combobox
    fireEvent.click(screen.getByRole("combobox"));

    // Type in the search
    await userEvent.type(screen.getByTestId("search-combobox-input"), "boh");

    // Wait for results and click the first one
    await waitFor(() => {
      fireEvent.click(screen.getByText("Bohemian Rhapsody"));
    });

    expect(mockOnSelect).toHaveBeenCalledWith(mockResults[0]);
  });

  it("shows empty state when no results found", async () => {
    mockOnSearch.mockResolvedValue([]);

    render(<SearchCombobox onSearch={mockOnSearch} onSelect={mockOnSelect} />);

    // Open the combobox
    fireEvent.click(screen.getByRole("combobox"));

    // Type in the search
    await userEvent.type(screen.getByTestId("search-combobox-input"), "xyz");

    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText("No results found.")).toBeInTheDocument();
    });
  });

  it("debounces search requests", async () => {
    jest.useFakeTimers();

    render(<SearchCombobox onSearch={mockOnSearch} onSelect={mockOnSelect} />);

    // Open the combobox
    fireEvent.click(screen.getByRole("combobox"));

    // Type quickly
    await userEvent.type(
      screen.getByTestId("search-combobox-input"),
      "bohemian",
      {
        delay: 50,
      }
    );

    // Fast-forward timers
    jest.runAllTimers();

    // Should only call search once with final value
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith("bohemian");

    jest.useRealTimers();
  });
});
