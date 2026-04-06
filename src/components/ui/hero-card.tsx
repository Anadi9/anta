import React, { useState } from 'react';
import styled from 'styled-components';

// Types
type BrandInputs = {
  domain: string;
  niche: string;
  vision: string;
  colors: string[];
  tone: "Modern / Minimal" | "Playful" | "Trustworthy / Corporate" | "Edgy";
  tagline?: string;
  ctaText?: string;
  logoText?: string;
  sections: {
    hero: boolean;
    about: boolean;
    features: boolean;
    team: boolean;
    testimonials: boolean;
    pricing: boolean;
    contact: boolean;
  };
};

type BrandJSON = {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    stats?: Array<{
      number: string;
      label: string;
    }>;
  };
  about: {
    title: string;
    description: string;
    team?: Array<{
      name: string;
      role: string;
      avatar: string;
    }>;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
    avatar: string;
  }>;
  pricing?: Array<{
    name: string;
    price: string;
    features: string[];
    popular?: boolean;
  }>;
  contact: {
    title: string;
    description: string;
    email: string;
    phone: string;
  };
  footer: {
    companyName: string;
    tagline: string;
    links: Array<{
      title: string;
      url: string;
    }>;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  tone: string;
  sections: {
    hero: boolean;
    about: boolean;
    features: boolean;
    team: boolean;
    testimonials: boolean;
    pricing: boolean;
    contact: boolean;
  };
};

