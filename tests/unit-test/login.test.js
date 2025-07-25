import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../../src/App";

describe("App Component - Authentication", () => {
  test("should show error for empty login fields", () => {
    render(<App />);
    const loginButton = screen.getByText("Login");

    fireEvent.click(loginButton);

    expect(
      screen.getByText("Username and password must be entered.")
    ).toBeInTheDocument();
  });

  test("should login successfully with valid credentials", () => {
    render(<App />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Login");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    expect(screen.getByText(/Username:/)).toBeInTheDocument();
    expect(screen.getByText(/testuser/)).toBeInTheDocument();
  });

  test("should logout successfully", () => {
    render(<App />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Login");

    // Login first
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    // Then logout
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  test("should handle whitespace-only credentials", () => {
    render(<App />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Login");

    fireEvent.change(usernameInput, { target: { value: "   " } });
    fireEvent.change(passwordInput, { target: { value: "   " } });
    fireEvent.click(loginButton);

    expect(
      screen.getByText("Username and password must be entered.")
    ).toBeInTheDocument();
  });
});
