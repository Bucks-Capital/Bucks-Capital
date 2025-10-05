import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Donation: React.FC = () => {
  const navigate = useNavigate();
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const donateRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = [
      donateRef.current,
      footerRef.current
    ].filter(Boolean);

    elements.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      elements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
              
              <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg text-base">
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
          <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden relative z-50 ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
                className="w-full bg-primary text-primary-foreground font-semibold px-4 py-3 transition-all duration-300 text-center text-sm mt-4 rounded-full"
              >
                Donate
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 bg-white text-gray-900 relative overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto px-6 relative z-10 w-full">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-display text-5xl md:text-6xl font-black text-gray-900 mb-8">
                Support Our Mission
              </h1>
              <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
              <p className="text-xl text-gray-700 leading-relaxed mb-16 font-medium max-w-3xl mx-auto">
                Help us provide more students with real-world investment experience and financial education. 
                Your support directly impacts the next generation of financial leaders.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-12 border border-gray-200 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Make a Difference</h2>
                <p className="text-gray-700 font-medium">
                  Every donation helps us expand our program and reach more students.
                </p>
              </div>
              
              <a href="https://donate.stripe.com/fZueVe4B0bm37NPaZ55wI00">
                <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold px-12 py-4 rounded-full transition-all duration-300 hover:shadow-xl text-lg">
                  Make a Donation
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" ref={footerRef} className="py-20 bg-white text-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className={`grid lg:grid-cols-4 gap-12 mb-16 transition-all duration-1000 ${visibleElements.has('footer') ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  <img src="/crest.png" alt="Bucks Capital" className="h-10 w-10 object-contain mr-4" />
                  <span className="text-2xl font-bold text-gray-900">Bucks Capital</span>
                </div>
                <p className="text-gray-600 text-lg font-medium mb-6 max-w-md">
                  Empowering the next generation of financial leaders through hands-on investment experience and professional mentorship.
                </p>
                <div className="w-16 h-1 bg-primary"></div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <button 
                      onClick={() => navigate('/')}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/about')}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
                    >
                      About Us
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/donors')}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
                    >
                      Donors
                    </button>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Contact</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="mailto:bucks.capital1@gmail.com" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium">
                      bucks.capital1@gmail.com
                    </a>
                  </li>
                  <li>
                    <a href="https://forms.gle/WLXY5CheUyqNJLYL9" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium">
                      Apply Now
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className={`pt-8 border-t border-gray-200 transition-all duration-1000 ${visibleElements.has('footer') ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-500 font-medium mb-4 md:mb-0">
                  © 2025 Bucks Capital. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a href="mailto:bucks.capital1@gmail.com" className="text-gray-500 hover:text-gray-900 transition-colors duration-300 font-medium">
                    Contact
                  </a>
                  <a href="https://forms.gle/WLXY5CheUyqNJLYL9" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors duration-300 font-medium">
                    Apply
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Donation;
