"use client"
import { motion, useInView } from "framer-motion"
import { Globe, Smartphone, Cloud, Database, Palette, Zap, ArrowRight, CheckCircle, Star, Sparkles } from "lucide-react"
import { useRef, useState } from "react"

const Services = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const [hoveredCard, setHoveredCard] = useState(null)
  const services = [
    {
      icon: <Globe className="w-12 h-12" />,
      title: "MERN Stack Development",
      description:
        "Full-stack web applications built with MongoDB, Express.js, React, and Node.js. Scalable, high-performance solutions with modern architecture and best practices.",
      features: [
        "React Frontend Development",
        "Node.js Backend APIs",
        "MongoDB Database Design",
        "Express.js Server Architecture",
      ],
      price: "Starting at $600",
      gradient: "from-orange-500 to-red-500",
      popular: true,
      delay: 0.1
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "React Native Mobile Development",
      description:
        "Cross-platform mobile applications using React Native and JavaScript. Single codebase for both iOS and Android with native performance and beautiful UI.",
      features: ["Cross-platform Development", "Native Performance", "Custom UI Components", "Firebase Integration"],
      price: "Starting at $350",
      gradient: "from-emerald-500 to-teal-500",
      popular: false,
      delay: 0.2
    },
    {
      icon: <Cloud className="w-12 h-12" />,
      title: "API Development & Integration",
      description:
        "RESTful APIs and backend services using Node.js and Express.js. Secure, scalable, and well-documented APIs with proper authentication.",
      features: ["RESTful API Design", "JWT Authentication", "Database Integration", "API Documentation"],
      price: "Starting at $400",
      gradient: "from-slate-600 to-slate-700",
      popular: false,
      delay: 0.3
    },
    {
      icon: <Database className="w-12 h-12" />,
      title: "Database Design & Optimization",
      description:
        "MongoDB database design and optimization for scalable applications. Efficient data modeling and query optimization for high performance.",
      features: ["MongoDB Schema Design", "Query Optimization", "Data Modeling", "Performance Tuning"],
      price: "Starting at $300",
      gradient: "from-orange-600 to-red-600",
      popular: false,
      delay: 0.4
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Full-Stack Consulting",
      description:
        "Technical consulting for MERN Stack projects. Architecture planning, code reviews, and best practices implementation.",
      features: ["Architecture Planning", "Code Review", "Performance Optimization", "Best Practices"],
      price: "Starting at $450",
      gradient: "from-emerald-600 to-teal-600",
      popular: false,
      delay: 0.5
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Maintenance & Support",
      description:
        "Ongoing maintenance and support for existing MERN Stack and React Native applications. Bug fixes, updates, and feature enhancements.",
      features: ["Bug Fixes", "Feature Updates", "Performance Monitoring", "Technical Support"],
      price: "Starting at $1,000",
      gradient: "from-slate-700 to-slate-800",
      popular: false,
      delay: 0.6
    },
  ]

  return (
    <section ref={ref} id="services" className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50/40 via-slate-50/30 to-zinc-50/40 dark:from-slate-900/30 dark:via-gray-900/20 dark:to-slate-800/30">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-400/20 dark:from-orange-600/20 dark:to-red-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 dark:from-emerald-600/20 dark:to-teal-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8 md:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="px-6 py-3 bg-gradient-to-r from-slate-100/80 to-gray-100/80 dark:from-slate-800/80 dark:to-gray-800/80 backdrop-blur-sm border border-slate-200/30 dark:border-slate-700/30 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300">
              ⚡ Services I Offer
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-slate-600 dark:from-orange-400 dark:via-red-400 dark:to-slate-400 bg-clip-text text-transparent">
              Professional
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-600 via-orange-600 to-slate-600 dark:from-red-400 dark:via-orange-400 dark:to-slate-400 bg-clip-text text-transparent">
              Services
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Comprehensive development services to bring your digital vision to life with cutting-edge technology and modern architecture.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 md:mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 + service.delay }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Popular badge */}
              {service.popular && (
                <motion.div
                  className="absolute -top-3 -right-3 z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Popular</span>
                  </div>
                </motion.div>
              )}

              <motion.div
                className={`relative h-full p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl border border-white/30 dark:border-gray-700/40 shadow-lg transition-all duration-300 ${
                  hoveredCard === index ? 'shadow-xl -translate-y-1' : 'hover:shadow-xl hover:-translate-y-1'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-all duration-300`}></div>
                
                {/* Animated border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-20 rounded-xl blur-sm transition-all duration-300`}></div>
                
                <div className="relative">
                  {/* Icon with animated background */}
                  <motion.div 
                    className={`inline-flex p-3 bg-gradient-to-br ${service.gradient} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-white">{service.icon}</div>
                  </motion.div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm">
                    {service.description}
                  </p>

                  {/* Enhanced features list */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-center text-gray-700 dark:text-gray-300 text-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 1 + featureIndex * 0.1 }}
                      >
                        <CheckCircle className={`w-4 h-4 text-green-500 mr-2 flex-shrink-0`} />
                        <span className="group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Price and CTA */}
                  <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                    <div className={`text-2xl font-bold mb-3 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                      {service.price}
                    </div>
                    
                    <motion.button 
                      className={`group/btn w-full bg-gradient-to-r ${service.gradient} text-white py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.div 
            className="relative p-6 sm:p-8 md:p-10 bg-gradient-to-br from-orange-600 via-red-600 to-slate-700 rounded-3xl text-white shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                className="absolute -top-10 -right-10 w-40 h-40 border border-white/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-32 h-32 border border-white/20 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-full h-full text-white/50" />
              </motion.div>
            </div>
            
            <div className="relative z-10">
              <motion.h3 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.7 }}
              >
                Need a Custom Solution?
              </motion.h3>
              
              <motion.p 
                className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.9 }}
              >
                Every project is unique. Let's discuss your specific requirements and create a tailored solution that exceeds your expectations.
              </motion.p>
              
              <motion.button
                className="group inline-flex items-center space-x-3 bg-white text-orange-600 px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 2.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Schedule a Consultation</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
