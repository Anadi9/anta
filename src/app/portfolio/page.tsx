import type { Metadata } from 'next'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Portfolio from "@/components/Portfolio";

export const metadata: Metadata = {
  title: 'Portfolio — AI Product Studio Work | ANTA',
  description:
    'Selected builds from our studio: MVPs, platforms, and systems focused on validation, revenue, and scale — web, mobile, and backend.',
  keywords:
    'portfolio, MVP, product studio, AI, web development, mobile apps, React, Next.js, React Native, case studies',
  openGraph: {
    title: 'Portfolio — AI Product Studio Work | ANTA',
    description:
      'Selected builds from our studio: MVPs, platforms, and systems focused on validation, revenue, and scale.',
    type: 'website',
  },
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="pt-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/bg-hero.jpg"
              alt="Portfolio background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center space-y-6 mb-16">

              <h1 className="text-5xl md:text-7xl font-bold font-righteous">
                <span className="block text-foreground">Shipped for</span>
                <span className="block bg-gradient-brand bg-clip-text text-transparent">
                  Founders & Teams
                </span>
                <span className="block text-brand-purple text-2xl md:text-3xl font-normal">
                  Validation, revenue, scale
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                A snapshot of products and systems we’ve built — from customer-facing platforms to high-load backends.
              </p>
            </div>
          </div>
        </section>

        {/* Portfolio Component */}
        <Portfolio />
      </main>

      <Footer />
    </div>
  );
}
