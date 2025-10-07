import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Code, Smartphone, Zap, Database, Shield, Cpu, Cloud, Lock, BarChart3, Users, GitBranch } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: 'Custom Website Builder - Get Your Website Built According to Requirements',
  description: 'Professional custom website builder service. We build websites exactly according to your requirements and specifications. Contact us to get your custom website built.',
  keywords: 'custom website builder, build website according to requirements, custom website development, website creation service, professional website builder, custom web design',
  openGraph: {
    title: 'Custom Website Builder - Get Your Website Built According to Requirements',
    description: 'Professional custom website builder service. We build websites exactly according to your requirements and specifications. Contact us to get your custom website built.',
    type: 'website',
  },
}

const customWebsiteTypes = [
  {
    icon: Globe,
    title: "Business Websites",
    description: "Professional websites for businesses of all sizes. Custom-built to showcase your brand and convert visitors into customers.",
    features: ["Custom Design", "Lead Generation", "Contact Forms", "SEO Optimized"],
    examples: ["Corporate Sites", "Service Pages", "About Sections", "Portfolio"],
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Code,
    title: "E-commerce Websites",
    description: "Complete online stores with shopping carts, payment processing, and inventory management.",
    features: ["Product Catalog", "Shopping Cart", "Payment Gateway", "Order Management"],
    examples: ["Online Stores", "Product Pages", "Checkout Process", "User Accounts"],
    color: "from-green-500 to-green-600"
  },
  {
    icon: Smartphone,
    title: "Landing Pages",
    description: "High-converting landing pages designed to capture leads and drive specific actions.",
    features: ["Lead Capture", "A/B Testing", "Fast Loading", "Mobile Optimized"],
    examples: ["Campaign Pages", "Product Launches", "Event Pages", "Lead Magnets"],
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Zap,
    title: "Web Applications",
    description: "Complex web applications with custom functionality, user management, and data processing.",
    features: ["User Authentication", "Database Integration", "API Development", "Custom Features"],
    examples: ["SaaS Platforms", "Management Systems", "Data Dashboards", "User Portals"],
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Portfolio Websites",
    description: "Beautiful portfolio websites to showcase your work and attract potential clients.",
    features: ["Image Galleries", "Project Showcases", "Contact Integration", "Responsive Design"],
    examples: ["Design Portfolios", "Photography Sites", "Creative Work", "Professional Profiles"],
    color: "from-red-500 to-red-600"
  },
  {
    icon: Cloud,
    title: "Blog & Content Sites",
    description: "Content management systems for blogs, news sites, and content-heavy websites.",
    features: ["CMS Integration", "Content Management", "SEO Features", "Social Sharing"],
    examples: ["Blog Platforms", "News Sites", "Content Hubs", "Educational Sites"],
    color: "from-cyan-500 to-blue-500"
  }
];

const processSteps = [
  {
    step: "01",
    title: "Requirements Analysis",
    description: "We discuss your needs, goals, and vision for the website."
  },
  {
    step: "02", 
    title: "Design & Planning",
    description: "Create wireframes, mockups, and detailed project specifications."
  },
  {
    step: "03",
    title: "Development",
    description: "Build your website using modern technologies and best practices."
  },
  {
    step: "04",
    title: "Testing & Launch",
    description: "Thorough testing, optimization, and deployment to your hosting."
  }
];

export default function CustomWebsitesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <div className="flex items-center justify-center gap-3 text-sm text-brand-purple font-medium">
                <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse"></div>
                <span>Custom Website Builder Service</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold font-righteous">
                <span className="block text-foreground">Get Your Website</span>
                <span className="block bg-gradient-brand bg-clip-text text-transparent">
                  Built According to
                </span>
                <span className="block text-brand-purple text-2xl md:text-3xl font-normal">
                  Your Requirements
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                We build custom websites exactly according to your specifications. Tell us what you need, 
                and we'll create a website that perfectly matches your vision and business requirements.
              </p>
            </div>

            {/* Website Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {customWebsiteTypes.map((type, index) => (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center shadow-md`}>
                        <type.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Key Features:</h4>
                        <div className="space-y-1">
                          {type.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-brand-purple rounded-full"></div>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Examples:</h4>
                        <div className="flex flex-wrap gap-1">
                          {type.examples.map((example, idx) => (
                            <span key={idx} className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-1 rounded">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Process Section */}
            <div className="bg-card rounded-2xl p-8 mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Our Development Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-purple to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <Card className="text-center p-6">
                <Cpu className="w-12 h-12 text-brand-purple mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Modern Technologies</h3>
                <p className="text-muted-foreground">We use the latest web technologies and frameworks for optimal performance.</p>
              </Card>
              
              <Card className="text-center p-6">
                <Zap className="w-12 h-12 text-brand-purple mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">Efficient development process ensures quick turnaround without compromising quality.</p>
              </Card>
              
              <Card className="text-center p-6">
                <Shield className="w-12 h-12 text-brand-purple mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Quality Assurance</h3>
                <p className="text-muted-foreground">Thorough testing and quality checks ensure your website works perfectly.</p>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-brand-purple/10 to-blue-500/10 rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Build Your Custom Website?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Tell us about your requirements and let's create a website that perfectly fits your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/start-project" 
                  className="bg-brand-purple text-white px-8 py-3 rounded-lg hover:bg-brand-purple/90 transition-colors"
                >
                  Start Your Project
                </a>
                <a 
                  href="/#contact" 
                  className="border border-brand-purple text-brand-purple px-8 py-3 rounded-lg hover:bg-brand-purple hover:text-white transition-colors"
                >
                  Discuss Requirements
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
