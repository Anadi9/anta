'use client'

import { ExternalLink, Play, Apple, Globe, Microscope, UtensilsCrossed, Factory, Heart, Briefcase, Sparkles, GraduationCap, Trophy } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  type: 'web' | 'mobile';
  category: string[];
  technologies: string[];
  links: {
    website?: string;
    android?: string;
    ios?: string;
  };
  color: string;
  icon: any;
  image?: string;
}

const projects: Project[] = [
  {
    id: 'zeiss',
    title: 'ZEISS Microscopy',
    description: 'Scientific Light Microscope Product Platform - A comprehensive web platform showcasing ZEISS microscopy products with advanced filtering, product comparisons, and detailed specifications.',
    type: 'web',
    category: ['Scientific', 'E-commerce', 'Product Platform'],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    links: {
      website: 'https://www.zeiss.com/microscopy/us/products/light-microscopes.html'
    },
    color: 'from-blue-500 to-blue-600',
    icon: Microscope,
    image: '/images/portfolio/zeiss.png'
  },
  {
    id: 'appwalker',
    title: 'AppWalker',
    description: 'Recipe Sharing & Culinary Community Platform - A social platform for food enthusiasts to share recipes, discover new dishes, and connect with fellow cooks.',
    type: 'web',
    category: ['Social Platform', 'Food & Recipe', 'Community'],
    technologies: ['React', 'Next.js', 'Node.js', 'MongoDB'],
    links: {
      website: 'https://www.appwalker-technology.com/'
    },
    color: 'from-orange-500 to-red-500',
    icon: UtensilsCrossed,
    image: '/images/portfolio/appwalker.png'
  },
  {
    id: 'iotindustry',
    title: 'IOTIndustry',
    description: 'IoT Industry Platform - A comprehensive platform connecting IoT businesses, showcasing solutions, and facilitating industry connections.',
    type: 'web',
    category: ['IoT', 'Industry Platform', 'B2B'],
    technologies: ['React', 'Next.js', 'TypeScript', 'GraphQL'],
    links: {
      website: 'https://ioti.io/'
    },
    color: 'from-cyan-500 to-blue-500',
    icon: Factory,
    image: '/images/portfolio/ioti.png'
  },
  {
    id: 'royal-mindfulness',
    title: 'Royal Mindfulness',
    description: 'Mindfulness & Wellness Platform - A serene platform dedicated to mindfulness practices, meditation guides, and wellness resources.',
    type: 'web',
    category: ['Wellness', 'Mindfulness', 'Health'],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'CMS'],
    links: {
      website: 'https://royalmindfulness.com/'
    },
    color: 'from-purple-500 to-pink-500',
    icon: Heart,
    image: '/images/portfolio/royal-mindfullness.png'
  },
  {
    id: 'boardsi',
    title: 'Boardsi',
    description: 'Board Management Platform - A professional platform for board management, governance, and executive networking.',
    type: 'web',
    category: ['B2B', 'Management', 'Professional'],
    technologies: ['React', 'Next.js', 'TypeScript', 'PostgreSQL'],
    links: {
      website: 'https://boardsi.com/'
    },
    color: 'from-indigo-500 to-purple-500',
    icon: Briefcase,
    image: '/images/portfolio/boardsi.png'
  },
  {
    id: 'storyteller',
    title: 'StoryTeller',
    description: 'AI-powered creative intelligence tool for Instagram and Facebook that gives brands the insights to create more profitable content.',
    type: 'web',
    category: ['AI', 'Social Media', 'Marketing', 'Analytics'],
    technologies: ['React', 'Next.js', 'AI/ML', 'TypeScript'],
    links: {
      website: 'https://www.thestoryteller.tech/'
    },
    color: 'from-purple-500 to-pink-500',
    icon: Sparkles,
    image: '/images/portfolio/storyteller.png'
  },
  {
    id: 'la-pte',
    title: 'LA-PTE',
    description: 'Language Academy PTE Preparation App - A comprehensive mobile application for PTE exam preparation with practice tests, study materials, and progress tracking.',
    type: 'mobile',
    category: ['Education', 'Language Learning', 'Exam Prep'],
    technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    links: {
      android: 'https://play.google.com/store/apps/details?id=com.languageacademy&pcampaignid=web_share&pli=1',
      ios: 'https://apps.apple.com/in/app/la-pte/id6443614190'
    },
    color: 'from-green-500 to-emerald-500',
    icon: GraduationCap,
    image: '/images/portfolio/la-pte.png'
  },
  {
    id: 'sonee-sports',
    title: 'Sonee Sports',
    description: 'Sports Management & Community App - A mobile application for sports enthusiasts to track activities, connect with teams, and manage sports events.',
    type: 'mobile',
    category: ['Sports', 'Social', 'Fitness'],
    technologies: ['React Native', 'TypeScript', 'Firebase', 'Maps API'],
    links: {
      android: 'https://play.google.com/store/apps/details?id=com.sponeesports&pcampaignid=web_share',
      ios: 'https://apps.apple.com/mv/app/sonee-sports/id6443951631'
    },
    color: 'from-yellow-500 to-orange-500',
    icon: Trophy,
    image: '/images/portfolio/sonee-sports.png'
  }
];

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
        {/* Projects Grid - Browser Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const IconComponent = project.icon;
            return (
              <div 
                key={project.id} 
                className="bg-white w-full max-w-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 overflow-hidden flex flex-col"
              >
                {/* Browser-style header with colored dots */}
                <div className="flex p-2 gap-1 border-b border-gray-100">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                
                {/* Project Image Section with fixed aspect ratio */}
                <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {project.image ? (
                    <>
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg opacity-80`}>
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1 min-h-0">
                  {/* Project Icon and Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-800 group-hover:text-brand-purple transition-colors duration-300 leading-tight mb-1">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                          project.type === 'web' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <span className={`text-xs font-medium ${
                          project.type === 'web' ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {project.type === 'web' ? 'Web Platform' : 'Mobile App'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Category Tags */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.category.slice(0, 3).map((cat, idx) => (
                        <span key={idx} className="inline-block px-2.5 py-1 bg-gradient-to-r from-brand-purple/10 to-transparent text-xs font-medium text-gray-700 border border-brand-purple/20 rounded-md">
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

                  {/* Technology Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="inline-block px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-md">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="inline-block px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-500 rounded-md">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Links */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
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
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-500/10 to-gray-600/10 text-gray-700 text-xs font-medium rounded-md hover:from-gray-500/20 hover:to-gray-600/20 transition-all duration-300 border border-gray-500/20 hover:border-gray-500/40"
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
