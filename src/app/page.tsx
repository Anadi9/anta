import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BrandCard from "@/components/BrandCard";
import Services from "@/components/Services";
import WhatYouGet from "@/components/WhatYouGet";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        {/* <BrandCard /> */}
        <div id="services">
          <Services />
        </div>
        <WhatYouGet />
        {/* <div id="pricing">
          <Pricing />
        </div> */}
        <div id="contact">
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}

