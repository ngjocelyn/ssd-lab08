import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../../src/App";

describe("App Component - Search", () => {
  test("should update search term on input change", () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText("Search term");

    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(searchInput.value).toBe("test search");
  });

  test("should show error for XSS attempt", () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText("Search term");
    const searchButton = screen.getByText("Search");

    fireEvent.change(searchInput, {
      target: { value: '<script>alert("xss")</script>' },
    });
    fireEvent.click(searchButton);

    expect(
      screen.getByText(/Potential XSS attack prevented/)
    ).toBeInTheDocument();
  });

  test("should show error for SQL injection attempt", () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText("Search term");
    const searchButton = screen.getByText("Search");

    fireEvent.change(searchInput, { target: { value: "admin' OR '1'='1'" } });
    fireEvent.click(searchButton);

    expect(
      screen.getByText(/Potential SQL injection attack prevented/)
    ).toBeInTheDocument();
  });

  test("should navigate to results page with valid search", () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText("Search term");
    const searchButton = screen.getByText("Search");

    fireEvent.change(searchInput, { target: { value: "valid search term" } });
    fireEvent.click(searchButton);

    expect(screen.getByText("Search Results")).toBeInTheDocument();
    expect(screen.getByText("You searched for:")).toBeInTheDocument();
  });

  test("should clear search input after submission", () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText("Search term");
    const searchButton = screen.getByText("Search");

    fireEvent.change(searchInput, { target: { value: "test" } });
    fireEvent.click(searchButton);

    expect(searchInput.value).toBe("");
  });
});
