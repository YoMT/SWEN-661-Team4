import {
  setAuthToken,
  registerErrorHandler,
  registerUnauthorizedHandler,
  api,
} from "../services/api";
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_TOKEN } from "../services/mock-api";

// EXPO_PUBLIC_API_URL=http://localhost is set in jest.env.js → USE_MOCK = false
// All requests go through fetch; MSW intercepts them in jest.setup.js

beforeEach(() => {
  setAuthToken(null);
  registerErrorHandler(null);
  registerUnauthorizedHandler(null);
});

// ── setAuthToken ──────────────────────────────────────────────────────────────

describe("setAuthToken", () => {
  test("sets and clears the token without throwing", () => {
    expect(() => setAuthToken("my-token")).not.toThrow();
    expect(() => setAuthToken(null)).not.toThrow();
  });
});

// ── registerErrorHandler ──────────────────────────────────────────────────────

describe("registerErrorHandler", () => {
  test("registers and clears a handler without throwing", () => {
    const handler = jest.fn();
    expect(() => registerErrorHandler(handler)).not.toThrow();
    expect(() => registerErrorHandler(null)).not.toThrow();
  });

  test("calls the handler when an API endpoint returns an error status", async () => {
    const onError = jest.fn();
    registerErrorHandler(onError);

    await expect(
      api.post("/auth/login", { email: "bad@test.com", password: "wrong" })
    ).rejects.toThrow();

    expect(onError).toHaveBeenCalledWith(expect.stringContaining("400"));
  });
});

// ── registerUnauthorizedHandler ───────────────────────────────────────────────

describe("registerUnauthorizedHandler", () => {
  test("registers and clears a handler without throwing", () => {
    const handler = jest.fn();
    expect(() => registerUnauthorizedHandler(handler)).not.toThrow();
    expect(() => registerUnauthorizedHandler(null)).not.toThrow();
  });
});

// ── api convenience methods (mock mode) ───────────────────────────────────────

describe("api.get", () => {
  test("GET /auth/me returns the demo user", async () => {
    const user = await api.get<{ id: string; email: string }>("/auth/me");
    expect(user.email).toBe(DEMO_EMAIL);
    expect(user.id).toBe("u1");
  });

  test("GET /medications returns an array", async () => {
    const meds = await api.get<unknown[]>("/medications");
    expect(Array.isArray(meds)).toBe(true);
  });

  test("GET /appointments returns an array", async () => {
    const appts = await api.get<unknown[]>("/appointments");
    expect(Array.isArray(appts)).toBe(true);
  });
});

describe("api.post", () => {
  test("POST /auth/login with valid credentials returns token", async () => {
    const result = await api.post<{ token: string }>("/auth/login", {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    expect(result.token).toBe(DEMO_TOKEN);
  });

  test("POST /auth/login with invalid credentials rejects", async () => {
    await expect(
      api.post("/auth/login", { email: "wrong@test.com", password: "wrong" })
    ).rejects.toThrow();
  });

  test("POST /ai/chat returns a reply string", async () => {
    const result = await api.post<{ reply: string }>("/ai/chat", { message: "medication?" });
    expect(typeof result.reply).toBe("string");
    expect(result.reply.length).toBeGreaterThan(0);
  });
});

describe("api.patch", () => {
  test("PATCH /profile merges fields and returns updated profile", async () => {
    const result = await api.patch<{ phone: string }>("/profile", { phone: "(111) 222-3333" });
    expect(result.phone).toBe("(111) 222-3333");
  });
});

describe("api.delete", () => {
  test("DELETE on an unhandled route rejects with an error", async () => {
    await expect(api.delete("/medications")).rejects.toThrow();
  });
});
