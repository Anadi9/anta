import { Target, TrendingUp, Brain, Cpu, BarChart3, Users, GitBranch, Lock, Zap, Shield } from "lucide-react";

const services = [
  {
    icon: Target,
    title: "Idea Validation Systems",
    description:
      "Test demand before you over-invest. We instrument funnels, experiments, and feedback loops so you know what to build next — and what to kill.",
    features: ["Assumption mapping & metrics", "Rapid user feedback loops", "Decision-ready evidence"],
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Revenue-Focused Product Builds",
    description:
      "MVPs engineered around monetization and retention — not vanity features. Ship something people pay for, then compound from real usage data.",
    features: ["Conversion-first UX", "Pricing & packaging fit", "Roadmap tied to revenue"],
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Brain,
    title: "AI & Automation Systems",
    description:
      "Practical AI that reduces workload and improves outcomes — assistants, workflows, and integrations that founders can run without a full ML team.",
    features: ["Workflow automation", "AI-assisted experiences", "Operational leverage"],
    color: "from-green-500 to-emerald-600",
  },
];

const startupFeatures = [
  { icon: Cpu, title: "Validation-first", description: "Evidence before scale" },
  { icon: BarChart3, title: "Revenue signals", description: "Metrics that matter" },
  { icon: Users, title: "Founder velocity", description: "Ship in weeks, not quarters" },
  { icon: GitBranch, title: "Learn & iterate", description: "Tight build-measure loops" },
  { icon: Shield, title: "Secure foundations", description: "Right-sized for stage" },
  { icon: Zap, title: "Automation where it counts", description: "Less manual ops" },
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
            <span>AI product studio</span>
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
            We partner with founders to turn ideas into validated, revenue-generating products — combining AI, disciplined product thinking, and systems that scale when you are ready to grow.
          </p>
        </div>

        {/* Startup Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {startupFeatures.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="relative p-4 rounded-xl bg-white/60 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-2xl hover:shadow-brand-purple/10 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-purple/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-blue-500/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-700"></div>

                <div className="relative mb-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-brand-purple/10 to-blue-500/10 flex items-center justify-center group-hover:from-brand-purple/20 group-hover:to-blue-500/20 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <feature.icon className="w-6 h-6 text-brand-purple group-hover:text-brand-purple/80 relative z-10 group-hover:scale-110 transition-all duration-500" />

                    <div className="absolute inset-0 rounded-xl border-2 border-brand-purple/20 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                  </div>
                </div>

                <div className="text-center space-y-1 relative z-10">
                  <h3 className="font-semibold text-xs text-gray-800 group-hover:text-brand-purple transition-colors duration-300 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-blue-500 group-hover:w-6 transition-all duration-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Services Grid - Browser Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white w-full max-w-sm h-80 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 pb-6">
              <div className="flex p-2 gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>

              <div className="card__content p-4 h-full flex flex-col">
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
                      <span className="text-xs text-green-600 font-medium">Outcome-driven</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">
                  {service.description}
                </p>

                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Outcomes</div>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-3 py-1 bg-gradient-to-r from-brand-purple/10 to-transparent text-xs font-medium text-gray-700 border border-brand-purple/20 rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
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
