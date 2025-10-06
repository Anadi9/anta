import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Brain, Smartphone, Zap, Database, Shield, Cpu, Cloud, Lock, BarChart3, Users, GitBranch, Code, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "MVP Web Applications",
    description: "Get to market fast with a solid MVP. We build lean, functional web apps that validate your idea without breaking the bank.",
    features: ["React/Next.js", "Rapid Development", "Cost-Effective", "User Testing"],
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Brain,
    title: "AI-Enhanced MVPs",
    description: "Add intelligent features to your MVP without the complexity. Smart chatbots, basic analytics, and AI that actually helps users.",
    features: ["Simple AI Integration", "Chatbot MVP", "Basic Analytics", "Smart Automation"],
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Database,
    title: "Startup Analytics",
    description: "Understand your users from day one. Simple dashboards that show what matters: user behavior, growth metrics, and key insights.",
    features: ["User Analytics", "Growth Tracking", "Simple Dashboards", "A/B Testing"],
    color: "from-green-500 to-green-600"
  },
  {
    icon: Zap,
    title: "Rapid Prototyping",
    description: "Test ideas quickly with working prototypes. We build fast, iterate faster, and help you find product-market fit.",
    features: ["Quick Builds", "User Feedback", "Fast Iterations", "Validation"],
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Startup Security",
    description: "Secure from day one, but not over-engineered. We implement essential security without the enterprise complexity.",
    features: ["Basic Auth", "Data Protection", "Secure Hosting", "Privacy First"],
    color: "from-red-500 to-red-600"
  },
  {
    icon: Cloud,
    title: "Scalable Deployment",
    description: "Start small, scale smart. We deploy on cost-effective platforms that grow with your startup, not against it.",
    features: ["Vercel/Netlify", "Auto-scaling", "Cost Monitoring", "Easy Updates"],
    color: "from-cyan-500 to-blue-500"
  }
];

const startupFeatures = [
  { icon: Cpu, title: "Fast Development", description: "2-4 weeks to MVP" },
  { icon: BarChart3, title: "Growth Analytics", description: "Track what matters" },
  { icon: Users, title: "User Validation", description: "Test with real users" },
  { icon: GitBranch, title: "Agile Process", description: "Iterate quickly" },
  { icon: Lock, title: "Startup Security", description: "Secure but simple" },
  { icon: Zap, title: "Cost Effective", description: "Budget-friendly" }
];

const Services = () => {
  return (
    <section id="services" className="py-20 px-6 relative overflow-hidden">
      {/* Full Width Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/images/bg-hero.jpg" 
          alt="Services background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-6 mb-10">
          <div className="flex items-center justify-center gap-3 text-sm text-brand-purple font-medium">
            <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse"></div>
            <span>MVP & Startup Services</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold font-righteous">
            <span className="block text-foreground">Build</span>
            <span className="block bg-gradient-brand bg-clip-text text-transparent">
              Validate
            </span>
            <span className="block text-brand-purple text-2xl md:text-3xl font-normal">
              Scale
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We help startups and businesses build custom websites and web applications that work perfectly for their needs. 
            From MVPs to full-scale web solutions - fast development, real validation, and smart scaling.
          </p>
        </div>

        {/* Startup Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {startupFeatures.map((feature, index) => (
            <div key={index} className="group relative">
              {/* Card Container */}
              <div className="relative p-4 rounded-xl bg-white/60 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-2xl hover:shadow-brand-purple/10 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Particles Effect */}
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-purple/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-blue-500/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-700"></div>
                
                {/* Icon Container */}
                <div className="relative mb-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-brand-purple/10 to-blue-500/10 flex items-center justify-center group-hover:from-brand-purple/20 group-hover:to-blue-500/20 transition-all duration-500 relative overflow-hidden">
                    {/* Icon Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Icon */}
                    <feature.icon className="w-6 h-6 text-brand-purple group-hover:text-brand-purple/80 relative z-10 group-hover:scale-110 transition-all duration-500" />
                    
                    {/* Hover Ring Effect */}
                    <div className="absolute inset-0 rounded-xl border-2 border-brand-purple/20 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="text-center space-y-1 relative z-10">
                  <h3 className="font-semibold text-xs text-gray-800 group-hover:text-brand-purple transition-colors duration-300 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-blue-500 group-hover:w-6 transition-all duration-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Custom Website Development Services</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Need a custom website built according to your specific requirements? We create websites tailored to your business needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <a href="/services/web-development" className="group">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg group-hover:text-brand-purple transition-colors">Custom Web Development</h4>
                    <p className="text-sm text-muted-foreground">Professional web development services</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">Build custom websites and web applications using modern technologies and best practices.</p>
                <div className="flex items-center text-brand-purple font-medium">
                  Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
            
            <a href="/services/custom-websites" className="group">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg group-hover:text-brand-purple transition-colors">Website Builder Service</h4>
                    <p className="text-sm text-muted-foreground">Get websites built according to your requirements</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">Tell us what you need and we'll create a website that perfectly fits your business requirements.</p>
                <div className="flex items-center text-brand-purple font-medium">
                  Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Services Grid - Browser Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white w-full max-w-sm h-80 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 pb-6">
              {/* Browser-style header with colored dots */}
              <div className="flex p-2 gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              {/* Card Content */}
              <div className="card__content p-4 h-full flex flex-col">
                {/* Service Icon and Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-800 group-hover:text-brand-purple transition-colors duration-300 leading-tight">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">Startup Ready</span>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">
                  {service.description}
                </p>
                
                {/* Key Features as Tags */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Key Features</div>
                  <div className="flex flex-wrap gap-2">
                    {service.features.slice(0, 4).map((feature, idx) => (
                      <span key={idx} className="inline-block px-3 py-1 bg-gradient-to-r from-brand-purple/10 to-transparent text-xs font-medium text-gray-700 border border-brand-purple/20 rounded-md">
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 4 && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-xs font-medium text-gray-500 rounded-md">
                        +{service.features.length - 4}
                      </span>
                    )}
                  </div>
                </div>
                
                
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Services;