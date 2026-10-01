import { Container, Heading } from "@/components/landing/Section";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-canvas py-24 md:py-36">
      <Container>
        <Heading as="h1" size="lg">Terms</Heading>
        <p className="mt-6 text-[15px] text-muted">Last updated: September 2026</p>
        <p className="mt-12 max-w-[60ch] text-[20px] leading-[1.5] text-muted">Our terms are coming soon.</p>
      </Container>
    </main>
  );
}
