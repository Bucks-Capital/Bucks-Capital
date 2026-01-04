import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingUp, Users, Target, Award, GraduationCap, BookOpen, DollarSign, PieChart, BarChart3, LineChart, Briefcase, Crown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import ApplicationModal from './ApplicationModal';

const About: React.FC = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [horizontalScroll, setHorizontalScroll] = useState(0);
  const [isCarouselActive, setIsCarouselActive] = useState(false);
  const [lockedScrollPosition, setLockedScrollPosition] = useState<number | null>(null);
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isCarouselActiveRef = useRef(false);
  const lockedScrollPositionRef = useRef<number | null>(null);
  const carouselCompletedRef = useRef(false);
  const lastReleaseTimeRef = useRef<number>(0);
  const lastReleaseDirectionRef = useRef<'up' | 'down' | null>(null);
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
    name: 'Jackson Hornick',
    role: 'Head of Equity',
    description: 'Student with equity analysis and portfolio management experience.',
    year: 'Junior'
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
  name: 'Imaan Mulji',
  role: 'Custodian @ Bucks Capital',
} , {
  name: 'Martin Meo',
  role: 'Business Teacher @ CB West',
} , {
  name: 'Dan Pfieffer',
  role: 'Financial Services Representative/Advisor ',
} , {
  name: 'Trevor Fennimore',
  role: 'Custodian @ Bucks Capital',
} , {
  name: 'Chris Meister',
  role: 'Senior VP @ WSFS',
} , 
];

const macroAnalysts = [
  {
    name: 'Noah Gerstein',
    role: 'Macro Analyst',
    year: 'Senior'
  },
  {
    name: 'Michael Reshetnyak',
    role: 'Macro Analyst',
    year: 'Senior'
  },
  {
    name: 'Conor Kelly',
    role: 'Macro Analyst',
    year: 'Junior'
  },
  {
    name: 'Dan Richmond',
    role: 'Macro Analyst',
    year: 'Junior'
  },
  {
    name: 'John Lopit',
    role: 'Macro Analyst',
    year: 'Junior'
  }


];

