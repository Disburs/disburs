import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import BuiltOnStrip from "@/components/landing/BuiltOnStrip";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import WhoWeServeSection from "@/components/landing/WhoWeServeSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PlatformSection from "@/components/landing/PlatformSection";
import SecuritySection from "@/components/landing/SecuritySection";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <NavBar />
      <HeroSection />
      <BuiltOnStrip />
      <HowItWorksSection />
      <WhoWeServeSection />
      <FeaturesSection />
      <PlatformSection />
      <SecuritySection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
