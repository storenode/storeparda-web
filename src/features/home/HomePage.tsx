import { Navbar } from "@/features/home/components/Navbar";
import { Hero } from "@/features/home/components/Hero";
import { FeaturesSection } from "@/features/home/components/FeaturesSection";
import { SellingPointsSection } from "@/features/home/components/SellingPointsSection";
import { CTASection } from "@/features/home/components/CTASection";
import { Footer } from "@/features/home/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-full bg-bg text-fg">
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <SellingPointsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
