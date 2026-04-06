'use client'

import type { LucideIcon } from "lucide-react";
import {
  ExternalLink,
  Play,
  Apple,
  Globe,
  Microscope,
  UtensilsCrossed,
  Factory,
  Heart,
  Briefcase,
  Sparkles,
  GraduationCap,
  Trophy,
  Network,
  Headphones,
  Building2,
  Receipt,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  type: "web" | "mobile" | "backend";
  category: string[];
  technologies: string[];
  links: {
    website?: string;
    android?: string;
    ios?: string;
  };
  color: string;
  icon: LucideIcon;
  image?: string;
  highlights?: string[];
  /** Shown when all three are set — compact Problem → Solution → Outcome */
  problem?: string;
  solution?: string;
  outcome?: string;
}

const projects: Project[] = [
  {
    id: "zeiss",
    title: "ZEISS Microscopy",
    description:
      "Scientific Light Microscope Product Platform - A comprehensive web platform showcasing ZEISS microscopy products with advanced filtering, product comparisons, and detailed specifications.",
    type: "web",
    category: ["Scientific", "E-commerce", "Product Platform"],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    links: {
      website:
        "https://www.zeiss.com/microscopy/us/products/light-microscopes.html",
    },
    color: "from-blue-500 to-blue-600",
    icon: Microscope,
    image: "/images/portfolio/zeiss.png",
    problem:
      "Researchers and buyers needed to compare complex microscopy lines without drowning in static PDFs.",
    solution:
      "A filterable product platform with specs, comparisons, and structured scientific content.",
    outcome:
      "Faster product discovery and a clearer path from research interest to the right instrument.",
  },
  {
    id: "appwalker",
    title: "AppWalker",
    description:
      "Recipe Sharing & Culinary Community Platform - A social platform for food enthusiasts to share recipes, discover new dishes, and connect with fellow cooks.",
    type: "web",
    category: ["Social Platform", "Food & Recipe", "Community"],
    technologies: ["React", "Next.js", "Node.js", "MongoDB"],
    links: {
      website: "https://www.appwalker-technology.com/",
    },
    color: "from-orange-500 to-red-500",
    icon: UtensilsCrossed,
    image: "/images/portfolio/appwalker.png",
    problem:
      "Food creators needed a focused place to share recipes and grow an audience beyond generic social noise.",
    solution:
      "A community-first web platform with discovery, profiles, and content workflows tuned for culinary use cases.",
    outcome:
      "Higher engagement and repeat usage in a niche vertical without rebuilding generic social infrastructure.",
  },
  {
    id: "iotindustry",
    title: "IOTIndustry",
    description:
      "IoT Industry Platform - A comprehensive platform connecting IoT businesses, showcasing solutions, and facilitating industry connections.",
    type: "web",
    category: ["IoT", "Industry Platform", "B2B"],
    technologies: ["React", "Next.js", "TypeScript", "GraphQL"],
    links: {
      website: "https://ioti.io/",
    },
    color: "from-cyan-500 to-blue-500",
    icon: Factory,
    image: "/images/portfolio/ioti.png",
    problem:
      "IoT vendors struggled to get credible visibility and B2B connections across a fragmented market.",
    solution:
      "An industry hub that showcases solutions, categories, and connections in one structured experience.",
    outcome:
      "Stronger positioning for member businesses and a clearer funnel for partnership and lead flow.",
  },
  {
    id: "royal-mindfulness",
    title: "Royal Mindfulness",
    description:
      "Mindfulness & Wellness Platform - A serene platform dedicated to mindfulness practices, meditation guides, and wellness resources.",
    type: "web",
    category: ["Wellness", "Mindfulness", "Health"],
    technologies: ["React", "Next.js", "Tailwind CSS", "CMS"],
    links: {
      website: "https://royalmindfulness.com/",
    },
    color: "from-purple-500 to-pink-500",
    icon: Heart,
    image: "/images/portfolio/royal-mindfullness.png",
    problem:
      "Wellness audiences bounce from cluttered sites that don’t support calm, habit-forming journeys.",
    solution:
      "A serene, CMS-driven experience with guided resources and content patterns built for mindfulness.",
    outcome:
      "Clearer user journeys and stronger retention for wellness content and brand trust.",
  },
  {
    id: "boardsi",
    title: "Boardsi",
    description:
      "Board Management Platform - A professional platform for board management, governance, and executive networking.",
    type: "web",
    category: ["B2B", "Management", "Professional"],
    technologies: ["React", "Next.js", "TypeScript", "PostgreSQL"],
    links: {
      website: "https://boardsi.com/",
    },
    color: "from-indigo-500 to-purple-500",
    icon: Briefcase,
    image: "/images/portfolio/boardsi.png",
    problem:
      "Boards and executives needed professional governance workflows and high-trust networking in one place.",
    solution:
      "A B2B platform purpose-built for board management, visibility, and executive matchmaking.",
    outcome:
      "Streamlined governance touchpoints and faster paths to the right leadership connections.",
  },
  {
    id: "storyteller",
    title: "StoryTeller",
    description:
      "AI-powered creative intelligence tool for Instagram and Facebook that gives brands the insights to create more profitable content.",
    type: "web",
    category: ["AI", "Social Media", "Marketing", "Analytics"],
    technologies: ["React", "Next.js", "AI/ML", "TypeScript"],
    links: {
      website: "https://www.thestoryteller.tech/",
    },
    color: "from-purple-500 to-pink-500",
    icon: Sparkles,
    image: "/images/portfolio/storyteller.png",
    problem:
      "Marketing teams were guessing which creative directions actually drove revenue on social.",
    solution:
      "AI-assisted analytics that translates performance data into actionable creative guidance.",
    outcome:
      "More profitable content decisions and less wasted production cycles on what doesn’t convert.",
  },
  {
    id: "la-pte",
    title: "LA-PTE",
    description:
      "Language Academy PTE Preparation App - A comprehensive mobile application for PTE exam preparation with practice tests, study materials, and progress tracking.",
    type: "mobile",
    category: ["Education", "Language Learning", "Exam Prep"],
    technologies: ["React Native", "TypeScript", "Firebase", "Redux"],
    links: {
      android:
        "https://play.google.com/store/apps/details?id=com.languageacademy&pcampaignid=web_share&pli=1",
      ios: "https://apps.apple.com/in/app/la-pte/id6443614190",
    },
    color: "from-green-500 to-emerald-500",
    icon: GraduationCap,
    image: "/images/portfolio/la-pte.png",
    problem:
      "PTE students needed structured practice, materials, and progress visibility on the go.",
    solution:
      "A mobile-first prep app with tests, study assets, and tracked improvement loops.",
    outcome:
      "Faster skill gains and clearer readiness signals before exam day.",
  },
  {
    id: "sonee-sports",
    title: "Sonee Sports",
    description:
      "Sports Management & Community App - A mobile application for sports enthusiasts to track activities, connect with teams, and manage sports events.",
    type: "mobile",
    category: ["Sports", "Social", "Fitness"],
    technologies: ["React Native", "TypeScript", "Firebase", "Maps API"],
    links: {
      android:
        "https://play.google.com/store/apps/details?id=com.sponeesports&pcampaignid=web_share",
      ios: "https://apps.apple.com/mv/app/sonee-sports/id6443951631",
    },
    color: "from-yellow-500 to-orange-500",
    icon: Trophy,
    image: "/images/portfolio/sonee-sports.png",
    problem:
      "Local sports groups needed coordination for teams, events, and members without fragmented chats.",
    solution:
      "A community app for activities, events, and maps-backed discovery in one workflow.",
    outcome:
      "Higher participation and simpler operations for organizers and athletes.",
  },
  {
    id: "desktop-connect",
    title: "Desktop Connect – Decentralized Data Synchronization Tool",
    description:
      "A lightweight peer-aware system enabling decentralized customer data management across local networks without centralized databases.",
    type: "backend",
    category: ["Backend Systems", "Distributed Systems", "Networking"],
    technologies: ["C#", ".NET", "Networking", "Distributed Systems"],
    highlights: [
      "Real-time peer-to-peer synchronization",
      "Works without central server",
      "Offline-first architecture",
      "Designed for distributed environments like retail & field ops",
    ],
    links: {},
    color: "from-slate-600 to-slate-800",
    icon: Network,
    problem:
      "Distributed sites needed shared customer context without forcing everything through a central cloud.",
    solution:
      "Peer-aware synchronization across local networks with offline-first behavior.",
    outcome:
      "Reliable operations in retail and field environments where connectivity is uneven.",
  },
  {
    id: "audio-communication",
    title: "High-Performance Audio Communication Service",
    description:
      "Scalable real-time audio communication system built in C# handling thousands of concurrent users.",
    type: "backend",
    category: ["High-Performance Systems", "Backend Systems", "Real-time"],
    technologies: ["C#", ".NET", "Sockets", "Multithreading"],
    highlights: [
      "5000+ concurrent clients",
      "350 Mbps sustained throughput",
      "Low latency audio streaming",
      "UDP/TCP sockets with multithreading",
    ],
    links: {},
    color: "from-amber-600 to-orange-700",
    icon: Headphones,
    problem:
      "Voice products collapse under load when real-time audio isn’t engineered for massive concurrency.",
    solution:
      "A high-throughput C# service using sockets and multithreading for low-latency streaming.",
    outcome:
      "Stable performance at thousands of concurrent users with sustained throughput.",
  },
  {
    id: "crm-system",
    title: "Customer Management CRM System",
    description:
      "Full CRM solution with backend services, REST APIs, and TCP-based desktop clients.",
    type: "backend",
    category: ["Backend Systems", "CRM", "Enterprise"],
    technologies: ["C#", ".NET", "REST API", "TCP", "MySQL"],
    highlights: [
      "Central backend service",
      "REST API + TCP communication",
      "Multi-user desktop client",
      "Optimized installation builds",
    ],
    links: {},
    color: "from-teal-600 to-cyan-700",
    icon: Building2,
    problem:
      "Sales teams needed one source of truth with desktop tools that still felt fast at the edge.",
    solution:
      "Central CRM backend with REST APIs plus TCP desktop clients for distributed users.",
    outcome:
      "Consistent customer records and faster sales workflows across the organization.",
  },
  {
    id: "accounting-billing",
    title: "Accounting & Billing Software",
    description:
      "Automated billing system for generating structured invoices with tax calculations.",
    type: "backend",
    category: ["Backend Systems", "Finance Systems", "Desktop"],
    technologies: ["C#", ".NET", "Finance Systems"],
    highlights: [
      "GST/tax calculation",
      "Itemized billing system",
      "Customer & company management",
      "Reliable desktop performance",
    ],
    links: {},
    color: "from-emerald-700 to-green-800",
    icon: Receipt,
    problem:
      "Invoicing broke down when tax rules, line items, and customer records weren’t kept in sync.",
    solution:
      "A desktop billing engine with structured invoices, tax logic, and company/customer management.",
    outcome:
      "Faster billing cycles and fewer costly compliance mistakes at month-end.",
  },
];

