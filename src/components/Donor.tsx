import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingUp, Users, Target, Award, GraduationCap, BookOpen, DollarSign, PieChart, BarChart3, LineChart, Briefcase, Crown, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Donors: React.FC = () => {
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled
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

            <Link to={{ pathname: "/about", hash: "#join-us" }}>
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
              className="bg-primary hover:bg-white hover:text-primary border border-primary text-primary-foreground font-bold px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg text-base"
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
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden relative z-50 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="py-4 space-y-1 bg-white border-t border-gray-200">
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
            <Link to={{ pathname: "/about", hash: "#join-us" }}>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-foreground hover:text-primary transition-colors duration-300 text-sm font-semibold py-3"
              >
                Join Us
              </button>
            </Link>
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

    <section id="donors-hero" className="relative pt-32 pb-20 bg-zinc-950 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest inter-font">Our Supporters</span>
          </div>
          <h1 className="text-display text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
            The Foundation of <span className="text-primary">Our Future</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-medium mb-12 max-w-3xl mx-auto">
            Bucks Capital extends its deepest gratitude to the partners and individuals whose support empowers the next generation of financial leaders.
          </p>
        </div>
      </div>
    </section>

    <section id="educational-partners" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Educational Partners</h2>
              <div className="w-20 h-1.5 bg-primary rounded-full"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trendspider */}
            <Card className="p-8 group hover:shadow-2xl transition-all duration-500 border-zinc-100 flex flex-col items-center justify-center min-h-[320px]">
              <div className="relative w-full h-48 flex items-center justify-center mb-6">
                <img
                  src="/Trendspider_black_Logo.jpg"
                  alt="Trendspider Logo"
                  className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <p className="text-center text-zinc-500 font-medium inter-font">Professional Charting & Analysis</p>
            </Card>

            {/* WSO */}
            <Card className="p-8 group hover:shadow-2xl transition-all duration-500 border-zinc-100 flex flex-col items-center justify-center min-h-[320px]">
              <div className="relative w-full h-48 flex items-center justify-center mb-6">
                <img
                  src="/WSO_logo.png"
                  alt="WSO Logo"
                  className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <p className="text-center text-zinc-500 font-medium inter-font">Global Finance Education Partner</p>
            </Card>

            {/* Barebone */}
            <a
              href="https://linktr.ee/barebone.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="p-8 group hover:shadow-2xl transition-all duration-500 border-zinc-100 flex flex-col items-center justify-center min-h-[320px] h-full">
                <div className="relative w-full h-48 flex items-center justify-center mb-6">
                  <img
                    src="/barebone-logo.png"
                    alt="Barebone Logo"
                    className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <p className="text-center text-zinc-500 font-medium inter-font">Strategic AI Research Partner</p>
              </Card>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section id="honor-roll" className="py-24 bg-zinc-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Crown className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">Wall of Honor</h2>
            <p className="text-zinc-500 text-lg font-medium max-w-2xl mx-auto inter-font">
              Acknowledging the families and individuals who have directly contributed to our capital base.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Sarah Cornwell Jewelery',
              'McCusker Family',
              'Mulji Family',
              'Cornwell Family',
              'Medi Family'
            ].map((donor, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-4 group"
              >
                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold text-zinc-800 inter-font">{donor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <footer className="py-20 bg-zinc-950 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <img src="/crest.png" alt="Bucks Capital" className="h-10 w-10 object-contain mr-4" />
                <span className="text-2xl font-bold text-white">Bucks Capital</span>
              </div>
              <p className="text-zinc-400 text-lg font-medium mb-6 max-w-md">
                Empowering the next generation of financial leaders through hands-on investment experience and professional mentorship.
              </p>
              <div className="w-16 h-1 bg-primary"></div>
            </div>

            <div>
              <h3 className="inter-font text-lg font-bold text-white mb-6 uppercase tracking-wider">Contact</h3>
              <div className="space-y-4">
                <p className="text-zinc-400 font-medium">Doylestown, PA 18901</p>
                <p className="text-zinc-400 font-medium inter-font">info@buckscapital.org</p>
              </div>
            </div>

            <div>
              <h3 className="inter-font text-lg font-bold text-white mb-6 uppercase tracking-wider">Mission</h3>
              <p className="text-zinc-400 font-medium">
                Bridging the gap between classroom theory and real-world financial responsibility.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center text-zinc-500 font-medium">
              <p className="mb-4 md:mb-0">© 2025 Bucks Capital. All rights reserved.</p>
              <div className="flex space-x-8">
                <a href="mailto:info@buckscapital.org" className="hover:text-primary transition-colors">Contact</a>
                <button onClick={() => navigate('/donation')} className="hover:text-primary transition-colors">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
};

export default Donors;
