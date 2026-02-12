'use client'

import { Mail, Phone, Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";
const antaLogo = "/anta-logo.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background border-t border-border/20">
      <div className="mx-auto px-20 py-16">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          {/* Brand Section */}
          <div className="flex-1 max-w-md">
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Building tomorrow's startups today. We craft MVPs that validate ideas and scale into enterprise solutions.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-6 mb-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>


            {/* Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@anta.com" className="hover:underline">hello@anta.com</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                <a href="tel:+13135289034" className="hover:underline">+1 (313) 528-9034</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-12">
            <div className="flex items-center space-x-3 mb-6">
              <img src={antaLogo} alt="ANTA Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-foreground font-righteous">ANTA</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © 2026 ANTA. All rights reserved.
            </div>



            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <button
                onClick={scrollToTop}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                Back to top <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
