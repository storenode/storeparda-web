import type { LucideIcon } from "lucide-react";
import { Barcode, Receipt, Truck, WifiOff, FileSpreadsheet, Package } from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: FeatureItem[] = [
  {
    icon: Truck,
    title: "Purchase-Trip tracking",
    description:
      "Log every sourcing trip — Surat, Kerala, Bangladesh — and track landed cost per piece before it ever reaches the shop.",
  },
  {
    icon: WifiOff,
    title: "Works with no internet",
    description:
      "Billing, stock, and trips all run offline-first. The counter never stops because the connection drops.",
  },
  {
    icon: Receipt,
    title: "GST-ready billing",
    description:
      "Correct CGST/SGST/IGST splits and slab rates on every invoice, with per-piece discount edge cases handled automatically.",
  },
  {
    icon: Package,
    title: "Inventory & variants",
    description:
      "Track size and color variants with barcode generation and scanning built in — not bolted on.",
  },
  {
    icon: Barcode,
    title: "Print-ready receipts",
    description:
      "Thermal or browser printing for every bill, formatted for the counter, not a desktop invoice template.",
  },
  {
    icon: FileSpreadsheet,
    title: "GST reports & export",
    description:
      "Filing-ready reports and GSTR export, so return season isn't a manual reconciliation exercise.",
  },
];