// AI Generation Function (Frontend-only)
const generateBrandPreview = async (inputs: BrandInputs): Promise<BrandJSON> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // TODO: Replace this dummy data with actual LLM/SDK call
  // Example: const response = await openai.chat.completions.create({...})
  
  const companyName = inputs.domain.replace('.com', '').replace(/[-_]/g, ' ');
  const toneStyles = {
    "Modern / Minimal": {
      heroTitle: `Welcome to ${companyName}`,
      heroSubtitle: `The modern solution for ${inputs.niche}`,
      ctaText: inputs.ctaText || "Get Started",
      stats: [
        { number: "10K+", label: "Happy Users" },
        { number: "99.9%", label: "Uptime" },
        { number: "24/7", label: "Support" }
      ],
      team: [
        { name: "Alex Chen", role: "CEO & Founder", avatar: "AC" },
        { name: "Sarah Kim", role: "CTO", avatar: "SK" },
        { name: "Mike Johnson", role: "Head of Design", avatar: "MJ" }
      ],
      testimonials: [
        {
          quote: "This platform has completely transformed how we handle our workflow. The results speak for themselves.",
          author: "Jennifer Martinez",
          role: "Operations Director",
          avatar: "JM"
        },
        {
          quote: "Finally, a solution that actually works as promised. Our team productivity has increased by 300%.",
          author: "David Thompson",
          role: "Startup Founder",
          avatar: "DT"
        }
      ],
      pricing: [
        {
          name: "Starter",
          price: "$29",
          features: ["Up to 5 projects", "Basic analytics", "Email support"]
        },
        {
          name: "Professional",
          price: "$99",
          features: ["Unlimited projects", "Advanced analytics", "Priority support", "Custom integrations"],
          popular: true
        },
        {
          name: "Enterprise",
          price: "$299",
          features: ["Everything in Pro", "Dedicated account manager", "Custom development", "SLA guarantee"]
        }
      ]
    },
    "Playful": {
      heroTitle: `Hey there! 👋 ${companyName} is here!`,
      heroSubtitle: `Making ${inputs.niche} fun and easy!`,
      ctaText: inputs.ctaText || "Let's Go!",
      stats: [
        { number: "50K+", label: "Smiles Created" },
        { number: "100%", label: "Fun Guaranteed" },
        { number: "∞", label: "Awesome Moments" }
      ],
      team: [
        { name: "Zoe Sparkle", role: "Chief Happiness Officer", avatar: "ZS" },
        { name: "Ben Funky", role: "Innovation Wizard", avatar: "BF" },
        { name: "Luna Creative", role: "Design Magician", avatar: "LC" }
      ],
      testimonials: [
        {
          quote: "This is the most fun I've had using a business tool! It actually makes work enjoyable.",
          author: "Emma Sunshine",
          role: "Creative Director",
          avatar: "ES"
        },
        {
          quote: "Finally, a platform that doesn't take itself too seriously but delivers serious results!",
          author: "Jake Playful",
          role: "Marketing Manager",
          avatar: "JP"
        }
      ],
      pricing: [
        {
          name: "Fun Pack",
          price: "$19",
          features: ["Basic fun features", "Happy support", "GIF reactions"]
        },
        {
          name: "Awesome Pack",
          price: "$49",
          features: ["All fun features", "Premium support", "Custom emojis", "Party mode"],
          popular: true
        },
        {
          name: "Epic Pack",
          price: "$99",
          features: ["Everything awesome", "VIP treatment", "Surprise features", "Fun guarantee"]
        }
      ]
    },
    "Trustworthy / Corporate": {
      heroTitle: `${companyName} - Trusted Solutions`,
      heroSubtitle: `Professional ${inputs.niche} services you can rely on`,
      ctaText: inputs.ctaText || "Get Your MVP Strategy",
      stats: [
        { number: "500+", label: "Enterprise Clients" },
        { number: "99.99%", label: "Reliability" },
        { number: "ISO", label: "Certified" }
      ],
      team: [
        { name: "Robert Sterling", role: "Chief Executive Officer", avatar: "RS" },
        { name: "Dr. Patricia Walsh", role: "Chief Technology Officer", avatar: "PW" },
        { name: "Michael Harrison", role: "Head of Operations", avatar: "MH" }
      ],
      testimonials: [
        {
          quote: "We've been working with this company for three years. Their professionalism and reliability are unmatched.",
          author: "Elizabeth Williams",
          role: "VP of Technology",
          avatar: "EW"
        },
        {
          quote: "The level of service and attention to detail exceeds all our expectations. Highly recommended.",
          author: "James Mitchell",
          role: "IT Director",
          avatar: "JM"
        }
      ],
      pricing: [
        {
          name: "Professional",
          price: "$199",
          features: ["Standard support", "Basic reporting", "Email assistance"]
        },
        {
          name: "Enterprise",
          price: "$499",
          features: ["Priority support", "Advanced reporting", "Dedicated manager", "Custom SLA"],
          popular: true
        },
        {
          name: "Corporate",
          price: "Custom",
          features: ["24/7 support", "Full customization", "On-site training", "Compliance guarantee"]
        }
      ]
    },
    "Edgy": {
      heroTitle: `${companyName.toUpperCase()}`,
      heroSubtitle: `Disrupting ${inputs.niche} since day one`,
      ctaText: inputs.ctaText || "Join the Revolution",
      stats: [
        { number: "1M+", label: "Rebels Recruited" },
        { number: "0", label: "Fucks Given" },
        { number: "∞", label: "Rules Broken" }
      ],
      team: [
        { name: "Blade Runner", role: "Chief Rebel", avatar: "BR" },
        { name: "Neo Matrix", role: "Code Breaker", avatar: "NM" },
        { name: "Phoenix Rising", role: "Design Destroyer", avatar: "PR" }
      ],
      testimonials: [
        {
          quote: "This platform is absolutely insane in the best way possible. It's like nothing I've ever used before.",
          author: "Storm Rebel",
          role: "Innovation Leader",
          avatar: "SR"
        },
        {
          quote: "Finally, someone who's not afraid to break the mold. This changes everything.",
          author: "Rogue Agent",
          role: "Disruption Specialist",
          avatar: "RA"
        }
      ],
      pricing: [
        {
          name: "Rebel",
          price: "$49",
          features: ["Basic disruption", "Community access", "Underground support"]
        },
        {
          name: "Revolutionary",
          price: "$149",
          features: ["Full disruption", "Priority access", "Insider secrets", "Exclusive features"],
          popular: true
        },
        {
          name: "Legend",
          price: "$299",
          features: ["Complete takeover", "VIP treatment", "Future features", "Legendary status"]
        }
      ]
    }
  };

  const style = toneStyles[inputs.tone];
  
  return {
    hero: {
      title: style.heroTitle,
      subtitle: style.heroSubtitle,
      ctaText: style.ctaText,
      stats: style.stats
    },
    about: {
      title: `About ${companyName}`,
      description: inputs.vision || `We're revolutionizing ${inputs.niche} with innovative solutions that make a difference.`,
      team: style.team
    },
    features: [
      {
        title: "Innovative Solutions",
        description: `Cutting-edge ${inputs.niche} technology designed for the modern world.`,
        icon: "🚀"
      },
      {
        title: "User-Focused Design",
        description: "Every feature is crafted with our users' needs in mind.",
        icon: "💡"
      },
      {
        title: "Reliable Support",
        description: "24/7 assistance to help you succeed every step of the way.",
        icon: "🛡️"
      },
      {
        title: "Scalable Infrastructure",
        description: "Built to grow with your business, from startup to enterprise.",
        icon: "⚡"
      },
      {
        title: "Advanced Analytics",
        description: "Deep insights and reporting to optimize your performance.",
        icon: "📊"
      },
      {
        title: "Seamless Integration",
        description: "Works perfectly with your existing tools and workflows.",
        icon: "🔗"
      }
    ],
    testimonials: style.testimonials,
    pricing: style.pricing,
    contact: {
      title: "Get in Touch",
      description: "Ready to get started? We'd love to hear from you.",
      email: `hello@${inputs.domain}`,
      phone: "+1 (555) 123-4567"
    },
    footer: {
      companyName: companyName,
      tagline: inputs.tagline || `Leading the future of ${inputs.niche}`,
      links: [
        { title: "Privacy Policy", url: "#privacy" },
        { title: "Terms of Service", url: "#terms" },
        { title: "Contact", url: "#contact" },
        { title: "Blog", url: "#blog" }
      ]
    },
    colors: {
      primary: inputs.colors[0] || "#3b82f6",
      secondary: inputs.colors[1] || "#1e40af",
      accent: inputs.colors[2] || "#f59e0b"
    },
    tone: inputs.tone,
    sections: inputs.sections
  };
};

