import { describe, expect, it } from "vitest";
import { calculateGstForLine, GST_THRESHOLD_PAISE } from "./gstCalc";

describe("calculateGstForLine", () => {
  it("applies 5% at or below the ₹2,500 per-piece threshold", () => {
    const r = calculateGstForLine({
      unitPricePaise: GST_THRESHOLD_PAISE,
      quantity: 1,
    });
    expect(r.ratePercent).toBe(5);
    expect(r.totalPaise).toBe(262_500);
  });

  it("applies 18% above the threshold", () => {
    expect(
      calculateGstForLine({
        unitPricePaise: GST_THRESHOLD_PAISE + 100,
        quantity: 1,
      }).ratePercent,
    ).toBe(18);
  });

  it("drops to 5% when a discount pushes per-piece value below the threshold", () => {
    // ₹3,000 saree, ₹600 off → ₹2,400/piece → 5%, not 18%
    const r = calculateGstForLine({
      unitPricePaise: 300_000,
      quantity: 1,
      lineDiscountPaise: 60_000,
    });
    expect(r.ratePercent).toBe(5);
    expect(r.totalTaxPaise).toBe(12_000);
  });

  it("evaluates the threshold per piece, not per line total", () => {
    // 3 × ₹1,000 = ₹3,000 line total but ₹1,000/piece → still 5%
    expect(
      calculateGstForLine({ unitPricePaise: 100_000, quantity: 3 }).ratePercent,
    ).toBe(5);
  });

  it("splits intra-state tax into CGST + SGST with no rounding leak", () => {
    const r = calculateGstForLine({ unitPricePaise: 99_999, quantity: 1 });
    expect(r.cgstPaise + r.sgstPaise).toBe(r.totalTaxPaise);
    expect(r.igstPaise).toBe(0);
  });

  it("puts the whole tax in IGST for inter-state sales", () => {
    const r = calculateGstForLine({
      unitPricePaise: 100_000,
      quantity: 1,
      interState: true,
    });
    expect(r.igstPaise).toBe(r.totalTaxPaise);
  });

  it("rejects a discount larger than the line value", () => {
    expect(() =>
      calculateGstForLine({
        unitPricePaise: 100_000,
        quantity: 1,
        lineDiscountPaise: 100_001,
      }),
    ).toThrow(RangeError);
  });

  it("rejects non-integer paise (float money is a bug)", () => {
    expect(() =>
      calculateGstForLine({ unitPricePaise: 100_000.5, quantity: 1 }),
    ).toThrow(RangeError);
  });
});
