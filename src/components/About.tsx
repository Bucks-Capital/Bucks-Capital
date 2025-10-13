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
        <section id="team" className="py-32 bg-gradient-to-br from-gray-50 to-white">
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

              {/* Team Members */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-20">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 md:p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center">
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-primary/10 rounded-2xl mx-auto mb-4 md:mb-6 flex items-center justify-center">
                      <span className="text-lg md:text-2xl font-black text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-sm md:text-xl font-bold text-foreground mb-1 md:mb-2">{member.name}</h3>
                    <div className="text-xs md:text-base text-primary font-bold mb-1">{member.role}</div>
                    <div className="text-xs md:text-sm text-foreground/60 font-medium mb-2 md:mb-4">{member.year}</div>
                    <p className="text-xs md:text-base text-foreground/80 leading-relaxed">{member.description}</p>
                  </div>
                ))}
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
                  <a href="mailto:bucks.capital1@gmail.com">
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
                      bucks.capital1@gmail.com
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
                    <a href="mailto:bucks.capital1@gmail.com" className="text-gray-500 hover:text-gray-900 transition-colors duration-300 font-medium">
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
