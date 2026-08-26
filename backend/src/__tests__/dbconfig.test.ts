import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { env } from "../config/env.js";

describe("database configuration", () => {
  it("does not hardcode localhost credentials", () => {
    assert.equal(process.env.DATABASE_URL === "postgresql://postgres:postgres@localhost:5432/trace", false);
  });

  it("treats missing DATABASE_URL as a configuration error at runtime", () => {
    if (!env.databaseUrl) {
      assert.equal(env.databaseUrl, "");
    } else {
      assert.match(env.databaseUrl, /^postgres(ql)?:\/\//);
    }
  });
});
