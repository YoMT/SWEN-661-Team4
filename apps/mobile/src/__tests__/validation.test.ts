import { validate } from "../services/validation";

describe("validate.email", () => {
  test("accepts correct email format", () => {
    expect(validate.email("demo@careConnect.com")).toBeNull();
  });

  test("accepts email with subdomain", () => {
    expect(validate.email("user@mail.example.com")).toBeNull();
  });

  test("rejects incorrect email format", () => {
    expect(validate.email("wrong-email")).toBe("Please enter a valid email address.");
  });

  test("rejects empty string", () => {
    expect(validate.email("")).toBe("Please enter a valid email address.");
  });
});

describe("validate.password", () => {
  test("accepts password of exactly 6 characters", () => {
    expect(validate.password("123456")).toBeNull();
  });

  test("accepts password longer than 6 characters", () => {
    expect(validate.password("securePassword1")).toBeNull();
  });

  test("rejects short password", () => {
    expect(validate.password("123")).toBe("Password must be at least 6 characters.");
  });

  test("rejects empty password", () => {
    expect(validate.password("")).toBe("Password must be at least 6 characters.");
  });
});

describe("validate.required", () => {
  test("accepts required text", () => {
    expect(validate.required("CareConnect")).toBeNull();
  });

  test("rejects empty required text", () => {
    expect(validate.required("", "Name")).toBe("Name is required.");
  });

  test("rejects whitespace-only string", () => {
    expect(validate.required("   ")).toBe("This field is required.");
  });

  test("uses default field name when none provided", () => {
    expect(validate.required("")).toBe("This field is required.");
  });

  test("uses custom field name in error message", () => {
    expect(validate.required("", "Email")).toBe("Email is required.");
  });
});

describe("validate.loginForm", () => {
  test("accepts valid login form", () => {
    expect(validate.loginForm("demo@careConnect.com", "demo123")).toBeNull();
  });

  test("rejects invalid email", () => {
    expect(validate.loginForm("notanemail", "demo123")).toBe("Please enter a valid email address.");
  });

  test("rejects short password", () => {
    expect(validate.password("123")).toBe("Password must be at least 6 characters.");
  });

  test("short-circuits to email error when both fields are invalid", () => {
    expect(validate.loginForm("bad", "123")).toBe("Please enter a valid email address.");
  });
});

describe("validate.signupForm", () => {
  test("accepts all valid fields", () => {
    expect(validate.signupForm("John Doe", "john@example.com", "password123")).toBeNull();
  });

  test("rejects empty name", () => {
    expect(validate.signupForm("", "john@example.com", "password123")).toBe("Name is required.");
  });

  test("rejects whitespace-only name", () => {
    expect(validate.signupForm("   ", "john@example.com", "password123")).toBe("Name is required.");
  });

  test("rejects invalid email when name is valid", () => {
    expect(validate.signupForm("John", "notanemail", "password123")).toBe("Please enter a valid email address.");
  });

  test("rejects short password when name and email are valid", () => {
    expect(validate.signupForm("John", "john@example.com", "123")).toBe("Password must be at least 6 characters.");
  });

  test("validates name first when all fields are invalid", () => {
    expect(validate.signupForm("", "bad", "123")).toBe("Name is required.");
  });
});
