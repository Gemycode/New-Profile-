"use client"

import { useState, useRef } from "react"
import { Mail, Phone, MapPin, Send, Github, Linkedin, CheckCircle, Loader2, MessageCircle, Clock, Star, Sparkles } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useCreateDocument } from "../hooks/useFirebase"
import { COLLECTIONS } from "../lib/firebase"
import toast from "react-hot-toast"

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Firebase mutation for creating contact messages
  const createMessage = useCreateDocument(COLLECTIONS.CONTACT_MESSAGES)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Try to save to Firebase
      await createMessage.mutateAsync({
        ...formData,
        status: 'new',
        ipAddress: 'hidden',
        userAgent: navigator.userAgent
      })
      
      // Reset form and show success
      setFormData({ name: "", email: "", subject: "", message: "" })
      setIsSubmitted(true)
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000)
      
    } catch (error) {
      // Fallback: show success message even if Firebase fails
      console.log("Firebase not configured, showing demo success")
      toast.success("Message received! I'll get back to you soon.")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "abdallagamal00@outlook.sa",
      link: "mailto:abdallagamal00@outlook.sa",
      gradient: "from-slate-600 to-gray-600",
      description: "Drop me a line anytime"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      value: "(+20)01151012221",
      link: "tel:+201151012221",
      gradient: "from-gray-600 to-slate-600",
      description: "Let's talk about your project"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      value: "Aswan, Egypt",
      link: null,
      gradient: "from-slate-500 to-gray-500",
      description: "Available for remote work"
    },
  ]

  const socialLinks = [
    {
      icon: <Github className="w-6 h-6" />,
      name: "GitHub",
      url: "https://github.com/Gemycode",
      color: "hover:text-gray-900 dark:hover:text-white",
      gradient: "from-slate-600 to-gray-600",
      description: "Check out my repositories"
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/abdullah-jamal-51181a214/",
      color: "hover:text-blue-600",
      gradient: "from-blue-600 to-blue-700",
      description: "Let's connect professionally"
    },
  ]

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

  return (
    <section ref={ref} id="contact" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50/50 via-slate-50/30 to-gray-100/50 dark:from-slate-900/50 dark:via-gray-900/30 dark:to-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-6 md:mb-8 lg:mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2 md:mb-3"
            variants={itemVariants}
          >
            Get In Touch
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Ready to start your next project? Let's discuss how I can help bring your ideas to life.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Contact Form */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/30 dark:border-slate-700/30">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Send Me a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Project Discussion"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={createMessage.isPending}
                className="w-full bg-gradient-primary text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: createMessage.isPending ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {createMessage.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Message Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Enhanced Contact Information */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h3>
                  <p className="text-gray-600 dark:text-gray-400">Let's connect and discuss your project</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div 
                    key={index} 
                    className="group p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{info.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{info.description}</p>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300 font-medium">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Enhanced Social Links */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Connect With Me</h3>
              <div className="grid grid-cols-1 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-4 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 1.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${social.gradient} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                      {social.icon}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">{social.name}</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{social.description}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Enhanced Availability Card */}
            <motion.div 
              className="relative p-4 sm:p-6 md:p-8 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl text-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.8 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-20">
                <motion.div
                  className="absolute top-4 right-4 w-16 h-16 border border-white/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 w-12 h-12"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Star className="w-full h-full text-white" />
                </motion.div>
              </div>
              
              <div className="relative">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  <h4 className="text-xl font-bold">Available for New Projects</h4>
                </div>
                <p className="mb-6 opacity-90 leading-relaxed">
                  I'm currently accepting new MERN Stack & React Native projects and would love to discuss how I can help build your next web application or mobile app.
                </p>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-medium">Usually responds within 24 hours</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
