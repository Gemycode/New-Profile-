import { motion, useInView } from "framer-motion"
import { Code, Database, Smartphone, Cloud, Zap, Users, Award, Target, Sparkles, TrendingUp, Clock, Star } from "lucide-react"
import { useRef, useEffect, useState, useMemo, useCallback } from "react"
// import pic from '../../public/assets/images/dennis-irorere-yvB-g4g8Uj8-unsplash.jpg' // Fixed: Use public path instead
const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const [counters, setCounters] = useState({ projects: 0, experience: 0, clients: 0 })

  const skills = useMemo(() => [
    {
      category: "Frontend Development",
      technologies: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Framer Motion"],
      icon: <Code className="w-8 h-8" />,
      progress: 95,
      color: "from-slate-600 to-gray-600",
      description: "Building responsive, interactive user interfaces"
    },
    {
      category: "Backend Development",
      technologies: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "RESTful APIs", "GraphQL", "JWT", "Socket.io"],
      icon: <Database className="w-8 h-8" />,
      progress: 90,
      color: "from-gray-600 to-slate-600",
      description: "Scalable server-side applications and APIs"
    },
    {
      category: "Mobile Development",
      technologies: ["React Native", "Expo", "TypeScript", "Firebase", "Redux Toolkit", "Native Features"],
      icon: <Smartphone className="w-8 h-8" />,
      progress: 85,
      color: "from-slate-500 to-gray-500",
      description: "Cross-platform mobile applications"
    },
    {
      category: "Cloud & DevOps",
      technologies: ["AWS", "Docker", "Kubernetes", "CI/CD", "Git", "GitHub Actions", "Vercel", "Netlify"],
      icon: <Cloud className="w-8 h-8" />,
      progress: 88,
      color: "from-gray-500 to-slate-500",
      description: "Deployment and infrastructure management"
    },
  ], [])

  const stats = useMemo(() => [
    { number: 25, label: "Projects Completed", icon: <Target className="w-6 h-6" />, suffix: "+", color: "text-slate-600 dark:text-slate-400" },
    { number: 2, label: "Years Experience", icon: <Award className="w-6 h-6" />, suffix: "+", color: "text-gray-600 dark:text-gray-400" },
    { number: 30, label: "Happy Clients", icon: <Users className="w-6 h-6" />, suffix: "+", color: "text-slate-500 dark:text-slate-500" },
    { number: 100, label: "Code Quality", icon: <Sparkles className="w-6 h-6" />, suffix: "%", color: "text-gray-500 dark:text-gray-500" },
    { number: 50, label: "Technologies", icon: <TrendingUp className="w-6 h-6" />, suffix: "+", color: "text-slate-600 dark:text-slate-400" },
    { number: 24, label: "Support Hours", icon: <Clock className="w-6 h-6" />, suffix: "/7", color: "text-gray-600 dark:text-gray-400" },
  ], [])

  // Animated counter effect
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setCounters({
          projects: 12,
          experience: 1,
          clients: 15
        })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  const AnimatedCounter = useCallback(({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      if (isInView) {
        let startTime
        const animate = (currentTime) => {
          if (!startTime) startTime = currentTime
          const progress = Math.min((currentTime - startTime) / duration, 1)
          // Use easing function for smoother animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4)
          setCount(Math.floor(easeOutQuart * end))
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        requestAnimationFrame(animate)
      }
    }, [end, duration, isInView])
    
    return <span>{count}{suffix}</span>
  }, [isInView])

  return (
    <section ref={ref} id="about" className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50/50 via-slate-50/30 to-gray-100/50 dark:from-slate-900/50 dark:via-gray-900/30 dark:to-slate-800/50">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-slate-300/10 to-gray-400/10 dark:from-slate-600/10 dark:to-gray-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-gray-300/10 to-slate-400/10 dark:from-gray-600/10 dark:to-slate-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [180, 90, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
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
              ✨ About Me
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-slate-800 via-gray-700 to-slate-600 dark:from-slate-200 dark:via-gray-300 dark:to-slate-400 bg-clip-text text-transparent">
              Building Digital
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-700 via-slate-600 to-gray-800 dark:from-gray-300 dark:via-slate-200 dark:to-gray-400 bg-clip-text text-transparent">
              Excellence
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Passionate full-stack developer with expertise in modern technologies and a proven track record of
            delivering exceptional digital solutions that scale and perform.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h3 className="text-3xl lg:text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Crafting Digital Solutions
                </span>
              </h3>
              
              <div className="space-y-4">
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  With extensive experience in full-stack development, I specialize in the <span className="font-semibold text-blue-600 dark:text-blue-400">MERN Stack</span> (MongoDB, Express.js, React, Node.js) to create scalable and high-performance web applications.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  My expertise extends to cross-platform mobile development using <span className="font-semibold text-cyan-600 dark:text-cyan-400">React Native</span>, enabling me to deliver comprehensive digital solutions across all platforms.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  I'm passionate about writing clean, maintainable code and creating exceptional user experiences that drive business growth.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-blue-200/20 dark:border-blue-800/30">
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Fast Development</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-blue-200/20 dark:border-blue-800/30">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Team Collaboration</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="relative group">
              {/* Animated border gradient */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-slate-500 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              
              <div className="relative">
                <img
                  src="/assets/images/dennis-irorere-yvB-g4g8Uj8-unsplash.jpg"
                  alt="Developer workspace"
                  className="relative rounded-2xl shadow-2xl transform transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Glass morphism overlay card */}
                <motion.div 
                  className="absolute -bottom-8 -right-8 p-6 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-1">
                      <AnimatedCounter end={1} suffix="+" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Years of Excellence</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="group relative p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 rounded-2xl transition-all duration-300"></div>
              
              <div className="relative text-center">
                <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">{stat.icon}</div>
                </div>
                
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                  </span>
                </div>
                
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Technical Expertise
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A comprehensive skill set covering the full spectrum of modern web development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                className="group relative p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-all duration-500`}></div>
                
                <div className="relative">
                  {/* Icon with gradient background */}
                  <div className={`inline-flex p-4 bg-gradient-to-br ${skill.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">{skill.icon}</div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {skill.category}
                  </h4>
                  
                  {/* Progress bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Proficiency</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.progress}%` } : { width: 0 }}
                        transition={{ duration: 1.5, delay: 2 + index * 0.2, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  {/* Technologies */}
                  <div className="space-y-2">
                    {skill.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        className="inline-block bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm mr-2 mb-2 border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:scale-105"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: 2.2 + index * 0.1 + techIndex * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
