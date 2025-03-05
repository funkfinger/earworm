import { render, screen, waitFor } from "@testing-library/react";
import Home from "../page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Home Page", () => {
  it("renders the splash screen initially", () => {
    render(<Home />);

    // Check for splash screen elements
    expect(screen.getByText("De Worm")).toBeInTheDocument();
    expect(screen.getByText("Your Earworm Cure")).toBeInTheDocument();
    expect(screen.getByText("QT")).toBeInTheDocument();
  });

  it("renders the welcome screen after splash screen timeout", async () => {
    // Mock the setTimeout function
    jest.useFakeTimers();

    render(<Home />);

    // Fast-forward timer to skip splash screen
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      // Check for welcome screen elements
      expect(
        screen.getByText("Got a song stuck in your head?")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Hi! I'm QT! I can help you get rid of that annoying earworm by playing another catchy song to replace it!"
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Connect with Spotify")).toBeInTheDocument();
      expect(screen.getByText("How it works:")).toBeInTheDocument();
    });

    // Restore timers
    jest.useRealTimers();
  });

  it('displays the correct steps in the "How it works" section', async () => {
    // Mock the setTimeout function
    jest.useFakeTimers();

    render(<Home />);

    // Fast-forward timer to skip splash screen
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      // Check for the steps
      expect(
        screen.getByText("Connect your Spotify account")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Tell us what song is stuck in your head")
      ).toBeInTheDocument();
      expect(
        screen.getByText("We'll play a replacement song that's equally catchy")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Your earworm will be replaced!")
      ).toBeInTheDocument();
    });

    // Restore timers
    jest.useRealTimers();
  });
});
