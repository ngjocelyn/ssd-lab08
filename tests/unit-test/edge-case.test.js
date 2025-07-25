import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../../src/App";

describe("App Component - Edge Cases", () => {
  test("should handle very long input strings", () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText("Search term");
    const longString = "a".repeat(1000);

    fireEvent.change(searchInput, { target: { value: longString } });

    expect(searchInput.value).toBe(longString);
  });

  test("should handle special characters in search", () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText("Search term");
    const searchButton = screen.getByText("Search");

    fireEvent.change(searchInput, { target: { value: "café & résumé" } });
    fireEvent.click(searchButton);

    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  test("should trim whitespace from search input", () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText("Search term");
    const searchButton = screen.getByText("Search");

    fireEvent.change(searchInput, { target: { value: "  test search  " } });
    fireEvent.click(searchButton);

    // Should show trimmed result
    expect(screen.getByText(/test search/)).toBeInTheDocument();
  });
});
