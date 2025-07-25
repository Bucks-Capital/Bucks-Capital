import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingUp, Users, Target, Award, GraduationCap, BookOpen, DollarSign, PieChart, BarChart3, LineChart, Briefcase, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
const CBWestWebsite: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const [scrollY, setScrollY] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [countersVisible, setCountersVisible] = useState(false);
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
    value: '$TBD',
    label: 'Portfolio Value',
    icon: DollarSign
  }, {
    value: 'TBD',
    label: 'Active Investments',
    icon: PieChart
  }, {
    value: 'TBD',
    label: 'Annual Returns',
    icon: TrendingUp
  }, {
    value: 'TBD',
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
    name: 'Abhi Medi',
    role: 'Head of Macro',
    description: 'Finance focused student with macroeconomics interest.',
    year: 'Junior'
  } , {
    name: 'Position Available',
    role: 'Head of Equity',
    description: 'Apply Now!',
    year: 'TBD+'
  }
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
              onClick={() => smoothScrollTo('about')}
              className="text-white hover:text-white/70 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
            >
              Who We Are
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

      
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-hero" style={{
      transform: !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? `translateY(${scrollY * 0.2}px)` : undefined
    }}>
        {/* Interactive geometric elements */}
        {!window.matchMedia('(prefers-reduced-motion: reduce)').matches && <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-24 h-24 border-2 border-accent/30 rounded-lg animate-float opacity-60" style={{
          top: '15%',
          left: '10%',
          animationDelay: '0s',
          transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px)`
        }} />
            <div className="absolute w-20 h-20 border-2 border-gold/40 rounded-full animate-float opacity-40" style={{
          top: '70%',
          right: '15%',
          animationDelay: '2s',
          transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * 0.04}px)`
        }} />
            <div className="absolute w-16 h-16 bg-accent/10 rounded-lg animate-float" style={{
          bottom: '25%',
          left: '20%',
          animationDelay: '4s',
          transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * -0.03}px)`
        }} />
            <div className="absolute w-12 h-12 border border-gold/30 rounded-full animate-float" style={{
          top: '40%',
          right: '25.7%',
          animationDelay: '6s',
          transform: `translate(${mousePosition.x * -0.04}px, ${mousePosition.y * 0.02}px)`
        }} />
          </div>}
        
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto text-white">
          <img src="/buckscapitalhorizontalnobgwhite.png" alt="Bucks Capital Banner" className="w-full h-auto object-contain mb-2"/>
          {/*<h1 className="text-display text-5xl md:text-8xl font-black mb-8 leading-tight">
            Bucks
            <span className="block text-primary">Capital</span>
          </h1> */}
          <p className="text-xl md:text-2xl text-white/90 mb-14 leading-relaxed max-w-4xl mx-auto font-medium">
            Real Capital. Real Analysis. Real Impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button onClick={() => smoothScrollTo('portfolio')} size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold text-lg px-10 py-5 shadow-bold transition-all duration-300 rounded-full">
              View Our Portfolio <BarChart3 className="ml-2 h-5 w-5" />
            </Button>
            <Button onClick={() => smoothScrollTo('join-us')} size="lg" className="bg-black/20 border-2 border-white text-white hover:bg-white hover:text-black text-lg px-10 py-5 transition-all duration-300 rounded-full font-semibold backdrop-blur-sm">
              Join Our Team <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        {!window.matchMedia('(prefers-reduced-motion: reduce)').matches && <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>}

        {/* Rolling Hills SVG Transition */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
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
      </section>

      {/* About Section */}
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

      {/* Animated Counters Section */}
      <section id="counters" className="h-screen bg-white flex items-center justify-center relative">
        {/* Transparent Gold Band */}
        <div 
          className="absolute inset-x-0 bg-gold/20 backdrop-blur-sm"
          style={{
            height: '40vh',
            top: '30vh'
          }}
        >
          <div className="container mx-auto px-6 h-full flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center w-full max-w-6xl">
              
              {/* AUM Counter */}
              <div className="flex flex-col items-center">
                <div className="text-6xl md:text-7xl font-black text-black mb-4" style={{ fontSize: '4rem' }}>
                  TBD {/* USE THIS WHEN CURRENCY IS AVALIABLE: {formatCurrency(counterValues.aum)}  */}
                </div>
                <div className="text-xl font-semibold text-primary uppercase tracking-wide">
                  Assets Under Management
                </div>
              </div>

              {/* Students Counter */}
              <div className="flex flex-col items-center">
                <div className="text-6xl md:text-7xl font-black text-black mb-4" style={{ fontSize: '4rem' }}>
                   TBD  {/* USE FOR LATER:   {counterValues.students.toLocaleString()}+ */} 
                </div>
                <div className="text-xl font-semibold text-primary uppercase tracking-wide">
                  Students Trained
                </div>
              </div>

              {/* Donations Counter */}
              <div className="flex flex-col items-center">
                <div className="text-6xl md:text-7xl font-black text-black mb-4" style={{ fontSize: '4rem' }}>
                  TBD {/* USE FOR LATER:    {formatCurrency(counterValues.donations)} */ }
                </div>
                <div className="text-xl font-semibold text-primary uppercase tracking-wide">
                  Community Donations
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Bottom curve transition */}
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
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-black text-white relative">
        {/* Top curve from about section */}
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

        {/* Bottom curve transition to performance */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-16 md:h-20 lg:h-24"
          >
            <path 
              d="M0,40 C150,80 350,20 600,60 C850,100 1050,40 1200,80 L1200,120 L0,120 Z" 
              fill="#164F2C"
            />
          </svg>
        </div>
      </section>

      {/* Performance Metrics */}
      <section id="performance" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Top curve from portfolio section */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-16 md:h-20 lg:h-24"
            style={{ transform: 'rotate(180deg)' }}
          >
            <path 
              d="M0,40 C150,80 350,20 600,60 C850,100 1050,40 1200,80 L1200,120 L0,120 Z" 
              fill="#164F2C"
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
            <p className="text-xl text-primary-foreground/80 max-w-4xl mx-auto leading-relaxed">
              Our track record demonstrates the power of combining student enthusiasm with professional 
              investment principles and experienced mentorship.
            </p>
          </div>

          <div className="fade-in-trigger grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactMetrics.map((metric, index) => <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-2xl mb-6">
                    <metric.icon className="h-10 w-10 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-3">
                  {metric.value}
                </div>
                <div className="text-primary-foreground/90 font-semibold text-lg">
                  {metric.label}
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-background relative">
        {/* Top curve from performance section */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-16 md:h-20 lg:h-24"
            style={{ transform: 'rotate(180deg)' }}
          >
            <path 
              d="M0,80 C150,20 350,100 600,60 C850,20 1050,80 1200,40 L1200,120 L0,120 Z" 
              fill="white"
            />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-16">
          <div className="fade-in-trigger text-center mb-16">
            <h2 className="text-display text-4xl md:text-6xl font-black text-primary mb-8">
              Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Led by passionate students with diverse academic backgrounds and guided by experienced 
              faculty advisors and industry professionals.
            </p>
          </div>

          <div className="fade-in-trigger grid md:grid-cols-3 gap-8 mb-16">
            {teamMembers.map((member, index) => <Card key={index} className="p-8 bg-black border-primary/20 shadow-bold hover:shadow-large transition-all duration-300 text-center rounded-2xl">
                <div className="w-24 h-24 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-black text-primary-foreground">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <div className="text-primary font-bold mb-1">{member.role}</div>
                <div className="text-sm text-white/60 font-medium mb-4">{member.year}</div>
                <p className="text-white/80">{member.description}</p>
              </Card>)}
          </div>

          <div className="fade-in-trigger text-center">
            <div className="bg-black/5 border border-black/10 rounded-3xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-black mb-4">Faculty Advisor</h3>
              <div className="text-lg font-semibold text-primary mb-2"> Martin Meo</div>
              <p className="text-foreground/80">
                Accounting Teacher at CB West. Oversees all operations and ensures that SMIF maintains its standard of quality investments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section id="join-us" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="fade-in-trigger max-w-5xl mx-auto text-center">
            <h2 className="text-display text-4xl md:text-6xl font-black text-primary mb-8">
              Ready to Start Your Finance Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join CB West SMIF and gain hands-on experience managing real investments while building 
              the skills and network that will launch your career in finance.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 bg-card border-border shadow-soft">
                <BookOpen className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-bold text-white mb-4">What You'll Learn</h3>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Financial modeling & valuation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Portfolio management strategies
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Market research & analysis
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Risk assessment techniques
                  </li>
                </ul>
              </Card>
              
              <Card className="p-8 bg-card border-border shadow-soft">
                <Briefcase className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Current CB West student
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    3.0+ GPA requirement
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Interest in finance/business
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Commitment to weekly meetings
                  </li>
                </ul>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="https://forms.gle/WLXY5CheUyqNJLYL9" target="_blank" rel="noopener noreferrer">
              <Button size="lg"  className="bg-gradient-primary text-primary-foreground font-bold text-lg px-10 py-5 shadow-primary hover:shadow-primary/70 transition-all duration-300 rounded-full border-2 border-grey-500 hover:border-primary">
                Apply Now
              </Button>
              </a>
              <a href="mailto:bucks.capital1@gmail.com">
              <Button size="lg" variant="outline" className="border-2 border-primary hover:border-gray text-primary hover:bg-gray hover:text-primary-foreground text-lg px-10 py-5 transition-all duration-300 rounded-full font-semibold">
                Contact Us
              </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <section id="donate" className="py-24 bg-black text-white">
        <div className="container mx-auto px-6">
          <div className="fade-in-trigger text-center">
            <h2 className="text-display text-4xl md:text-6xl font-black text-white mb-8">
              Support Our Mission
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-10">
              Help us provide more students with real-world investment experience and financial education.
            </p>
            <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold text-lg px-10 py-5">
              Make a Donation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="text-center">
            {/* <div className="text-3xl font-display font-black mb-4">
              CB West <span className="text-primary">SMIF</span>
            </div> */}
            <img src="/deernobg.png" alt="Crest Icon" className="h-40 w-40 content-center block mx-auto mb-10 object-contain" />
            <p className="text-primary-foreground/80 mb-6">
              Empowering the next generation of financial leaders.
            </p>
            <div className="text-sm text-primary-foreground/60">
              © 2025 CB West Student Managed Investment Fund. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default CBWestWebsite;