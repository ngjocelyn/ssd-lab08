import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../../src/App";

describe("App Component - Navigation", () => {
  test("should return to home from results page", () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText("Search term");
    const searchButton = screen.getByText("Search");

    // Navigate to results
    fireEvent.change(searchInput, { target: { value: "test" } });
    fireEvent.click(searchButton);

    // Return to home
    const returnButton = screen.getByText("Return to Home");
    fireEvent.click(returnButton);

    expect(screen.getByText("Welcome to React")).toBeInTheDocument();
  });

  test("should navigate to profile page after login", () => {
    render(<App />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Login");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    expect(screen.getByText("User Profile")).toBeInTheDocument();
  });
});
