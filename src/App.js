import React, { Component } from "react";
import DOMPurify from "dompurify"; // For XSS sanitization
import logo from "./logo.svg";
import "./App.css";

// XSS validation - detects common XSS patterns
const validateXSS = (input) => {
  const sanitizedInput = DOMPurify.sanitize(input);
  return sanitizedInput !== input; // Returns true if input was modified
};

// SQL injection validation - detects common SQL injection patterns
const validateSQLInjection = (input) => {
  const sqlPatterns = [
    /(\bOR\b.*=.*)|(\bAND\b.*=.*)/gi, // OR x=x or AND x=x
    /\bUNION\b\s+\bSELECT\b/i, // UNION SELECT
    /(--|#|\/\*)/, // SQL comments
    /['"`]\s*(OR|AND)\s+['"`]?\d+=\d+/i, // ' OR '1'='1'
    /["';]\s*\b(DROP|DELETE|INSERT|UPDATE)\b/i, // SQL + dangerous command chaining
    /\b(WAITFOR|DELAY)\b/gi,
    /\bEXEC(\s+|\()/i, // EXEC() or EXEC cmd
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
};

// Safe HTML encoding for output
const encodeHTML = (input) => {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
};

class App extends Component {
  state = {
    searchTerm: "",
    currentPage: "home",
    error: "",
    validatedTerm: "",
    isLoggedIn: false,
    username: "",
    password: "",
  };

  handleChange = (e) => {
    this.setState({ searchTerm: e.target.value, error: "" });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search term:", this.state.searchTerm);

    const rawTerm = this.state.searchTerm;
    const trimmed = rawTerm.trim();

    // Validate for XSS attack
    if (validateXSS(trimmed)) {
      this.setState({
        error:
          "Invalid input detected: Potential XSS attack prevented. Please try again.",
        searchTerm: "",
        currentPage: "home",
      });
      return;
    }

    // Validate for SQL injection
    if (validateSQLInjection(trimmed)) {
      this.setState({
        error:
          "Invalid input detected: Potential SQL injection attack prevented Please try again.",
        searchTerm: "",
        currentPage: "home",
      });
      return;
    }

    // Navigate to results page
    this.setState({
      validatedTerm: encodeHTML(trimmed),
      // validatedTerm: searchTerm, // Use raw input for simplicity
      currentPage: "results",
      searchTerm: "",
      error: "",
    });
    console.log(
      "Navigating to results page with term:",
      this.state.validatedTerm
    );
    this.setState(
      {
        validatedTerm: trimmed,
        currentPage: "results",
        searchTerm: "",
        error: "",
      },
      () => {
        console.log("Now on results page with term:", this.state.validatedTerm);
      }
    );
  };

  // Login form handlers
  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleLoginSubmit = (e) => {
    e.preventDefault();

    const { username, password } = this.state;

    if (!username.trim() || !password.trim()) {
      this.setState({
        error: "Username and password must be entered.",
      });
      return;
    }
    // Simulate successful login
    this.setState({ isLoggedIn: true, currentPage: "profile", error: "" });
  };

  handleLogout = () => {
    this.setState({
      isLoggedIn: false,
      username: "",
      password: "",
      currentPage: "home",
      error: "",
    });
  };

  renderHomePage = () => (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>

      {/* Search Form */}
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Search term"
          value={this.state.searchTerm}
          onChange={this.handleChange}
        />
        <button type="submit">Search</button>
      </form>

      {/* Global Error Message */}
      {this.state.currentPage === "home" && this.state.error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {this.state.error}
        </div>
      )}

      {/* Login Form */}
      {!this.state.isLoggedIn ? (
        <form onSubmit={this.handleLoginSubmit} style={{ marginTop: "20px" }}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleUsernameChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <p>
            Welcome, <strong>{this.state.username}</strong>!
          </p>
          <button onClick={this.handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );

  renderResultsPage = () => (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Search Results</h1>
      </header>

      <p className="App-intro">
        You searched for: <strong>{this.state.validatedTerm}</strong>{" "}
      </p>
      <button onClick={this.handleReturn} style={{ padding: "8px 16px" }}>
        Return to Home
      </button>
    </div>
  );

  renderProfilePage = () => (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">User Profile</h1>
      </header>

      {this.state.isLoggedIn ? (
        <div className="App-intro">
          <p>
            <strong>Username:</strong> {this.state.username}
          </p>
          <p>
            <strong>Password:</strong> {this.state.password}
          </p>
          {/* <button onClick={this.handleReturn}>Back to Home</button> */}
          <button onClick={this.handleLogout}>Logout</button>
        </div>
      ) : (
        <p className="App-intro">You must be logged in to view this page.</p>
      )}
    </div>
  );

  handleReturn = () => {
    this.setState({
      currentPage: "home",
      searchTerm: "",
      validatedTerm: "",
      error: "",
    });
  };

  render() {
    const { currentPage } = this.state;

    return (
      <div className="App">
        {currentPage === "home"
          ? this.renderHomePage()
          : currentPage === "results"
          ? this.renderResultsPage()
          : this.renderProfilePage()}
      </div>
    );
  }
}

export default App;
