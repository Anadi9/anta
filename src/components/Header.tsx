'use client'

import { Button } from "@/components/ui/button";
import { Menu, X, Code2, Sun, Moon, Settings, Info, DollarSign, MessageCircle, Briefcase } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
const antaLogo = "/anta-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // Function to handle navigation to sections
  const handleSectionNavigation = (sectionId: string) => {
    if (pathname === '/') {
      // If already on home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on other page, navigate to home and then scroll to section
      window.location.href = `/#${sectionId}`;
    }
    setIsMenuOpen(false);
  };

  // Function to handle logo/ANTA click - always go to home and scroll to top
  const handleLogoClick = () => {
    if (pathname === '/') {
      // If already on home page, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If on other page, navigate to home
      window.location.href = '/';
    }
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: "Services", href: "#services", icon: Settings, sectionId: "services" },
    { name: "Portfolio", href: "/portfolio", icon: Briefcase },
    { name: "About", href: "/about", icon: Info },
    // { name: "Pricing", href: "#pricing", icon: DollarSign, sectionId: "pricing" },
    { name: "Contact", href: "#contact", icon: MessageCircle, sectionId: "contact" }
  ];

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-50 border-b border-border/50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="relative">
              <img src={antaLogo} alt="ANTA Logo" className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground font-righteous">
                ANTA
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              item.sectionId ? (
                <button
                  key={item.name}
                  onClick={() => handleSectionNavigation(item.sectionId)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            ))}
            
            {/* Theme Switch Button */}
            <Button
              variant="outline"
              size="sm"
              className="px-3 border-border hover:bg-muted"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            
            <Link href="/start-project">
              <Button 
                size="sm" 
                className="px-6 bg-brand-navy hover:bg-brand-navy/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Code2 className="w-4 h-4 mr-2" />
                Build MVP
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-border pt-4">
            {navigation.map((item) => (
              item.sectionId ? (
                <button
                  key={item.name}
                  onClick={() => handleSectionNavigation(item.sectionId)}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2 w-full text-left"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2 w-full text-left"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            ))}
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-border hover:bg-muted"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    Dark Mode
                  </>
                )}
              </Button>
              <Link href="/start-project" className="w-full">
                <Button 
                  size="sm" 
                  className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white border-0"
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  Build MVP
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;