function typeBadgeClasses(type: Project["type"]) {
  switch (type) {
    case "web":
      return {
        dot: "bg-blue-500",
        label: "text-blue-600",
        text: "Web Platform",
      };
    case "mobile":
      return {
        dot: "bg-green-500",
        label: "text-green-600",
        text: "Mobile App",
      };
    case "backend":
      return {
        dot: "bg-amber-500",
        label: "text-amber-700",
        text: "Backend Systems",
      };
    default:
      return {
        dot: "bg-gray-500",
        label: "text-gray-600",
        text: "Project",
      };
  }
}

const Portfolio = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Full Width Background Image
      <div className="absolute inset-0">
        <img 
          src="/images/bg-hero.jpg" 
          alt="Portfolio background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80"></div>
      </div> */}

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const IconComponent = project.icon;
            const typeBadge = typeBadgeClasses(project.type);
            const techVisible =
              project.technologies.length <= 6
                ? project.technologies
                : project.technologies.slice(0, 5);
            const techOverflow =
              project.technologies.length > 6
                ? project.technologies.length - 5
                : 0;

            return (
              <div
                key={project.id}
                className="bg-white w-full max-w-sm rounded-lg border border-gray-100/80 shadow-lg ring-1 ring-transparent transition-all duration-300 group hover:scale-105 hover:-translate-y-0.5 hover:shadow-2xl hover:ring-brand-purple/15 overflow-hidden flex flex-col"
              >
                <div className="flex p-2 gap-1 border-b border-gray-100">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {project.image ? (
                    <>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className={`w-20 h-20 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg opacity-80`}
                      >
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1 min-h-0 space-y-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-purple transition-colors duration-300 leading-tight mb-1">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full animate-pulse ${typeBadge.dot}`}
                        ></div>
                        <span
                          className={`text-xs font-medium ${typeBadge.label}`}
                        >
                          {typeBadge.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {project.problem && project.solution && project.outcome && (
                    <div className="rounded-lg border border-brand-purple/15 bg-gradient-to-br from-brand-purple/[0.06] to-transparent p-3 space-y-1.5 text-xs text-gray-700 leading-snug">
                      <p>
                        <span className="font-semibold text-gray-900">Problem: </span>
                        {project.problem}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">Solution: </span>
                        {project.solution}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-purple">Outcome: </span>
                        {project.outcome}
                      </p>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="text-xs text-gray-600 leading-relaxed space-y-1.5 pl-3.5 list-disc marker:text-brand-purple/70">
                      {project.highlights.map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  )}

                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.category.slice(0, 3).map((cat, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2.5 py-1 bg-gradient-to-r from-brand-purple/10 to-transparent text-xs font-medium text-gray-700 border border-brand-purple/20 rounded-md"
                        >
                          {cat}
                        </span>
                      ))}
                      {project.category.length > 3 && (
                        <span className="inline-block px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-500 rounded-md">
                          +{project.category.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      {techVisible.map((tech, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2.5 py-0.5 text-[11px] font-medium text-gray-700 bg-gray-50 border border-gray-200/90 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {techOverflow > 0 && (
                        <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full">
                          +{techOverflow}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto pt-1">
                    {project.links.website && (
                      <a
                        href={project.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-purple/10 to-blue-500/10 text-brand-purple text-xs font-medium rounded-md hover:from-brand-purple/20 hover:to-blue-500/20 transition-all duration-300 border border-brand-purple/20 hover:border-brand-purple/40"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {project.links.android && (
                      <a
                        href={project.links.android}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 text-xs font-medium rounded-md hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300 border border-green-500/20 hover:border-green-500/40"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Android</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {project.links.ios && (
                      <a
                        href={project.links.ios}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-500/10 to-gray-600/10 text-gray-700 text-xs font-medium rounded-md hover:from-gray-500/20 hover:to-gray-500/20 transition-all duration-300 border border-gray-500/20 hover:border-gray-500/40"
                      >
                        <Apple className="w-3.5 h-3.5" />
                        <span>iOS</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
