import { mockRequest, DEMO_EMAIL, DEMO_PASSWORD, DEMO_TOKEN } from "../services/mock-api";

// ── AI chat / aiReply ─────────────────────────────────────────────────────────

describe("POST /ai/chat — aiReply keyword routing", () => {
  const chat = (message: string) =>
    mockRequest<{ reply: string }>("POST", "/ai/chat", { message });

  test("responds to medication keyword", () => {
    expect(chat("What about her medication?").reply).toContain("medication");
  });

  test("responds to 'med' shorthand", () => {
    expect(chat("med update").reply).toContain("medication");
  });

  test("responds to 'pill' keyword", () => {
    expect(chat("any pills today?").reply).toContain("medication");
  });

  test("responds to appointment keyword", () => {
    expect(chat("any appointment today?").reply).toContain("appointment");
  });

  test("responds to 'doctor' keyword", () => {
    expect(chat("who is the doctor?").reply).toContain("appointment");
  });

  test("responds to symptom keyword", () => {
    expect(chat("any symptoms?").reply).toContain("symptom");
  });

  test("responds to 'feeling' keyword", () => {
    expect(chat("how is she feeling?").reply).toContain("symptom");
  });

  test("responds to blood pressure keyword", () => {
    expect(chat("blood pressure reading?").reply).toContain("Blood pressure");
  });

  test("responds to 'bp' keyword", () => {
    expect(chat("what is the bp?").reply).toContain("Blood pressure");
  });

  test("responds to emergency keyword", () => {
    expect(chat("emergency contact?").reply).toContain("Emergency contact");
  });

  test("is case-insensitive for keywords", () => {
    expect(chat("MEDICATION").reply).toContain("medication");
  });

  test("returns default response for unrecognised message", () => {
    const reply = chat("hello there").reply;
    expect(reply).toBeTruthy();
    expect(typeof reply).toBe("string");
  });
});

// ── Auth ──────────────────────────────────────────────────────────────────────

describe("Auth endpoints", () => {
  test("POST /auth/login — valid credentials return token and user", () => {
    const result = mockRequest<{ token: string; user: { email: string } }>(
      "POST", "/auth/login", { email: DEMO_EMAIL, password: DEMO_PASSWORD }
    );
    expect(result.token).toBe(DEMO_TOKEN);
    expect(result.user.email).toBe(DEMO_EMAIL);
  });

  test("POST /auth/login — wrong password throws", () => {
    expect(() =>
      mockRequest("POST", "/auth/login", { email: DEMO_EMAIL, password: "wrong" })
    ).toThrow("Invalid email or password.");
  });

  test("POST /auth/login — wrong email throws", () => {
    expect(() =>
      mockRequest("POST", "/auth/login", { email: "other@test.com", password: DEMO_PASSWORD })
    ).toThrow("Invalid email or password.");
  });

  test("POST /auth/signup — returns token and a new user with generated id", () => {
    const result = mockRequest<{ token: string; user: { id: string; name: string; email: string } }>(
      "POST", "/auth/signup", { name: "Jane Smith", email: "jane@test.com", password: "password1" }
    );
    expect(result.token).toBe(DEMO_TOKEN);
    expect(result.user.name).toBe("Jane Smith");
    expect(result.user.email).toBe("jane@test.com");
    expect(typeof result.user.id).toBe("string");
    expect(result.user.id.length).toBeGreaterThan(0);
  });

  test("POST /auth/signup — two signups produce different ids", () => {
    const r1 = mockRequest<{ user: { id: string } }>(
      "POST", "/auth/signup", { name: "A", email: "a@test.com", password: "aaaaaa" }
    );
    const r2 = mockRequest<{ user: { id: string } }>(
      "POST", "/auth/signup", { name: "B", email: "b@test.com", password: "bbbbbb" }
    );
    expect(r1.user.id).not.toBe(r2.user.id);
  });

  test("GET /auth/me — returns the demo user", () => {
    const user = mockRequest<{ id: string; email: string }>("GET", "/auth/me");
    expect(user.email).toBe(DEMO_EMAIL);
    expect(user.id).toBe("u1");
  });
});

// ── Profile ───────────────────────────────────────────────────────────────────

describe("Profile endpoints", () => {
  test("GET /profile — returns a profile object with required fields", () => {
    const profile = mockRequest<{ id: string; name: string; email: string }>("GET", "/profile");
    expect(profile.id).toBeDefined();
    expect(profile.name).toBeDefined();
    expect(profile.email).toBeDefined();
  });

  test("PATCH /profile — merges updated fields", () => {
    const updated = mockRequest<{ phone: string; updatedAt: string }>(
      "PATCH", "/profile", { phone: "(999) 999-9999" }
    );
    expect(updated.phone).toBe("(999) 999-9999");
    expect(updated.updatedAt).toBeTruthy();
  });
});

// ── Medications ───────────────────────────────────────────────────────────────

