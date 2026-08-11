import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import BuiltOnStrip from "@/components/landing/BuiltOnStrip";
import PillarsSection from "@/components/landing/PillarsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AgentDemoSection from "@/components/landing/AgentDemoSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WhoWeServeSection from "@/components/landing/WhoWeServeSection";
import PricingSection from "@/components/landing/PricingSection";
import SecuritySection from "@/components/landing/SecuritySection";
import FaqSection from "@/components/landing/FaqSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <NavBar />
      <HeroSection />
      <BuiltOnStrip />
      <PillarsSection />
      <HowItWorksSection />
      <AgentDemoSection />
      <FeaturesSection />
      <SecuritySection />
      <WhoWeServeSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
