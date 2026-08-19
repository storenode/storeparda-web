export const GST_THRESHOLD_PAISE = 250_000; // ₹2,500 per piece

export interface GstLineInput {
  unitPricePaise: number;
  quantity: number;
  lineDiscountPaise?: number;
  interState?: boolean;
}

/**
 * Apparel GST (HSN 61 / 62), rates as revised w.e.f. 22 Sep 2025:
 *   sale value ≤ ₹2,500 per piece → 5%
 *   sale value >  ₹2,500 per piece → 18%   (this replaced the old ₹1,000 / 12% structure)
 * The threshold is applied to the POST-discount per-piece value, so a discount can pull an
 * item down into the 5% slab. That edge case is exactly what Constitution §2.V calls out.
 */
export function calculateGstForLine(input: GstLineInput) {
  const {
    unitPricePaise,
    quantity,
    lineDiscountPaise = 0,
    interState = false,
  } = input;

  if (!Number.isInteger(unitPricePaise) || unitPricePaise < 0)
    throw new RangeError(
      "unitPricePaise must be a non-negative integer (paise)",
    );
  if (!Number.isInteger(quantity) || quantity <= 0)
    throw new RangeError("quantity must be a positive integer");
  if (!Number.isInteger(lineDiscountPaise) || lineDiscountPaise < 0)
    throw new RangeError(
      "lineDiscountPaise must be a non-negative integer (paise)",
    );

  const gross = unitPricePaise * quantity;
  if (lineDiscountPaise > gross)
    throw new RangeError("discount exceeds line value");

  const taxableValuePaise = gross - lineDiscountPaise;
  // Threshold applies to the POST-discount per-piece value (§2.V edge case)
  const perPieceAfterDiscount = Math.round(taxableValuePaise / quantity);
  const ratePercent: 5 | 18 =
    perPieceAfterDiscount <= GST_THRESHOLD_PAISE ? 5 : 18;

  const totalTaxPaise = Math.round((taxableValuePaise * ratePercent) / 100);

  let cgstPaise = 0,
    sgstPaise = 0,
    igstPaise = 0;
  if (interState) {
    igstPaise = totalTaxPaise;
  } else {
    cgstPaise = Math.floor(totalTaxPaise / 2);
    sgstPaise = totalTaxPaise - cgstPaise; // odd paise lands in SGST, never lost
  }

  return {
    taxableValuePaise,
    ratePercent,
    cgstPaise,
    sgstPaise,
    igstPaise,
    totalTaxPaise,
    totalPaise: taxableValuePaise + totalTaxPaise,
  };
}