describe("Medications endpoints", () => {
  test("GET /medications — returns an array", () => {
    const meds = mockRequest<unknown[]>("GET", "/medications");
    expect(Array.isArray(meds)).toBe(true);
  });

  test("POST /medications — creates a new medication with id and timestamps", () => {
    const body = {
      name: "Aspirin",
      dosage: "100mg",
      instruction: "With food",
      scheduledTime: "8:00 AM",
      timeSlot: "morning",
      status: "upcoming",
    };
    const med = mockRequest<{ id: string; name: string; createdAt: string; updatedAt: string }>(
      "POST", "/medications", body
    );
    expect(med.id).toBeTruthy();
    expect(med.name).toBe("Aspirin");
    expect(med.createdAt).toBeTruthy();
    expect(med.updatedAt).toBeTruthy();
  });

  test("PATCH /medications/:id/taken — updates status to 'given' and sets takenAt", () => {
    const meds = mockRequest<Array<{ id: string; status: string }>>("GET", "/medications");
    const targetId = meds[1].id;

    mockRequest("PATCH", `/medications/${targetId}/taken`);

    const after = mockRequest<Array<{ id: string; status: string; takenAt?: string }>>("GET", "/medications");
    const updated = after.find((m) => m.id === targetId);
    expect(updated?.status).toBe("given");
    expect(updated?.takenAt).toBeTruthy();
  });
});

// ── Appointments ──────────────────────────────────────────────────────────────

describe("Appointments endpoints", () => {
  test("GET /appointments — returns an array", () => {
    const appts = mockRequest<unknown[]>("GET", "/appointments");
    expect(Array.isArray(appts)).toBe(true);
  });

  test("POST /appointments — creates a new appointment with id and timestamps", () => {
    const body = {
      doctorName: "Dr. Test",
      specialty: "GP",
      location: "Clinic",
      dateTime: new Date().toISOString(),
      type: "inPerson",
      status: "upcoming",
    };
    const appt = mockRequest<{ id: string; doctorName: string; createdAt: string }>(
      "POST", "/appointments", body
    );
    expect(appt.id).toBeTruthy();
    expect(appt.doctorName).toBe("Dr. Test");
    expect(appt.createdAt).toBeTruthy();
  });

  test("PATCH /appointments/:id — merges updated fields", () => {
    const appts = mockRequest<Array<{ id: string }>>( "GET", "/appointments");
    const targetId = appts[0].id;

    const updated = mockRequest<{ id: string; notes: string; updatedAt: string }>(
      "PATCH", `/appointments/${targetId}`, { notes: "Bring x-ray" }
    );
    expect(updated.id).toBe(targetId);
    expect(updated.notes).toBe("Bring x-ray");
    expect(updated.updatedAt).toBeTruthy();
  });
});

// ── Symptoms ──────────────────────────────────────────────────────────────────

describe("Symptoms endpoints", () => {
  test("GET /symptoms — returns an array", () => {
    const logs = mockRequest<unknown[]>("GET", "/symptoms");
    expect(Array.isArray(logs)).toBe(true);
  });

  test("POST /symptoms — creates a new log and prepends it to the array", () => {
    const before = mockRequest<Array<{ id: string }>>("GET", "/symptoms");
    const body = { symptom: "headache", severity: 2, note: "Mild" };

    const created = mockRequest<{ id: string; symptom: string }>("POST", "/symptoms", body);
    expect(created.id).toBeTruthy();
    expect(created.symptom).toBe("headache");

    const after = mockRequest<Array<{ id: string }>>("GET", "/symptoms");
    expect(after[0].id).toBe(created.id);
    expect(after.length).toBe(before.length + 1);
  });
});

// ── Emergency contacts & incidents ───────────────────────────────────────────

describe("Emergency endpoints", () => {
  test("GET /emergency-contacts — returns an array", () => {
    const contacts = mockRequest<unknown[]>("GET", "/emergency-contacts");
    expect(Array.isArray(contacts)).toBe(true);
    expect(contacts.length).toBeGreaterThan(0);
  });

  test("POST /incidents — returns empty object", () => {
    const result = mockRequest<Record<string, never>>("POST", "/incidents", { type: "fall" });
    expect(result).toEqual({});
  });
});

// ── Caretaker notes ───────────────────────────────────────────────────────────

describe("Caretaker notes endpoints", () => {
  test("GET /caretaker-notes — returns an array", () => {
    const notes = mockRequest<unknown[]>("GET", "/caretaker-notes");
    expect(Array.isArray(notes)).toBe(true);
    expect(notes.length).toBeGreaterThan(0);
  });

  test("PATCH /caretaker-notes/:id/reply — updates replyContent", () => {
    const notes = mockRequest<Array<{ id: string }>>("GET", "/caretaker-notes");
    const targetId = notes[0].id;

    const updated = mockRequest<{ id: string; replyContent: string; updatedAt: string }>(
      "PATCH", `/caretaker-notes/${targetId}/reply`, { reply: "Acknowledged." }
    );
    expect(updated.id).toBe(targetId);
    expect(updated.replyContent).toBe("Acknowledged.");
    expect(updated.updatedAt).toBeTruthy();
  });
});

// ── Unhandled routes ──────────────────────────────────────────────────────────

describe("Unhandled routes", () => {
  test("throws an error for unknown endpoint", () => {
    expect(() => mockRequest("GET", "/unknown-route")).toThrow("[mock] Unhandled GET /unknown-route");
  });

  test("throws an error for wrong method on known path", () => {
    expect(() => mockRequest("DELETE", "/profile")).toThrow("[mock] Unhandled DELETE /profile");
  });
});
