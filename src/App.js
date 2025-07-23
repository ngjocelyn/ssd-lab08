import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

// XSS validation - detects common XSS patterns
const validateXSS = (input) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<link/gi,
    /<meta/gi,
    /vbscript:/gi,
    /expression\s*\(/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
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

  renderHomePage = () => (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Search term"
          value={this.state.searchTerm}
          onChange={this.handleChange}
        />
        <button type="submit">Search</button>
      </form>

      {this.state.error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {this.state.error}
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
          : this.renderResultsPage()}
      </div>
    );
  }
}

export default App;
