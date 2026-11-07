"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../contexts/ThemeContext"
import { Menu, X, Sun, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
// import logo from '../../public/assets/images/logo.jpg' // Fixed: Use public path instead

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Education", href: "#education" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ]

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  }

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border-b border-white/20 dark:border-gray-800/50" 
          : "bg-transparent"
      }`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced glass morphism background */}
      {scrolled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-gray-800/10 dark:via-gray-900/5 dark:to-gray-800/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div 
            className="flex-shrink-0 group"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-4 cursor-pointer">
              <motion.div 
                className="relative w-12 h-12 rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/60 dark:to-cyan-900/60 shadow-xl backdrop-blur-sm group/logo"
                whileHover={{ 
                  borderColor: "rgb(59 130 246 / 0.9)",
                  boxShadow: "0 15px 40px rgba(59, 130, 246, 0.4)",
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Simplified animated background - Mobile optimized */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-cyan-400/15 to-teal-400/20 rounded-xl"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.15), rgba(20, 184, 166, 0.2))",
                      "linear-gradient(45deg, rgba(6, 182, 212, 0.2), rgba(20, 184, 166, 0.15), rgba(59, 130, 246, 0.2))",
                      "linear-gradient(45deg, rgba(20, 184, 166, 0.2), rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.2))"
                    ]
                  }}
                  transition={{
                    background: { duration: 8, repeat: Infinity, ease: "linear" }
                  }}
                />
                
                {/* Main image container - Mobile optimized */}
                <motion.div 
                  className="relative z-10 w-full h-full rounded-xl overflow-hidden"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <img
                    src="/assets/images/logo.jpg"
                    alt="Abdullah Gamal Logo"
                    className="w-full h-full object-cover transition-all duration-300 group-hover/logo:scale-105"
                    loading="eager"
                  />
                  
                  {/* Simplified hover overlay */}
                  <motion.div
                    className="hidden sm:block absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/15 to-teal-500/20 rounded-xl opacity-0 group-hover/logo:opacity-100 transition-all duration-300"
                  />
                </motion.div>
                
                {/* Simplified border glow effect - Desktop only */}
                <motion.div
                  className="hidden sm:block absolute -inset-1 bg-gradient-to-br from-blue-400/30 via-cyan-400/30 to-teal-400/30 rounded-2xl blur-sm opacity-0 group-hover/logo:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              
              <motion.div className="hidden sm:block group/text">
                <motion.h1 
                  className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-cyan-800 dark:from-white dark:via-blue-200 dark:to-cyan-200 bg-clip-text text-transparent relative"
                  whileHover={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    scale: 1.02
                  }}
                  transition={{
                    backgroundPosition: { duration: 2, ease: "linear" },
                    scale: { duration: 0.3, ease: "easeOut" }
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Abdullah Gamal
                  
                  {/* Text glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gray-900 via-blue-800 to-cyan-800 dark:from-white dark:via-blue-200 dark:to-cyan-200 bg-clip-text text-transparent blur-sm opacity-0 group-hover/text:opacity-50"
                    style={{ backgroundSize: "200% 200%" }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{
                      duration: 2,
                      ease: "linear"
                    }}
                  />
                </motion.h1>
                <motion.p 
                  className="text-sm text-gray-500 dark:text-gray-400 font-medium relative group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  Full-Stack Developer
                  
                  {/* Subtle underline effect */}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-0 group-hover/text:opacity-100"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </motion.p>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2 bg-white/10 dark:bg-gray-900/20 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/20 shadow-lg">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-xl group"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -1,
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Background hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    layoutId="navbar-hover"
                  />
                  
                  {/* Text */}
                  <span className="relative z-10">{item.name}</span>
                  
                  {/* Enhanced bottom indicator */}
                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 rounded-full"
                    whileHover={{ width: "80%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  
                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)"
                    }}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Enhanced Admin Link */}
            <motion.a
              href="#admin"
              className="hidden lg:flex items-center space-x-2 text-xs px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-lg text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300 shadow-lg"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="font-medium">Admin</span>
            </motion.a>
            
            {/* Enhanced Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-white/10 dark:bg-gray-900/20 backdrop-blur-lg text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-900/30 transition-all duration-300 border border-white/20 shadow-lg group"
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={isDark ? "sun" : "moon"}
                  initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  {isDark ? (
                    <motion.div
                      animate={{
                        rotate: [0, 15, -15, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sun size={20} className="group-hover:text-yellow-500 transition-colors duration-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Moon size={20} className="group-hover:text-blue-400 transition-colors duration-300" />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Enhanced Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-2xl bg-white/10 dark:bg-gray-900/20 backdrop-blur-lg text-gray-700 dark:text-gray-300 border border-white/20 shadow-lg"
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={isOpen ? "close" : "open"}
                    initial={{ rotate: 0, opacity: 0 }}
                    animate={{ rotate: isOpen ? 45 : 0, opacity: 1 }}
                    exit={{ rotate: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile menu backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile menu panel */}
            <motion.div 
              className="fixed top-20 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 z-50 md:hidden max-w-[calc(100vw-2rem)]"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Menu header */}
              <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <motion.h3 
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Navigation
                </motion.h3>
              </div>
              
              {/* Menu items */}
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="group w-full text-left px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-2xl transition-all duration-200 flex items-center justify-between font-medium"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{item.name}</span>
                    <motion.div
                      className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      initial={false}
                      whileHover={{ scale: 1.2 }}
                    />
                  </motion.button>
                ))}
              </div>
              
              {/* Mobile menu footer */}
              <motion.div 
                className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
                  <motion.button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 px-3 py-2 bg-white/50 dark:bg-gray-700/50 rounded-xl"
                    whileTap={{ scale: 0.95 }}
                  >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    <span className="text-sm">{isDark ? 'Light' : 'Dark'}</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
