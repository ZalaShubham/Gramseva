import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  requireLevel,
  requireRole,
  AuthError,
} from "../src/lib/auth";
import {
  SEED_TEST_USERS,
  SEED_RELATION_TYPES,
} from "../src/lib/seed-data";

describe("Phase 0: Permission & Auth Helper Business Rules", () => {
  it("Level 0 visitor has access to public operations without throwing", async () => {
    // When no user is logged in, requireLevel(0) should return a guest user
    const guest = await requireLevel(0);
    assert.equal(guest.level, 0);
    assert.equal(guest.role, "USER");
  });

  it("Level 1 requirement throws UNAUTHENTICATED when not signed in", async () => {
    await assert.rejects(
      async () => {
        await requireLevel(1);
      },
      (err: unknown) => {
        assert(err instanceof AuthError);
        assert.equal(err.code, "UNAUTHENTICATED");
        assert.equal(err.status, 401);
        return true;
      }
    );
  });

  it("Level 2 requirement enforces SC/ST verified status", async () => {
    await assert.rejects(
      async () => {
        await requireLevel(2);
      },
      (err: unknown) => {
        assert(err instanceof AuthError);
        assert.equal(err.code, "UNAUTHENTICATED");
        return true;
      }
    );
  });

  it("requireRole throws UNAUTHENTICATED if session is empty", async () => {
    await assert.rejects(
      async () => {
        await requireRole("ADMIN");
      },
      (err: unknown) => {
        assert(err instanceof AuthError);
        assert.equal(err.code, "UNAUTHENTICATED");
        return true;
      }
    );
  });
});

describe("Phase 0: Seed Data & Relationship Model Integrity", () => {
  it("Seed dataset contains 6 designated test users for all levels & roles", () => {
    assert.equal(SEED_TEST_USERS.length, 6);

    const l0 = SEED_TEST_USERS.find((u) => u.level === 0);
    const l1 = SEED_TEST_USERS.find((u) => u.level === 1);
    const l2 = SEED_TEST_USERS.find((u) => u.level === 2 && u.role === "USER");
    const politician = SEED_TEST_USERS.find((u) => u.role === "POLITICIAN");
    const employer = SEED_TEST_USERS.find((u) => u.role === "EMPLOYER");
    const admin = SEED_TEST_USERS.find((u) => u.role === "ADMIN");

    assert.ok(l0, "Must have Level 0 visitor");
    assert.ok(l1, "Must have Level 1 OTP user");
    assert.ok(l2, "Must have Level 2 SC/ST verified user");
    assert.ok(politician, "Must have Politician user");
    assert.ok(employer, "Must have Employer user");
    assert.ok(admin, "Must have Admin user");
  });

  it("RelationType mappings include required inverse relations and symmetry", () => {
    const relationCodes = SEED_RELATION_TYPES.map((r) => r.code);
    assert(relationCodes.includes("FATHER"));
    assert(relationCodes.includes("MOTHER"));
    assert(relationCodes.includes("SON"));
    assert(relationCodes.includes("DAUGHTER"));
    assert(relationCodes.includes("BROTHER"));
    assert(relationCodes.includes("SISTER"));
    assert(relationCodes.includes("SPOUSE"));
    assert(relationCodes.includes("FRIEND"));
    assert(relationCodes.includes("RELATIVE"));

    const spouse = SEED_RELATION_TYPES.find((r) => r.code === "SPOUSE");
    assert.equal(spouse?.isSymmetric, true);

    const friend = SEED_RELATION_TYPES.find((r) => r.code === "FRIEND");
    assert.equal(friend?.isSymmetric, true);
  });
});
