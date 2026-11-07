"use client"

import { useState, useMemo, useCallback } from "react"
import { ExternalLink, Github, Filter, Loader2, Eye, Code2, Smartphone, Globe, Play, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useProjects } from "../hooks/useFirebase"

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all")
  const [hoveredProject, setHoveredProject] = useState(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  
  // Fetch projects from Firebase
  const { data: projects = [], isLoading, error } = useProjects()
  
  // Enhanced fallback data with professional images and better descriptions
  const fallbackProjects = [
    // CV Projects
    {
      id: 1,
      title: "Restaurant Management & Ordering System",
      description:
        "A comprehensive multi-restaurant platform where owners can register and configure tables. Each table gets a unique QR code that customers scan to view menus, place orders, and send requests directly to the kitchen with table numbers. Features real-time order tracking and kitchen management.",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      technologies: ["Node.js", "Express.js", "MongoDB", "QR Code", "Real-time", "JWT"],
      category: "web",
      status: "published",
      featured: true,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      metrics: { restaurants: "50+", orders: "10K+", efficiency: "85%" },
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 2,
      title: "Global Movies & Series Platform",
      description:
        "A comprehensive content platform displaying upcoming and newly added movies and TV shows worldwide. Features country-based filtering, optimized API responses for global scalability, and real-time content updates from multiple sources.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl3BLMHNx36uc0tWtU--99-7jT3hT_uNiBew&s",
      technologies: ["Node.js", "Express.js", "MongoDB", "RESTful APIs", "Global CDN", "Redis"],
      category: "web",
      status: "published",
      featured: true,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      metrics: { movies: "100K+", countries: "195", users: "25K+" },
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 3,
      title: "AI CV Builder & Job Analyzer",
      description:
        "A bilingual (Arabic & English) system for generating professional CVs using AI and analyzing job descriptions to suggest optimizations. Features secure authentication, file handling, and intelligent content generation powered by OpenAI API.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      technologies: ["Node.js", "Express.js", "MongoDB", "OpenAI API", "AI/ML", "Bilingual"],
      category: "web",
      status: "published",
      featured: true,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      metrics: { cvs: "5K+", languages: "2", accuracy: "95%" },
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 4,
      title: "Surveys Management System (Magdi Yacoub Hospital)",
      description:
        "A secure survey creation, storage, and analytics system designed for healthcare institutions. Features advanced data visualization, secure APIs, and improved backend response times by 30%. Built with enterprise-grade security and compliance.",
      image: "https://egyptunitedvoice.com/wp-content/uploads/2018/02/2018-02-03-magdi-yacoub-foundation-logo-myf-logo.png",
      technologies: ["Node.js", "Express.js", "MongoDB", "Healthcare", "Analytics", "Security"],
      category: "web",
      status: "published",
      featured: true,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      metrics: { surveys: "500+", response: "30% faster", compliance: "100%" },
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 5,
      title: "Ninja Dashboard System",
      description:
        "A responsive dashboard for delivery company management with interactive charts and comprehensive business analytics. Features real-time tracking, performance metrics, and intuitive data visualization for efficient operations management.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      technologies: ["HTML", "CSS", "Bootstrap", "JavaScript", "Chart.js", "ApexCharts"],
      category: "web",
      status: "published",
      featured: false,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      metrics: { deliveries: "1K+", efficiency: "90%", analytics: "Real-time" },
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 6,
      title: "Dari Company for Decoration",
      description:
        "A modern, mobile-responsive landing page for a decoration company with optimized performance and clean UI. Features beautiful animations, contact forms, portfolio showcase, and SEO optimization for better visibility.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      technologies: ["Next.js", "Tailwind CSS", "Responsive", "SEO", "Performance"],
      category: "web",
      status: "published",
      featured: false,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      metrics: { speed: "95%", mobile: "100%", seo: "A+" },
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 7,
      title: "Saraha Web App",
      description:
        "An anonymous messaging platform with real-time data storage and authentication. Features secure anonymous communication, real-time messaging, and user-friendly interface built with Firebase for scalability and reliability.",
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      technologies: ["Firebase", "Vanilla JS", "Real-time", "Anonymous", "Authentication"],
      category: "web",
      status: "published",
      featured: false,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      metrics: { messages: "50K+", users: "10K+", privacy: "100%" },
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 8,
      title: "Ancosy Real Estate Website",
      description:
        "A responsive website to showcase real estate services, property listings, and project portfolios. Features advanced property search, virtual tours, and comprehensive portfolio management for real estate professionals.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      technologies: ["React.js", "Real Estate", "Property Search", "Portfolio", "Responsive"],
      category: "web",
      status: "published",
      featured: false,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      metrics: { properties: "500+", views: "100K+", conversions: "15%" },
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    // New Mobile Projects
    {
      id: 9,
      title: "Hella Meshwar - School Transport App",
      description:
        "A comprehensive Flutter application for school transportation management. Features real-time tracking of school buses, parent notifications, route optimization, and secure child pickup/dropoff management with driver verification.",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      technologies: ["Flutter", "Dart", "Firebase", "GPS", "Real-time", "Push Notifications"],
      category: "mobile",
      status: "published",
      featured: true,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      metrics: { schools: "25+", students: "5K+", safety: "100%" },
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 10,
      title: "GoFleet - Ride Sharing App",
      description:
        "A React Native ride-sharing application similar to Uber and Careem. Features real-time ride booking, driver tracking, payment integration, rating system, and comprehensive fleet management with advanced analytics.",
      image: "https://mostaql.hsoubcdn.com/uploads/portfolios/1378619/689b0171a94f1/974shotsso.png",
      technologies: ["React Native", "TypeScript", "Firebase", "Payment", "Maps", "Real-time"],
      category: "mobile",
      status: "published",
      featured: true,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      metrics: { rides: "100K+", drivers: "2K+", rating: "4.8" },
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  ]
  
  // Use Firebase data if available, otherwise use fallback
  const displayProjects = useMemo(() => 
    projects.length > 0 ? 
      projects.filter(p => p.status === 'published') : 
      fallbackProjects,
    [projects]
  )

  const filters = useMemo(() => [
    { id: "all", label: "All Projects", icon: Eye, count: displayProjects.length },
    { id: "web", label: "Web Apps", icon: Globe, count: displayProjects.filter(p => p.category === 'web').length },
    { id: "mobile", label: "Mobile Apps", icon: Smartphone, count: displayProjects.filter(p => p.category === 'mobile').length },
    { id: "cloud", label: "Cloud Solutions", icon: Code2, count: displayProjects.filter(p => p.category === 'cloud').length },
  ], [displayProjects])

  const filteredProjects = useMemo(() =>
    activeFilter === "all" ? displayProjects : displayProjects.filter((project) => project.category === activeFilter),
    [displayProjects, activeFilter]
  )

  const handleFilterChange = useCallback((filterId) => {
    setActiveFilter(filterId)
  }, [])

  const handleVideoPlay = useCallback((project) => {
    if (project.videoUrl) {
      setSelectedVideo(project)
      setShowVideoModal(true)
    }
  }, [])

  const handleCloseVideo = useCallback(() => {
    setShowVideoModal(false)
    setSelectedVideo(null)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20
      }
    }
  }

  const cardVariants = {
    hidden: { 
      scale: 0.9, 
      opacity: 0,
      y: 60,
      rotateX: 15
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.8
      }
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      y: -30,
      rotateX: -15,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -8,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  }

  const filterVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: {
      scale: 0.95
    }
  }

  return (
    <section id="portfolio" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50/30 via-slate-50/20 to-zinc-50/30 dark:from-gray-900 dark:via-slate-900/20 dark:to-slate-950 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-20 w-48 h-48 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl"
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8 md:mb-12 lg:mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="mb-8"
            variants={itemVariants}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-orange-100/80 dark:bg-orange-900/30 backdrop-blur-sm rounded-full border border-orange-200/50 dark:border-orange-800/50 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-2 h-2 bg-orange-500 rounded-full mr-3"
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
              <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm tracking-wide uppercase">
                Featured Work
              </span>
            </motion.div>
          </motion.div>
          
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-4"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-slate-600 dark:from-orange-400 dark:via-red-400 dark:to-slate-400 bg-clip-text text-transparent">
              My Portfolio
            </span>
          </motion.h2>
          
          <motion.div 
            className="max-w-4xl mx-auto"
            variants={itemVariants}
          >
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 md:mb-8"
              variants={itemVariants}
            >
              A showcase of my recent projects demonstrating expertise across{" "}
              <motion.span 
                className="font-semibold text-blue-600 dark:text-blue-400"
                whileHover={{ scale: 1.05 }}
              >
                web development
              </motion.span>
              ,{" "}
              <motion.span 
                className="font-semibold text-cyan-600 dark:text-cyan-400"
                whileHover={{ scale: 1.05 }}
              >
                mobile apps
              </motion.span>
              , and{" "}
              <motion.span 
                className="font-semibold text-teal-600 dark:text-teal-400"
                whileHover={{ scale: 1.05 }}
              >
                cloud solutions
              </motion.span>
              .
            </motion.p>
          </motion.div>
          
          {/* Loading indicator */}
          {isLoading && (
            <motion.div 
              className="flex items-center justify-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Loading projects from CMS...
              </span>
            </motion.div>
          )}
          
          {/* Error state */}
          {error && (
            <motion.div 
              className="mt-4 p-4 bg-orange-100 dark:bg-orange-900/20 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Using demo data - CMS not configured yet
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Filter Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 md:mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl p-2 border border-white/30 dark:border-gray-800/30 shadow-xl">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => {
                const IconComponent = filter.icon
                return (
                  <motion.button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id)}
                    className={`group relative flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 ${
                      activeFilter === filter.id
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/70 backdrop-blur-sm"
                    }`}
                    variants={filterVariants}
                    whileHover={{ 
                      scale: 1.05,
                      y: -2
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Active indicator background */}
                    {activeFilter === filter.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"
                        layoutId="activeFilter"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    {/* Icon with enhanced animation */}
                    <motion.div
                      animate={{
                        rotate: activeFilter === filter.id ? [0, 5, -5, 0] : 0
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                    >
                      <IconComponent size={18} className={activeFilter === filter.id ? "text-white" : "text-blue-600 dark:text-blue-400"} />
                    </motion.div>
                    
                    {/* Text and Count */}
                    <div className="relative z-10 flex items-center space-x-2">
                      <span className="text-sm">{filter.label}</span>
                      <motion.span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          activeFilter === filter.id 
                            ? "bg-white/20 text-white" 
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        }`}
                        animate={{
                          scale: activeFilter === filter.id ? [1, 1.1, 1] : 1
                        }}
                        transition={{
                          duration: 0.3
                        }}
                      >
                        {filter.count}
                      </motion.span>
                    </div>
                    
                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Projects Grid */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          layout
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                {/* Card background glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                {/* Enhanced Image Section */}
                <div className="relative rounded-t-2xl">
                  <motion.div 
                    className="relative h-32 sm:h-36 md:h-40"
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <motion.img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.15,
                        filter: "brightness(1.1) contrast(1.1)"
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    
                    {/* Video overlay when hovering */}
                    {hoveredProject === project.id && project.videoUrl && (
                      <motion.div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.button
                          onClick={() => handleVideoPlay(project)}
                          className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full text-white border border-white/30 hover:bg-white/30 transition-all duration-300 group/play"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play size={32} className="group-hover/play:scale-110 transition-transform duration-200 ml-1" />
                        </motion.button>
                      </motion.div>
                    )}
                    
                    {/* Gradient overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                      initial={{ opacity: 0.3 }}
                      whileHover={{ opacity: hoveredProject === project.id ? 0.6 : 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Enhanced Action Buttons */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100"
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl text-white border border-white/30 hover:bg-white/30 transition-all duration-300 group/btn"
                        whileHover={{ scale: 1.1, y: -3, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink size={20} className="group-hover/btn:scale-110 transition-transform duration-200" />
                      </motion.a>
                      
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl text-white border border-white/30 hover:bg-white/30 transition-all duration-300 group/btn"
                        whileHover={{ scale: 1.1, y: -3, rotate: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github size={20} className="group-hover/btn:scale-110 transition-transform duration-200" />
                      </motion.a>
                    </motion.div>
                    
                    {/* Featured badge */}
                    {project.featured && (
                      <motion.div
                        className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg"
                        initial={{ scale: 0, rotate: -12 }}
                        animate={{ scale: 1, rotate: -12 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      >
                        ⭐ Featured
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Enhanced Content Section */}
                <div className="p-6 space-y-4">
                  <motion.div className="space-y-3">
                    <motion.h3 
                      className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {project.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm line-clamp-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {project.description}
                    </motion.p>
                  </motion.div>

                  {/* Enhanced Technology Tags */}
                  <motion.div 
                    className="flex flex-wrap gap-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {project.technologies.slice(0, 4).map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        className="px-2 py-1 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm text-orange-600 dark:text-orange-400 rounded-lg text-xs font-medium border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300"
                        initial={{ opacity: 0, scale: 0.8, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 0.4 + techIndex * 0.1 }}
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: "rgba(249, 115, 22, 0.1)"
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                    {project.technologies.length > 4 && (
                      <motion.span
                        className="px-2 py-1 bg-gray-500/10 backdrop-blur-sm text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium border border-gray-500/20"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        +{project.technologies.length - 4} more
                      </motion.span>
                    )}
                  </motion.div>

                  {/* Project Metrics */}
                  {project.metrics && (
                    <motion.div 
                      className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200/50 dark:border-gray-700/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {Object.entries(project.metrics).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          className="text-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <motion.div 
                            className="text-sm font-bold text-blue-600 dark:text-blue-400"
                            animate={{
                              scale: [1, 1.05, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.2
                            }}
                          >
                            {value}
                          </motion.div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize text-center">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                  
                  {/* Project stats or additional info */}
                  <motion.div 
                    className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Live Project</span>
                      </span>
                      <span className="capitalize">{project.category}</span>
                    </div>
                  </motion.div>
                </div>
                
                {/* Card border glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", maskComposite: "xor" }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Call-to-Action Section */}
        <motion.div 
          className="text-center mt-8 md:mt-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.div
            className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl rounded-4xl border border-white/20 dark:border-gray-800/20 shadow-2xl"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="mb-3 md:mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-3"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-wide uppercase">
                  Let's Collaborate
                </span>
              </motion.div>
            </motion.div>
            
            <motion.h3 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Ready to bring your
              <motion.span 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
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
                {" "}ideas to life?
              </motion.span>
            </motion.h3>
            
            <motion.p 
              className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Want to see more of my work or discuss a project? Let's connect and explore how we can work together to create something amazing.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl font-semibold text-sm sm:text-base md:text-lg shadow-xl"
                whileHover={{ 
                  scale: 1.05,
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button background animation */}
                <motion.div
                  className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Let's Work Together</span>
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    →
                  </motion.div>
                </span>
              </motion.button>
              
              <motion.button
                className="group px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-sm sm:text-base md:text-lg border border-white/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center space-x-2">
                  <span>Learn More About Me</span>
                  <motion.div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && selectedVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseVideo}
          >
            <motion.div
              className="relative w-full max-w-4xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                onClick={handleCloseVideo}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>

              {/* Video container */}
              <div className="relative w-full h-0 pb-[56.25%]">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="absolute top-0 left-0 w-full h-full rounded-t-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedVideo.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedVideo.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Portfolio