// Loader Component
const Loader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
  color: #666;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading-text {
    font-size: 14px;
    text-align: center;
  }
`;

// Brand Form Component
const BrandForm: React.FC<{
  initialDomain: string;
  onSubmit: (inputs: BrandInputs) => void;
  isGenerating: boolean;
}> = ({ initialDomain, onSubmit, isGenerating }) => {
  const [formData, setFormData] = useState<BrandInputs>({
    domain: initialDomain,
    niche: '',
    vision: '',
    colors: ['#3b82f6', '#1e40af', '#f59e0b'],
    tone: 'Modern / Minimal',
    tagline: '',
    ctaText: 'Get Started',
    logoText: '',
    sections: {
      hero: true,
      about: true,
      features: true,
      team: true,
      testimonials: true,
      pricing: true,
      contact: true
    }
  });

  const handleInputChange = (field: keyof BrandInputs, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...formData.colors];
    newColors[index] = color;
    setFormData(prev => ({ ...prev, colors: newColors }));
  };

  const handleSectionChange = (section: keyof typeof formData.sections) => {
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.domain && formData.niche) {
      onSubmit(formData);
    }
  };

  const isValid = formData.domain.trim() !== '' && formData.niche.trim() !== '';

  return (
    <FormContainer>
      <FormTitle>🚀 Launch Your Brand</FormTitle>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="domain">Domain</Label>
          <Input
            id="domain"
            type="text"
            value={formData.domain}
            onChange={(e) => handleInputChange('domain', e.target.value)}
            placeholder="your-brand.com"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="niche">Niche</Label>
          <Input
            id="niche"
            type="text"
            value={formData.niche}
            onChange={(e) => handleInputChange('niche', e.target.value)}
            placeholder="e.g., fintech for freelancers"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="vision">Vision</Label>
          <Textarea
            id="vision"
            value={formData.vision}
            onChange={(e) => handleInputChange('vision', e.target.value)}
            placeholder="Our vision is to..."
            rows={2}
          />
        </FormGroup>

        <FormGroup>
          <Label>Brand Colors</Label>
          <ColorPickerContainer>
            {[0, 1, 2].map((index) => (
              <ColorInputWrapper key={index}>
                <ColorInput
                  type="color"
                  value={formData.colors[index]}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />
                <ColorLabel>Color {index + 1}</ColorLabel>
              </ColorInputWrapper>
            ))}
          </ColorPickerContainer>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tone">Tone</Label>
          <Select
            id="tone"
            value={formData.tone}
            onChange={(e) => handleInputChange('tone', e.target.value)}
          >
            <option value="Modern / Minimal">Modern / Minimal</option>
            <option value="Playful">Playful</option>
            <option value="Trustworthy / Corporate">Trustworthy / Corporate</option>
            <option value="Edgy">Edgy</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tagline">Tagline (Optional)</Label>
          <Input
            id="tagline"
            type="text"
            value={formData.tagline}
            onChange={(e) => handleInputChange('tagline', e.target.value)}
            placeholder="One-line tagline"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="ctaText">Primary CTA Text</Label>
          <Input
            id="ctaText"
            type="text"
            value={formData.ctaText}
            onChange={(e) => handleInputChange('ctaText', e.target.value)}
            placeholder="Get Started"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="logoText">Logo Text (Optional)</Label>
          <Input
            id="logoText"
            type="text"
            value={formData.logoText}
            onChange={(e) => handleInputChange('logoText', e.target.value)}
            placeholder="Company initials"
          />
        </FormGroup>

        <SectionCustomizationContainer>
          <SectionCustomizationTitle>Choose Your Website Sections</SectionCustomizationTitle>
          <SectionGrid>
            {[
              { key: 'hero', label: 'Hero Section', description: 'Main banner with title and CTA' },
              { key: 'about', label: 'About Us', description: 'Company description and mission' },
              { key: 'features', label: 'Features', description: 'Product/service features showcase' },
              { key: 'team', label: 'Team', description: 'Meet the team members' },
              { key: 'testimonials', label: 'Testimonials', description: 'Customer reviews and feedback' },
              { key: 'pricing', label: 'Pricing', description: 'Plans and pricing tiers' },
              { key: 'contact', label: 'Contact', description: 'Contact information and form' }
            ].map((section) => (
              <SectionOption key={section.key}>
                <SectionCheckbox
                  type="checkbox"
                  id={section.key}
                  checked={formData.sections[section.key as keyof typeof formData.sections]}
                  onChange={() => handleSectionChange(section.key as keyof typeof formData.sections)}
                />
                <SectionLabel htmlFor={section.key}>
                  <SectionOptionTitle>{section.label}</SectionOptionTitle>
                  <SectionOptionDescription>{section.description}</SectionOptionDescription>
                </SectionLabel>
              </SectionOption>
            ))}
          </SectionGrid>
        </SectionCustomizationContainer>

        <LaunchButton type="submit" disabled={!isValid || isGenerating}>
          {isGenerating ? 'Generating...' : '🚀 Launch'}
        </LaunchButton>
      </Form>
    </FormContainer>
  );
};

// Brand Preview Component
const BrandPreview: React.FC<{ data: BrandJSON }> = ({ data }) => {
  return (
    <PreviewContainer>
      <PreviewHeader>
        <Logo>{data.footer.companyName.charAt(0).toUpperCase()}</Logo>
        <HeaderNav>
          {data.sections.hero && <NavItem>Home</NavItem>}
          {data.sections.about && <NavItem>About</NavItem>}
          {data.sections.features && <NavItem>Features</NavItem>}
          {data.sections.pricing && <NavItem>Pricing</NavItem>}
          {data.sections.contact && <NavItem>Contact</NavItem>}
        </HeaderNav>
      </PreviewHeader>

      {data.sections.hero && (
        <HeroSection style={{ backgroundColor: data.colors.primary }}>
          <HeroContent>
            <HeroTitle style={{ color: 'white' }}>{data.hero.title}</HeroTitle>
            <HeroSubtitle style={{ color: 'white' }}>{data.hero.subtitle}</HeroSubtitle>
            <HeroButton style={{ backgroundColor: data.colors.accent, color: 'white' }}>
              {data.hero.ctaText}
            </HeroButton>
            {data.hero.stats && (
              <StatsContainer>
                {data.hero.stats.map((stat, index) => (
                  <StatItem key={index}>
                    <StatNumber style={{ color: 'white' }}>{stat.number}</StatNumber>
                    <StatLabel style={{ color: 'rgba(255,255,255,0.8)' }}>{stat.label}</StatLabel>
                  </StatItem>
                ))}
              </StatsContainer>
            )}
          </HeroContent>
        </HeroSection>
      )}

      {data.sections.about && (
        <AboutSection>
          <SectionTitle>{data.about.title}</SectionTitle>
          <SectionDescription>{data.about.description}</SectionDescription>
          {data.sections.team && data.about.team && (
            <TeamContainer>
              <TeamTitle>Meet Our Team</TeamTitle>
              <TeamGrid>
                {data.about.team.map((member, index) => (
                  <TeamMember key={index}>
                    <TeamAvatar>{member.avatar}</TeamAvatar>
                    <TeamName>{member.name}</TeamName>
                    <TeamRole>{member.role}</TeamRole>
                  </TeamMember>
                ))}
              </TeamGrid>
            </TeamContainer>
          )}
        </AboutSection>
      )}

      {data.sections.features && (
        <FeaturesSection>
          <SectionTitle>Features</SectionTitle>
          <FeaturesGrid>
            {data.features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesSection>
      )}

      {data.sections.testimonials && data.testimonials && (
        <TestimonialsSection style={{ backgroundColor: data.colors.secondary }}>
          <SectionTitle style={{ color: 'white', textAlign: 'center' }}>What Our Customers Say</SectionTitle>
          <TestimonialsGrid>
            {data.testimonials.map((testimonial, index) => (
              <TestimonialCard key={index}>
                <TestimonialQuote>"{testimonial.quote}"</TestimonialQuote>
                <TestimonialAuthor>
                  <TestimonialAvatar>{testimonial.avatar}</TestimonialAvatar>
                  <TestimonialInfo>
                    <TestimonialName>{testimonial.author}</TestimonialName>
                    <TestimonialRole>{testimonial.role}</TestimonialRole>
                  </TestimonialInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            ))}
          </TestimonialsGrid>
        </TestimonialsSection>
      )}

      {data.sections.pricing && data.pricing && (
        <PricingSection>
          <SectionTitle style={{ textAlign: 'center' }}>Choose Your Plan</SectionTitle>
          <PricingGrid>
            {data.pricing.map((plan, index) => (
              <PricingCard key={index} $popular={plan.popular}>
                {plan.popular && <PopularBadge>Most Popular</PopularBadge>}
                <PricingName>{plan.name}</PricingName>
                <PricingPrice>{plan.price}</PricingPrice>
                <PricingFeatures>
                  {plan.features.map((feature, featureIndex) => (
                    <PricingFeature key={featureIndex}>✓ {feature}</PricingFeature>
                  ))}
                </PricingFeatures>
                <PricingButton $popular={plan.popular}>Get Started</PricingButton>
              </PricingCard>
            ))}
          </PricingGrid>
        </PricingSection>
      )}

      {data.sections.contact && (
        <ContactSection style={{ backgroundColor: data.colors.primary }}>
          <ContactContent>
            <ContactTitle style={{ color: 'white' }}>{data.contact.title}</ContactTitle>
            <ContactDescription style={{ color: 'white' }}>{data.contact.description}</ContactDescription>
            <ContactInfo>
              <ContactItem style={{ color: 'white' }}>📧 {data.contact.email}</ContactItem>
              <ContactItem style={{ color: 'white' }}>📞 {data.contact.phone}</ContactItem>
            </ContactInfo>
          </ContactContent>
        </ContactSection>
      )}

      <PreviewFooter style={{ backgroundColor: '#1a1a1a' }}>
        <FooterContent>
          <FooterCompany style={{ color: 'white' }}>{data.footer.companyName}</FooterCompany>
          <FooterTagline style={{ color: '#666' }}>{data.footer.tagline}</FooterTagline>
          <FooterLinks>
            {data.footer.links.map((link, index) => (
              <FooterLink key={index} href={link.url} style={{ color: '#888' }}>
                {link.title}
              </FooterLink>
            ))}
          </FooterLinks>
        </FooterContent>
      </PreviewFooter>
    </PreviewContainer>
  );
};

const Card = () => {
  const [displayText] = useState('theanta.com');
  const [showForm, setShowForm] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [brandPreview, setBrandPreview] = useState<BrandJSON | null>(null);

  const handleFormSubmit = async (inputs: BrandInputs) => {
    setIsGenerating(true);
    setShowForm(false);
    
    try {
      const result = await generateBrandPreview(inputs);
      setBrandPreview(result);
    } catch (error) {
      console.error('Error generating brand preview:', error);
      setShowForm(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setShowForm(true);
    setBrandPreview(null);
  };


  return (
    <StyledWrapper>
      <div className="browser">
        <div className="tabs-head">
          <div className="tabs">
            <div className="tab-open">
              <div className="rounded-l"><div className="mask-round" /></div>
              <span>ANTA</span>
              <div className="close-tab">✕</div>
              <div className="rounded-r"><div className="mask-round" /></div>
            </div>
          </div>
          <div className="window-opt">
            <button>-</button>
            <button>□</button>
            <button className="window-close">✕</button>
          </div>
        </div>
        <div className="head-browser">
          <button>←</button>
          <button disabled>→</button>
          <input 
            type="text" 
            name="anta" 
            id="anta" 
            placeholder="Enter your brand/startup name" 
            value={displayText}
            readOnly
          />
          <button>⋮</button>
          <button className="star">✰</button>
        </div>
        <div className="body-browser">
          {showForm && (
            <BrandForm
              initialDomain={displayText}
              onSubmit={handleFormSubmit}
              isGenerating={isGenerating}
            />
          )}
          {isGenerating && (
            <Loader>
              <div className="spinner"></div>
              <div className="loading-text">
                <div>🤖 AI is crafting your brand...</div>
                <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
                  Generating personalized content
                </div>
              </div>
            </Loader>
          )}
          {brandPreview && !isGenerating && (
            <>
              <BrandPreview data={brandPreview} />
              <ResetButton onClick={handleReset}>
                🔄 Try Again
              </ResetButton>
            </>
          )}
        </div>
        
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .browser {
    width: 720px;
    height: 500px;
    background: lightgrey;
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    box-shadow: 5px 5px 10px rgba(31, 31, 31, 0.245);
  }

  /* tabs-head */
  .tabs-head {
    background-color: #353535;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: end;
    padding-left: 20px;
  }

  .tabs-head .tab-open {
    width: 100px;
    height: 34px;
    border-radius: 7px 7px 0 0;
    background-color: #515151;
    display: flex;
    gap: 5px;
    align-items: start;
    justify-content: space-between;
    padding: 4px 8px;
    position: relative;
  }

  .tabs-head .tab-open .close-tab {
    color: #fff;
    font-size: 9px;
    padding: 1px 4px 1px 4px;
    border-radius: 50%;
    cursor: default;
  }
  .tabs-head .tab-open .close-tab:hover {
    background-color: #5d5d5d;
  }

  .tabs-head .tab-open .rounded-l {
    position: absolute;
    background-color: #515151;
    width: 20px;
    height: 24px;
    top: 0;
    right: 0;
    transform: translate(100%);
    overflow: hidden;
  }
  .tabs-head .tab-open .rounded-l .mask-round {
    width: 100%;
    height: 100%;
    background-color: #353535;
    border-radius: 0 0 0 7px;
  }

  .tabs-head .tab-open .rounded-r {
    position: absolute;
    background-color: #515151;
    width: 20px;
    height: 24px;
    top: 0;
    left: 0;
    transform: translate(-100%);
    overflow: hidden;
  }

  .tabs-head .tab-open .rounded-r .mask-round {
    width: 100%;
    height: 100%;
    background-color: #353535;
    border-radius: 0 0 7px 0;
  }

  .tabs-head .tab-open span {
    color: #fff;
    font-size: 10px;
  }

  .tabs-head .window-opt {
    display: flex;
  }

  .tabs-head .window-opt button {
    height: 30px;
    width: 30px;
    border: none;
    background-color: transparent;
    transition: 0.1s ease-out;
    color: #fff;
    margin-bottom: 10px;
  }

  .tabs-head .window-opt button:hover {
    background-color: #515151c8;
  }

  .tabs-head .window-opt .window-close:hover {
    background-color: rgb(255, 52, 52);
  }

  /* head-browser */
  .head-browser {
  margin-top: -12px;
    top: 30px;
    width: 100%;
    height: 40px;
    background-color: #515151;
    padding: 7px;
    display: flex;
    border-radius: 7px 7px 0 0;
    gap: 5px;
  }

  .head-browser input {
    background-color: #3b3b3b;
    border: 2px solid transparent;
    height: 100%;
    border-radius: 20px;
    outline: none;
    color: #fff;
    padding: 0 15px;
    flex: 1;
    transition: 0.2s ease-in-out;
    position: relative;
  }

  .head-browser input.animating {
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 50% {
      border-color: transparent;
    }
    51%, 100% {
      border-color: rgb(173, 214, 255);
    }
  }

  .head-browser input:hover {
    background-color: #5d5d5d;
  }

  .head-browser input:focus {
    border-color: rgb(173, 214, 255);
    background-color: #3b3b3b;
    transition: none;
  }

  .head-browser input::placeholder {
    color: #fff;
  }

  .head-browser button {
    width: 27px;
    height: 25px;
    border: none;
    background-color: transparent;
    color: #fff;
    border-radius: 50%;
    transition: 0.2s ease-in-out;
  }

  .head-browser button:disabled {
    opacity: 0.4;
  }

  .head-browser button:hover {
    background-color: #5d5d5d;
  }

  .head-browser button:disabled:hover {
    background-color: transparent;
  }

  .head-browser .star {
    color: #fff;
    position: absolute;
    right: 45px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    opacity: 0.7;
    height: 18px;
    width: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 3px;
  }

  .body-browser {
    flex: 1;
    background: white;
    overflow-y: auto;
  }
`;

