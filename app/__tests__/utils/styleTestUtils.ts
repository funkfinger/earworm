import "@testing-library/jest-dom";

export const getElementStyles = (element: HTMLElement) => {
  // In test environment, we'll check for Tailwind CSS classes
  const hasPrimaryClass = element.classList.contains("bg-primary");
  const hasPrimaryForegroundClass = element.classList.contains(
    "text-primary-foreground"
  );
  const hasSecondaryClass = element.classList.contains("text-secondary");
  const hasAccentAClass = element.classList.contains("text-accent-a");

  return {
    backgroundColor: hasPrimaryClass ? "rgb(78, 52, 46)" : "",
    color: hasPrimaryForegroundClass ? "rgb(221, 210, 167)" : "",
    borderColor: hasSecondaryClass ? "rgb(239, 121, 138)" : "",
    accentColor: hasAccentAClass ? "rgb(114, 125, 113)" : "",
  };
};

export const expectColorScheme = (element: HTMLElement) => {
  // Check if the element has the correct background color
  expect(element).toHaveClass("bg-primary");

  // Check if the element has the correct text color
  expect(element).toHaveClass("text-primary-foreground");
};

export const expectHighlightColor = (element: HTMLElement) => {
  expect(element).toHaveClass("text-secondary");
};

export const expectAccentColor = (element: HTMLElement) => {
  expect(element).toHaveClass("text-accent-a");
};
