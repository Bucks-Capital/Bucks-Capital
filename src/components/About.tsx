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
  }, {
    name: 'Abhi Medi',
    role: 'Head of Macro',
    description: 'Finance focused student with macroeconomics interest.',
    year: 'Junior'
  }, {
    name: 'Jackson Hornick',
    role: 'Head of Equity',
    description: 'Student with equity analysis and portfolio management experience.',
    year: 'Junior'
  }, {
    name: 'Macro Analayst Team',
    role: 'Macro Analyst',
    description: 'Apply Now!',
    year: 'Mixed'
  }, {
    name: 'Equity Analayst Team',
    role: 'Equity Analyst',
    description: 'Apply Now!',
    year: 'Mixed'
  }
  ];
  const advisoryBoard = [{
    name: 'Nicholas Allgyer',
    role: 'Economics Teacher @ CB West',
  }, {
    name: 'Imaan Mulji',
    role: 'Custodian @ Bucks Capital',
  }, {
    name: 'Martin Meo',
    role: 'Business Teacher @ CB West',
  }, {
    name: 'Dan Pfieffer',
    role: 'Financial Services Representative/Advisor ',
  }, {
    name: 'Trevor Fennimore',
    role: 'Custodian @ Bucks Capital',
  }, {
    name: 'Chris Meister',
    role: 'Senior VP @ WSFS',
  },
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
    }, {
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
      'Abhi Medi': 'abhi.jpg',
      'Jackson Hornick': 'jackson.jpeg'
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
      <nav className={`fixed top-0 left-0 right-0 z-50 h-20 w-full transition-all duration-500 ${navScrolled
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
              <Button className="bg-primary hover:bg-white hover:text-primary border border-primary text-primary-foreground font-bold px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg text-base">
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
        <div className={`md:hidden bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
              className="w-full bg-primary hover:bg-white hover:text-primary border border-primary text-primary-foreground font-semibold px-4 py-3 transition-all duration-300 text-center text-sm mt-4 rounded-full"
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

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Financial Literacy Card */}
              <div className="group relative overflow-hidden bg-zinc-950 rounded-3xl border border-zinc-800 p-8 hover:border-primary/50 transition-all duration-500">
                <div className="relative z-10 h-full flex flex-col justify-between min-h-[400px]">
                  <div>
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Financial Literacy</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Learn fundamental investment principles, market analysis, and portfolio management strategies through hands-on experience.
                    </p>
                  </div>

                  {/* Chart Visual */}
                  <div className="mt-8 relative h-32 w-full bg-gradient-to-t from-primary/5 to-transparent rounded-xl border border-white/5 overflow-hidden group-hover:border-primary/20 transition-colors duration-500">
                    <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-around px-4 pb-2">
                      {[40, 65, 55, 80, 70, 90, 85].map((height, i) => (
                        <div
                          key={i}
                          className="w-2 bg-primary/40 rounded-t-sm transition-all duration-700 group-hover:bg-primary"
                          style={{
                            height: `${height}%`,
                            transitionDelay: `${i * 50}ms`
                          }}
                        />
                      ))}
                    </div>
                    {/* Line Overlay */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                      <path d="M0,100 L40,60 L80,70 L120,45 L160,55 L200,35 L240,40" fill="none" stroke="currentColor" className="text-primary opacity-50" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <div className="absolute top-4 left-4 bg-zinc-900/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                      <span className="text-xs font-mono text-primary">+24.8%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Impact Card */}
              <div className="group relative overflow-hidden bg-zinc-950 rounded-3xl border border-zinc-800 p-8 hover:border-primary/50 transition-all duration-500">
                <div className="relative z-10 h-full flex flex-col justify-between min-h-[400px]">
                  <div>
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Target className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Real Impact</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Manage $4,000 worth of real capital. Profits are donated to community causes. Gain skills beyond classroom simulations.
                    </p>
                  </div>

                  {/* Chip/Card Visual */}
                  <div className="mt-8 relative h-32 flex items-center justify-center">
                    <div className="absolute inset-x-8 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-white/5 shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500 flex flex-col justify-between p-4">
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-5 bg-yellow-500/20 rounded flex items-center justify-center border border-yellow-500/30">
                          <div className="w-4 h-3 border border-yellow-500/50 rounded-sm"></div>
                        </div>
                        <Crown className="text-white/20 h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="w-12 h-1 bg-white/10 rounded-full"></div>
                        <div className="w-8 h-1 bg-white/10 rounded-full"></div>
                      </div>
                    </div>
                    {/* Floating Coin */}
                    <div className="absolute right-4 top-0 bg-zinc-900 rounded-full p-2 border border-zinc-700 shadow-xl animate-float group-hover:text-primary transition-colors">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mentorship Card */}
              <div className="group relative overflow-hidden bg-zinc-950 rounded-3xl border border-zinc-800 p-8 hover:border-primary/50 transition-all duration-500">
                <div className="relative z-10 h-full flex flex-col justify-between min-h-[400px]">
                  <div>
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Professional Mentorship</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Work alongside an advisory board of finance professionals who provide guidance, career insight, and industry connections.
                    </p>
                  </div>

                  {/* Network Visual */}
                  <div className="mt-8 relative h-32 w-full bg-zinc-900/30 rounded-xl border border-white/5 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        {/* Nodes */}
                        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-zinc-500 rounded-full"></div>
                        {/* Connecting Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <line x1="25%" y1="25%" x2="75%" y2="50%" stroke="currentColor" className="text-primary/20" strokeWidth="1" />
                          <line x1="25%" y1="25%" x2="50%" y2="66%" stroke="currentColor" className="text-white/10" strokeWidth="1" />
                          <line x1="75%" y1="50%" x2="50%" y2="66%" stroke="currentColor" className="text-white/10" strokeWidth="1" />
                        </svg>
                        {/* Floating Badge */}
                        <div className="absolute bottom-2 right-4 flex items-center gap-2 bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-700 shadow-lg transform group-hover:scale-105 transition-transform">
                          <div className="flex -space-x-2">
                            <div className="w-5 h-5 rounded-full bg-zinc-600 border border-zinc-800"></div>
                            <div className="w-5 h-5 rounded-full bg-zinc-500 border border-zinc-800"></div>
                          </div>
                          <span className="text-[10px] font-bold text-white">Advisors</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                      className={`bg-zinc-950 border border-zinc-800 rounded-3xl cursor-pointer transition-all duration-500 flex-shrink-0 flex-grow-0 overflow-hidden group ${isExpanded
                        ? 'w-80 md:w-96 shadow-2xl scale-105 border-primary/50 z-20'
                        : 'w-64 md:w-72 hover:shadow-xl hover:scale-105 hover:border-primary/30'
                        }`}
                      style={{
                        height: '550px',
                        flexShrink: 0,
                        flexGrow: 0
                      }}
                    >
                      {!isExpanded ? (
                        // Collapsed state - show image
                        <div className="h-full flex flex-col items-center justify-center p-6 relative">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/50 pointer-events-none" />
                          <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden mb-8 shadow-2xl ring-1 ring-white/10 group-hover:ring-primary/30 transition-all duration-500 relative z-10">
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
                                  parent.className = 'w-48 h-48 md:w-56 md:h-56 bg-zinc-900 rounded-2xl flex items-center justify-center mb-8 shadow-2xl ring-1 ring-white/10';
                                  parent.innerHTML = `<span class="text-4xl md:text-5xl font-black text-zinc-700 select-none">${member.name.split(' ').map(n => n[0]).join('')}</span>`;
                                }
                              }}
                            />
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-2 z-10">{member.name}</h3>
                          <div className="text-sm md:text-base text-primary font-bold text-center z-10">{member.role}</div>
                        </div>
                      ) : (
                        // Expanded state - show all details
                        <div className="h-full flex flex-col p-6 md:p-8 overflow-y-auto custom-scrollbar">
                          <div className="flex-shrink-0 mb-6">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden mx-auto shadow-xl ring-1 ring-white/10">
                              <img
                                src={imagePath}
                                alt={member.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.className = 'w-24 h-24 md:w-32 md:h-32 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto shadow-xl ring-1 ring-white/10';
                                    parent.innerHTML = `<span class="text-2xl md:text-3xl font-black text-zinc-700 select-none">${member.name.split(' ').map(n => n[0]).join('')}</span>`;
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">{member.name}</h3>
                          <div className="text-base md:text-lg text-primary font-bold mb-3 text-center">{member.role}</div>
                          <div className="text-sm md:text-base text-zinc-500 font-medium mb-6 text-center">{member.year}</div>
                          <div className="w-full h-px bg-zinc-800 mb-6"></div>
                          <p className="text-sm md:text-base text-zinc-400 leading-relaxed text-center flex-1">{member.description}</p>
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

            <div className="flex flex-wrap justify-center gap-6">
              {advisoryBoard.map((member, index) => (
                <div key={`advisory-${index}`} className="w-full sm:w-72 group relative bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <h4 className="relative z-10 text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{member.name}</h4>
                  <div className="relative z-10 text-zinc-400 font-semibold text-sm">{member.role}</div>
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
                    <div key={`macro-${index}`} className="group relative bg-zinc-950 border border-zinc-800 rounded-xl p-4 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                          <span className="text-sm font-bold text-emerald-500">
                            {analyst.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{analyst.name}</h5>
                          <div className="text-zinc-400 font-semibold text-sm">{analyst.role}</div>
                          <div className="text-xs text-zinc-600 font-medium">{analyst.year}</div>
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
                    <div key={`equity-${index}`} className="group relative bg-zinc-950 border border-zinc-800 rounded-xl p-4 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                          <span className="text-sm font-bold text-emerald-500">
                            {analyst.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{analyst.name}</h5>
                          <div className="text-zinc-400 font-semibold text-sm">{analyst.role}</div>
                          <div className="text-xs text-zinc-600 font-medium">{analyst.year}</div>
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
              {/* What You'll Learn Card */}
              <div className="group relative overflow-hidden bg-zinc-950 rounded-[2.5rem] p-10 lg:p-12 shadow-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-500">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-8 leading-tight">What You'll Learn</h3>

                  <ul className="space-y-4 relative z-20">
                    {[
                      'Financial modeling & valuation',
                      'Portfolio management strategies',
                      'Market research & analysis',
                      'Risk assessment techniques'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center text-zinc-300">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Floating UI Visuals */}
                <div className="absolute right-0 bottom-0 w-3/4 h-3/4 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                  {/* Abstract Chart Card */}
                  <div className="absolute bottom-12 right-12 w-64 h-40 bg-zinc-900 rounded-2xl border border-zinc-800 p-4 transform rotate-[-6deg] translate-x-12 translate-y-12 shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
                      <ArrowRight className="w-4 h-4 text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-24 bg-zinc-800 rounded-full"></div>
                      <div className="h-2 w-16 bg-zinc-800 rounded-full"></div>
                    </div>
                    <div className="mt-8 flex items-end gap-1 h-12">
                      {[40, 70, 50, 80, 60, 90].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                  </div>
                  {/* Balance Card */}
                  <div className="absolute bottom-32 right-32 w-48 h-24 bg-zinc-900 rounded-xl border border-zinc-800 p-4 transform rotate-[12deg] shadow-xl backdrop-blur-sm">
                    <div className="text-xs text-zinc-500 mb-1">Total Assets</div>
                    <div className="text-xl font-mono text-primary font-bold">+$4,250.00</div>
                    <div className="mt-2 flex gap-2">
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements Card */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-950 rounded-[2.5rem] p-10 lg:p-12 shadow-2xl transition-all duration-500">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-8 leading-tight">Requirements</h3>

                  <ul className="space-y-4 relative z-20">
                    {[
                      'Current Central Bucks student',
                      '3.0+ GPA requirement',
                      'Interest in finance/business',
                      'Commitment to weekly meetings'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center text-emerald-100">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Abstract Visuals */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Gradient Blobs */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                  {/* Phone Mockup Visual */}
                  <div className="absolute -bottom-12 -right-12 w-80 h-[500px] bg-zinc-950 rounded-[3rem] border-8 border-zinc-900 shadow-2xl transform rotate-[-12deg] overflow-hidden">
                    {/* Screen Content */}
                    <div className="w-full h-full bg-zinc-900 p-6 relative">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-8">
                        <Menu className="w-5 h-5 text-zinc-600" />
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                      </div>
                      {/* Balance */}
                      <div className="mb-8">
                        <div className="text-zinc-500 text-xs mb-1">Commitment Score</div>
                        <div className="text-3xl font-bold text-white">100<span className="text-emerald-500 text-lg">.0%</span></div>
                      </div>
                      {/* List Items */}
                      <div className="space-y-3">
                        <div className="bg-zinc-800 p-3 rounded-xl flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <GraduationCap className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">GPA Verified</div>
                            <div className="text-emerald-500 text-xs">3.8 Average</div>
                          </div>
                        </div>
                        <div className="bg-zinc-800 p-3 rounded-xl flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">Attendance</div>
                            <div className="text-zinc-400 text-xs">Weekly Check-in</div>
                          </div>
                        </div>
                      </div>
                      {/* Bottom nav */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-950/50 backdrop-blur-md flex justify-around items-center px-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                      </div>
                    </div>
                  </div>
                </div>
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
