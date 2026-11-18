import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flatten(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

const enPath = path.resolve(__dirname, "../messages/en.json");
const guPath = path.resolve(__dirname, "../messages/gu.json");
const hiPath = path.resolve(__dirname, "../messages/hi.json");

const enRaw = JSON.parse(fs.readFileSync(enPath, "utf8"));
const guRaw = JSON.parse(fs.readFileSync(guPath, "utf8"));
const hiRaw = JSON.parse(fs.readFileSync(hiPath, "utf8"));

const en = flatten(enRaw);
const gu = flatten(guRaw);
const hi = flatten(hiRaw);

// Allowed identical values across languages (brand names, numbers, acronyms, placeholders)
function isAllowedIdentical(value: string): boolean {
  const trimmed = value.trim();

  // Pure numbers, symbols, placeholders, or phone numbers
  if (/^[0-9\s.,:;!?\/\\()\[\]\-_+*#@|•₹{}]+$/.test(trimmed)) {
    return true;
  }

  // Allowed brand names and technical acronyms
  const allowedTokens = new Set([
    "Gramseva",
    "SC",
    "ST",
    "SC/ST",
    "SC & ST",
    "L0",
    "L1",
    "L2",
    "OTP",
    "IT",
    "PSU",
    "MLA",
    "MP",
    "Next.js App Router (Turbopack)",
    "PostgreSQL / Prisma",
    "gu",
    "hi",
    "en",
  ]);

  if (allowedTokens.has(trimmed)) {
    return true;
  }

  return false;
}

describe("Phase 0: i18n Translation Completeness & Integrity", () => {
  it("Every key in en.json must be present and non-empty in gu.json and hi.json", () => {
    const missingInGu: string[] = [];
    const missingInHi: string[] = [];
    const emptyKeys: string[] = [];

    for (const [key, val] of Object.entries(en)) {
      if (gu[key] === undefined) missingInGu.push(key);
      if (hi[key] === undefined) missingInHi.push(key);
      if (!val || val.trim().length === 0) emptyKeys.push(`en:${key}`);
      if (gu[key] !== undefined && (!gu[key] || gu[key].trim().length === 0)) {
        emptyKeys.push(`gu:${key}`);
      }
      if (hi[key] !== undefined && (!hi[key] || hi[key].trim().length === 0)) {
        emptyKeys.push(`hi:${key}`);
      }
    }

    assert.deepEqual(missingInGu, [], `Keys missing in messages/gu.json: ${missingInGu.join(", ")}`);
    assert.deepEqual(missingInHi, [], `Keys missing in messages/hi.json: ${missingInHi.join(", ")}`);
    assert.deepEqual(emptyKeys, [], `Empty translation keys found: ${emptyKeys.join(", ")}`);
  });

  it("Every key in gu.json and hi.json must exist in en.json (no orphan keys)", () => {
    const orphanInGu = Object.keys(gu).filter((k) => en[k] === undefined);
    const orphanInHi = Object.keys(hi).filter((k) => en[k] === undefined);

    assert.deepEqual(orphanInGu, [], `Orphan keys in messages/gu.json: ${orphanInGu.join(", ")}`);
    assert.deepEqual(orphanInHi, [], `Orphan keys in messages/hi.json: ${orphanInHi.join(", ")}`);
  });

  it("No translated value in hi.json should be identical to gu.json (except brand names and numbers)", () => {
    const identicalGuHi: Array<{ key: string; value: string }> = [];

    for (const [key, hiValue] of Object.entries(hi)) {
      const guValue = gu[key];
      if (guValue !== undefined && guValue === hiValue && !isAllowedIdentical(hiValue)) {
        identicalGuHi.push({ key, value: hiValue });
      }
    }

    assert.deepEqual(
      identicalGuHi,
      [],
      `Identical values in GU and HI: ${JSON.stringify(identicalGuHi, null, 2)}`
    );
  });

  it("No translated value in hi.json or gu.json should be identical to en.json (except brand names and numbers)", () => {
    const identicalHiEn: Array<{ key: string; value: string }> = [];
    const identicalGuEn: Array<{ key: string; value: string }> = [];

    for (const [key, enValue] of Object.entries(en)) {
      if (hi[key] === enValue && !isAllowedIdentical(enValue)) {
        identicalHiEn.push({ key, value: enValue });
      }
      if (gu[key] === enValue && !isAllowedIdentical(enValue)) {
        identicalGuEn.push({ key, value: enValue });
      }
    }

    assert.deepEqual(
      identicalHiEn,
      [],
      `Identical values in HI and EN: ${JSON.stringify(identicalHiEn, null, 2)}`
    );
    assert.deepEqual(
      identicalGuEn,
      [],
      `Identical values in GU and EN: ${JSON.stringify(identicalGuEn, null, 2)}`
    );
  });

  it("messages/hi.json must not contain any Gujarati characters (proper Hindi enforcement)", () => {
    const gujaratiRegex = /[\u0A80-\u0AFF]/;
    const invalidHiKeys: Array<{ key: string; value: string }> = [];

    for (const [key, value] of Object.entries(hi)) {
      if (gujaratiRegex.test(value)) {
        invalidHiKeys.push({ key, value });
      }
    }

    assert.deepEqual(
      invalidHiKeys,
      [],
      `Gujarati characters found in messages/hi.json: ${JSON.stringify(invalidHiKeys, null, 2)}`
    );
  });

  it("messages/gu.json must not contain any Devanagari characters (proper Gujarati enforcement)", () => {
    const devanagariRegex = /[\u0900-\u097F]/;
    const invalidGuKeys: Array<{ key: string; value: string }> = [];

    for (const [key, value] of Object.entries(gu)) {
      if (devanagariRegex.test(value)) {
        invalidGuKeys.push({ key, value });
      }
    }

    assert.deepEqual(
      invalidGuKeys,
      [],
      `Devanagari characters found in messages/gu.json: ${JSON.stringify(invalidGuKeys, null, 2)}`
    );
  });
});

