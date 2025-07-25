import React from "react";
import "@testing-library/jest-dom";
import { validateXSS, validateSQLInjection } from "../../src/App";

describe("XSS Validation", () => {
  test("should detect script tags", () => {
    expect(validateXSS('<script>alert("xss")</script>')).toBe(true);
  });

  test("should detect javascript: URLs", () => {
    expect(validateXSS('javascript:alert("xss")')).toBe(true);
  });

  test("should detect iframe injections", () => {
    expect(validateXSS('<iframe src="javascript:alert(1)"></iframe>')).toBe(
      true
    );
  });

  test("should allow clean input", () => {
    expect(validateXSS("hello world")).toBe(false);
    expect(validateXSS("search term")).toBe(false);
  });

  test("should handle empty input", () => {
    expect(validateXSS("")).toBe(false);
  });
});

describe("SQL Injection Validation", () => {
  test("should detect OR-based injection", () => {
    expect(validateSQLInjection("admin' OR '1'='1")).toBe(true);
    expect(validateSQLInjection("1 OR 1=1")).toBe(true);
  });

  test("should detect UNION SELECT attacks", () => {
    expect(validateSQLInjection("1 UNION SELECT * FROM users")).toBe(true);
  });

  test("should detect SQL comments", () => {
    expect(validateSQLInjection("admin'--")).toBe(true);
    expect(validateSQLInjection("admin/*comment*/")).toBe(true);
  });

  test("should detect dangerous SQL commands", () => {
    expect(validateSQLInjection("'; DROP TABLE users;--")).toBe(true);
    expect(validateSQLInjection("'; DELETE FROM users;--")).toBe(true);
  });

  test("should allow clean input", () => {
    expect(validateSQLInjection("normal search term")).toBe(false);
    expect(validateSQLInjection("john@email.com")).toBe(false);
  });
});
