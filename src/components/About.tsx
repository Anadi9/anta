import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Database, Cpu, Brain, Cloud, Lock } from "lucide-react";

const expertise = [
  { icon: Brain, title: "Product Strategy", description: "Define clear roadmaps" },
  { icon: Zap, title: "Rapid Development", description: "Build fast, iterate faster" },
  { icon: Database, title: "Data Solutions", description: "Analytics and insights" },
  { icon: Cpu, title: "Modern Architecture", description: "Scalable and maintainable" },
  { icon: Cloud, title: "Cloud Deployment", description: "Reliable and cost-effective" },
  { icon: Shield, title: "Security First", description: "Built-in protection" }
];

const About = () => {
  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(59,130,246)_1px,transparent_0)] bg-[length:32px_32px]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Hero Section with Background Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-32 min-h-[600px] md:min-h-[700px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/images/expert-bg.jpg"
              alt="Expert team background"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/50 to-background/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/20 via-transparent to-transparent"></div>
          </div>

          {/* Content Overlay with Glassmorphism */}
          <div className="relative z-10 h-full min-h-[600px] md:min-h-[700px] flex items-center">
            <div className="container mx-auto sm:px-2 md:px-16 py-4">
              <div className="max-w-3xl">
                <div className="mb-8">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-righteous leading-tight">
                    <span className="block text-white">Building</span>
                    <span className="bg-gradient-brand bg-clip-text text-transparent">
                      Digital Solutions
                    </span>
                    <span className="block text-brand-purple font-normal text-3xl md:text-4xl lg:text-5xl">
                      That Actually Work
                    </span>
                  </h1>
                </div>

                {/* Glassmorphism Card for Content */}
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-500 group">
                  <div className="space-y-8">

                    <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl drop-shadow-md">
                      We're a team of experienced developers and designers who specialize in creating
                      digital products that solve real problems. From web applications to mobile apps,
                      we focus on building solutions that are both functional and beautiful.
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-brand-purple/30 to-brand-pink/30 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 hidden md:block"></div>
                <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 hidden lg:block animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack - Interactive Design */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold font-righteous mb-6">
              <span className="bg-gradient-brand bg-clip-text text-transparent">Technology Stack</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We use the latest tools and technologies to build modern, scalable solutions.
            </p>
          </div>

          {/* Full Width Tech Stack Visualization */}
          <div className="relative w-full">
            {/* Full Width Transparent Container */}
            <div className="relative w-full h-[500px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-transparent to-blue-500/5"></div>

              {/* Technology Icons Grid */}
              <div className="absolute inset-0 p-8">
                <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4 h-full">
                  {[
                    { name: "React", icon: "https://img.icons8.com/color/48/react-native.png", delay: 0 },
                    { name: "Next.js", icon: "https://img.icons8.com/color/48/nextjs.png", delay: 0.1 },
                    { name: "TypeScript", icon: "https://img.icons8.com/color/48/typescript.png", delay: 0.2 },
                    { name: "JavaScript", icon: "https://img.icons8.com/color/48/javascript.png", delay: 0.3 },
                    { name: "Tailwind", icon: "https://img.icons8.com/color/48/tailwindcss.png", delay: 0.4 },
                    { name: "Framer", icon: "https://img.icons8.com/color/48/framer.png", delay: 0.5 },
                    { name: "Vue.js", icon: "https://img.icons8.com/color/48/vue-js.png", delay: 0.6 },
                    { name: "Angular", icon: "https://img.icons8.com/color/48/angularjs.png", delay: 0.7 },
                    { name: "Svelte", icon: "https://img.icons8.com/color/48/svelte.png", delay: 0.8 },
                    { name: "Nuxt.js", icon: "https://img.icons8.com/color/48/nuxt-js.png", delay: 0.9 },

                    { name: "Node.js", icon: "https://img.icons8.com/color/48/nodejs.png", delay: 1.0 },
                    { name: "Python", icon: "https://img.icons8.com/color/48/python.png", delay: 1.1 },
                    { name: "PostgreSQL", icon: "https://img.icons8.com/color/48/postgreesql.png", delay: 1.2 },
                    { name: "MongoDB", icon: "https://img.icons8.com/color/48/mongodb.png", delay: 1.3 },
                    { name: "Express", icon: "https://img.icons8.com/color/48/express-js.png", delay: 1.4 },
                    { name: "FastAPI", icon: "https://img.icons8.com/color/48/fastapi.png", delay: 1.5 },
                    { name: "Django", icon: "https://img.icons8.com/color/48/django.png", delay: 1.6 },
                    { name: "Flask", icon: "https://img.icons8.com/color/48/flask.png", delay: 1.7 },
                    { name: "Redis", icon: "https://img.icons8.com/color/48/redis.png", delay: 1.8 },
                    { name: "MySQL", icon: "https://img.icons8.com/color/48/mysql.png", delay: 1.9 },

                    { name: "AWS", icon: "https://img.icons8.com/color/48/amazon-web-services.png", delay: 2.0 },
                    { name: "Docker", icon: "https://img.icons8.com/color/48/docker.png", delay: 2.1 },
                    { name: "Kubernetes", icon: "https://img.icons8.com/color/48/kubernetes.png", delay: 2.2 },
                    { name: "GraphQL", icon: "https://img.icons8.com/color/48/graphql.png", delay: 2.3 },
                    { name: "GitLab", icon: "https://img.icons8.com/color/48/gitlab.png", delay: 2.4 },
                    { name: "GitHub", icon: "https://img.icons8.com/color/48/github.png", delay: 2.5 },
                    { name: "Vercel", icon: "https://img.icons8.com/color/48/vercel.png", delay: 2.6 },
                    { name: "Netlify", icon: "https://img.icons8.com/color/48/netlify.png", delay: 2.7 },
                    { name: "Firebase", icon: "https://img.icons8.com/color/48/firebase.png", delay: 2.8 },
                    { name: "Supabase", icon: "https://img.icons8.com/color/48/supabase.png", delay: 2.9 }
                  ].map((tech, index) => (
                    <div
                      key={index}
                      className="group relative flex items-center justify-center"
                    >
                      {/* Tech Icon Card */}
                      <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110 group-hover:-translate-y-2 flex items-center justify-center">
                        <img
                          src={tech.icon}
                          alt={tech.name}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-brand-purple/20 to-brand-pink/20 rounded-2xl backdrop-blur-sm animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-4 w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg backdrop-blur-sm animate-pulse delay-500"></div>
            </div>
          </div>
        </div>

        {/* Expertise Section - Fullscreen Image with Overlay Cards */}
        <div className="mb-22">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold font-righteous mb-6">
              <span className="bg-gradient-brand bg-clip-text text-transparent">Our Expertise</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We bring together technical skills and creative thinking to deliver exceptional results.
            </p>
          </div>

          {/* Fullscreen Image with Overlay */}
          <div className="relative h-[700px] rounded-3xl overflow-hidden shadow-2xl">
            {/* Background Image */}
            <img
              src="/images/3d-expert.jpg"
              alt="3D expert background"
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/40 via-transparent to-blue-500/30"></div>

            {/* Expertise Cards - Positioned on Right Side */}
            <div className="absolute inset-0 flex items-center justify-start p-8">
              <div className="w-full max-w-md space-y-4">
                {expertise.map((item, index) => (
                  <div key={index} className="group relative">
                    <div className="p-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/40 shadow-xl hover:shadow-2xl hover:shadow-brand-purple/30 transition-all duration-500 hover:-translate-x-2 hover:scale-105">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-brand-purple/30 to-blue-500/30 group-hover:from-brand-purple/50 group-hover:to-blue-500/50 transition-all duration-300 shadow-lg">
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-[#C20566] mb-1 group-hover:text-brand-purple transition-colors duration-300">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-purple/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Left Side Content */}
            <div className="absolute inset-0 flex items-center justify-end p-8">
              <div className="max-w-lg">
                <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 mt-80">
                  <h3 className="text-3xl font-bold text-[#C20566] mb-2">
                    Building the Future
                  </h3>
                  <p className="text-lg text-white/90 leading-relaxed">
                    Our expertise spans across modern technologies and methodologies,
                    enabling us to deliver exceptional digital solutions that drive real results.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default About;