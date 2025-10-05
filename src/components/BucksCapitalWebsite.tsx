import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingUp, Users, Target, Award, GraduationCap, BookOpen, DollarSign, PieChart, BarChart3, LineChart, Briefcase, Crown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const CBWestWebsite: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const [scrollY, setScrollY] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countersVisible, setCountersVisible] = useState(false);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [counterValues, setCounterValues] = useState({
    aum: 0,
    students: 0,
    donations: 0
  });

  {/*useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []); */}

  // Handle mouse movement for interactive hero
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setMousePosition({
          x: e.clientX / window.innerWidth * 100,
          y: e.clientY / window.innerHeight * 100
        });
      }
    };
    const handleScroll = () => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setScrollY(window.scrollY);
      }
      setNavScrolled(window.scrollY > 80);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('Element entered viewport:', entry.target.id);
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
      footerRef.current
    ].filter(Boolean);

    console.log('Observing elements:', elements.map(el => el?.id));

    elements.forEach((element) => {
      if (element) {
        observer.observe(element);
        console.log('Started observing:', element.id);
      }
    });

    return () => {
      elements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  // Debug visible elements
  useEffect(() => {
    console.log('Visible elements updated:', Array.from(visibleElements));
  }, [visibleElements]);



    // Scrolls to Join Us Section From Any Page
  const location2 = useLocation();

  useEffect(() => {
    if (location.hash === "#join-us") {
      // Delay until after DOM render so positions are correct
      setTimeout(() => {
      smoothScrollTo("join-us");
      }, 50);
    }
  }, [location]);


  // Intersection Observer for animations
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    const elements = document.querySelectorAll('.fade-in-trigger');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
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

  // Counter animation logic
  useEffect(() => {
    if (countersVisible) {
      const targetValues = {
        aum: 5, // $2.3M
        students: 5,
        donations: 45000 // $45K
      };

      const duration = 1200; // 1.2 seconds
      const steps = 60; // 60 FPS
      const increment = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        setCounterValues({
          aum: Math.floor(targetValues.aum * easeProgress),
          students: Math.floor(targetValues.students * easeProgress),
          donations: Math.floor(targetValues.donations * easeProgress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCounterValues(targetValues); // Ensure exact final values
        }
      }, increment);

      return () => clearInterval(timer);
    }
  }, [countersVisible]);

  // Intersection Observer for counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setCountersVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    const counterSection = document.getElementById('counters');
    if (counterSection) {
      observer.observe(counterSection);
    }

    return () => observer.disconnect();
  }, []);

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const impactMetrics = [{
    value: '$N/A',
    label: 'Portfolio Value',
    icon: DollarSign
  }, {
    value: 'N/A',
    label: 'Active Investments',
    icon: PieChart
  }, {
    value: 'N/A',
    label: 'Annual Returns',
    icon: TrendingUp
  }, {
    value: '12',
    label: 'Student Members',
    icon: Users
  }];
  const teamMembers = [{
    name: 'Zahin Mulji',
    role: 'Chief Investment Officer',
    description: 'Finance focused student with expertise in equity analysis and portfolio optimization.',
    year: 'Senior'
  }, {
    name: 'Harrison Cornwell',
    role: 'Chief Financial Officer',
    description: 'Business focused student with prior experience in public relations.',
    year: 'Senior'
  }, {
    name: 'Aadi Anantuni',
    role: 'Chief Operations Officer',
    description: 'Finance focused student interested in equity research and financial modeling.',
    year: 'Senior'
  }, {
    name: 'Shreyas Raju',
    role: 'Chief Technology Officer',
    description: 'Finance and technology focused student with experience in software and web development.',
    year: 'Senior'
  }, {
    name: 'Priyansh Patel',
    role: 'Chief Marketing Officer',
    description: 'Background in fundamental analysis wit skills in portfolio strategy, marketing, and digital creation.',
    year: 'Senior'
  } , {
    name: 'Abhi Medi',
    role: 'Head of Macro',
    description: 'Finance focused student with macroeconomics interest.',
    year: 'Junior'
  } , {
    name: 'Position Available',
    role: 'Head of Equity',
    description: 'Apply Now!',
    year: 'TBD+'
  } , {
    name: 'Macro Analayst Team',
    role: 'Macro Analyst',
    description: 'Apply Now!',
    year: 'Mixed'
  } , {
    name: 'Equity Analayst Team',
    role: 'Equity Analyst',
    description: 'Apply Now!',
    year: 'Mixed'
  }
];
const advisoryBoard = [{
  name: 'Nicholas Allgyer',
  role: 'Economics Teacher @ CB West',
} , {
  name: 'Brian Pultro',
  role: 'Pultro Financial Management',
} , {
  name: 'Imaan Mulji',
  role: 'Custodian @ Bucks Capital',
} , {
  name: 'Martin Meo',
  role: 'Business Teacher @ CB West',
} , {
  name: 'Dan Pfieffer',
  role: 'Financial Services Representative/Advisor ',
} , {
  name: 'Frank Pustay',
  role: 'House Principal @ CB West',
} , {
  name: 'Trevor Fennimore',
  role: 'Custodian @ Bucks Capital',
} , {
  name: 'Chris Meister',
  role: 'Senior VP @ Univest',
} , 
];
  const portfolioCompanies = [{
    name: 'TBD',
    sector: 'Technology',
    value: '$TBD',
    return: '+0.0%'
  }, {
    name: 'TBD',
    sector: 'Renewable Energy',
    value: '$TBD',
    return: '+0.0%'
  }, {
    name: 'TBD',
    sector: 'Healthcare',
    value: 'TBD',
    return: '+0.0%'
  }, {
    name: 'TBD',
    sector: 'Education',
    value: 'TBD',
    return: '+0.0%'
  }, {
    name: 'TBD',
    sector: 'Fintech',
    value: '$TBD',
    return: '+0.0%'
  }, {
    name: 'TBD',
    sector: 'E-commerce',
    value: '$TBD',
    return: '+0.0%'
  }];

  

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-20 w-full transition-all duration-500 ${
        navScrolled 
          ? 'bg-white/95 shadow-lg border-b border-gray-200' 
          : 'bg-white/90 backdrop-blur-lg border-b border-gray-100'
      }`}
      style={{
        backdropFilter: navScrolled ? 'none' : 'blur(20px)',
      }}>
        <div className="h-full px-8 flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Left: Logo */}
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-4 text-foreground hover:text-primary transition-colors duration-300"
          >
            <img src="/crest.png" alt="Crest Icon" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-foreground">Bucks Capital</span>
          </button>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
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
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 py-4 space-y-1">
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
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
      </nav>
   
      {/* Hero Section */}
      <section ref={heroRef} className="h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative overflow-hidden" style={{
      backgroundImage: "url('/mountain_hero.jpg')", 
      transform: !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? `translateY(${scrollY * 0.2}px)` : undefined
    }}>
        {/* Professional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/50"></div>
        
          <div className="relative z-20 text-center px-6 max-w-6xl mx-auto pt-20 md:pt-0">
            <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <img src="/buckscapitalhorizontalnobgwhite.png" alt="Bucks Capital" className="w-80 sm:w-96 md:w-full h-auto object-contain mx-auto mb-4 md:mb-8 drop-shadow-2xl"/>
            </div>
            
            <div className="max-w-4xl mx-auto mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h1 className="text-xl md:text-2xl font-bold text-white -mb-8 leading-tight">
                Real Capital. Real Analysis. Real Impact.
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Button 
                onClick={() => navigate('/about')} 
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:shadow-xl text-lg"
              >
                About Us
              </Button>
              <Button 
                onClick={() => navigate('/donation')} 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-800 font-semibold px-10 py-4 rounded-full transition-all duration-300 text-lg bg-white/10 backdrop-blur-sm"
              >
                Donate
              </Button>
            </div>
          </div>

        {/* Professional scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-20 bg-gradient-to-b from-white/80 to-transparent"></div>
        </div>
      </section>

      {/* Transition Section */}
      <div className="bg-white h-48 relative z-20"></div>

      {/*
      // Animated Counters Section 
      <section id="counters" className="h-screen bg-white flex items-center justify-center relative">
        // Transparent Gold Band 
        <div 
          className="absolute inset-x-0 bg-gold/20 backdrop-blur-sm"
          style={{
            height: '40vh',
            top: '30vh'
          }}
        >
          <div className="container mx-auto px-6 h-full flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center w-full max-w-6xl">
              
              // AUM Counter 
              <div className="flex flex-col items-center">
                <div className="text-6xl md:text-7xl font-black text-black mb-4" style={{ fontSize: '4rem' }}>
                  TBD // USE THIS WHEN CURRENCY IS AVALIABLE: {formatCurrency(counterValues.aum)}  
                </div>
                <div className="text-xl font-semibold text-primary uppercase tracking-wide">
                  Assets Under Management
                </div>
              </div>

              // Students Counter 
              <div className="flex flex-col items-center">
                <div className="text-6xl md:text-7xl font-black text-black mb-4" style={{ fontSize: '4rem' }}>
                   TBD  // USE FOR LATER:   {counterValues.students.toLocaleString()}+  
                </div>
                <div className="text-xl font-semibold text-primary uppercase tracking-wide">
                  Students Trained
                </div>
              </div>

              // Donations Counter 
              <div className="flex flex-col items-center">
                <div className="text-6xl md:text-7xl font-black text-black mb-4" style={{ fontSize: '4rem' }}>
                  TBD {/* USE FOR LATER:    {formatCurrency(counterValues.donations)} 
                </div>
                <div className="text-xl font-semibold text-primary uppercase tracking-wide">
                  Community Donations
                </div>
              </div>
              
            </div>
          </div>
        </div>
        
        // Bottom curve transition 
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-16 md:h-20 lg:h-24"
          >
            <path 
              d="M0,0 C150,60 350,0 600,40 C850,80 1050,20 1200,60 L1200,120 L0,120 Z" 
              fill="white"
            />
          </svg>
        </div>
      </section> */}

      {/* 
      // Portfolio Section 
      <section id="portfolio" className="py-24 bg-black text-white relative">
        // Top curve from about section 
        <div className="absolute top-0 left-0 right-0 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-16 md:h-20 lg:h-24"
            style={{ transform: 'rotate(180deg)' }}
          >
            <path 
              d="M0,60 C150,0 350,80 600,40 C850,0 1050,60 1200,20 L1200,120 L0,120 Z" 
              fill="#000000"
            />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-16">
          <div className="fade-in-trigger text-center mb-16">
            <h2 className="text-display text-4xl md:text-6xl font-black text-white mb-8">
              Our Portfolio
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              We maintain a diversified portfolio across multiple sectors, focusing on growth companies 
              with strong fundamentals and innovative business models.
            </p>
          </div>

          <div className="fade-in-trigger grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {portfolioCompanies.map((company, index) => <Card key={index} className="p-6 bg-white/5 border-white/10 shadow-bold hover:shadow-large hover:bg-white/10 transition-all duration-300 backdrop-blur-sm rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{company.name}</h3>
                    <p className="text-sm text-white/60">{company.sector}</p>
                  </div>
                  <div className={`text-sm font-semibold px-2 py-1 rounded-full ${company.return.startsWith('+') ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                    {company.return}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{company.value}</div>
              </Card>)}
          </div>

          <div className="fade-in-trigger text-center">
            <h3 className="text-2xl font-bold text-white mb-8">Investment Focus Areas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Technology', 'Healthcare', 'Renewable Energy', 'Fintech', 'E-commerce', 'Education', 'Biotechnology', 'Clean Tech'].map((sector, index) => <div key={index} className="p-4 bg-white/5 border border-white/20 rounded-2xl text-center hover:border-primary hover:bg-white/10 transition-all duration-300">
                  <span className="font-semibold text-white">{sector}</span>
                </div>)}
            </div>
          </div>
        </div>

        //Bottom curve transition to performance 
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-16 md:h-20 lg:h-24"
          >
            <path 
              d="M0,40 C150,80 350,20 600,60 C850,100 1050,40 1200,80 L1200,120 L0,120 Z" 
              fill="white"
            />
          </svg>
        </div>
      </section>
      */}

      {/* 
      //Performance Metrics 
      <section id="performance" className="py-24 bg-white text-primary relative overflow-hidden">
        // Top curve from portfolio section 
        <div className="absolute top-0 left-0 right-0 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-16 md:h-20 lg:h-24"
            style={{ transform: 'rotate(180deg)' }}
          >
            <path 
              d="M0,40 C150,80 350,20 600,60 C850,100 1050,40 1200,80 L1200,120 L0,120 Z" 
              fill="white"
            />
          </svg>
        </div>

        {!window.matchMedia('(prefers-reduced-motion: reduce)').matches && <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 border border-accent rounded-full animate-float"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 border border-accent rounded-lg animate-float" style={{
          animationDelay: '2s'
        }}></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-accent/20 rounded-full animate-float" style={{
          animationDelay: '4s'
        }}></div>
          </div>}
        
        <div className="container mx-auto px-6 relative z-10 pt-16">
          <div className="fade-in-trigger text-center mb-16">
            <h2 className="text-display text-4xl md:text-6xl font-black mb-8">
              Performance & Impact
            </h2>
            <p className="text-xl text-primary/80 max-w-4xl mx-auto leading-relaxed">
              Our track record demonstrates the power of combining student enthusiasm with professional 
              investment principles and experienced mentorship.
            </p>
          </div>

          <div className="fade-in-trigger grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactMetrics.map((metric, index) => <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-2xl mb-6">
                    <metric.icon className="h-10 w-10 text-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-primary mb-3">
                  {metric.value}
                </div>
                <div className="text-primary/90 font-semibold text-lg">
                  {metric.label}
                </div>
              </div>)}
          </div>
        </div>
      </section>
        */}
      


      {/* Market Performance Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8">
                Market Performance
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
              <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed max-w-4xl mx-auto font-medium px-4">
                Track real-time market performance and understand the financial landscape 
                that shapes our investment decisions.
              </p>
            </div>
            
            <div className="animate-fade-in-up">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="w-full h-96">
                  <iframe
                    src="https://www.tradingview.com/embed-widget/hotlists/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22dateRange%22%3A%2212M%22%2C%22exchange%22%3A%22US%22%2C%22showChart%22%3Atrue%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22400%22%2C%22isTransparent%22%3Afalse%2C%22showSymbolLogo%22%3Afalse%2C%22showFloatingTooltip%22%3Afalse%2C%22plotLineColorGrowing%22%3A%22rgba(26%2C%2077%2C%2046%2C%201)%22%2C%22plotLineColorFalling%22%3A%22rgba(26%2C%2077%2C%2046%2C%201)%22%2C%22gridLineColor%22%3A%22rgba(240%2C%20243%2C%20250%2C%200)%22%2C%22scaleFontColor%22%3A%22%230F0F0F%22%2C%22belowLineFillColorGrowing%22%3A%22rgba(26%2C%2077%2C%2046%2C%200.12)%22%2C%22belowLineFillColorFalling%22%3A%22rgba(26%2C%2077%2C%2046%2C%200.12)%22%2C%22belowLineFillColorGrowingBottom%22%3A%22rgba(41%2C%2098%2C%20255%2C%200)%22%2C%22belowLineFillColorFallingBottom%22%3A%22rgba(41%2C%2098%2C%20255%2C%200)%22%2C%22symbolActiveColor%22%3A%22rgba(26%2C%2077%2C%2046%2C%200.12)%22%7D"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    title="TradingView Market Data"
                  />
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  <a href="https://www.tradingview.com/markets/stocks-usa/" rel="noopener nofollow" target="_blank" className="text-primary hover:text-primary-dark">
                    Stocks today
                  </a>
                  <span> by TradingView</span>
                </div>
              </div>
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
              
              <div className={`transition-all duration-1000 ${visibleElements.has('footer') ? 'animate-stagger-fade-in' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">Contact</h3>
                <div className="space-y-4">
                  <p className="text-gray-600 font-medium">
                    Central Bucks High School West<br />
                    Doylestown, PA 18901
                  </p>
                  <p className="text-gray-600 font-medium">
                    bucks.capital1@gmail.com
                  </p>
                </div>
              </div>
              
              <div className={`transition-all duration-1000 ${visibleElements.has('footer') ? 'animate-stagger-fade-in' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '0.4s' }}>
                <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">Mission</h3>
                <p className="text-gray-600 font-medium">
                  Bridging the gap between classroom theory and real-world financial responsibility.
                </p>
              </div>
            </div>
            
            <div className={`pt-8 border-t border-gray-200 transition-all duration-1000 ${visibleElements.has('footer') ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '0.6s' }}>
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
export default CBWestWebsite;
