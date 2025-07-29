import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingUp, Users, Target, Award, GraduationCap, BookOpen, DollarSign, PieChart, BarChart3, LineChart, Briefcase, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
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
                    onClick={() => smoothScrollTo('portfolio')}
                    className="text-white hover:text-white/70 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                  >
                    What We Do
                  </button>
                  <button
                    onClick={() => smoothScrollTo('performance')}
                    className="text-white hover:text-white/70 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                  >
                    Impact
                  </button>
                  <button
                    onClick={() => smoothScrollTo('join-us')}
                    className="text-white hover:text-white/70 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                  >
                    Join Us
                  </button>
                  <Button
                    onClick={() => smoothScrollTo('donate')}
                    className="bg-white/10 hover:bg-white hover:text-black text-white font-semibold px-6 py-2 border uppercase border-white/20 hover:border-white transition-all duration-300"
                  >
                    Donate Now
                  </Button>
                </div>
              </div>
            </nav>

      <section id="about" className="py-24 bg-background relative">
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
          <div className="fade-in-trigger max-w-5xl mx-auto text-center mb-16">
            <h2 className="text-display text-4xl md:text-6xl font-black text-black mb-12">
              Who We Are
            </h2>
            <p className="text-2xl text-foreground/80 leading-relaxed mb-8">
              Bucks Capital is more than just a club—we're a comprehensive 
              financial education program that gives students real-world investment experience with actual capital.
            </p>
          </div>
          
          <div className="fade-in-trigger grid md:grid-cols-3 gap-8">
            {[{
            icon: GraduationCap,
            title: 'Educational Excellence',
            description: 'There is a financial literacy gap that leaves students underprepared. "Young people lack the necessary knowledge to make fundamental economic decisions (McInerney, 2005)."'
          }, {
            icon: Target,
            title: 'Real Impact',
            description: 'Real Capital > Paper Portfolios. High school students often learn personal finance through games, simulations, or "paper portfolios."'
          }, {
            icon: Users,
            title: 'Collaborative Growth',
            description: 'Checks & Balances. All investment decisions follow a documented approval process that requires multiple sign-offs, ensuring proper risk management and educational value.'
          }].map((feature, index) => <Card key={index} className="p-8 bg-black text-white border-primary/20 shadow-bold hover:shadow-large transition-all duration-300 text-center rounded-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </Card>)}
          </div>
        </div>

        {/* Bottom curve transition to portfolio */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-16 md:h-20 lg:h-24"
          >
            <path 
              d="M0,60 C150,0 350,80 600,40 C850,0 1050,60 1200,20 L1200,120 L0,120 Z" 
              fill="#000000"
            />
          </svg>
        </div>
      </section>
      </div>
};



export default About;
