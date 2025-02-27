import { expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import Page from "../app/page";
import { getValidToken } from "../app/actions/auth";

vi.mock("../app/actions/auth", () => ({
  getValidToken: vi.fn(),
}));

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

test("Page renders heading", () => {
  render(<Page />);
  expect(
    screen.getByRole("heading", { level: 1, name: "DeWorm" })
  ).toBeDefined();
});

test("Shows login button when user is not logged in", async () => {
  vi.mocked(getValidToken).mockResolvedValueOnce(null);
  render(<Page />);

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /login with spotify/i })
    ).toBeDefined();
  });
});

test("Hides login button when user is logged in", async () => {
  vi.mocked(getValidToken).mockResolvedValueOnce("mock-token");
  render(<Page />);

  await waitFor(() => {
    expect(
      screen.queryByRole("button", { name: /login with spotify/i })
    ).toBeNull();
  });
});
