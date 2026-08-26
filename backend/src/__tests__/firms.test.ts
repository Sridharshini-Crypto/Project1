import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseFirmsCsv } from "../services/firmsService.js";

const SAMPLE = `latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,instrument,confidence,version,bright_ti5,frp,daynight
13.0827,80.2707,340.1,0.4,0.4,2026-08-25,1842,N,VIIRS,high,2.0NRT,298.1,22.4,N
91.0,80.2,340.1,0.4,0.4,2026-08-25,1842,N,VIIRS,high,2.0NRT,298.1,22.4,N
`;

describe("FIRMS CSV parsing", () => {
  it("normalizes valid rows and skips invalid coordinates", () => {
    const rows = parseFirmsCsv(SAMPLE, "TEST");
    assert.equal(rows.length, 1);
    assert.equal(rows[0].latitude, 13.0827);
    assert.equal(rows[0].longitude, 80.2707);
    assert.equal(rows[0].instrument, "VIIRS");
    assert.equal(rows[0].source, "TEST");
    assert.ok(rows[0].id.includes("13.0827"));
  });
});
