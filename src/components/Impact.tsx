import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingUp, Users, Target, Award, GraduationCap, BookOpen, DollarSign, PieChart, BarChart3, LineChart, Briefcase, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Impact: React.FC = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const navigate = useNavigate();

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
            <nav className={` top-0 left-0 right-0 z-50 h-[72px] w-full transition-all duration-[600ms] ${
              navScrolled 
                ? 'bg-black shadow-lg' 
                : 'bg-black/90 backdrop-blur-lg'
            }`}
            style={{
              backdropFilter: navScrolled ? 'none' : 'blur(20px)',
            }}>
              <div className="h-full px-6 flex items-center justify-between max-w-screen-2xl mx-auto">
                {/* Left: Crest Icon */}
                <button
                  onClick={scrollToTop}
                  className="flex items-center space-x-3 text-white hover:scale-105 transition-transform duration-300"
                >
                  {/*<Crown className="h-8 w-8 text-white" /> */}
                  <img src="/crest.png" alt="Crest Icon" className="h-8 w-8 object-contain" />
                  <span className="text-xl font-display font-black">Bucks Capital</span>
                </button>
      
                {/* Center: Navigation Links */}
                <div className="hidden md:flex items-center space-x-12">
                  <button
                    onClick={() => navigate('/')}
                    className="text-white hover:text-white/70 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                  >
                    Home
                  </button>
      
                  <button
                    onClick={() => navigate('/about')}
                    className="text-white hover:text-white/70 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                  >
                    About Us
                  </button>
                  
                  <button
                    onClick={() => navigate('/whatwedo')}
                    className="text-white hover:text-white/70 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                  >
                    What We Do
                  </button>
      
                  <button
                    onClick={() => navigate('/impact')}
                    className="text-white hover:text-white/70 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                  >
                    Impact
                    
                  </button>
                  <Link to={{ pathname: "/about", hash: "#join-us" }}>
                  <button
                    className="text-white hover:text-white/70 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                  >
                    Join Us
                  </button>
                  </Link>
                  <button
              onClick={() => navigate('/donors')}
              className="text-white hover:text-white/70 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
            >
              Donors
              
            </button>
                  <Link to={{ pathname: "/", hash: "#donate" }}>
                    <Button className="bg-white/10 hover:bg-white hover:text-black text-white font-semibold px-6 py-2 border uppercase border-white/20 hover:border-white transition-all duration-300">
                      Donate Now
                    </Button>
                  </Link>
                </div>
              </div>
            </nav>

      <section id="impact" className="py-24 bg-white relative">
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
              Impact
            </h2>
            <p className="text-2xl text-black leading-relaxed mb-8">
              <strong>Bucks Capital</strong> strives to not just foster knowledge, but also community. Bucks Capital directly benefits our surrounding community due to our rule of donating all profits made to surrounding non-profits and local initiatives. Bucks Capital exists solely to serve the community and we thank you for your faith in our organization.
            </p>
            <p className="text-2xl text-black leading-relaxed mb-8">
              Our program cultivates financial liateracy, critical thinking, and professional skills that extend far beyond the trading floor. As we grow, we aim to expand access to this hands-on learning model, reinvesting knowledge and resources back into local schools and organizations to empower the next generation of financially capable leaders.
            </p>
            <p className="text-2xl text-black leading-relaxed mb-8">
              At Bucks Capital, our impact is measured in more than returns — it’s seen in the confidence, skills, and opportunities our members carry forward. We equip students with the tools to navigate real markets, fostering a mindset of responsibility and long-term thinking. As our fund grows, so will our ability to mentor, educate, and invest back into the community, creating a cycle of learning and leadership that benefits far beyond our own members.
            </p>
          </div>          
        </div>

        
      </section>
      </div>
};



export default Impact;