// Form Styled Components
const FormContainer = styled.div`
  padding: 24px;
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #001f3f, #730062, #F00B51);
  }
`;

const FormTitle = styled.h2`
  margin: 0 0 32px 0;
  font-size: 24px;
  font-weight: 400;
  font-family: 'Righteous', cursive;
  background: linear-gradient(135deg, #001f3f, #730062, #F00B51);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
  max-width: 100%;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  
  &:nth-child(3), &:nth-child(4) {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: #1e293b;
  font-family: 'Righteous', cursive;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  margin-bottom: 2px;
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #730062;
    box-shadow: 0 0 0 3px rgba(115, 0, 98, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #94a3b8;
    font-style: italic;
  }
`;

const Textarea = styled.textarea`
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  resize: vertical;
  min-height: 70px;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #730062;
    box-shadow: 0 0 0 3px rgba(115, 0, 98, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #94a3b8;
    font-style: italic;
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #730062;
    box-shadow: 0 0 0 3px rgba(115, 0, 98, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
  
  option {
    background: white;
    color: #1e293b;
    padding: 8px;
  }
`;

const ColorPickerContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(226, 232, 240, 0.5);
  grid-column: 1 / -1;
`;

const ColorInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
`;

const ColorInput = styled.input`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:focus {
    outline: none;
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 0 0 4px rgba(115, 0, 98, 0.2), 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const ColorLabel = styled.span`
  font-size: 10px;
  color: #475569;
  font-weight: 600;
  font-family: 'Righteous', cursive;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const LaunchButton = styled.button`
  background: linear-gradient(135deg, #001f3f 0%, #730062 50%, #F00B51 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 400;
  font-family: 'Righteous', cursive;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 31, 63, 0.3);
  grid-column: 1 / -1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 30px rgba(0, 31, 63, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px) scale(0.98);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 12px rgba(0, 31, 63, 0.2);
    
    &::before {
      display: none;
    }
  }
`;

