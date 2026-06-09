import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import BuiltOnStrip from "@/components/landing/BuiltOnStrip";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ChatSection from "@/components/landing/ChatSection";
import AgentDemoSection from "@/components/landing/AgentDemoSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WhoWeServeSection from "@/components/landing/WhoWeServeSection";
import PricingSection from "@/components/landing/PricingSection";
import TrustSection from "@/components/landing/TrustSection";
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
      <ProblemSection />
      <HowItWorksSection />
      <ChatSection />
      <AgentDemoSection />
      <FeaturesSection />
      <WhoWeServeSection />
      <PricingSection />
      <TrustSection />
      <SecuritySection />
      <FxSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
