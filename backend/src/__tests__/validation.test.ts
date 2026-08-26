import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidLatitude, isValidLongitude, riskLevelFromScore } from "../utils/helpers.js";

describe("coordinate validation", () => {
  it("accepts Chennai coordinates", () => {
    assert.equal(isValidLatitude(13.0827), true);
    assert.equal(isValidLongitude(80.2707), true);
  });

  it("rejects out-of-range values", () => {
    assert.equal(isValidLatitude(91), false);
    assert.equal(isValidLongitude(-200), false);
  });
});

describe("risk levels", () => {
  it("maps score bands", () => {
    assert.equal(riskLevelFromScore(10), "LOW");
    assert.equal(riskLevelFromScore(45), "MODERATE");
    assert.equal(riskLevelFromScore(70), "HIGH");
    assert.equal(riskLevelFromScore(90), "CRITICAL");
  });
});
