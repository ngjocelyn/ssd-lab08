import React, { Component } from "react";
// import DOMPurify from "dompurify";
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
    /["';]{1,10}.*?(DROP|DELETE|INSERT|UPDATE)/i, // SQL + dangerous command chaining
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
    // const { searchTerm } = this.state;
    // const searchTerm = this.state.searchTerm.trim();
    // const searchTerm = this.state.searchTerm;
    this.setState((prevState) => ({
      searchTerm: prevState.searchTerm.trim(),
    }));

    // Validate for XSS attack
    if (validateXSS(searchTerm)) {
      this.setState({
        error:
          "Invalid input detected: Potential XSS attack prevented. Please try again.",
        searchTerm: "",
        currentPage: "home",
      });
      return;
    }

    // Validate for SQL injection
    if (validateSQLInjection(searchTerm)) {
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
      validatedTerm: encodeHTML(searchTerm),
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
        validatedTerm: searchTerm,
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
        <h1 className="App-title">Welcome to React6</h1>
      </header>
      {/* <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p> */}
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
        {/* escapes dangerous input in JSX. */}
      </p>
      <button onClick={this.handleReturn} style={{ padding: "8px 16px" }}>
        Return to Home
      </button>
    </div>
  );

  // renderResultsPage = () => {
  //   return (
  //     <div className="App">
  //       <header className="App-header">
  //         <img src={logo} className="App-logo" alt="logo" />
  //         <h1 className="App-title">Search Results</h1>
  //       </header>

  //       <p className="App-intro">
  //         You searched for:
  //         <div
  //           dangerouslySetInnerHTML={{
  //             // __html: this.state.validatedTerm,
  //             __html: DOMPurify.sanitize(this.state.validatedTerm),
  //           }}
  //         />
  //       </p>
  //       <button onClick={this.handleReturn} style={{ padding: "8px 16px" }}>
  //         Return to Home
  //       </button>
  //     </div>
  //   );
  // };

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
