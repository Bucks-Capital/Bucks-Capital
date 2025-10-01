import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingUp, Users, Target, Award, GraduationCap, BookOpen, DollarSign, PieChart, BarChart3, LineChart, Briefcase, Crown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function with 600ms timing
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Use custom smooth scroll with 600ms duration
      const targetPosition = element.offsetTop - 72; // Account for nav height
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 600;
      let start: number | null = null;

      function animation(currentTime: number) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      function ease(t: number, b: number, c: number, d: number) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    }
  };

    const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

      return <div className="min-h-screen bg-background overflow-x-hidden">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              navScrolled 
                ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
                : 'bg-transparent'
            }`}>
              <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                  {/* Logo */}
                  <div className="flex items-center">
                    <button 
                      onClick={() => {
                        navigate('/');
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                      }}
                      className="flex items-center"
                    >
                      <img src="/crest.png" alt="Bucks Capital" className="h-10 w-10 object-contain mr-4" />
                      <span className="text-2xl font-bold text-gray-900">Bucks Capital</span>
                    </button>
                  </div>

                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center space-x-8">
                    <button 
                      onClick={() => {
                        navigate('/');
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                      }}
                      className="text-foreground hover:text-primary transition-colors duration-300 text-base font-semibold uppercase tracking-wide relative group"
                    >
                      Home
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </button>
                    
                    <button
                      onClick={() => navigate('/about')}
                      className="text-foreground hover:text-primary transition-colors duration-300 text-base font-semibold uppercase tracking-wide relative group"
                    >
                      About
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </button>
                    
                    <Link to={{ pathname: "/", hash: "#join-us" }}>
                      <button className="text-foreground hover:text-primary transition-colors duration-300 text-base font-semibold uppercase tracking-wide relative group">
                        Join Us
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                      </button>
                    </Link>
                    
                    <button
                      onClick={() => navigate('/donors')}
                      className="text-foreground hover:text-primary transition-colors duration-300 text-base font-semibold uppercase tracking-wide relative group"
                    >
                      Donors
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </button>
                    
                    <Button 
                      onClick={() => navigate('/donation')}
                      className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg text-base"
                    >
                      Donate
                    </Button>
                  </div>

                  {/* Mobile menu button */}
                  <div className="md:hidden">
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="text-foreground hover:text-primary transition-colors duration-300"
                    >
                      {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                  </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                  mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="py-4 space-y-1">
                    <button
                      onClick={() => {
                        navigate('/');
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-foreground hover:text-primary transition-colors duration-300 text-sm font-semibold py-3"
                    >
                      Home
                    </button>
                    <button
                      onClick={() => {
                        navigate('/about');
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-foreground hover:text-primary transition-colors duration-300 text-sm font-semibold py-3"
                    >
                      About
                    </button>
                    <button
                      onClick={() => {
                        smoothScrollTo('join-us');
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-foreground hover:text-primary transition-colors duration-300 text-sm font-semibold py-3"
                    >
                      Join Us
                    </button>
                    <button
                      onClick={() => {
                        navigate('/donors');
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-foreground hover:text-primary transition-colors duration-300 text-sm font-semibold py-3"
                    >
                      Donors
                    </button>
                    <button
                      onClick={() => {
                        navigate('/donation');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-primary text-primary-foreground font-semibold px-4 py-3 transition-all duration-300 text-center text-sm mt-4 rounded-full"
                    >
                      Donate
                    </button>
                  </div>
                </div>
              </div>
            </nav>

      <section id="donors" className="py-24 bg-white relative">
        {/* Top curve to match counters section */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-16 md:h-20 lg:h-24"
            style={{ transform: 'rotate(180deg)' }}
          >
            <path 
              d="M0,0 C150,60 350,0 600,40 C850,80 1050,20 1200,60 L1200,120 L0,120 Z" 
              fill="white"
            />
          </svg>
        </div>
        <div className="container mx-auto px-6 relative z-10 pt-16">
          <div className="fade-in-trigger max-w-5xl mx-auto text-center -mt-14 mb-16">
            <h2 className="text-display text-4xl md:text-6xl font-black text-primary-background mb-12">
              Donors
            </h2>
            <p className="text-2xl text-black leading-relaxed mb-8">
              <strong>Bucks Capital</strong> wants to thank each and every one of our donors for their support. Without donations, we would not be able to continue our mission.
            </p>
            <p className="text-4xl text-black font-bold leading-relaxed mt-20 mb-8">
              List of Donors
            </p>    
          </div>
        </div>
      </section>
      </div>
};



export default About;
