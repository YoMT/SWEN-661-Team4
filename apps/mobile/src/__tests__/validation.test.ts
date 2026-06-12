import { validate } from "../services/validation";

describe("Validation utilities", () => {
  test("accepts correct email format", () => {
    expect(validate.email("demo@careConnect.com")).toBeNull();
  });

  test("rejects incorrect email format", () => {
    expect(validate.email("wrong-email")).toBe("Please enter a valid email address.");
  });

  test("accepts required text", () => {
    expect(validate.required("CareConnect")).toBeNull();
  });

  test("rejects empty required text", () => {
    expect(validate.required("", "Name")).toBe("Name is required.");
  });

  test("accepts valid login form", () => {
    expect(validate.loginForm("demo@careConnect.com", "demo123")).toBeNull();
  });

  test("rejects short password", () => {
    expect(validate.password("123")).toBe("Password must be at least 6 characters.");
  });
});