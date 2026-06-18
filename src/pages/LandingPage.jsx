import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  CreditCard,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  Rocket,
  Star,
  Sparkles,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);

  // Mouse Tracking for Parallax & Custom Cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const parallaxX = useTransform(cursorX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-40, 40]);
  const parallaxY = useTransform(cursorY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-40, 40]);
  const parallaxXReverse = useTransform(cursorX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [40, -40]);
  const parallaxYReverse = useTransform(cursorY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [40, -40]);

  useEffect(() => {
    const mouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  useEffect(() => {
    // Only check local storage, default to light mode
    if (localStorage.theme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.2 }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 40, scale: 0.95 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const floatAnimation = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const features = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: 'Student & Staff Management',
      description: 'Effortlessly manage records, attendance, and performance for everyone.'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      title: 'Academic Tracking',
      description: 'Streamline homework, exams, and grading with automated reports.'
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: 'Attendance & Leaves',
      description: 'Real-time attendance tracking and simplified leave management.'
    },
    {
      icon: <CreditCard className="w-6 h-6 text-primary" />,
      title: 'Fee Management',
      description: 'Secure, transparent, and automated fee collection and invoicing.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Demo Plan',
      price: '₹0',
      duration: 'for 30 days',
      features: [
        'Full access to all modules',
        'Up to 100 student profiles',
        'Basic reporting',
        'Email support'
      ],
      buttonText: 'Start Free Trial',
      popular: true,
      comingSoon: false,
    },
    {
      name: 'Monthly Plan',
      price: '₹4,999',
      duration: '/month',
      features: [
        'Unlimited student profiles',
        'Advanced analytics & reports',
        'Parent portal access',
        'Priority email & chat support',
        'Custom branding'
      ],
      buttonText: 'Coming Soon',
      popular: false,
      comingSoon: true,
    },
    {
      name: 'Yearly Plan',
      price: '₹49,999',
      duration: '/year',
      features: [
        'Everything in Monthly',
        'Dedicated Account Manager',
        'API access & Integrations',
        'On-site training',
        '2 months free (Save 16%)'
      ],
      buttonText: 'Coming Soon',
      popular: false,
      comingSoon: true,
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-sans text-on-surface dark:text-slate-100 selection:bg-primary-light selection:text-primary-800 transition-colors duration-300">
      
      {/* Custom Trailing Cursor */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary/50 pointer-events-none z-[100] hidden md:block backdrop-blur-sm"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      />

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
        className="fixed w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-surface-variant dark:border-slate-800 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                <img src="/logo.png" alt="Zuna Logo" className="w-full h-full object-contain drop-shadow-sm" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">Zuna</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-on-surface-variant dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-on-surface-variant dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors font-medium">Pricing</a>
              <a href="#contact" className="text-on-surface-variant dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors font-medium">Contact</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-surface-variant dark:hover:bg-slate-800 text-on-surface-variant dark:text-slate-300 transition-colors">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Students Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setStudentDropdownOpen(!studentDropdownOpen);
                    setStaffDropdownOpen(false);
                  }}
                  className="flex items-center space-x-1 border-2 border-slate-800 dark:border-slate-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-5 py-2 rounded-md font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <span>Students</span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${studentDropdownOpen ? 'rotate-90' : ''}`} />
                </button>

                {studentDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-primary-200 dark:border-slate-700 py-3 z-50"
                  >
                    <Link to="/login" className="flex items-center px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <span className="mr-3 text-slate-400">→]</span> Student Sign In
                    </Link>
                    <Link to="/register" className="flex items-center px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <Users className="w-4 h-4 mr-3 text-slate-400" /> Student Register
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Staff Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setStaffDropdownOpen(!staffDropdownOpen);
                    setStudentDropdownOpen(false);
                  }}
                  className="flex items-center space-x-1 bg-primary hover:bg-primary-600 text-white px-5 py-2.5 rounded-md font-bold text-sm transition-colors shadow-sm"
                >
                  <span>University (Coordinator)</span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${staffDropdownOpen ? 'rotate-90' : ''}`} />
                </button>

                {staffDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-primary-200 dark:border-slate-700 py-3 z-50"
                  >
                    <Link to="/login" className="flex items-center px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <span className="mr-3 text-slate-400">→]</span> Staff Sign In
                    </Link>
                    <Link to="/register" className="flex items-center px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <Users className="w-4 h-4 mr-3 text-slate-400" /> Staff Register
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button onClick={toggleDarkMode} className="text-on-surface-variant dark:text-slate-300">
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-on-surface dark:text-white hover:text-primary">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-surface-variant dark:border-slate-800 px-4 pt-2 pb-4 space-y-3 shadow-lg">
            <a href="#features" className="block px-3 py-2 text-on-surface dark:text-slate-200 font-medium" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#pricing" className="block px-3 py-2 text-on-surface dark:text-slate-200 font-medium" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <Link to="/login" className="block px-3 py-2 text-on-surface dark:text-slate-200 font-medium" onClick={() => setIsMenuOpen(false)}>Login as Student</Link>
            <Link to="/login" className="block px-3 py-2 text-on-surface dark:text-slate-200 font-medium" onClick={() => setIsMenuOpen(false)}>Login as Teacher</Link>
            <Link to="/register" className="block px-3 py-2 text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Register</Link>
          </div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Animated Background Gradients with Parallax */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <motion.div 
            style={{ x: parallaxX, y: parallaxY }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/30 dark:bg-primary-900/40 rounded-full blur-[100px]"
          />
          <motion.div 
            style={{ x: parallaxXReverse, y: parallaxYReverse }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary-400/20 dark:bg-secondary-900/30 rounded-full blur-[120px]"
          />
        </div>

        {/* Floating Icons with Parallax */}
        <motion.div style={{ x: parallaxXReverse, y: parallaxYReverse }} className="absolute hidden lg:flex top-40 left-32 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl items-center justify-center -rotate-12 border border-slate-100 dark:border-slate-700">
          <motion.div variants={floatAnimation} animate="animate">
            <GraduationCap className="w-8 h-8 text-primary" />
          </motion.div>
        </motion.div>
        <motion.div style={{ x: parallaxX, y: parallaxYReverse }} className="absolute hidden lg:flex top-60 right-32 w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-2xl items-center justify-center rotate-12 border border-slate-100 dark:border-slate-700">
          <motion.div variants={floatAnimation} animate="animate" style={{ animationDelay: '1s' }}>
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </motion.div>
        </motion.div>
        <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute hidden lg:flex bottom-32 left-1/4 w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-2xl items-center justify-center rotate-45 border border-slate-100 dark:border-slate-700">
          <motion.div variants={floatAnimation} animate="animate" style={{ animationDelay: '2s' }}>
            <BookOpen className="w-5 h-5 text-emerald-500" />
          </motion.div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-primary-700 dark:text-primary-light px-5 py-2.5 rounded-full font-semibold text-sm mb-8 border border-primary-100 dark:border-primary-900/50 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Next Generation School Management</span>
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-on-surface dark:text-white mb-6 leading-[1.1]">
              Manage your institution with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-600 dark:from-primary-400 dark:to-primary-200">Confidence</span>.
            </h1>
            
            <p className="text-lg lg:text-xl text-on-surface-variant dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Zuna brings administrators, teachers, students, and parents together on a single, powerful platform designed for modern educational excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="w-full sm:w-auto bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-primary/40 flex items-center justify-center space-x-2 group">
                  <span>Start your free demo</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href="#features" className="w-full sm:w-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-surface-dim dark:hover:bg-slate-700 text-on-surface dark:text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-surface-variant dark:border-slate-600 shadow-lg flex items-center justify-center">
                  Explore Features
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface-bright dark:bg-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-on-surface dark:text-white mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-on-surface-variant dark:text-slate-400">A comprehensive suite of tools built specifically for modern educational institutions.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-surface-variant dark:border-slate-700 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6 text-primary rotate-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-on-surface dark:text-white mb-3">{feature.title}</h3>
                <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-slate-900 relative transition-colors duration-300">
        <div className="absolute top-0 inset-x-0 h-1/2 bg-surface-bright dark:bg-slate-800/50 rounded-b-[4rem] lg:rounded-b-[8rem] transition-colors duration-300"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeIn} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-on-surface dark:text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-on-surface-variant dark:text-slate-400">Choose the plan that best fits your institution's needs.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div 
                key={index}
                variants={cardVariants}
                whileHover={plan.popular ? { scale: 1.08, y: -10 } : { scale: 1.02, y: -10 }}
                className={`relative bg-white dark:bg-slate-800 rounded-3xl p-8 border transition-all duration-300 ${plan.popular ? 'border-primary dark:border-primary shadow-2xl shadow-primary/20 scale-105 z-10' : 'border-surface-variant dark:border-slate-700 shadow-lg'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-on-surface dark:text-white mb-2">{plan.name}</h3>
                
                {!plan.comingSoon ? (
                  <>
                    <div className="flex items-baseline mb-8">
                      <span className="text-4xl font-extrabold text-on-surface dark:text-white">{plan.price}</span>
                      <span className="text-on-surface-variant dark:text-slate-400 ml-2">{plan.duration}</span>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start">
                          <CheckCircle2 className={`w-5 h-5 mr-3 shrink-0 ${plan.popular ? 'text-primary' : 'text-primary-400'}`} />
                          <span className="text-on-surface-variant dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 mb-8">
                    <div className="w-16 h-16 bg-surface-variant dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-primary">
                      <Rocket className="w-8 h-8" />
                    </div>
                    <p className="text-on-surface-variant dark:text-slate-400 text-center px-4">
                      We are working hard on bringing you this plan. Stay tuned for exciting features!
                    </p>
                  </div>
                )}
                
                {plan.comingSoon ? (
                  <button 
                    disabled
                    className="block w-full py-3 px-6 rounded-full text-center font-bold transition-all bg-surface-variant dark:bg-slate-700 text-on-surface-variant dark:text-slate-400 cursor-not-allowed"
                  >
                    {plan.buttonText}
                  </button>
                ) : (
                  <Link 
                    to="/register" 
                    className={`block w-full py-3 px-6 rounded-full text-center font-bold transition-all ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary-600 text-white shadow-md shadow-primary/30' 
                        : 'bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-light'
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150"
        ></motion.div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div {...fadeIn}>
            <Zap className="w-16 h-16 text-white/90 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Ready to transform your school?</h2>
            <p className="text-primary-100 text-xl md:text-2xl mb-12 font-medium">Join Zuna today and experience the future of educational management.</p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="inline-flex items-center space-x-3 bg-white text-primary font-bold px-10 py-5 rounded-full text-xl shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all">
                <span>Start Your Free Demo</span>
                <ChevronRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-surface-bright dark:bg-slate-900 py-12 border-t border-surface-variant dark:border-slate-800 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                <img src="/logo.png" alt="Zuna Logo" className="w-full h-full object-contain drop-shadow-sm" />
              </div>
              <span className="text-xl font-bold text-on-surface dark:text-white">Zuna</span>
            </div>
            <div className="text-on-surface-variant dark:text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Zuna by Team Carrezza. All rights reserved.
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
