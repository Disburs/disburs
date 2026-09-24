import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Statement from "@/components/landing/Statement";
import Privacy from "@/components/landing/Privacy";
import Agent from "@/components/landing/Agent";
import Advantages from "@/components/landing/Advantages";
import Rails from "@/components/landing/Rails";
import Audience from "@/components/landing/Audience";
import HowItWorks from "@/components/landing/HowItWorks";
import Security from "@/components/landing/Security";
import Pricing from "@/components/landing/Pricing";
import Faq from "@/components/landing/Faq";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main id="top" className="overflow-x-clip">
      {/* Scroll reveals are hidden by CSS until JS reveals them; without JS,
          show everything. Pure CSS — no DOM mutation before hydration. */}
      <noscript>
        <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <Nav />
      <Hero />
      <Privacy />
      <Statement />
      <Agent />
      <Advantages />
      <Rails />
      <Audience />
      <HowItWorks />
      <Security />
      <Pricing />
      <Faq />
      <Footer />
    </main>
  );
}
