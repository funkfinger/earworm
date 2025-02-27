import { expect, test, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Page from "../app/page";

beforeEach(() => {
  cleanup();
});

test("renders the main heading", () => {
  render(<Page />);
  const heading = screen.getByRole("heading", { level: 1, name: "DeWorm" });
  expect(heading).toBeInTheDocument();
});

test("renders the feature cards", () => {
  render(<Page />);
  const identifyCard = screen.getByTestId("feature-identify");
  const listenCard = screen.getByTestId("feature-listen");
  const moveOnCard = screen.getByTestId("feature-move-on");

  expect(identifyCard).toBeInTheDocument();
  expect(identifyCard.textContent).toContain("Identify");

  expect(listenCard).toBeInTheDocument();
  expect(listenCard.textContent).toContain("Listen");

  expect(moveOnCard).toBeInTheDocument();
  expect(moveOnCard.textContent).toContain("Move On");
});
