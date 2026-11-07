"use client"
import { ArrowDown, Github, Linkedin, Mail, Download } from "lucide-react"
import { motion } from "framer-motion"
import { useSEO, ScreenReaderOnly } from "../utils/seo.jsx"
// import logo from '/assets/images/logo.jpg' // Fixed: Use public path instead
import resume from '../assets/Abdullah-Jamal-Abdul-Muttalib.pdf'

const Hero = () => {
  // SEO optimization for hero section
  useSEO({
    title: "Abdullah Gamal - Full-Stack Developer | MERN Stack & React Native Expert",
    description: "Professional full-stack developer specializing in MERN Stack web applications and React Native mobile development. Available for freelance projects and full-time opportunities.",
    keywords: "Abdullah Gamal, full-stack developer, MERN stack, React, Node.js, MongoDB, React Native, JavaScript, freelance developer",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Abdullah Gamal",
      "jobTitle": "Full-Stack Developer",
      "description": "Full-Stack Developer specializing in MERN Stack and React Native",
      "url": window.location.origin,
      "image": `${window.location.origin}/assets/images/logo.jpg`,
      "sameAs": [
        "https://github.com/Gemycode",
        "https://www.linkedin.com/in/abdullah-jamal0/"
      ]
    }
  })
  const scrollToAbout = () => {
    document.querySelector("#about").scrollIntoView({ behavior: "smooth" })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section 
      id="home" 
      className="pt-16 sm:pt-20 md:pt-28 lg:pt-32 flex items-center justify-center relative"
      role="banner"
      aria-label="Hero section - Abdullah Gamal's introduction"
    >
      {/* Dark mode background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed hidden dark:block"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`,
          filter: 'blur(2px)',
          transform: 'scale(1.1)'
        }}
      ></div>
      
      {/* Light mode background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed dark:hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          filter: 'blur(2px)',
          transform: 'scale(1.1)'
        }}
      ></div>
      {/* Skip to main content link */}
      <a 
        href="#about" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Primary floating orbs - Adjusted positioning to avoid profile image */}
        <motion.div 
          className="absolute top-32 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl"
          variants={floatingVariants}
          animate="animate"
        ></motion.div>
        
        <motion.div
          className="absolute top-52 right-10 w-80 h-80 bg-gradient-to-r from-cyan-400/15 to-teal-400/15 rounded-full mix-blend-multiply filter blur-3xl"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
        ></motion.div>
        
        <motion.div
          className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "4s" }}
        ></motion.div>
        
        {/* Additional decorative elements */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full mix-blend-multiply filter blur-2xl"
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            y: [10, -10, 10],
            x: [5, -5, 5],
            scale: [1.1, 1, 1.1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
      </div>
      
      {/* Professional overlay for better text readability - Dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 dark:from-black/80 dark:via-black/60 dark:to-black/90 hidden dark:block"></div>
      
      {/* Light mode overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/80 dark:hidden"></div>
      
      {/* Subtle pattern overlay for texture */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}></div>

      <motion.div 
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Ultra-Enhanced Profile Image - Premium styling */}
          <motion.div 
            className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 mb-4 sm:mb-6 md:mb-8 z-30 group"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            role="img"
            aria-label="Abdullah Gamal's profile photo"
          >
            {/* Outer glow ring - Desktop only */}
            <motion.div 
              className="hidden sm:block absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-teal-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Simplified glass morphism background - Mobile optimized */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/15 to-white/10 dark:from-white/15 dark:via-white/10 dark:to-white/5 backdrop-blur-lg rounded-full border border-white/20 dark:border-white/15 shadow-xl z-10"></div>
            
            {/* Simplified gradient border - No rotation on mobile */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 p-1 rounded-full z-20"
              animate={{
                background: [
                  "linear-gradient(45deg, #3b82f6, #06b6d4, #14b8a6)",
                  "linear-gradient(45deg, #06b6d4, #14b8a6, #3b82f6)",
                  "linear-gradient(45deg, #14b8a6, #3b82f6, #06b6d4)",
                  "linear-gradient(45deg, #3b82f6, #06b6d4, #14b8a6)"
                ]
              }}
              transition={{
                background: { duration: 6, repeat: Infinity, ease: "linear" }
              }}
            >
              {/* Inner border - Simplified for mobile */}
              <div className="w-full h-full rounded-full p-1 bg-white dark:bg-gray-900 relative z-30">
                {/* Main image container - Mobile optimized */}
                <motion.div 
                  className="w-full h-full rounded-full overflow-hidden relative z-40 shadow-lg"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <img
                    src="/assets/images/logo.jpg"
                    alt="Abdullah Gamal - Full-Stack Developer specializing in MERN Stack and React Native development"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    loading="eager"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src)
                      e.target.style.display = 'none'
                    }}
                  />
                  
                  {/* Subtle overlay for depth - Desktop only */}
                  <motion.div 
                    className="hidden sm:block absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 dark:to-white/5"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Simplified availability indicator - Mobile optimized */}
            <motion.div 
              className="absolute -top-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-full border-2 sm:border-3 md:border-4 border-white dark:border-gray-900 shadow-xl flex items-center justify-center z-50"
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.7)",
                  "0 0 0 10px rgba(34, 197, 94, 0)",
                  "0 0 0 0 rgba(34, 197, 94, 0)"
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              aria-label="Available for work indicator"
              title="Available for new projects"
            >
              {/* Simplified inner dot */}
              <motion.div 
                className="relative w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-white rounded-full shadow-lg"
                animate={{
                  scale: [1, 0.9, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Simple pulse effect */}
              <motion.div 
                className="absolute inset-0 bg-emerald-400 rounded-full opacity-0"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </motion.div>
            
            {/* Simplified floating decorative elements - Mobile optimized */}
            <motion.div
              className="hidden sm:block absolute -top-4 -left-4 sm:-top-6 sm:-left-6 md:-top-8 md:-left-8 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 rounded-full opacity-70 shadow-lg"
              animate={{
                y: [-8, 8, -8],
                x: [-3, 3, -3],
                opacity: [0.5, 0.9, 0.5],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="hidden sm:block absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6 w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 rounded-full opacity-70 shadow-lg"
              animate={{
                y: [8, -8, 8],
                x: [3, -3, 3],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.15, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>

          {/* Enhanced Main Content */}
          <motion.header className="space-y-4 sm:space-y-6 md:space-y-8 max-w-5xl mx-auto" variants={itemVariants}>
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-cyan-900 dark:from-white dark:via-blue-100 dark:to-cyan-100 leading-tight drop-shadow-2xl"
              variants={itemVariants}
            >
              Hi, I'm{" "}
              <motion.span 
                className="inline-block bg-gradient-to-r from-blue-900  via-blu-600 to-blue-900 dark:from-teal-200 dark:via-blu-600 dark:to-teal-900 bg-clip-text text-transparent" 
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Abdullah
              </motion.span>
              <ScreenReaderOnly>
                , a Full-Stack Developer
              </ScreenReaderOnly>
            </motion.h1>

            <motion.div 
              className="space-y-4"
              variants={itemVariants}
            >
              <motion.h2 
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-900 dark:text-white/90 tracking-wide drop-shadow-lg relative"
                variants={itemVariants}
                role="doc-subtitle"
              >
                <motion.span
                  className="inline-block"
                  animate={{
                    y: [0, -2, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0
                  }}
                >
                  Full-Stack Developer
                </motion.span>
                {" | "}
                <motion.span
                  className="inline-block text-blue-800 dark:text-blue-400"
                  animate={{
                    y: [0, -2, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                >
                  MERN Stack Expert
                </motion.span>
                {" | "}
                <motion.span
                  className="inline-block text-black dark:text-cyan-400 dark:text-cyan-400 dark:text-cyan-400 dark:text-cyan-400"
                  animate={{
                    y: [0, -2, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6
                  }}
                >
                  React Native Developer
                </motion.span>
              </motion.h2>
            </motion.div>

            <motion.div 
              className="relative max-w-4xl mx-auto"
              variants={itemVariants}
            >
              {/* Professional glass morphism background for description */}
              <div className="absolute inset-0 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-gray-300/50 dark:border-white/20 shadow-2xl"></div>
              <motion.p 
                className="relative text-base sm:text-lg md:text-xl text-gray-900 dark:text-white/90 leading-relaxed p-4 sm:p-6 md:p-8 drop-shadow-lg"
                variants={itemVariants}
                role="doc-abstract"
              >
                I specialize in building{" "}
                <motion.span 
                  className="font-semibold text-blue-800 dark:text-blue-300"
                  whileHover={{ scale: 1.05 }}
                >
                  scalable and high-performance
                </motion.span>
                {" "}web applications using the{" "}
                <motion.span 
                  className="font-semibold text-cyan-800 dark:text-cyan-300"
                  whileHover={{ scale: 1.05 }}
                >
                  MERN Stack
                </motion.span>
                {" "}(MongoDB, Express, React, Node.js) and cross-platform mobile apps with{" "}
                <motion.span 
                  className="font-semibold text-teal-800 dark:text-teal-300"
                  whileHover={{ scale: 1.05 }}
                >
                  React Native
                </motion.span>
                . Passionate about clean code, exceptional user experience, and leveraging modern technologies to deliver impactful digital solutions that drive business growth.
              </motion.p>
            </motion.div>
          </motion.header>

          {/* Enhanced CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center pt-4 sm:pt-6 md:pt-8 px-4"
            variants={itemVariants}
            role="group"
            aria-label="Call to action buttons"
          >
            <motion.button
              onClick={() => {
                document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl font-semibold text-sm sm:text-base md:text-lg shadow-2xl focus-ring w-full sm:w-auto min-w-[180px] border border-white/20 backdrop-blur-sm"
              whileHover={{ 
                scale: 1.05,
                y: -3,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              aria-label="View my portfolio projects"
              type="button"
            >
              {/* Glass overlay effect */}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100"
                initial={false}
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              ></motion.div>
              
              <span className="relative z-10 flex items-center gap-2 ">
                <motion.span
                  initial={false}
                  animate={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  View My Work
                </motion.span>
                <motion.div
                  initial={false}
                  animate={{ x: 0, opacity: 0.7 }}
                  whileHover={{ x: 5, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.div>
              </span>
            </motion.button>
            
            <motion.button
              onClick={() => {
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="group relative bg-white/20 dark:bg-white/10 backdrop-blur-lg border-2 border-gray-300/50 dark:border-white/30 text-gray-800 dark:text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl font-semibold text-sm sm:text-base md:text-lg hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 focus-ring shadow-2xl w-full sm:w-auto min-w-[180px]"
              whileHover={{ 
                scale: 1.05,
                y: -3,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              aria-label="Get in touch for project inquiries"
              type="button"
            >
              <span className="relative z-10 flex items-center gap-2">
                <motion.span
                  initial={false}
                  animate={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Get In Touch
                </motion.span>
                <motion.div
                  initial={false}
                  animate={{ x: 0, opacity: 0.7 }}
                  whileHover={{ x: 5, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  💬
                </motion.div>
              </span>
            </motion.button>
            
            <motion.a
              href={resume}
              download="Abdullah-Jamal-Abdul-Muttalib.pdf"
              className="group relative bg-white/30 dark:bg-white/20 backdrop-blur-lg text-gray-800 dark:text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-semibold text-base md:text-lg hover:bg-white/40 dark:hover:bg-white/30 transition-all duration-300 focus-ring shadow-2xl border border-gray-300/50 dark:border-white/30 w-full sm:w-auto min-w-[200px]"
              whileHover={{ 
                scale: 1.05,
                y: -3,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              aria-label="Download Abdullah Gamal's resume as PDF"
            >
              <span className="relative z-10 flex items-center gap-3">
                <motion.div
                  animate={{
                    y: [0, -2, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Download size={20} aria-hidden="true" />
                </motion.div>
                <motion.span
                  initial={false}
                  animate={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Download CV
                </motion.span>
              </span>
            </motion.a>
          </motion.div>

          {/* Enhanced Social Links */}
          <motion.div 
            className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-8 pt-4 sm:pt-6 md:pt-8 px-4"
            variants={itemVariants}
          >
            {[
              { href: "https://github.com/Gemycode", icon: Github, label: "GitHub", color: "from-gray-600 to-gray-800" },
              { href: "https://www.linkedin.com/in/abdullah-jamal0/", icon: Linkedin, label: "LinkedIn", color: "from-blue-600 to-blue-800" },
              { href: "mailto:abdallagamalph@gmail.com", icon: Mail, label: "Email", color: "from-cyan-600 to-teal-600" }
            ].map(({ href, icon: Icon, label, color }, index) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? "_blank" : undefined}
                rel={href.startsWith('http') ? "noopener noreferrer" : undefined}
                className="group relative p-2 sm:p-3 md:p-4 bg-white/30 dark:bg-white/10 backdrop-blur-lg rounded-2xl text-gray-900 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-all duration-300 border border-gray-300/50 dark:border-white/20 shadow-2xl flex items-center justify-center"
                whileHover={{ 
                  scale: 1.15,
                  y: -8
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
              >
                {/* Gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`}
                ></motion.div>
                
                {/* Icon with enhanced animation */}
                <motion.div
                  className="relative z-10"
                  animate={{
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                >
                  <Icon size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </motion.div>
                
                {/* Tooltip */}
                <motion.div
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  initial={false}
                  whileHover={{ y: -2 }}
                >
                  {label}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-white"></div>
                </motion.div>
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll Indicator - Now properly positioned in content flow */}
          <motion.div
            className="flex flex-col items-center pt-8 sm:pt-10 md:pt-12 lg:pt-16 pb-4 sm:pb-6 md:pb-8 space-y-2 sm:space-y-3 md:space-y-4"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            {/* Scroll text - Hidden on mobile to save space */}
            <motion.span
              className="hidden md:block text-xs lg:text-sm text-gray-800 dark:text-white/70 font-medium tracking-wider uppercase text-center drop-shadow-lg relative px-3 py-1 rounded-full"
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Scroll Down
            </motion.span>
            
            {/* Animated scroll button */}
            <motion.button
              onClick={scrollToAbout}
              className="group relative p-2 sm:p-3 md:p-4 bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-full border border-gray-300/30 dark:border-white/20 shadow-2xl hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300"
              whileHover={{ 
                scale: 1.1,
                y: -3
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll down to about section"
            >
              {/* Animated arrow */}
              <motion.div
                animate={{
                  y: [0, 3, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300" />
              </motion.div>
              
              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [1, 1.4, 1.8],
                  opacity: [0.6, 0.3, 0]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              ></motion.div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
