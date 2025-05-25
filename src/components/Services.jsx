"use client"
import { Globe, Smartphone, Cloud, Database, Palette, Zap } from "lucide-react"

const Services = () => {
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
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Flutter Mobile Development",
      description:
        "Cross-platform mobile applications using Flutter and Dart. Single codebase for both iOS and Android with native performance and beautiful UI.",
      features: ["Cross-platform Development", "Native Performance", "Custom UI Components", "Firebase Integration"],
      price: "Starting at $350",
    },
    {
      icon: <Cloud className="w-12 h-12" />,
      title: "API Development & Integration",
      description:
        "RESTful APIs and backend services using Node.js and Express.js. Secure, scalable, and well-documented APIs with proper authentication.",
      features: ["RESTful API Design", "JWT Authentication", "Database Integration", "API Documentation"],
      price: "Starting at $400",
    },
    {
      icon: <Database className="w-12 h-12" />,
      title: "Database Design & Optimization",
      description:
        "MongoDB database design and optimization for scalable applications. Efficient data modeling and query optimization for high performance.",
      features: ["MongoDB Schema Design", "Query Optimization", "Data Modeling", "Performance Tuning"],
      price: "Starting at $300",
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Full-Stack Consulting",
      description:
        "Technical consulting for MERN Stack projects. Architecture planning, code reviews, and best practices implementation.",
      features: ["Architecture Planning", "Code Review", "Performance Optimization", "Best Practices"],
      price: "Starting at $450",
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Maintenance & Support",
      description:
        "Ongoing maintenance and support for existing MERN Stack and Flutter applications. Bug fixes, updates, and feature enhancements.",
      features: ["Bug Fixes", "Feature Updates", "Performance Monitoring", "Technical Support"],
      price: "Starting at $1,000",
    },
  ]

  return (
    <section id="services" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Services I Offer</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive development services to bring your digital vision to life with cutting-edge technology and
            best practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>

              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{service.description}</p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="text-2xl font-bold text-gradient mb-4">{service.price}</div>
                <button className="w-full bg-gradient-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-primary p-8 rounded-2xl text-white">
            <h3 className="text-3xl font-bold mb-4">Need a Custom Solution?</h3>
            <p className="text-xl mb-6 opacity-90">
              Every project is unique. Let's discuss your specific requirements and create a tailored solution.
            </p>
            <button
              onClick={() => document.querySelector("#contact").scrollIntoView({ behavior: "smooth" })}
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Schedule a Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
