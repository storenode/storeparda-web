import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Smartphone, IndianRupee } from "lucide-react";

export interface SellingPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const sellingPoints: SellingPoint[] = [
  {
    icon: Smartphone,
    title: "Built for the counter, not a desktop",
    description:
      "Every screen is designed for a ₹8,000 Android tablet with one hand free for the customer — big tap targets, fast first paint, no clutter.",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    description:
      "Store-level data isolation with row-level security. Nothing leaks between stores, ever.",
  },
  {
    icon: IndianRupee,
    title: "Priced for independent stores",
    description:
      "No franchise fees, no per-transaction cut. Built for the family-run cloth shop, not enterprise retail chains.",
  },
];