const equityAnalysts = [
  {
    name: 'Yash Rajpathak',
    role: 'Equity Analyst',
    year: 'Senior'
  },
  {
    name: 'Atharva Bhargude',
    role: 'Equity Analyst',
    year: 'Junior'
  },{
    name: 'Michael Reshetnyak',
    role: 'Equity Analyst',
    year: 'Senior'
  },
  {
    name: 'Emad Bokhari',
    role: 'Equity Analyst',
    year: 'Junior'
  },
  {
    name: 'Evan Patras',
    role: 'Equity Analyst',
    year: 'Equity Analyst'
  }
  
  ];

  // Helper function to map team member names to profile images
  const getProfileImage = (name: string): string => {
    const nameMap: { [key: string]: string } = {
      'Zahin Mulji': 'zahin.jpg',
      'Harrison Cornwell': 'harrison.jpg',
      'Aadi Anantuni': 'aadi.jpg',
      'Shreyas Raju': 'shreyas.jpg',
      'Priyansh Patel': 'priyansh.jpg',
      'Abhi Medi': 'abhi.jpg'
    };
    return nameMap[name] || '';
  };

  // Filter team members to only include those with profile photos
  const teamMembersWithPhotos = teamMembers.filter(member => {
    return getProfileImage(member.name) !== '' && 
           member.name !== 'Macro Analayst Team' && 
           member.name !== 'Equity Analayst Team';
  });

  // Scroll hijacking for carousel - freeze page scroll and convert to horizontal movement
  const accumulatedScrollRef = useRef(0);
  
  useEffect(() => {
    if (!teamSectionRef.current || !scrollContainerRef.current) return;

    const horizontalScrollRef = { current: 0 };

    const calculateMaxHorizontalScroll = () => {
      if (!scrollContainerRef.current) return 0;
      const container = scrollContainerRef.current;
      
      // Force layout recalculation to ensure all cards are measured
      void container.offsetHeight;
      
      // Get all child cards
      const children = Array.from(container.children) as HTMLElement[];
      const numCards = children.length;
      
      if (numCards === 0) return 0;
      
      // Calculate total width by summing actual card widths
      let totalWidth = 0;
      const cardWidths: number[] = [];
      children.forEach((child, index) => {
        // Get the actual rendered width of each card
        const rect = child.getBoundingClientRect();
        const cardWidth = rect.width;
        cardWidths.push(cardWidth);
        totalWidth += cardWidth;
        
        // Add gap after each card except the last
        if (index < numCards - 1) {
          const gap = window.innerWidth >= 768 ? 32 : 24; // gap-8 = 32px, gap-6 = 24px
          totalWidth += gap;
        }
      });
      
      // Add container padding (px-4 = 16px on each side = 32px total)
      totalWidth += 32;
      
      const viewportWidth = window.innerWidth;
      
      // Calculate expected width based on card count and sizes
      // This is more reliable than getBoundingClientRect() which can be constrained
      const cardWidth = window.innerWidth >= 768 ? 288 : 256;
      const gap = window.innerWidth >= 768 ? 32 : 24;
      const expectedTotal = (numCards * cardWidth) + ((numCards - 1) * gap) + 32; // +32 for padding
      
      // Use the maximum of: calculated total, measured total, or scrollWidth
      // This ensures we account for all cards even if measurements are constrained
      const contentWidth = Math.max(expectedTotal, totalWidth, container.scrollWidth);
      let maxScroll = Math.max(0, contentWidth - viewportWidth);
      
      // Add buffer to ensure we can scroll past the last card to see it fully
      // We need enough buffer to scroll past the last card completely
      // For 6 cards, we need to scroll at least 2 full card widths to see the last card
      const buffer = (cardWidth * 2) + 200; // 2 full card widths + extra padding for safety
      const finalMaxScroll = maxScroll + buffer;
      
      return finalMaxScroll;
    };

    const checkCarouselActivation = (scrollDelta?: number) => {
      if (!teamSectionRef.current) return false;

      const section = teamSectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowCenter = windowHeight / 2;
      
      // Calculate the center point of the carousel section
      const sectionCenter = rect.top + (rect.height / 2);
      
      // Activate when carousel section center is at the viewport center
      // When scrolling down: activate when section center reaches or passes viewport center (so cards are visible)
      // When scrolling up: activate when section center reaches or passes viewport center (so cards are visible)
      let shouldActivate = false;
      
      if (scrollDelta !== undefined) {
        if (scrollDelta > 0) {
          // Scrolling down - activate when section center is slightly below viewport center
          // Allow up to 80% below center to ensure cards are well visible
          const distanceBelow = sectionCenter - windowCenter; // Positive when section is below center
          shouldActivate = distanceBelow >= -180 && distanceBelow <= windowHeight * 0.8 && 
                          rect.top < windowHeight * 0.9 && 
                          rect.bottom > windowHeight * 0.1;
        } else if (scrollDelta < 0) {
          // Scrolling up - activate when section center is at or below viewport center
          // Allow up to 80% below center to ensure cards are well visible (same as scrolling down)
          const distanceBelow = sectionCenter - windowCenter; // Positive when section is below center
          shouldActivate = distanceBelow >= -180 && distanceBelow <= windowHeight * 0.8 && 
                          rect.top < windowHeight * 0.9 && 
                          rect.bottom > windowHeight * 0.1;
        } else {
          // No scroll direction - use symmetric activation at center
          const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
          shouldActivate = distanceFromCenter < windowHeight * 0.05 && 
                          rect.top < windowHeight * 0.9 && 
                          rect.bottom > windowHeight * 0.1;
        }
      } else {
        // No scroll delta - use symmetric activation at center
        const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
        shouldActivate = distanceFromCenter < windowHeight * 0.05 && 
                        rect.top < windowHeight * 0.9 && 
                        rect.bottom > windowHeight * 0.1;
      }
      
      return shouldActivate;
    };

    const handleWheel = (e: WheelEvent) => {
      // Only process if we're near the carousel section
      const scrollDelta = e.deltaY;
      const maxScroll = calculateMaxHorizontalScroll();
      
      // If we just released at the end and user is trying to scroll past, don't re-engage
      if (lastReleaseDirectionRef.current === 'down' && scrollDelta > 0 && !isCarouselActiveRef.current) {
        // User is scrolling down after releasing at end - allow normal scroll
        return;
      }
      if (lastReleaseDirectionRef.current === 'up' && scrollDelta < 0 && !isCarouselActiveRef.current) {
        // User is scrolling up after releasing at start - allow normal scroll
        return;
      }
      
      const shouldBeActive = checkCarouselActivation(scrollDelta);

      // Only hijack if we're in the carousel area AND have cards to scroll
      if (!shouldBeActive || maxScroll <= 10) {
        // Not in carousel area or no scroll needed - allow normal scrolling
        if (isCarouselActiveRef.current) {
          // Exit carousel mode
          setIsCarouselActive(false);
          isCarouselActiveRef.current = false;
          setLockedScrollPosition(null);
          lockedScrollPositionRef.current = null;
        }
        return; // Allow normal scroll
      }

      // Enter carousel mode
      if (!isCarouselActiveRef.current) {
        setIsCarouselActive(true);
        isCarouselActiveRef.current = true;
        const currentScroll = window.scrollY;
        setLockedScrollPosition(currentScroll);
        lockedScrollPositionRef.current = currentScroll;
        lastReleaseDirectionRef.current = null; // Clear release direction when entering carousel
        // Preserve current horizontal position
        const currentPos = horizontalScrollRef.current;
        const scrollNeeded = maxScroll * 3.5; // Match the multiplier used in scroll handling
        accumulatedScrollRef.current = maxScroll > 0 ? (currentPos / maxScroll) * scrollNeeded : 0;
      }

      // Handle scroll hijacking when carousel is active
      if (isCarouselActiveRef.current && lockedScrollPositionRef.current !== null && maxScroll > 0) {
        // Prevent default scroll behavior ONLY in carousel area
        e.preventDefault();
        e.stopPropagation();

        const scrollSpeed = 2;
        
        // Update accumulated scroll based on direction - use ref to persist across renders
        accumulatedScrollRef.current += scrollDelta * scrollSpeed;

        // Calculate how much scroll is needed - ensure enough scroll distance for all cards
        // Use a larger multiplier to ensure we can scroll through all 6 cards
        const scrollNeeded = maxScroll * 3.5; // Increased multiplier even more to ensure full range

        // Update horizontal scroll position
        // Allow going slightly beyond maxScroll to ensure we can see the last card
        const scrollRatio = Math.max(0, Math.min(1, accumulatedScrollRef.current / scrollNeeded));
        let newHorizontalScroll = scrollRatio * maxScroll;
        // Allow going up to 110% of maxScroll to ensure we can see the last card fully
        const maxAllowedScroll = maxScroll * 1.1;
        newHorizontalScroll = Math.max(0, Math.min(maxAllowedScroll, newHorizontalScroll));
        
        // Update immediately - ensure state updates
        horizontalScrollRef.current = newHorizontalScroll;
        setHorizontalScroll(prev => {
          // Force update if value changed significantly
          if (Math.abs(prev - newHorizontalScroll) > 0.1) {
            return newHorizontalScroll;
          }
          return prev;
        });
        
        // Force a re-render by updating the transform directly on the DOM element
        if (scrollContainerRef.current) {
          scrollContainerRef.current.style.transform = `translateX(-${newHorizontalScroll}px)`;
        }

        // Lock the page scroll position
        window.scrollTo({
          top: lockedScrollPositionRef.current,
          behavior: 'auto'
        });

        // Check boundaries - release when at end/start and trying to scroll further
        const isAtEnd = newHorizontalScroll >= maxScroll - 2; // Allow small tolerance for floating point
        const isAtStart = newHorizontalScroll <= 2;
        
        // Release immediately when at boundary and trying to scroll further in that direction
        if (isAtEnd && scrollDelta > 0) {
          // Reached end scrolling down - release immediately to allow scrolling past
          setIsCarouselActive(false);
          isCarouselActiveRef.current = false;
          setLockedScrollPosition(null);
          lockedScrollPositionRef.current = null;
          accumulatedScrollRef.current = scrollNeeded; // Lock to max
          lastReleaseTimeRef.current = Date.now(); // Record release time for cooldown
          lastReleaseDirectionRef.current = 'down'; // Record direction
          return; // Allow scroll to continue down
        } else if (isAtStart && scrollDelta < 0) {
          // Reached start scrolling up - release immediately to allow scrolling past
          setIsCarouselActive(false);
          isCarouselActiveRef.current = false;
          setLockedScrollPosition(null);
          lockedScrollPositionRef.current = null;
          accumulatedScrollRef.current = 0; // Lock to start
          lastReleaseTimeRef.current = Date.now(); // Record release time for cooldown
          lastReleaseDirectionRef.current = 'up'; // Record direction
          return; // Allow scroll to continue up
        }
      }
    };

    const handleScroll = () => {
      // If carousel is active, maintain locked position
      if (isCarouselActiveRef.current && lockedScrollPositionRef.current !== null) {
        // For scroll events, we don't have scrollDelta, so use undefined (symmetric activation)
        const shouldBeActive = checkCarouselActivation(undefined);
        if (shouldBeActive) {
          window.scrollTo({
            top: lockedScrollPositionRef.current,
            behavior: 'auto'
          });
        } else {
          // Exited carousel area - release lock
          setIsCarouselActive(false);
          isCarouselActiveRef.current = false;
          setLockedScrollPosition(null);
          lockedScrollPositionRef.current = null;
        }
      }
    };

    // Sync horizontalScrollRef with state
    horizontalScrollRef.current = horizontalScroll;

    // Use wheel event for scroll hijacking - only on carousel section
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Recalculate on resize
    const handleResize = () => {
      if (isCarouselActiveRef.current && lockedScrollPositionRef.current !== null) {
        window.scrollTo({
          top: lockedScrollPositionRef.current,
          behavior: 'auto'
        });
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [horizontalScroll]);

  // Track nav scroll state
  useEffect(() => {
    const handleNavScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleNavScroll);
  }, []);
  
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
                  <button
                    className="text-foreground hover:text-primary transition-colors duration-300 text-base font-semibold uppercase tracking-wide relative group"
                  >
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
                  <Link to={{ pathname: "/", hash: "#donate" }}>
                    <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg text-base">
                      Donate
                    </Button>
                  </Link>
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
              <div className={`md:hidden bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
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
                        smoothScrollTo('donate');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-primary text-primary-foreground font-semibold px-4 py-3 transition-all duration-300 text-center text-sm mt-4 rounded-full"
                    >
                      Donate
                    </button>
                </div>
              </div>
            </nav>

      <section id="about" className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-display text-5xl md:text-6xl font-black text-foreground mb-8">
                About Bucks Capital
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
              <p className="text-xl text-foreground/80 leading-relaxed max-w-4xl mx-auto font-medium mb-12">
                501(c)(3) student managed investment fund with a financial education program that gives students real-world investment experience with actual capital.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const joinSection = document.getElementById('join-us');
                    if (joinSection) {
                      joinSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  Join Us
                </button>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-16">
              {[{
              icon: GraduationCap,
              title: 'Financial Literacy',
              description: 'Learn fundamental investment principles, market analysis, and portfolio management strategies through hands-on experience with real capital.',
              number: '01'
            }, {
              icon: Target,
              title: 'Real Impact',
              description: 'Manage $4,000 worth of real capital and gain hands-on investing experience. Profits are donated. Learn skills that go beyond classroom simulations.',
              number: '02'
            }, {
              icon: Users,
              title: 'Professional Mentorship',
              description: 'Work alongside an advisory board of finance professionals who provide guidance and insight into the finance industry.',
              number: '03'
            }].map((feature, index) => <div key={index} className="group relative">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-4xl font-black text-primary/20">{feature.number}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-foreground/80 leading-relaxed font-medium text-lg">{feature.description}</p>
                </div>
              </div>)}
            </div>
          </div>
        </div>
      </section>

        {/* Team Section */}
        <section id="team" ref={teamSectionRef} className="py-32 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-display text-5xl md:text-6xl font-black text-foreground mb-8">
                  Our Team
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
                <p className="text-xl text-foreground/80 leading-relaxed max-w-4xl mx-auto font-medium">
                  Led by passionate students with diverse academic backgrounds and guided by experienced 
                  faculty advisors and industry professionals.
                </p>
              </div>

              {/* Team Members - Horizontal Scrolling */}
              <div className="mb-20 overflow-hidden relative" style={{ height: '600px', width: '100%' }}>
                {/* Gradient fade edges for visual indication */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
                <div 
                  ref={scrollContainerRef}
                  className="flex gap-6 md:gap-8 px-4"
                  style={{ 
                    transform: `translateX(-${horizontalScroll}px)`,
                    willChange: 'transform',
                    transition: isCarouselActive ? 'none' : 'transform 0.1s ease-out',
                    minWidth: 'max-content'
                  }}
                >
                  {teamMembersWithPhotos.map((member, index) => {
                    const isExpanded = expandedCardIndex === index;
                    const imagePath = `/Profile Photos/${getProfileImage(member.name)}`;
                    
                    return (
                      <div
                        key={index}
                        onClick={() => setExpandedCardIndex(isExpanded ? null : index)}
                        className={`bg-white border-2 border-gray-200 rounded-2xl cursor-pointer transition-all duration-500 flex-shrink-0 flex-grow-0 ${
                          isExpanded 
                            ? 'w-80 md:w-96 shadow-2xl scale-105 border-primary/30 z-20' 
                            : 'w-64 md:w-72 hover:shadow-xl hover:scale-105 hover:border-primary/20'
                        }`}
                        style={{ 
                          height: '550px',
                          flexShrink: 0,
                          flexGrow: 0
                        }}
                      >
                        {!isExpanded ? (
                          // Collapsed state - show image
                          <div className="h-full flex flex-col items-center justify-center p-6">
                            <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden mb-6 shadow-lg">
                              <img 
                                src={imagePath} 
                                alt={member.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to initials if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.className = 'w-48 h-48 md:w-56 md:h-56 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg';
                                    parent.innerHTML = `<span class="text-4xl md:text-5xl font-black text-primary">${member.name.split(' ').map(n => n[0]).join('')}</span>`;
                                  }
                                }}
                              />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-foreground text-center">{member.name}</h3>
                            <div className="text-sm md:text-base text-primary font-bold mt-2 text-center">{member.role}</div>
                          </div>
                        ) : (
                          // Expanded state - show all details
                          <div className="h-full flex flex-col p-6 md:p-8 overflow-y-auto">
                            <div className="flex-shrink-0 mb-4">
                              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden mx-auto shadow-lg">
                                <img 
                                  src={imagePath} 
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.className = 'w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-xl flex items-center justify-center mx-auto shadow-lg';
                                      parent.innerHTML = `<span class="text-2xl md:text-3xl font-black text-primary">${member.name.split(' ').map(n => n[0]).join('')}</span>`;
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 text-center">{member.name}</h3>
                            <div className="text-base md:text-lg text-primary font-bold mb-2 text-center">{member.role}</div>
                            <div className="text-sm md:text-base text-foreground/60 font-medium mb-4 text-center">{member.year}</div>
                            <p className="text-sm md:text-base text-foreground/80 leading-relaxed text-center flex-1">{member.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advisory Board */}
              <div className="text-center mb-16">
                <h3 className="text-display text-4xl md:text-5xl font-black text-foreground mb-4">
                  Advisory Board
                </h3>
                <div className="w-16 h-1 bg-primary mx-auto mb-8"></div>
                <p className="text-lg text-foreground/80 font-medium">
                  Industry professionals and faculty advisors guiding our mission
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {advisoryBoard.map((member, index) => (
                  <div key={`advisory-${index}`} className="bg-gray-50 border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
                    <h4 className="text-lg font-bold text-foreground mb-2">{member.name}</h4>
                    <div className="text-primary font-semibold text-sm">{member.role}</div>
                  </div>
                ))}
              </div>

              {/* Analysts Section */}
              <div className="text-center mb-16 mt-20">
                <h3 className="text-display text-3xl md:text-4xl font-black text-foreground mb-4">
                  Analysts
                </h3>
                <div className="w-12 h-1 bg-primary mx-auto mb-6"></div>
                <p className="text-base text-foreground/80 font-medium">
                  Dedicated analysts supporting our investment research.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Macro Analysts */}
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-6 text-center lg:text-left">Macro Analyst Team</h4>
                  <div className="space-y-4">
                    {macroAnalysts.map((analyst, index) => (
                      <div key={`macro-${index}`} className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="text-sm font-bold text-primary">
                              {analyst.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-base font-bold text-foreground">{analyst.name}</h5>
                            <div className="text-primary font-semibold text-sm">{analyst.role}</div>
                            <div className="text-xs text-foreground/60 font-medium">{analyst.year}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equity Analysts */}
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-6 text-center lg:text-left">Equity Analyst Team</h4>
                  <div className="space-y-4">
                    {equityAnalysts.map((analyst, index) => (
                      <div key={`equity-${index}`} className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="text-sm font-bold text-primary">
                              {analyst.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-base font-bold text-foreground">{analyst.name}</h5>
                            <div className="text-primary font-semibold text-sm">{analyst.role}</div>
                            <div className="text-xs text-foreground/60 font-medium">{analyst.year}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Join Our Program Section */}
        <section id="join-us" className="py-32 bg-gradient-to-br from-gray-50 to-white relative z-10">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-display text-5xl md:text-6xl font-black text-foreground mb-8">
                  Join Our Program
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
                <p className="text-xl text-foreground/80 leading-relaxed max-w-4xl mx-auto font-medium">
                  Join Bucks Capital and gain hands-on experience managing real investments while building 
                  the skills and network that will launch your career in finance.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 px-4">
                <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-gray-100 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground flex-1 min-w-0">What You'll Learn</h3>
                  </div>
                  <ul className="space-y-6">
                    {[
                      'Financial modeling & valuation',
                      'Portfolio management strategies', 
                      'Market research & analysis',
                      'Risk assessment techniques'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-base sm:text-lg font-medium text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-gray-100 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0">
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground flex-1 min-w-0">Requirements</h3>
                  </div>
                  <ul className="space-y-6">
                    {[
                      'Current Central Bucks student',
                      '3.0+ GPA requirement',
                      'Interest in finance/business',
                      'Commitment to weekly meetings'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-base sm:text-lg font-medium text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button 
                    onClick={() => setIsApplicationModalOpen(true)}
                    className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold px-12 py-4 rounded-full transition-all duration-300 hover:shadow-xl text-lg"
                  >
                    Apply Now
                  </Button>
                  <a href="mailto:info@buckscapital.org">
                    <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-12 py-4 rounded-full transition-all duration-300 text-lg">
                      Contact Us
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 bg-gray-50 text-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-12 mb-16">
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
                  <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">Contact</h3>
                  <div className="space-y-4">
                    <p className="text-gray-600 font-medium">
                      Central Bucks High School West<br />
                      Doylestown, PA 18901
                    </p>
                    <p className="text-gray-600 font-medium">
                      info@buckscapital.org
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">Mission</h3>
                  <p className="text-gray-600 font-medium">
                    Bridging the gap between classroom theory and real-world financial responsibility.
                  </p>
                </div>
              </div>
              
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-500 font-medium mb-4 md:mb-0">
                    © 2025 Bucks Capital. All rights reserved.
                  </p>
                  <div className="flex space-x-6">
                    <a href="mailto:info@buckscapital.org" className="text-gray-500 hover:text-gray-900 transition-colors duration-300 font-medium">
                      Contact
                    </a>
                    <button 
                      onClick={() => setIsApplicationModalOpen(true)}
                      className="text-gray-500 hover:text-gray-900 transition-colors duration-300 font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Application Modal */}
        <ApplicationModal 
          isOpen={isApplicationModalOpen} 
          onClose={() => setIsApplicationModalOpen(false)} 
        />
    </div>
  );
};

export default About;
