import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Code, Smartphone, Zap, Database, Shield, Cpu, Cloud, Lock, BarChart3, Users, GitBranch } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: 'Custom Web Development Services - Professional Website Development',
  description: 'Professional custom web development services. We build websites according to your requirements using modern technologies. Contact us for custom website development.',
  keywords: 'custom web development, website development services, professional web developer, custom website builder, web development company, build website, custom web solutions',
  openGraph: {
    title: 'Custom Web Development Services - Professional Website Development',
    description: 'Professional custom web development services. We build websites according to your requirements using modern technologies. Contact us for custom website development.',
    type: 'website',
  },
}

const webDevelopmentServices = [
  {
    icon: Globe,
    title: "Custom Website Development",
    description: "Build unique websites tailored to your specific requirements. From simple landing pages to complex web applications.",
    features: ["Custom Design", "Responsive Layout", "Modern Technologies", "SEO Optimized"],
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Code,
    title: "Full-Stack Development",
    description: "Complete web solutions with frontend and backend development. We handle everything from database design to user interface.",
    features: ["React/Next.js", "Node.js/Python", "Database Design", "API Development"],
    color: "from-green-500 to-green-600"
  },
  {
    icon: Smartphone,
    title: "Mobile-First Development",
    description: "Responsive websites that work perfectly on all devices. Mobile-first approach for better user experience.",
    features: ["Responsive Design", "Mobile Optimization", "Cross-Browser Support", "Touch-Friendly"],
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Zap,
    title: "Fast Performance",
    description: "Lightning-fast websites with optimized code and modern performance techniques. Your users will love the speed.",
    features: ["Performance Optimization", "Fast Loading", "Code Optimization", "CDN Integration"],
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Secure websites with proper authentication, data protection, and regular security updates.",
    features: ["Security Implementation", "Data Protection", "SSL Certificates", "Regular Updates"],
    color: "from-red-500 to-red-600"
  },
  {
    icon: Cloud,
    title: "Modern Hosting",
    description: "Deploy on modern cloud platforms with automatic scaling, backups, and monitoring.",
    features: ["Cloud Deployment", "Auto-scaling", "Backup Systems", "24/7 Monitoring"],
    color: "from-cyan-500 to-blue-500"
  }
];

const technologies = [
  { name: "React", description: "Modern frontend framework" },
  { name: "Next.js", description: "Full-stack React framework" },
  { name: "Node.js", description: "Backend JavaScript runtime" },
  { name: "Python", description: "Powerful backend language" },
  { name: "TypeScript", description: "Type-safe JavaScript" },
  { name: "Tailwind CSS", description: "Utility-first CSS framework" },
  { name: "PostgreSQL", description: "Reliable database" },
  { name: "MongoDB", description: "NoSQL database" },
];

export default function WebDevelopmentPage() {
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
                <span>Custom Web Development Services</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold font-righteous">
                <span className="block text-foreground">Custom</span>
                <span className="block bg-gradient-brand bg-clip-text text-transparent">
                  Website Development
                </span>
                <span className="block text-brand-purple text-2xl md:text-3xl font-normal">
                  Built for You
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                We create custom websites tailored to your specific requirements. From simple landing pages 
                to complex web applications, we build solutions that work perfectly for your business needs.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {webDevelopmentServices.map((service, index) => (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center shadow-md`}>
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-brand-purple rounded-full"></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Technologies Section */}
            <div className="bg-card rounded-2xl p-8 mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Technologies We Use</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {technologies.map((tech, index) => (
                  <div key={index} className="text-center p-4 bg-background rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{tech.name}</h3>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-brand-purple/10 to-blue-500/10 rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Build Your Custom Website?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's discuss your requirements and create a website that perfectly fits your business needs.
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
                  Get Free Consultation
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