// Preview Styled Components
const PreviewContainer = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #eee;
`;

const Logo = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`;

const HeaderNav = styled.div`
  display: flex;
  gap: 20px;
`;

const NavItem = styled.div`
  font-size: 12px;
  color: #666;
  cursor: pointer;
  
  &:hover {
    color: #3b82f6;
  }
`;

const HeroSection = styled.div`
  padding: 40px 20px;
  text-align: center;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroContent = styled.div`
  max-width: 400px;
`;

const HeroTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px 0;
  line-height: 1.2;
`;

const HeroSubtitle = styled.p`
  font-size: 14px;
  margin: 0 0 20px 0;
  opacity: 0.9;
  line-height: 1.4;
`;

const HeroButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`;

const AboutSection = styled.div`
  padding: 30px 20px;
  background: white;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
`;

const SectionDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
`;

const FeaturesSection = styled.div`
  padding: 30px 20px;
  background: #f8f9fa;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #eee;
`;

const FeatureTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
`;

const FeatureDescription = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;
  line-height: 1.4;
`;

const ContactSection = styled.div`
  padding: 30px 20px;
  text-align: center;
`;

const ContactContent = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;

const ContactTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
`;

const ContactDescription = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
  line-height: 1.4;
`;

const PreviewFooter = styled.div`
  padding: 20px;
  text-align: center;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FooterCompany = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const FooterTagline = styled.div`
  font-size: 12px;
`;

const ResetButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

// New Preview Section Styled Components
const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 24px;
  
  @media (max-width: 600px) {
    gap: 20px;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  font-family: 'Righteous', cursive;
  
  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const TeamContainer = styled.div`
  margin-top: 32px;
`;

const TeamTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin: 0 0 20px 0;
  font-family: 'Righteous', cursive;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 16px;
`;

const TeamMember = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #eee;
`;

const TeamAvatar = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #001f3f, #730062);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin: 0 auto 12px;
`;

const TeamName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const TeamRole = styled.div`
  font-size: 12px;
  color: #666;
`;

const FeatureIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`;

const TestimonialsSection = styled.div`
  padding: 40px 20px;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

const TestimonialCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TestimonialQuote = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 16px;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TestimonialAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #001f3f, #730062);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
`;

const TestimonialInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TestimonialName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #333;
`;

const TestimonialRole = styled.div`
  font-size: 10px;
  color: #666;
`;

const PricingSection = styled.div`
  padding: 40px 20px;
  background: #f8f9fa;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 24px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const PricingCard = styled.div<{ $popular?: boolean }>`
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 2px solid ${props => props.$popular ? '#730062' : '#e2e8f0'};
  position: relative;
  text-align: center;
  transition: all 0.3s ease;
  
  ${props => props.$popular && `
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(115, 0, 98, 0.2);
  `}
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #001f3f, #730062);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PricingName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  font-family: 'Righteous', cursive;
`;

const PricingPrice = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #001f3f;
  margin-bottom: 16px;
`;

