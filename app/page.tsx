import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import BuiltOnStrip from "@/components/landing/BuiltOnStrip";
import PillarsSection from "@/components/landing/PillarsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ChatSection from "@/components/landing/ChatSection";
import AgentDemoSection from "@/components/landing/AgentDemoSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WhoWeServeSection from "@/components/landing/WhoWeServeSection";
import PricingSection from "@/components/landing/PricingSection";
import SecuritySection from "@/components/landing/SecuritySection";
import FxSection from "@/components/landing/FxSection";
import FaqSection from "@/components/landing/FaqSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <NavBar />
      <HeroSection />
      <BuiltOnStrip />
      <PillarsSection />
      <HowItWorksSection />
      <ChatSection />
      <AgentDemoSection />
      <FeaturesSection />
      <SecuritySection />
      <FxSection />
      <WhoWeServeSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
