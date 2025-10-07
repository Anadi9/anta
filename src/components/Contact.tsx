'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Calendar, ArrowRight, Clock, Shield, Award, Users, Globe, Phone, MapPin, Send, Sparkles, Zap, Target, Brain, Rocket, CheckCircle, Loader2 } from "lucide-react";
import antaLogo from "@/assets/anta-logo.png";
import React, { useState } from "react";

const Contact = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    startupName: '',
    phone: '',
    idea: '',
    description: '',
    budget: '',
    timeline: ''
  });

  const steps = [
    {
      id: 'intro',
      title: 'Share Your Vision',
      subtitle: 'Tell us what you\'re thinking',
      icon: Rocket,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'personal',
      title: 'Who Are You?',
      subtitle: 'Let\'s get to know each other',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'startup',
      title: 'Your Idea',
      subtitle: 'What\'s on your mind?',
      icon: Brain,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'details',
      title: 'Explore Together',
      subtitle: 'Help us understand your vision',
      icon: Target,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'submit',
      title: 'Start the Conversation',
      subtitle: 'Ready to explore possibilities?',
      icon: Zap,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
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

      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      // You could add error state handling here
      alert('There was an error submitting your form. Please try again or contact us directly at antatechh@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">What's Your Vision?</h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Whether you have a fully formed idea or just a spark of inspiration, we're here to listen and help you explore the possibilities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <h4 className="font-bold mb-2">Free Brainstorming</h4>
                <p className="text-sm text-muted-foreground">Explore ideas without commitment</p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <Award className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold mb-2">Idea Validation</h4>
                <p className="text-sm text-muted-foreground">Get honest feedback on your concept</p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <Zap className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h4 className="font-bold mb-2">Explore Possibilities</h4>
                <p className="text-sm text-muted-foreground">Discover what's technically feasible</p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Full Name *
                </label>
                <Input 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe" 
                  className="bg-input/50 border-border focus:border-blue-500 transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email Address *
                </label>
                <Input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@company.com" 
                  className="bg-input/50 border-border focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                Phone Number
              </label>
              <Input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567" 
                className="bg-input/50 border-border focus:border-blue-500 transition-all duration-300"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Brain className="w-4 h-4 text-green-500" />
                Project/Company Name
              </label>
              <Input 
                value={formData.startupName}
                onChange={(e) => handleInputChange('startupName', e.target.value)}
                placeholder="Your project or company name (if you have one)" 
                className="bg-input/50 border-border focus:border-green-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                What's your idea or concept? *
              </label>
              <Input 
                value={formData.idea}
                onChange={(e) => handleInputChange('idea', e.target.value)}
                placeholder="e.g., A platform for connecting freelancers, An app to track fitness goals, A tool for managing small business inventory" 
                className="bg-input/50 border-border focus:border-green-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                Tell us about your vision or query *
              </label>
              <Textarea 
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="What's your vision? What problem are you trying to solve? What questions do you have? What outcome are you hoping for?"
                className="min-h-[140px] bg-input/50 border-border focus:border-green-500 transition-all duration-300"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-500" />
                  Budget Considerations
                </label>
                <Input 
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="e.g., Exploring options, $10k - $50k, $50k - $100k, or let's discuss" 
                  className="bg-input/50 border-border focus:border-orange-500 transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  Timeline Expectations
                </label>
                <Input 
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  placeholder="e.g., Exploring timeline, 2-3 months, 6 months, or flexible" 
                  className="bg-input/50 border-border focus:border-orange-500 transition-all duration-300"
                />
              </div>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                What to Expect
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Quick response within 24 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Free brainstorming session</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Honest feedback and exploration</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">Ready to Explore?</h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Perfect! Let's start the conversation and see where your idea can take us.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                <h4 className="font-bold mb-2">Next Steps</h4>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>• We'll review your idea</li>
                  <li>• Schedule a free brainstorming session</li>
                  <li>• Explore possibilities together</li>
                  <li>• Provide honest feedback and guidance</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <h4 className="font-bold mb-2">Timeline</h4>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>• Response: Within 24 hours</li>
                  <li>• Brainstorming: 2-3 days</li>
                  <li>• Exploration: 1 week</li>
                  <li>• Next steps: As needed</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <section id="contact" className="py-20 px-6 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(59,130,246)_1px,transparent_0)] bg-[length:36px_36px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="space-y-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-bold font-righteous">
                <span className="block text-foreground">Conversation</span>
                <span className="block bg-gradient-brand bg-clip-text text-transparent">
                  Started!
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your idea has been successfully shared with us. We'll be in touch within 24 hours to start exploring possibilities together.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-brand-navy hover:bg-brand-navy/90 text-white"
                onClick={() => {
                  setIsSuccess(false);
                  setCurrentStep(0);
                  setFormData({
                    name: '',
                    email: '',
                    startupName: '',
                    phone: '',
                    idea: '',
                    description: '',
                    budget: '',
                    timeline: ''
                  });
                }}
              >
                Share Another Idea
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
                onClick={() => window.location.href = 'mailto:hello@anta.dev'}
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
    <section id="contact" className="py-20 px-6 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(59,130,246)_1px,transparent_0)] bg-[length:36px_36px]"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-6 mb-20">
          <div className="flex items-center justify-center gap-3 text-sm text-brand-purple font-medium">
            <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse"></div>
            <span>Let's Build Your Future</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold font-righteous">
            <span className="block text-foreground">Have an Idea?</span>
            <span className="block bg-gradient-brand bg-clip-text text-transparent">
              Let's Talk About It
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Got a vision, concept, or just a spark of an idea? We're here to listen, understand, and help you explore the possibilities. Share your thoughts and let's discover what's possible together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? `bg-gradient-to-br ${step.color} text-white border-transparent shadow-lg` 
                        : isCompleted
                        ? 'bg-green-500/10 border-green-500/20 text-green-500'
                        : 'bg-card/50 border-border/50 text-muted-foreground hover:border-border'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive 
                          ? 'bg-white/20' 
                          : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm">{step.title}</h4>
                        <p className="text-xs opacity-80 truncate">{step.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-3">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl min-h-[600px]">
              <CardContent className="p-8">
                {/* Step Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${steps[currentStep].color} flex items-center justify-center`}>
                      {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-white" })}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{steps[currentStep].title}</h3>
                      <p className="text-muted-foreground">{steps[currentStep].subtitle}</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-brand-purple to-brand-navy h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Step Content */}
                <div className="min-h-[400px] flex flex-col">
                  <div className="flex-1">
                    {renderStepContent()}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-8 border-t border-border/50">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="border-border hover:border-brand-purple"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Step {currentStep + 1} of {steps.length}</span>
                    </div>

                    {currentStep === steps.length - 1 ? (
                      <Button
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-brand-purple to-brand-navy hover:from-brand-purple/90 hover:to-brand-navy/90 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Launching...
                          </>
                        ) : (
                          <>
                            <Rocket className="mr-2 w-5 h-5" />
                            Start the Conversation
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        onClick={handleNext}
                        className="bg-gradient-to-r from-brand-purple to-brand-navy hover:from-brand-purple/90 hover:to-brand-navy/90 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                      >
                        Next
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Direct Contact Options */}
        <div className="mt-16 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Prefer Direct Contact?</h3>
            <p className="text-muted-foreground">Reach out through your preferred channel</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white">
                <Mail className="mr-2 w-4 h-4" />
                hello@anta.dev
              </Button>
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                <MessageCircle className="mr-2 w-4 h-4" />
                WhatsApp
              </Button>
              <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                <Calendar className="mr-2 w-4 h-4" />
                Schedule Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;