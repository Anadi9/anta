'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Check, Plus, ArrowRight, Award, Shield, Clock, Users, Rocket, ArrowLeft, Sparkles, Zap, Target, Brain, Code, Palette, Database, Smartphone, Globe, ChevronRight, ChevronLeft, Star, Heart, TrendingUp, ShoppingCart, CheckCircle, Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StartProject = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    services: [] as string[],
    budget: "",
    timeline: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    description: "",
    experience: "",
    goals: [] as string[]
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const services = [
    { name: "Web Application", icon: Globe, color: "blue", description: "Modern web apps" },
    { name: "AI Features", icon: Brain, color: "purple", description: "Smart automation" },
    { name: "Data Dashboard", icon: TrendingUp, color: "green", description: "Analytics & insights" },
    { name: "Mobile App", icon: Smartphone, color: "pink", description: "iOS & Android" },
    { name: "E-commerce", icon: ShoppingCart, color: "orange", description: "Online stores" },
    { name: "API Development", icon: Code, color: "cyan", description: "Backend services" },
    { name: "Performance", icon: Zap, color: "yellow", description: "Speed optimization" },
    { name: "Security", icon: Shield, color: "red", description: "Data protection" },
    { name: "Database", icon: Database, color: "indigo", description: "Data architecture" },
    { name: "Real-time", icon: Target, color: "teal", description: "Live features" },
    { name: "Custom", icon: Palette, color: "violet", description: "Unique solutions" }
  ];

  const goals = [
    "Increase Revenue",
    "Improve Efficiency", 
    "Enhance User Experience",
    "Scale Operations",
    "Reduce Costs",
    "Digital Transformation",
    "Market Expansion",
    "Innovation"
  ];

  const steps = [
    { title: "What do you need?", subtitle: "Select your services" },
    { title: "Tell us about you", subtitle: "Your contact details" },
    { title: "Project specifications", subtitle: "Timeline & budget" },
    { title: "Requirements & goals", subtitle: "Detailed project scope" },
    { title: "Ready to proceed!", subtitle: "Review & submit" }
  ];

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      setIsAnimating(false);
    }, 300);
  };

  const prevStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.max(prev - 1, 0));
      setIsAnimating(false);
    }, 300);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (formData.services.length === 0) {
          toast({
            title: "Selection Required",
            description: "Please select at least one service to continue.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.company || !formData.title) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields (marked with *) to continue.",
            variant: "destructive",
          });
          return false;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast({
            title: "Invalid Email",
            description: "Please enter a valid email address.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.budget || !formData.timeline || !formData.description) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields to continue.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const validateForm = (): boolean => {
    if (formData.services.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one service.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company || !formData.title) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required contact information.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.budget || !formData.timeline || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required project specifications.",
        variant: "destructive",
      });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      const result = await response.json();
      setIsSuccess(true);
      
      toast({
        title: "Success!",
        description: "Your project submission has been received. We'll be in touch soon!",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : 'There was an error submitting your form. Please try again or contact us directly at antatechh@gmail.com',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(0);
    setFormData({
      services: [],
      budget: "",
      timeline: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      title: "",
      description: "",
      experience: "",
      goals: []
    });
  };

  if (isSuccess) {
    return (
      <section id="start-project" className="py-20 px-6 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(59,130,246)_1px,transparent_0)] bg-[length:48px_48px] animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="space-y-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-brand-purple to-brand-pink rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-bold font-righteous">
                <span className="block text-foreground">Project Submission</span>
                <span className="block bg-gradient-brand bg-clip-text text-transparent">
                  Successful!
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Thank you for your detailed project submission. Our team has received your information and will review it carefully. We'll be in touch within 24 hours to discuss next steps.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-brand-purple hover:bg-brand-purple/90 text-white"
                onClick={resetForm}
              >
                Submit Another Project
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
                onClick={() => window.location.href = 'mailto:antatechh@gmail.com'}
              >
                <Mail className="mr-2 w-5 h-5" />
                Contact Us Directly
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="start-project" className="py-20 px-6 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(59,130,246)_1px,transparent_0)] bg-[length:48px_48px] animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-3 text-sm text-brand-purple font-medium">
            <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse"></div>
            <span>Let's Build Together</span>
            <Sparkles className="w-4 h-4 text-brand-purple animate-pulse" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold font-righteous">
            <span className="block text-foreground">Ready to Build</span>
            <span className="block bg-gradient-brand bg-clip-text text-transparent">
              Your Solution?
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            You have a clear vision and requirements. Let's turn your well-defined project into a powerful solution with the right technology stack and development approach.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-brand-purple text-white shadow-lg' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                    index < currentStep ? 'bg-brand-purple' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Container */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Step Header */}
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-2">{steps[currentStep].title}</h3>
              <p className="text-muted-foreground">{steps[currentStep].subtitle}</p>
            </div>

            {/* Step Content */}
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {services.map((service) => {
                      const isSelected = formData.services.includes(service.name);
                      const IconComponent = service.icon;
                      return (
                        <button
                          key={service.name}
                          onClick={() => toggleService(service.name)}
                          className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                            isSelected
                              ? 'border-brand-purple bg-brand-purple/10 shadow-lg'
                              : 'border-border hover:border-brand-purple/50 hover:shadow-md'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                              isSelected ? 'bg-brand-purple text-white' : `bg-${service.color}-100 text-${service.color}-600`
                            }`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-sm">{service.name}</div>
                              <div className="text-xs text-muted-foreground">{service.description}</div>
                            </div>
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-purple rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-foreground text-sm font-medium mb-3">
                          First Name *
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => updateFormData('firstName', e.target.value)}
                          className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-brand-purple focus:ring-brand-purple rounded-xl"
                          placeholder="Enter your first name"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground text-sm font-medium mb-3">
                          Last Name *
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => updateFormData('lastName', e.target.value)}
                          className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-brand-purple focus:ring-brand-purple rounded-xl"
                          placeholder="Enter your last name"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground text-sm font-medium mb-3">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-brand-purple focus:ring-brand-purple rounded-xl"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-foreground text-sm font-medium mb-3">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-brand-purple focus:ring-brand-purple rounded-xl"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground text-sm font-medium mb-3">
                          Company Name *
                        </label>
                        <Input
                          value={formData.company}
                          onChange={(e) => updateFormData('company', e.target.value)}
                          className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-brand-purple focus:ring-brand-purple rounded-xl"
                          placeholder="Enter your company name"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground text-sm font-medium mb-3">
                          Your Title/Role *
                        </label>
                        <Input
                          value={formData.title}
                          onChange={(e) => updateFormData('title', e.target.value)}
                          className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-brand-purple focus:ring-brand-purple rounded-xl"
                          placeholder="e.g., CTO, VP Engineering, Product Manager"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-foreground text-sm font-medium mb-3">
                        Estimated Budget *
                      </label>
                      <Select value={formData.budget} onValueChange={(value) => updateFormData('budget', value)}>
                        <SelectTrigger className="h-12 bg-input border-border text-foreground focus:border-brand-purple rounded-xl">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-25k">Under $25,000</SelectItem>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                          <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                          <SelectItem value="over-250k">Over $250,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-foreground text-sm font-medium mb-3">
                        Estimated Timeline *
                      </label>
                      <Select value={formData.timeline} onValueChange={(value) => updateFormData('timeline', value)}>
                        <SelectTrigger className="h-12 bg-input border-border text-foreground focus:border-brand-purple rounded-xl">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3-months">1-3 Months</SelectItem>
                          <SelectItem value="3-6-months">3-6 Months</SelectItem>
                          <SelectItem value="6-12-months">6-12 Months</SelectItem>
                          <SelectItem value="12-24-months">12-24 Months</SelectItem>
                          <SelectItem value="ongoing">Ongoing Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-foreground text-sm font-medium mb-3">
                      Detailed Project Requirements *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Provide detailed project requirements, technical specifications, business objectives, user stories, integration needs, and any specific features or functionality you require..."
                      className="w-full min-h-[140px] bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-brand-purple focus:ring-brand-purple rounded-xl"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-6">What are your main goals? (Select all that apply)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {goals.map((goal) => {
                        const isSelected = formData.goals.includes(goal);
                        return (
                          <button
                            key={goal}
                            onClick={() => toggleGoal(goal)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                              isSelected
                                ? 'border-brand-purple bg-brand-purple/10 shadow-lg'
                                : 'border-border hover:border-brand-purple/50 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              {isSelected ? (
                                <Check className="w-5 h-5 text-brand-purple" />
                              ) : (
                                <Star className="w-5 h-5 text-muted-foreground" />
                              )}
                              <span className="text-sm font-medium">{goal}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-foreground text-sm font-medium mb-3">
                      Technical Background & Constraints
                    </label>
                    <Textarea
                      value={formData.experience}
                      onChange={(e) => updateFormData('experience', e.target.value)}
                      placeholder="Tell us about your technical background, existing systems, integration requirements, security needs, performance expectations, and any technical constraints or preferences..."
                      className="w-full min-h-[120px] bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-brand-purple focus:ring-brand-purple rounded-xl"
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-brand-purple" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2">Review Your Project Brief</h4>
                    <p className="text-muted-foreground">Please review your project details before we proceed with development</p>
                  </div>

                  <div className="bg-muted/50 rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-sm text-muted-foreground mb-2">Contact Information</h5>
                        <p className="text-sm">{formData.firstName} {formData.lastName}</p>
                        <p className="text-sm text-muted-foreground">{formData.email}</p>
                        <p className="text-sm text-muted-foreground">{formData.phone}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-muted-foreground mb-2">Company Details</h5>
                        <p className="text-sm">{formData.company}</p>
                        <p className="text-sm text-muted-foreground">{formData.title}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-sm text-muted-foreground mb-2">Project Specifications</h5>
                      <p className="text-sm">Services: {formData.services.join(', ')}</p>
                      <p className="text-sm">Budget: {formData.budget}</p>
                      <p className="text-sm">Timeline: {formData.timeline}</p>
                      <p className="text-sm">Goals: {formData.goals.join(', ')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/50">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center space-x-2 px-6 py-3 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple/90"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple/90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      <span>Start Development Process</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
            <div className="w-12 h-12 bg-brand-purple/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-brand-purple" />
            </div>
            <h4 className="font-semibold mb-2">Professional Development</h4>
            <p className="text-sm text-muted-foreground">Structured approach with clear milestones and deliverables</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-green-500" />
            </div>
            <h4 className="font-semibold mb-2">Enterprise-Grade Quality</h4>
            <p className="text-sm text-muted-foreground">Production-ready solutions with robust architecture</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
            <div className="w-12 h-12 bg-brand-pink/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-6 h-6 text-brand-pink" />
            </div>
            <h4 className="font-semibold mb-2">Efficient Delivery</h4>
            <p className="text-sm text-muted-foreground">Agile methodology with regular progress updates</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartProject;