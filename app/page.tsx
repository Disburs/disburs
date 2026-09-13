import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import BuiltOn from "@/components/landing/BuiltOn";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import Pillars from "@/components/landing/Pillars";
import Audience from "@/components/landing/Audience";
import Security from "@/components/landing/Security";
import Pricing from "@/components/landing/Pricing";
import Faq from "@/components/landing/Faq";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main id="top" className="overflow-x-clip">
      {/* Marks JS as available before any content below paints, so `.reveal`
          only hides content when it can actually be revealed again. */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.currentScript.parentElement.classList.add('js')",
        }}
      />
      <Nav />
      <Hero />
      <BuiltOn />
      <Problem />
      <HowItWorks />
      <Pillars />
      <Audience />
      <Security />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