const PricingFeatures = styled.div`
  text-align: left;
  margin-bottom: 24px;
`;

const PricingFeature = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  padding-left: 4px;
`;

const PricingButton = styled.button<{ $popular?: boolean }>`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  background: ${props => props.$popular 
    ? 'linear-gradient(135deg, #001f3f, #730062)' 
    : '#e2e8f0'
  };
  color: ${props => props.$popular ? 'white' : '#333'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

const ContactItem = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FooterLink = styled.a`
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #3b82f6 !important;
  }
`;

// Section Customization Styled Components
const SectionCustomizationContainer = styled.div`
  grid-column: 1 / -1;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 20px;
  border: 2px solid rgba(226, 232, 240, 0.5);
  backdrop-filter: blur(10px);
`;

const SectionCustomizationTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  font-family: 'Righteous', cursive;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-align: center;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const SectionOption = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: #730062;
    transform: translateY(-1px);
  }
`;

const SectionCheckbox = styled.input`
  margin-top: 2px;
  accent-color: #730062;
  cursor: pointer;
`;

const SectionLabel = styled.label`
  flex: 1;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SectionOptionTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  font-family: 'Righteous', cursive;
  letter-spacing: 0.3px;
`;

const SectionOptionDescription = styled.div`
  font-size: 10px;
  color: #666;
  line-height: 1.3;
`;

export default Card;
